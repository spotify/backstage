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

import { UrlReader } from '@backstage/backend-common';
import { InputError, NotModifiedError } from '@backstage/errors';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import parseGitUrl from 'git-url-parse';
import path from 'path';
import { Logger } from 'winston';
import {
  checkoutGitRepository,
  getLastCommitTimestamp,
  parseReferenceAnnotation,
} from '../../helpers';
import { PreparerBase, PreparerResponse } from './types';

export class DirectoryPreparer implements PreparerBase {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly reader: UrlReader,
  ) {
    this.config = config;
    this.logger = logger;
    this.reader = reader;
  }

  private async resolveManagedByLocationToDir(
    entity: Entity,
    options?: { etag?: string },
  ): Promise<PreparerResponse> {
    const { type, target } = parseReferenceAnnotation(
      'backstage.io/managed-by-location',
      entity,
    );

    this.logger.debug(
      `Building docs for entity with type 'dir' and managed-by-location '${type}'`,
    );
    switch (type) {
      case 'url': {
        const response = await this.reader.readTree(target, {
          etag: options?.etag,
        });
        const preparedDir = await response.dir();
        return {
          preparedDir,
          etag: response.etag,
        };
      }
      case 'github':
      case 'gitlab':
      case 'azure/api': {
        const parsedGitLocation = parseGitUrl(target);
        const repoLocation = await checkoutGitRepository(
          target,
          this.config,
          this.logger,
        );

        // Check if etag has changed for cache invalidation.
        const etag = await getLastCommitTimestamp(repoLocation, this.logger);
        if (options?.etag === etag.toString()) {
          throw new NotModifiedError();
        }
        return {
          preparedDir: path.dirname(
            path.join(repoLocation, parsedGitLocation.filepath),
          ),
          etag: etag.toString(),
        };
      }
      case 'file':
        return {
          preparedDir: path.dirname(target),
          // Instead of supporting caching on local sources, use techdocs-cli for local development and debugging.
          etag: '',
        };
      default:
        throw new InputError(`Unable to resolve location type ${type}`);
    }
  }

  async prepare(entity: Entity): Promise<PreparerResponse> {
    this.logger.warn(
      'You are using the legacy dir preparer in TechDocs which will be removed in near future (March 2021). ' +
        'Migrate to URL reader by updating `backstage.io/techdocs-ref` annotation in `catalog-info.yaml` ' +
        'to be prefixed with `url:`. Read the migration guide and benefits at https://github.com/backstage/backstage/issues/4409 ',
    );

    const { target } = parseReferenceAnnotation(
      'backstage.io/techdocs-ref',
      entity,
    );

    // This will throw NotModified error if etag has not changed.
    const response = await this.resolveManagedByLocationToDir(entity);

    return {
      preparedDir: path.resolve(response.preparedDir, target),
      etag: response.etag,
    };
  }
}
