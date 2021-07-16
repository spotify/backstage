/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/techdocs-common';
import { PassThrough } from 'stream';
import * as winston from 'winston';
import { DocsBuilder, shouldCheckForUpdate } from '../DocsBuilder';

export type DocsSynchronizerSyncOpts = {
  log: (message: string) => void;
  error: (e: Error) => void;
  finish: (result: { updated: boolean }) => void;
};

export class DocsSynchronizer {
  private readonly publisher: PublisherBase;
  private readonly logger: winston.Logger;
  private readonly config: Config;
  private readonly scmIntegrations: ScmIntegrationRegistry;

  constructor({
    publisher,
    logger,
    config,
    scmIntegrations,
  }: {
    publisher: PublisherBase;
    logger: winston.Logger;
    config: Config;
    scmIntegrations: ScmIntegrationRegistry;
  }) {
    this.config = config;
    this.logger = logger;
    this.publisher = publisher;
    this.scmIntegrations = scmIntegrations;
  }

  async doSync({
    responseHandler: { log, error, finish },
    entity,
    preparers,
    generators,
  }: {
    responseHandler: DocsSynchronizerSyncOpts;
    entity: Entity;
    preparers: PreparerBuilder;
    generators: GeneratorBuilder;
  }) {
    // create a new logger to log data to the caller
    const taskLogger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
      defaultMeta: {},
    });

    // create an in-memory stream to forward logs to the event-stream
    const logStream = new PassThrough();
    logStream.on('data', async data => {
      log(data.toString().trim());
    });

    taskLogger.add(new winston.transports.Stream({ stream: logStream }));

    // check if the last update check was too recent
    if (!shouldCheckForUpdate(entity.metadata.uid!)) {
      finish({ updated: false });
      return;
    }

    const docsBuilder = new DocsBuilder({
      preparers,
      generators,
      publisher: this.publisher,
      logger: taskLogger,
      entity,
      config: this.config,
      scmIntegrations: this.scmIntegrations,
      logStream,
    });

    let foundDocs = false;

    try {
      const updated = await docsBuilder.build();

      if (!updated) {
        finish({ updated: false });
        return;
      }
    } catch (e) {
      const msg = `Failed to build the docs page: ${e.message}`;
      taskLogger.error(msg);
      this.logger.error(msg, e);
      error(e);
      return;
    }

    // With a maximum of ~5 seconds wait, check if the files got published and if docs will be fetched
    // on the user's page. If not, respond with a message asking them to check back later.
    // The delay here is to make sure GCS/AWS/etc. registers newly uploaded files which is usually <1 second
    for (let attempt = 0; attempt < 5; attempt++) {
      if (await this.publisher.hasDocsBeenGenerated(entity)) {
        foundDocs = true;
        break;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    if (!foundDocs) {
      this.logger.error(
        'Published files are taking longer to show up in storage. Something went wrong.',
      );
      error(
        new NotFoundError(
          'Sorry! It took too long for the generated docs to show up in storage. Check back later.',
        ),
      );
      return;
    }

    finish({ updated: true });
  }
}
