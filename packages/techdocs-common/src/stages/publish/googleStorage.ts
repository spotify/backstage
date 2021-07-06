/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  FileExistsResponse,
  Storage,
  UploadResponse,
} from '@google-cloud/storage';
import express from 'express';
import JSON5 from 'json5';
import createLimiter from 'p-limit';
import path from 'path';
import { Logger } from 'winston';
import { getFileTreeRecursively, getHeadersForFileExtension } from './helpers';
import {
  PublisherBase,
  PublishRequest,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';

export class GoogleGCSPublish implements PublisherBase {
  static fromConfig(config: Config, logger: Logger): PublisherBase {
    let bucketName = '';
    try {
      bucketName = config.getString('techdocs.publisher.googleGcs.bucketName');
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'googleGcs' in your app config, " +
          'techdocs.publisher.googleGcs.bucketName is required.',
      );
    }

    // Credentials is an optional config. If missing, default GCS environment variables will be used.
    // Read more here https://cloud.google.com/docs/authentication/production
    const credentials = config.getOptionalString(
      'techdocs.publisher.googleGcs.credentials',
    );
    let credentialsJson = {};
    if (credentials) {
      try {
        credentialsJson = JSON.parse(credentials);
      } catch (err) {
        throw new Error(
          'Error in parsing techdocs.publisher.googleGcs.credentials config to JSON.',
        );
      }
    }

    const storageClient = new Storage({
      ...(credentials && {
        credentials: credentialsJson,
      }),
    });

    return new GoogleGCSPublish(storageClient, bucketName, logger);
  }

  constructor(
    private readonly storageClient: Storage,
    private readonly bucketName: string,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.bucketName = bucketName;
    this.logger = logger;
  }

  /**
   * Check if the defined bucket exists. Being able to connect means the configuration is good
   * and the storage client will work.
   */
  async getReadiness(): Promise<ReadinessResponse> {
    try {
      await this.storageClient.bucket(this.bucketName).getMetadata();
      this.logger.info(
        `Successfully connected to the GCS bucket ${this.bucketName}.`,
      );

      return {
        isAvailable: true,
      };
    } catch (err) {
      this.logger.error(
        `Could not retrieve metadata about the GCS bucket ${this.bucketName}. ` +
          'Make sure the bucket exists. Also make sure that authentication is setup either by explicitly defining ' +
          'techdocs.publisher.googleGcs.credentials in app config or by using environment variables. ' +
          'Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
      );
      this.logger.error(`from GCS client library: ${err.message}`);

      return { isAvailable: false };
    }
  }

  /**
   * Upload all the files from the generated `directory` to the GCS bucket.
   * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    try {
      // Note: GCS manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);

      const limiter = createLimiter(10);
      const uploadPromises: Array<Promise<UploadResponse>> = [];
      allFilesToUpload.forEach(sourceFilePath => {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = path.relative(directory, sourceFilePath);

        // Convert destination file path to a POSIX path for uploading.
        // GCS expects / as path separator and relativeFilePath will contain \\ on Windows.
        // https://cloud.google.com/storage/docs/gsutil/addlhelp/HowSubdirectoriesWork
        const relativeFilePathPosix = relativeFilePath
          .split(path.sep)
          .join(path.posix.sep);

        // The / delimiter is intentional since it represents the cloud storage and not the local file system.
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = `${entityRootDir}/${relativeFilePathPosix}`; // GCS Bucket file relative path

        // Rate limit the concurrent execution of file uploads to batches of 10 (per publish)
        const uploadFile = limiter(() =>
          this.storageClient.bucket(this.bucketName).upload(sourceFilePath, {
            destination,
          }),
        );
        uploadPromises.push(uploadFile);
      });

      await Promise.all(uploadPromises);

      this.logger.info(
        `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
      );
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to Google Cloud Storage. ${e}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  fetchTechDocsMetadata(entityName: EntityName): Promise<TechDocsMetadata> {
    return new Promise((resolve, reject) => {
      const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;

      const fileStreamChunks: Array<any> = [];
      this.storageClient
        .bucket(this.bucketName)
        .file(`${entityRootDir}/techdocs_metadata.json`)
        .createReadStream()
        .on('error', err => {
          this.logger.error(err.message);
          reject(err);
        })
        .on('data', chunk => {
          fileStreamChunks.push(chunk);
        })
        .on('end', () => {
          const techdocsMetadataJson = Buffer.concat(fileStreamChunks).toString(
            'utf-8',
          );
          resolve(JSON5.parse(techdocsMetadataJson));
        });
    });
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return (req, res) => {
      // Decode and trim the leading forward slash
      // filePath example - /default/Component/documented-component/index.html
      const filePath = decodeURI(req.path.replace(/^\//, ''));

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = path.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      // Pipe file chunks directly from storage to client.
      this.storageClient
        .bucket(this.bucketName)
        .file(filePath)
        .createReadStream()
        .on('pipe', () => {
          res.writeHead(200, responseHeaders);
        })
        .on('error', err => {
          this.logger.warn(err.message);
          // Send a 404 with a meaningful message if possible.
          if (!res.headersSent) {
            res.status(404).send(err.message);
          } else {
            res.destroy();
          }
        })
        .pipe(res);
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    return new Promise(resolve => {
      const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
      this.storageClient
        .bucket(this.bucketName)
        .file(`${entityRootDir}/index.html`)
        .exists()
        .then((response: FileExistsResponse) => {
          resolve(response[0]);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
}
