/*
 * Copyright 2020 Spotify AB
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
  Entity,
  ENTITY_DEFAULT_NAMESPACE,
  serializeEntityRef,
} from '@backstage/catalog-model';
import { NotModifiedError } from '@backstage/errors';
import {
  GeneratorBase,
  GeneratorBuilder,
  getLocationForEntity,
  PreparerBase,
  PreparerBuilder,
  PublisherBase,
  UrlPreparer,
} from '@backstage/techdocs-common';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { Logger } from 'winston';
import { BuildMetadataStorage } from './BuildMetadataStorage';

type DocsBuilderArguments = {
  preparers: PreparerBuilder;
  generators: GeneratorBuilder;
  publisher: PublisherBase;
  entity: Entity;
  logger: Logger;
};

export class DocsBuilder {
  private preparer: PreparerBase;
  private generator: GeneratorBase;
  private publisher: PublisherBase;
  private entity: Entity;
  private logger: Logger;

  constructor({
    preparers,
    generators,
    publisher,
    entity,
    logger,
  }: DocsBuilderArguments) {
    this.preparer = preparers.get(entity);
    this.generator = generators.get(entity);
    this.publisher = publisher;
    this.entity = entity;
    this.logger = logger;
  }

  public async build(): Promise<void> {
    if (!this.entity.metadata.uid) {
      throw new Error(
        'Trying to build documentation for entity not in service catalog',
      );
    }

    /**
     * Prepare (and cache check)
     */

    this.logger.info(
      `Step 1 of 3: Preparing docs for entity ${serializeEntityRef(
        this.entity,
      )}`,
    );

    // If available, use the etag stored in techdocs_metadata.json to
    // check if docs are outdated and need to be regenerated.
    let storedEtag: string | undefined;
    if (await this.publisher.hasDocsBeenGenerated(this.entity)) {
      try {
        storedEtag = (
          await this.publisher.fetchTechDocsMetadata({
            namespace:
              this.entity.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE,
            kind: this.entity.kind,
            name: this.entity.metadata.name,
          })
        ).etag;
      } catch (err) {
        // Proceed with a fresh build
        this.logger.warn(
          `Unable to read techdocs_metadata.json, proceeding with fresh build, error ${err}.`,
        );
      }
    }

    let preparedDir: string;
    let newEtag: string;
    try {
      const preparerResponse = await this.preparer.prepare(this.entity, {
        etag: storedEtag,
      });

      preparedDir = preparerResponse.preparedDir;
      newEtag = preparerResponse.etag;
    } catch (err) {
      if (err instanceof NotModifiedError) {
        // No need to prepare anymore since cache is valid.
        // Set last check happened to now
        new BuildMetadataStorage(this.entity.metadata.uid).setLastUpdated();
        this.logger.debug(
          `Docs for ${serializeEntityRef(
            this.entity,
          )} are unmodified. Using cache, skipping generate and prepare`,
        );
        return;
      }
      throw new Error(err.message);
    }

    this.logger.info(
      `Prepare step completed for entity ${serializeEntityRef(
        this.entity,
      )}, stored at ${preparedDir}`,
    );

    /**
     * Generate
     */

    this.logger.info(
      `Step 2 of 3: Generating docs for entity ${serializeEntityRef(
        this.entity,
      )}`,
    );

    // Create a temporary directory to store the generated files in.
    const tmpdirPath = os.tmpdir();
    // Fixes a problem with macOS returning a path that is a symlink
    const tmpdirResolvedPath = fs.realpathSync(tmpdirPath);
    const outputDir = await fs.mkdtemp(
      path.join(tmpdirResolvedPath, 'techdocs-tmp-'),
    );
    const parsedLocationAnnotation = getLocationForEntity(this.entity);
    await this.generator.run({
      inputDir: preparedDir,
      outputDir,
      parsedLocationAnnotation,
      etag: newEtag,
    });

    // Remove Prepared directory since it is no longer needed.
    // Caveat: Can not remove prepared directory in case of git preparer since the
    // local git repository is used to get etag on subsequent requests.
    if (this.preparer instanceof UrlPreparer) {
      this.logger.debug(
        `Removing prepared directory ${preparedDir} since the site has been generated`,
      );
      try {
        // Not a blocker hence no need to await this.
        fs.remove(preparedDir);
      } catch (error) {
        this.logger.debug(`Error removing prepared directory ${error.message}`);
      }
    }

    /**
     * Publish
     */

    this.logger.info(
      `Step 3 of 3: Publishing docs for entity ${serializeEntityRef(
        this.entity,
      )}`,
    );

    await this.publisher.publish({
      entity: this.entity,
      directory: outputDir,
    });

    try {
      // Not a blocker hence no need to await this.
      fs.remove(outputDir);
      this.logger.debug(
        `Removing generated directory ${outputDir} since the site has been published`,
      );
    } catch (error) {
      this.logger.debug(`Error removing generated directory ${error.message}`);
    }

    // Update the last check time for the entity
    new BuildMetadataStorage(this.entity.metadata.uid).setLastUpdated();
  }
}
