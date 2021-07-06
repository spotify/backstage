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

import { NotAllowedError } from '@backstage/errors';
import { UrlReader } from '@backstage/backend-common';
import {
  Entity,
  EntityPolicy,
  EntityRelationSpec,
  ENTITY_DEFAULT_NAMESPACE,
  LocationSpec,
  stringifyLocationReference,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { CatalogRulesEnforcer } from './CatalogRules';
import * as result from './processors/results';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorEntityResult,
  CatalogProcessorErrorResult,
  CatalogProcessorLocationResult,
  CatalogProcessorParser,
  CatalogProcessorResult,
} from './processors/types';
import { LocationReader, ReadLocationResult } from './types';

// The max amount of nesting depth of generated work items
const MAX_DEPTH = 10;

type Options = {
  reader: UrlReader;
  parser: CatalogProcessorParser;
  logger: Logger;
  config: Config;
  processors: CatalogProcessor[];
  rulesEnforcer: CatalogRulesEnforcer;
  policy: EntityPolicy;
};

/**
 * Implements the reading of a location through a series of processor tasks.
 */
export class LocationReaders implements LocationReader {
  private readonly options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  async read(location: LocationSpec): Promise<ReadLocationResult> {
    const { rulesEnforcer, logger } = this.options;

    const output: ReadLocationResult = {
      entities: [],
      errors: [],
    };
    let items: CatalogProcessorResult[] = [result.location(location, false)];

    for (let depth = 0; depth < MAX_DEPTH; ++depth) {
      const newItems: CatalogProcessorResult[] = [];
      const emit: CatalogProcessorEmit = i => newItems.push(i);

      for (const item of items) {
        if (item.type === 'location') {
          await this.handleLocation(item, emit);
        } else if (item.type === 'entity') {
          if (rulesEnforcer.isAllowed(item.entity, item.location)) {
            const relations = Array<EntityRelationSpec>();

            const entity = await this.handleEntity(
              item,
              emitResult => {
                if (emitResult.type === 'relation') {
                  relations.push(emitResult.relation);
                  return;
                }
                emit(emitResult);
              },
              location,
            );

            if (entity) {
              output.entities.push({
                entity,
                location: item.location,
                relations,
              });
            }
          } else {
            output.errors.push({
              location: item.location,
              error: new NotAllowedError(
                `Entity of kind ${
                  item.entity.kind
                } is not allowed from location ${stringifyLocationReference(
                  item.location,
                )}`,
              ),
            });
          }
        } else if (item.type === 'error') {
          await this.handleError(item, emit);
          output.errors.push({
            location: item.location,
            error: item.error,
          });
        }
      }

      if (newItems.length === 0) {
        return output;
      }

      items = newItems;
    }

    const message = `Max recursion depth ${MAX_DEPTH} reached for location ${location.type} ${location.target}`;
    logger.warn(message);
    output.errors.push({ location, error: new Error(message) });
    return output;
  }

  private async handleLocation(
    item: CatalogProcessorLocationResult,
    emit: CatalogProcessorEmit,
  ) {
    const { processors, logger } = this.options;

    const validatedEmit: CatalogProcessorEmit = emitResult => {
      if (emitResult.type === 'relation') {
        throw new Error('readLocation may not emit entity relations');
      }
      if (
        emitResult.type === 'location' &&
        emitResult.location.type === item.location.type &&
        emitResult.location.target === item.location.target
      ) {
        // Ignore self-referential locations silently (this can happen for
        // example if you use a glob target like "**/*.yaml" in a Location
        // entity)
        return;
      }
      emit(emitResult);
    };

    for (const processor of processors) {
      if (processor.readLocation) {
        try {
          if (
            await processor.readLocation(
              item.location,
              item.optional,
              validatedEmit,
              this.options.parser,
            )
          ) {
            return;
          }
        } catch (e) {
          const message = `Processor ${
            processor.constructor.name
          } threw an error while reading location ${stringifyLocationReference(
            item.location,
          )}, ${e}`;
          emit(result.generalError(item.location, message));
          logger.warn(message);
        }
      }
    }

    const message = `No processor was able to read location ${stringifyLocationReference(
      item.location,
    )}`;
    emit(result.inputError(item.location, message));
    logger.warn(message);
  }

  private async handleEntity(
    item: CatalogProcessorEntityResult,
    emit: CatalogProcessorEmit,
    originLocation: LocationSpec,
  ): Promise<Entity | undefined> {
    const { processors, logger } = this.options;

    let current = item.entity;

    // Construct the name carefully, this happens before validation below
    // so we do not want to crash here due to missing metadata or so
    const kind = current.kind || '';
    const namespace = !current.metadata
      ? ''
      : current.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE;
    const name = !current.metadata ? '' : current.metadata.name;

    for (const processor of processors) {
      if (processor.preProcessEntity) {
        try {
          current = await processor.preProcessEntity(
            current,
            item.location,
            emit,
            originLocation,
          );
        } catch (e) {
          const message = `Processor ${
            processor.constructor.name
          } threw an error while preprocessing entity ${kind}:${namespace}/${name} at ${stringifyLocationReference(
            item.location,
          )}, ${e}`;
          emit(result.generalError(item.location, e.message));
          logger.warn(message);
          return undefined;
        }
      }
    }

    try {
      const next = await this.options.policy.enforce(current);
      if (!next) {
        const message = `Policy unexpectedly returned no data while analyzing entity ${kind}:${namespace}/${name} at ${stringifyLocationReference(
          item.location,
        )}`;
        emit(result.generalError(item.location, message));
        logger.warn(message);
        return undefined;
      }
      current = next;
    } catch (e) {
      const message = `Policy check failed while analyzing entity ${kind}:${namespace}/${name} at ${stringifyLocationReference(
        item.location,
      )}, ${e}`;
      emit(result.inputError(item.location, e.message));
      logger.warn(message);
      return undefined;
    }

    let handled = false;
    for (const processor of processors) {
      if (processor.validateEntityKind) {
        try {
          handled = await processor.validateEntityKind(current);
          if (handled) {
            break;
          }
        } catch (e) {
          const message = `Processor ${
            processor.constructor.name
          } threw an error while validating the entity ${kind}:${namespace}/${name} at ${stringifyLocationReference(
            item.location,
          )}, ${e}`;
          emit(result.inputError(item.location, message));
          logger.warn(message);
          return undefined;
        }
      }
    }
    if (!handled) {
      const message = `No processor recognized the entity ${kind}:${namespace}/${name} at ${stringifyLocationReference(
        item.location,
      )}`;
      emit(result.inputError(item.location, message));
      logger.warn(message);
      return undefined;
    }

    for (const processor of processors) {
      if (processor.postProcessEntity) {
        try {
          current = await processor.postProcessEntity(
            current,
            item.location,
            emit,
          );
        } catch (e) {
          const message = `Processor ${
            processor.constructor.name
          } threw an error while postprocessing entity ${kind}:${namespace}/${name} at ${stringifyLocationReference(
            item.location,
          )}, ${e}`;
          emit(result.generalError(item.location, message));
          logger.warn(message);
          return undefined;
        }
      }
    }

    return current;
  }

  private async handleError(
    item: CatalogProcessorErrorResult,
    emit: CatalogProcessorEmit,
  ) {
    const { processors, logger } = this.options;

    logger.debug(
      `Encountered error at location ${stringifyLocationReference(
        item.location,
      )}, ${item.error}`,
    );

    const validatedEmit: CatalogProcessorEmit = emitResult => {
      if (emitResult.type === 'relation') {
        throw new Error('handleError may not emit entity relations');
      }

      emit(emitResult);
    };

    for (const processor of processors) {
      if (processor.handleError) {
        try {
          await processor.handleError(item.error, item.location, validatedEmit);
        } catch (e) {
          const message = `Processor ${
            processor.constructor.name
          } threw an error while handling another error at ${stringifyLocationReference(
            item.location,
          )}, ${e}`;
          emit(result.generalError(item.location, message));
          logger.warn(message);
        }
      }
    }
  }
}
