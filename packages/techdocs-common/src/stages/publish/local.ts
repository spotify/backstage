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
import {
  PluginEndpointDiscovery,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Entity, EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import express from 'express';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { Logger } from 'winston';
import {
  PublisherBase,
  PublishRequest,
  PublishResponse,
  ReadinessResponse,
  TechDocsMetadata,
} from './types';
import { getHeadersForFileExtension } from './helpers';

// TODO: Use a more persistent storage than node_modules or /tmp directory.
// Make it configurable with techdocs.publisher.local.publishDirectory
let staticDocsDir = '';
try {
  staticDocsDir = resolvePackagePath(
    '@backstage/plugin-techdocs-backend',
    'static/docs',
  );
} catch (err) {
  // This will most probably never be used.
  // The try/catch is introduced so that techdocs-cli can import @backstage/techdocs-common
  // on CI/CD without installing techdocs backend plugin.
  staticDocsDir = os.tmpdir();
}

/**
 * Local publisher which uses the local filesystem to store the generated static files. It uses a directory
 * called "static" at the root of techdocs-backend plugin.
 */
export class LocalPublish implements PublisherBase {
  // TODO: Use a static fromConfig method to create a LocalPublish instance, similar to aws/gcs publishers.
  // Move the logic of setting staticDocsDir based on config over to fromConfig,
  // and set the value as a class parameter.
  constructor(
    // @ts-ignore
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly discovery: PluginEndpointDiscovery,
  ) {
    this.config = config;
    this.logger = logger;
    this.discovery = discovery;
  }

  async getReadiness(): Promise<ReadinessResponse> {
    return {
      isAvailable: true,
    };
  }

  publish({ entity, directory }: PublishRequest): Promise<PublishResponse> {
    const entityNamespace = entity.metadata.namespace ?? 'default';

    const publishDir = path.join(
      staticDocsDir,
      entityNamespace,
      entity.kind,
      entity.metadata.name,
    );

    if (!fs.existsSync(publishDir)) {
      this.logger.info(`Could not find ${publishDir}, creating the directory.`);
      fs.mkdirSync(publishDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      fs.copy(directory, publishDir, err => {
        if (err) {
          this.logger.debug(
            `Failed to copy docs from ${directory} to ${publishDir}`,
          );
          reject(err);
        }
        this.logger.info(`Published site stored at ${publishDir}`);
        this.discovery
          .getBaseUrl('techdocs')
          .then(techdocsApiUrl => {
            resolve({
              remoteUrl: `${techdocsApiUrl}/static/docs/${entity.metadata.name}`,
            });
          })
          .catch(reason => {
            reject(reason);
          });
      });
    });
  }

  async fetchTechDocsMetadata(
    entityName: EntityName,
  ): Promise<TechDocsMetadata> {
    const metadataPath = path.join(
      staticDocsDir,
      entityName.namespace,
      entityName.kind,
      entityName.name,
      'techdocs_metadata.json',
    );

    try {
      return await fs.readJson(metadataPath);
    } catch (err) {
      this.logger.error(
        `Unable to read techdocs_metadata.json at ${metadataPath}. Error: ${err}`,
      );
      throw new Error(err.message);
    }
  }

  docsRouter(): express.Handler {
    return express.static(staticDocsDir, {
      // Handle content-type header the same as all other publishers.
      setHeaders: (res, filePath) => {
        const fileExtension = path.extname(filePath);
        const headers = getHeadersForFileExtension(fileExtension);
        for (const [header, value] of Object.entries(headers)) {
          res.setHeader(header, value);
        }
      },
    });
  }

  async hasDocsBeenGenerated(entity: Entity): Promise<boolean> {
    const namespace = entity.metadata.namespace ?? 'default';

    const indexHtmlPath = path.join(
      staticDocsDir,
      namespace,
      entity.kind,
      entity.metadata.name,
      'index.html',
    );

    // Check if the file exists
    try {
      await fs.access(indexHtmlPath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
}
