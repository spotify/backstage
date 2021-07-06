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

import {
  Entity,
  EntityPolicy,
  LocationEntity,
  LocationSpec,
  parseLocationReference,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { ConflictError, InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import path from 'path';
import { Logger } from 'winston';
import {
  CatalogProcessor,
  CatalogProcessorParser,
} from '../../ingestion/processors';
import * as results from '../../ingestion/processors/results';
import {
  CatalogProcessingOrchestrator,
  EntityProcessingRequest,
  EntityProcessingResult,
} from './types';
import { ProcessorOutputCollector } from './ProcessorOutputCollector';
import {
  getEntityLocationRef,
  getEntityOriginLocationRef,
  isLocationEntity,
  toAbsoluteUrl,
  validateEntity,
  validateEntityEnvelope,
} from './util';

type Context = {
  entityRef: string;
  location: LocationSpec;
  originLocation: LocationSpec;
  collector: ProcessorOutputCollector;
};

export class DefaultCatalogProcessingOrchestrator
  implements CatalogProcessingOrchestrator {
  constructor(
    private readonly options: {
      processors: CatalogProcessor[];
      integrations: ScmIntegrationRegistry;
      logger: Logger;
      parser: CatalogProcessorParser;
      policy: EntityPolicy;
    },
  ) {}

  async process(
    request: EntityProcessingRequest,
  ): Promise<EntityProcessingResult> {
    return this.processSingleEntity(request.entity);
  }

  private async processSingleEntity(
    unprocessedEntity: Entity,
  ): Promise<EntityProcessingResult> {
    const collector = new ProcessorOutputCollector(
      this.options.logger,
      unprocessedEntity,
    );

    try {
      // This will be checked and mutated step by step below
      let entity: Entity = unprocessedEntity;

      // NOTE: At this early point, we can only rely on the envelope having to
      // be valid; full entity + kind validation happens after the (potentially
      // mutative) pre-steps. This means that the code below can't make a lot
      // of assumptions about the data despite it using the Entity type.
      try {
        validateEntityEnvelope(entity);
      } catch (e) {
        throw new InputError(
          `Entity envelope failed validation before processing`,
          e,
        );
      }

      // TODO: which one do we actually use for the location?
      // source-location? - maybe probably doesn't exist yet?
      const context: Context = {
        entityRef: stringifyEntityRef(entity),
        location: parseLocationReference(getEntityLocationRef(entity)),
        originLocation: parseLocationReference(
          getEntityOriginLocationRef(entity),
        ),
        collector,
      };

      // Run the steps
      entity = await this.runPreProcessStep(entity, context);
      entity = await this.runPolicyStep(entity);
      await this.runValidateStep(entity, context);
      if (isLocationEntity(entity)) {
        await this.runSpecialLocationStep(entity, context);
      }
      entity = await this.runPostProcessStep(entity, context);

      return {
        ...context.collector.results(),
        completedEntity: entity,
        state: new Map(),
        ok: true,
      };
    } catch (error) {
      this.options.logger.warn(error.message);
      return {
        ok: false,
        errors: collector.results().errors.concat(error),
      };
    }
  }

  // Pre-process phase, used to populate entities with data that is required
  // during the main processing step
  private async runPreProcessStep(
    entity: Entity,
    context: Context,
  ): Promise<Entity> {
    let result = entity;

    for (const processor of this.options.processors) {
      if (processor.preProcessEntity) {
        try {
          result = await processor.preProcessEntity(
            result,
            context.location,
            context.collector.onEmit,
            context.originLocation,
          );
        } catch (e) {
          throw new InputError(
            `Processor ${processor.constructor.name} threw an error while preprocessing`,
            e,
          );
        }
      }
    }

    return result;
  }

  /**
   * Enforce entity policies making sure that entities conform to a general schema
   */
  private async runPolicyStep(entity: Entity): Promise<Entity> {
    let policyEnforcedEntity: Entity | undefined;

    try {
      policyEnforcedEntity = await this.options.policy.enforce(entity);
    } catch (e) {
      throw new InputError('Policy check failed', e);
    }

    if (!policyEnforcedEntity) {
      throw new Error('Policy unexpectedly returned no data');
    }

    return policyEnforcedEntity;
  }

  /**
   * Validate the given entity
   */
  private async runValidateStep(
    entity: Entity,
    context: Context,
  ): Promise<void> {
    // Double check that none of the previous steps tried to change something
    // related to the entity ref, which would break downstream
    if (stringifyEntityRef(entity) !== context.entityRef) {
      throw new ConflictError(
        'Fatal: The entity kind, namespace, or name changed during processing',
      );
    }

    // Validate that the end result is a valid Entity at all
    try {
      validateEntity(entity);
    } catch (e) {
      throw new ConflictError(
        `Entity envelope failed validation after preprocessing`,
        e,
      );
    }

    let foundKind = false;

    for (const processor of this.options.processors) {
      if (processor.validateEntityKind) {
        try {
          foundKind = await processor.validateEntityKind(entity);
          if (foundKind) {
            // TODO(freben): It would make sense to keep running, so that
            // multiple processors could have a go at making checks. For
            // example, an org may want to add additional rules on top of the
            // provided ones. But that would be a breaking change, so we'll
            // postpone that to a future processors rewrite.
            break;
          }
        } catch (e) {
          throw new InputError(
            `Processor ${processor.constructor.name} threw an error while validating the entity`,
            e,
          );
        }
      }
    }

    if (!foundKind) {
      throw new InputError(
        'No processor recognized the entity as valid, possibly caused by a foreign kind or apiVersion',
      );
    }
  }

  /**
   * Backwards compatible processing of location entities
   */
  private async runSpecialLocationStep(
    entity: LocationEntity,
    context: Context,
  ): Promise<void> {
    const { type = context.location.type } = entity.spec;
    const targets = new Array<string>();
    if (entity.spec.target) {
      targets.push(entity.spec.target);
    }
    if (entity.spec.targets) {
      targets.push(...entity.spec.targets);
    }

    for (const maybeRelativeTarget of targets) {
      if (type === 'file' && maybeRelativeTarget.endsWith(path.sep)) {
        context.collector.onEmit(
          results.inputError(
            context.location,
            `LocationEntityProcessor cannot handle ${type} type location with target ${context.location.target} that ends with a path separator`,
          ),
        );
        continue;
      }
      const target = toAbsoluteUrl(
        this.options.integrations,
        context.location,
        type,
        maybeRelativeTarget,
      );

      let didRead = false;
      for (const processor of this.options.processors) {
        if (processor.readLocation) {
          try {
            const read = await processor.readLocation(
              {
                type,
                target,
                presence: 'required',
              },
              false,
              context.collector.onEmit,
              this.options.parser,
            );
            if (read) {
              didRead = true;
              break;
            }
          } catch (e) {
            throw new InputError(
              `Processor ${processor.constructor.name} threw an error while reading ${type}:${target}`,
              e,
            );
          }
        }
      }
      if (!didRead) {
        throw new InputError(
          `No processor was able to handle reading of ${type}:${target}`,
        );
      }
    }
  }

  /**
   * Main processing step of the entity
   */
  private async runPostProcessStep(
    entity: Entity,
    context: Context,
  ): Promise<Entity> {
    let result = entity;

    for (const processor of this.options.processors) {
      if (processor.postProcessEntity) {
        try {
          result = await processor.postProcessEntity(
            result,
            context.location,
            context.collector.onEmit,
          );
        } catch (e) {
          throw new InputError(
            `Processor ${processor.constructor.name} threw an error while postprocessing`,
            e,
          );
        }
      }
    }

    return result;
  }
}
