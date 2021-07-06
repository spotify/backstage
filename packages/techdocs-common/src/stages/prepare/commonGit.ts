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
import { NotModifiedError } from '@backstage/errors';
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

export class CommonGitPreparer implements PreparerBase {
  private readonly config: Config;
  private readonly logger: Logger;

  constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async prepare(
    entity: Entity,
    options?: { etag?: string },
  ): Promise<PreparerResponse> {
    this.logger.warn(
      `You are using the legacy git preparer in TechDocs for \`${entity.metadata.name}\` which will be removed in near future (March 2021). ` +
        `Migrate to URL reader by updating \`backstage.io/techdocs-ref\` annotation in \`catalog-info.yaml\` ` +
        `to be prefixed with \`url:\`. Read the migration guide and benefits at https://github.com/backstage/backstage/issues/4409 `,
    );

    const { target } = parseReferenceAnnotation(
      'backstage.io/techdocs-ref',
      entity,
    );

    try {
      // Update repository or do a fresh clone.
      const repoPath = await checkoutGitRepository(
        target,
        this.config,
        this.logger,
      );
      // Check if etag has changed for cache invalidation.
      const etag = await getLastCommitTimestamp(repoPath, this.logger);
      if (options?.etag === etag.toString()) {
        throw new NotModifiedError();
      }

      const parsedGitLocation = parseGitUrl(target);
      return {
        preparedDir: path.join(repoPath, parsedGitLocation.filepath),
        etag: etag.toString(),
      };
    } catch (error) {
      if (error instanceof NotModifiedError) {
        this.logger.debug(`Cache is valid for etag ${options?.etag}`);
      } else {
        this.logger.debug(`Repo checkout failed with error ${error.message}`);
      }
      throw error;
    }
  }
}
