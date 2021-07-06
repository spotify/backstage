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
import { DefaultAzureCredential } from '@azure/identity';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import JSON5 from 'json5';
import limiterFactory from 'p-limit';
import { default as path, default as platformPath } from 'path';
import { Logger } from 'winston';
import { getFileTreeRecursively, getHeadersForFileExtension } from './helpers';
import {
  PublisherBase,
  PublishRequest,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';

// The number of batches that may be ongoing at the same time.
const BATCH_CONCURRENCY = 3;

export class AzureBlobStoragePublish implements PublisherBase {
  static fromConfig(config: Config, logger: Logger): PublisherBase {
    let containerName = '';
    try {
      containerName = config.getString(
        'techdocs.publisher.azureBlobStorage.containerName',
      );
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'azureBlobStorage' in your app config, " +
          'techdocs.publisher.azureBlobStorage.containerName is required.',
      );
    }

    let accountName = '';
    try {
      accountName = config.getString(
        'techdocs.publisher.azureBlobStorage.credentials.accountName',
      );
    } catch (error) {
      throw new Error(
        "Since techdocs.publisher.type is set to 'azureBlobStorage' in your app config, " +
          'techdocs.publisher.azureBlobStorage.credentials.accountName is required.',
      );
    }

    // Credentials is an optional config. If missing, default Azure Blob Storage environment variables will be used.
    // https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad-app
    const accountKey = config.getOptionalString(
      'techdocs.publisher.azureBlobStorage.credentials.accountKey',
    );

    let credential;
    if (accountKey) {
      credential = new StorageSharedKeyCredential(accountName, accountKey);
    } else {
      credential = new DefaultAzureCredential();
    }

    const storageClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential,
    );

    return new AzureBlobStoragePublish(storageClient, containerName, logger);
  }

  constructor(
    private readonly storageClient: BlobServiceClient,
    private readonly containerName: string,
    private readonly logger: Logger,
  ) {
    this.storageClient = storageClient;
    this.containerName = containerName;
    this.logger = logger;
  }

  async getReadiness(): Promise<ReadinessResponse> {
    try {
      const response = await this.storageClient
        .getContainerClient(this.containerName)
        .getProperties();

      if (response._response.status === 200) {
        return {
          isAvailable: true,
        };
      }

      if (response._response.status >= 400) {
        this.logger.error(
          `Failed to retrieve metadata from ${response._response.request.url} with status code ${response._response.status}.`,
        );
      }
    } catch (e) {
      this.logger.error(`from Azure Blob Storage client library: ${e.message}`);
    }

    this.logger.error(
      `Could not retrieve metadata about the Azure Blob Storage container ${this.containerName}. ` +
        'Make sure that the Azure project and container exist and the access key is setup correctly ' +
        'techdocs.publisher.azureBlobStorage.credentials defined in app config has correct permissions. ' +
        'Refer to https://backstage.io/docs/features/techdocs/using-cloud-storage',
    );

    return { isAvailable: false };
  }

  /**
   * Upload all the files from the generated `directory` to the Azure Blob Storage container.
   * Directory structure used in the container is - entityNamespace/entityKind/entityName/index.html
   */
  async publish({ entity, directory }: PublishRequest): Promise<void> {
    try {
      // Note: Azure Blob Storage manages creation of parent directories if they do not exist.
      // So collecting path of only the files is good enough.
      const allFilesToUpload = await getFileTreeRecursively(directory);

      // Bound the number of concurrent batches. We want a bit of concurrency for
      // performance reasons, but not so much that we starve the connection pool
      // or start thrashing.
      const limiter = limiterFactory(BATCH_CONCURRENCY);

      const promises = allFilesToUpload.map(sourceFilePath => {
        // Remove the absolute path prefix of the source directory
        // Path of all files to upload, relative to the root of the source directory
        // e.g. ['index.html', 'sub-page/index.html', 'assets/images/favicon.png']
        const relativeFilePath = path.normalize(
          path.relative(directory, sourceFilePath),
        );

        // Convert destination file path to a POSIX path for uploading.
        // Azure Blob Storage expects / as path separator and relativeFilePath will contain \\ on Windows.
        // https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#blob-names
        const relativeFilePathPosix = relativeFilePath
          .split(path.sep)
          .join(path.posix.sep);

        // The / delimiter is intentional since it represents the cloud storage and not the local file system.
        const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
        const destination = `${entityRootDir}/${relativeFilePathPosix}`; // Azure Blob Storage Container file relative path
        return limiter(async () => {
          const response = await this.storageClient
            .getContainerClient(this.containerName)
            .getBlockBlobClient(destination)
            .uploadFile(sourceFilePath);

          if (response._response.status >= 400) {
            return {
              ...response,
              error: new Error(
                `Upload failed for ${sourceFilePath} with status code ${response._response.status}`,
              ),
            };
          }
          return {
            ...response,
            error: undefined,
          };
        });
      });

      const responses = await Promise.all(promises);

      const failed = responses.filter(r => r.error);
      if (failed.length === 0) {
        this.logger.info(
          `Successfully uploaded the ${responses.length} generated file(s) for Entity ${entity.metadata.name}. Total number of files: ${allFilesToUpload.length}`,
        );
      } else {
        throw new Error(
          failed
            .map(r => r.error?.message)
            .filter(Boolean)
            .join(' '),
        );
      }
    } catch (e) {
      const errorMessage = `Unable to upload file(s) to Azure Blob Storage. ${e}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private download(containerName: string, blobPath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const fileStreamChunks: Array<any> = [];
      this.storageClient
        .getContainerClient(containerName)
        .getBlockBlobClient(blobPath)
        .download()
        .then(res => {
          const body = res.readableStreamBody;
          if (!body) {
            reject(new Error(`Unable to parse the response data`));
            return;
          }
          body
            .on('error', reject)
            .on('data', chunk => {
              fileStreamChunks.push(chunk);
            })
            .on('end', () => {
              resolve(Buffer.concat(fileStreamChunks));
            });
        })
        .catch(reject);
    });
  }

  async fetchTechDocsMetadata(
    entityName: EntityName,
  ): Promise<TechDocsMetadata> {
    const entityRootDir = `${entityName.namespace}/${entityName.kind}/${entityName.name}`;
    try {
      const techdocsMetadataJson = await this.download(
        this.containerName,
        `${entityRootDir}/techdocs_metadata.json`,
      );
      if (!techdocsMetadataJson) {
        throw new Error(
          `Unable to parse the techdocs metadata file ${entityRootDir}/techdocs_metadata.json.`,
        );
      }
      const techdocsMetadata = JSON5.parse(
        techdocsMetadataJson.toString('utf-8'),
      );
      return techdocsMetadata;
    } catch (e) {
      throw new Error(`TechDocs metadata fetch failed, ${e.message}`);
    }
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
      const fileExtension = platformPath.extname(filePath);
      const responseHeaders = getHeadersForFileExtension(fileExtension);

      try {
        this.download(this.containerName, filePath).then(fileContent => {
          // Inject response headers
          for (const [headerKey, headerValue] of Object.entries(
            responseHeaders,
          )) {
            res.setHeader(headerKey, headerValue);
          }
          res.send(fileContent);
        });
      } catch (e) {
        this.logger.error(e.message);
        res.status(404).json(e.message);
      }
    };
  }

  /**
   * A helper function which checks if index.html of an Entity's docs site is available. This
   * can be used to verify if there are any pre-generated docs available to serve.
   */
  hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    const entityRootDir = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
    return this.storageClient
      .getContainerClient(this.containerName)
      .getBlockBlobClient(`${entityRootDir}/index.html`)
      .exists();
  }
}
