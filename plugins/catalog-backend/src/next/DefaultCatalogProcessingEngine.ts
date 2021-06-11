/*
 * Copyright 2021 Spotify AB
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
  entityEnvelopeSchemaValidator,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { serializeError } from '@backstage/errors';
import { Logger } from 'winston';
import { ProcessingDatabase } from './database/types';
import { CatalogProcessingOrchestrator } from './processing/types';
import { Stitcher } from './stitching/Stitcher';
import {
  CatalogProcessingEngine,
  EntityProvider,
  EntityProviderConnection,
  EntityProviderMutation,
} from './types';

class Connection implements EntityProviderConnection {
  readonly validateEntityEnvelope = entityEnvelopeSchemaValidator();

  constructor(
    private readonly config: {
      processingDatabase: ProcessingDatabase;
      id: string;
    },
  ) {}

  async applyMutation(mutation: EntityProviderMutation): Promise<void> {
    const db = this.config.processingDatabase;

    if (mutation.type === 'full') {
      this.check(mutation.entities);
      await db.transaction(async tx => {
        await db.replaceUnprocessedEntities(tx, {
          sourceKey: this.config.id,
          type: 'full',
          items: mutation.entities,
        });
      });
      return;
    }

    this.check(mutation.added);
    this.check(mutation.removed);
    await db.transaction(async tx => {
      await db.replaceUnprocessedEntities(tx, {
        sourceKey: this.config.id,
        type: 'delta',
        added: mutation.added,
        removed: mutation.removed,
      });
    });
  }

  private check(entities: Entity[]) {
    for (const entity of entities) {
      try {
        this.validateEntityEnvelope(entity);
      } catch (e) {
        throw new TypeError(`Malformed entity envelope, ${e}`);
      }
    }
  }
}

export class DefaultCatalogProcessingEngine implements CatalogProcessingEngine {
  private running = false;

  constructor(
    private readonly logger: Logger,
    private readonly entityProviders: EntityProvider[],
    private readonly processingDatabase: ProcessingDatabase,
    private readonly orchestrator: CatalogProcessingOrchestrator,
    private readonly stitcher: Stitcher,
  ) {}

  async start() {
    for (const provider of this.entityProviders) {
      await provider.connect(
        new Connection({
          processingDatabase: this.processingDatabase,
          id: provider.getProviderName(),
        }),
      );
    }
    this.running = true;
    this.run();
  }

  private async run() {
    while (this.running) {
      try {
        // TODO: We want to disconnect the queue popping and message processing
        // so that if the queue popping fails we exponentially back off in order to give the DB room to sort itself out.
        await this.process();
      } catch (e) {
        this.logger.warn('Processing failed with:', e);
        // TODO: this can be a little smarter as mentioned in the above comment.
        // But for now, if something fails, wait a brief time to pick up the next message.
        await this.wait();
      }
    }
  }

  private async process() {
    const { items } = await this.processingDatabase.transaction(async tx => {
      return this.processingDatabase.getProcessableEntities(tx, {
        processBatchSize: 1,
      });
    });

    if (!items.length) {
      // No items to process, wait and try again.
      await this.wait();
      return;
    }

    // TODO: replace Promise.all with something more sophisticated for parallel processing.
    await Promise.all(
      items.map(async item => {
        const { id, state, unprocessedEntity, entityRef } = item;
        const result = await this.orchestrator.process({
          entity: unprocessedEntity,
          state,
        });

        for (const error of result.errors) {
          // TODO(freben): Try to extract the location out of the unprocessed
          // entity and add as meta to the log lines
          this.logger.warn(error.message, {
            entity: entityRef,
          });
        }
        const errorsString = JSON.stringify(
          result.errors.map(e => serializeError(e)),
        );

        // If the result was marked as not OK, it signals that some part of the
        // processing pipeline threw an exception. This can happen both as part of
        // non-catastrophic things such as due to validation errors, as well as if
        // something fatal happens inside the processing for other reasons. In any
        // case, this means we can't trust that anything in the output is okay. So
        // just store the errors and trigger a stich so that they become visible to
        // the outside.
        if (!result.ok) {
          await this.processingDatabase.transaction(async tx => {
            await this.processingDatabase.updateProcessedEntityErrors(tx, {
              id,
              errors: errorsString,
            });
          });
          await this.stitcher.stitch(
            new Set([stringifyEntityRef(unprocessedEntity)]),
          );
          return;
        }

        result.completedEntity.metadata.uid = id;
        await this.processingDatabase.transaction(async tx => {
          await this.processingDatabase.updateProcessedEntity(tx, {
            id,
            processedEntity: result.completedEntity,
            state: result.state,
            errors: errorsString,
            relations: result.relations,
            deferredEntities: result.deferredEntities,
          });
        });

        const setOfThingsToStitch = new Set<string>([
          stringifyEntityRef(result.completedEntity),
          ...result.relations.map(relation =>
            stringifyEntityRef(relation.source),
          ),
        ]);
        await this.stitcher.stitch(setOfThingsToStitch);
      }),
    );
  }

  private async wait() {
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
  }

  async stop() {
    this.running = false;
  }
}
