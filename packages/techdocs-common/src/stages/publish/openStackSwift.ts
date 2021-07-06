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
import express from 'express';
import fs from 'fs-extra';
import JSON5 from 'json5';
import createLimiter from 'p-limit';
import path from 'path';
import { storage } from 'pkgcloud';
import { Readable } from 'stream';
import { Logger } from 'winston';
import { getFileTreeRecursively, getHeadersForFileExtension } from './helpers';
import {
  PublisherBase,
  PublishRequest,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';

const streamToBuffer = (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const chunks: any[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    } catch (e) {
      throw new Error(`Unable to parse the response data ${e.message}`);
    }
  });
};

export class OpenStackSwiftPublish implements PublisherBase {
  static fromConfig(config: Config, logger: Logger): PublisherBase {
    let containerName = '';
    try {
      containerName = config.getString(
        'techdocs.publisher.openStackSwift.containerName',
      );
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'openStackSwift' in your app config, " +
          'techdocs.publisher.openStackSwift.containerName is required.',
      );
    }

    const openStackSwiftConfig = config.getConfig(
      'techdocs.publisher.openStackSwift',
    );

    const storageClient = storage.createClient({
      provider: 'openstack',
      username: openStackSwiftConfig.getString('credentials.username'),
      password: openStackSwiftConfig.getString('credentials.password'),
      authUrl: openStackSwiftConfig.getString('authUrl'),
      keystoneAuthVersion:
        openStackSwiftConfig.getOptionalString('keystoneAuthVersion') || 'v3',
      domainId: openStackSwiftConfig.getOptionalString('domainId') || 'default',
      domainName:
        openStackSwiftConfig.getOptionalString('domainName') || 'Default',
      region: openStackSwiftConfig.getString('region'),
    });

    return new OpenStackSwiftPublish(storageClient, containerName, logger);
  }

  constructor(
    private readonly storageClient: storage.Client,
    private readonly containerName: string,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.containerName = containerName;
    this.logger = logger;
  }

  /*
   * Check if the defined container exists. Being able to connect means the configuration is good
   * and the storage client will work.
   */
  getReadiness(): Promise<ReadinessResponse> {
    return new Promise(resolve => {
      this.storageClient.getContainer(this.containerName, (err, container) => {
        if (container) {
          this.logger.info(
            `Successfully connected to the OpenStack Swift container ${this.containerName}.`,
          );
          resolve({
            isAvailable: true,
          });
        } else {
          this.logger.error(
            `Could not retrieve metadata about the OpenStack Swift container ${this.containerName}. ` +
              'Make sure the container exists. Also make sure that authentication is setup either by ' +
              'explicitly defining credentials and region in techdocs.publisher.openStackSwift in app config or ' +
              'by using environment variables. Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
          );

          this.logger.error(`from OpenStack client library: ${err.message}`);
          resolve({
            isAvailable: false,
          });
        }
      });
    });
  }

  /**
   * Upload all the files from the generated `directory` to the OpenStack Swift container.
   * Directory structure used in the bucket is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    try {
      // Note: OpenStack Swift manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);
      const limiter = createLimiter(10);
      const uploadPromises: Array<Promise<unknown>> = [];
      for (const filePath of allFilesToUpload) {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = path.relative(directory, filePath);

        // Convert destination file path to a POSIX path for uploading.
        // Swift expects / as path separator and relativeFilePath will contain \\ on Windows.
        // https://docs.openstack.org/python-openstackclient/pike/cli/man/openstack.html
        const relativeFilePathPosix = relativeFilePath
          .split(path.sep)
          .join(path.posix.sep);

        // The / delimiter is intentional since it represents the cloud storage and not the local file system.
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = `${entityRootDir}/${relativeFilePathPosix}`; // Swift container file relative path

        const params = {
          container: this.containerName,
          remote: destination,
        };

        // Rate limit the concurrent execution of file uploads to batches of 10 (per publish)
        const uploadFile = limiter(
          () =>
            new Promise((res, rej) => {
              const readStream = fs.createReadStream(filePath);

              const writeStream = this.storageClient.upload(params);

              writeStream.on('error', rej);

              writeStream.on('success', res);

              readStream.pipe(writeStream);
            }),
        );
        uploadPromises.push(uploadFile);
      }
      await Promise.all(uploadPromises);
      this.logger.info(
        `Successfully uploaded all the generated files for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
      );
      return;
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to OpenStack Swift. ${e}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async fetchTechDocsMetadata(
    entityName: EntityName,
  ): Promise<TechDocsMetadata> {
    try {
      return await new Promise<TechDocsMetadata>(async (resolve, reject) => {
        const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;

        const stream = this.storageClient.download({
          container: this.containerName,
          remote: `${entityRootDir}/techdocs_metadata.json`,
        });

        try {
          const techdocsMetadataJson = await streamToBuffer(stream);
          if (!techdocsMetadataJson) {
            throw new Error(
              `Unable to parse the techdocs metadata file ${entityRootDir}/techdocs_metadata.json.`,
            );
          }

          const techdocsMetadata = JSON5.parse(
            techdocsMetadataJson.toString('utf-8'),
          );

          resolve(techdocsMetadata);
        } catch (err) {
          this.logger.error(err.message);
          reject(new Error(err.message));
        }
      });
    } catch (e) {
      throw new Error(`TechDocs metadata fetch failed, ${e.message}`);
    }
  }

  /**
   * Express route middleware to serve static files on a route in techdocs-backend.
   */
  docsRouter(): express.Handler {
    return async (req, res) => {
      // Decode and trim the leading forward slash
      // filePath example - /default/Component/documented-component/index.html
      const filePath = decodeURI(req.path.replace(/^\//, ''));

      // Files with different extensions (CSS, HTML) need to be served with different headers
      const fileExtension = path.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      const stream = this.storageClient.download({
        container: this.containerName,
        remote: filePath,
      });

      try {
        // Inject response headers
        for (const [headerKey, headerValue] of Object.entries(
          responseHeaders,
        )) {
          res.setHeader(headerKey, headerValue);
        }

        res.send(await streamToBuffer(stream));
      } catch (err) {
        this.logger.warn(err.message);
        res.status(404).send(err.message);
      }
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    try {
      const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;

      return new Promise(res => {
        this.storageClient.getFile(
          this.containerName,
          `${entityRootDir}/index.html`,
          (err, file) => {
            if (!err && file) {
              res(true);
            } else {
              res(false);
              this.logger.warn(err.message);
            }
          },
        );
      });
    } catch (e) {
      return Promise.resolve(false);
    }
  }
}
