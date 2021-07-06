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
  EntityRelationSpec,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
  stringifyLocationReference,
} from '@backstage/catalog-model';
import { Logger } from 'winston';
import { CatalogProcessorResult } from '../../ingestion';
import { locationSpecToLocationEntity } from '../util';
import { DeferredEntity } from './types';
import {
  getEntityLocationRef,
  getEntityOriginLocationRef,
  validateEntityEnvelope,
} from './util';

/**
 * Helper class for aggregating all of the emitted data from processors.
 */
export class ProcessorOutputCollector {
  private readonly errors = new Array<Error>();
  private readonly relations = new Array<EntityRelationSpec>();
  private readonly deferredEntities = new Array<DeferredEntity>();
  private done = false;

  constructor(
    private readonly logger: Logger,
    private readonly parentEntity: Entity,
  ) {}

  get onEmit(): (i: CatalogProcessorResult) => void {
    return i => this.receive(i);
  }

  results() {
    this.done = true;
    return {
      errors: this.errors,
      relations: this.relations,
      deferredEntities: this.deferredEntities,
    };
  }

  private receive(i: CatalogProcessorResult) {
    if (this.done) {
      this.logger.warn(
        `Item if type ${i.type} was emitted after processing had completed at ${
          new Error().stack
        }`,
      );
      return;
    }

    if (i.type === 'entity') {
      let entity: Entity;
      try {
        entity = validateEntityEnvelope(i.entity);
      } catch (e) {
        this.logger.debug(`Envelope validation failed at ${i.location}, ${e}`);
        this.errors.push(e);
        return;
      }

      const location = stringifyLocationReference(i.location);

      // Note that at this point, we have only validated the envelope part of
      // the entity data. Annotations are not part of that, so we have to be
      // defensive. If the annotations were malformed (e.g. were not a valid
      // object), we just skip over this step and let the full entity
      // validation at the next step of processing catch that.
      const annotations = entity.metadata.annotations || {};
      if (typeof annotations === 'object' && !Array.isArray(annotations)) {
        const originLocation = getEntityOriginLocationRef(this.parentEntity);
        entity = {
          ...entity,
          metadata: {
            ...entity.metadata,
            annotations: {
              ...annotations,
              [ORIGIN_LOCATION_ANNOTATION]: originLocation,
              [LOCATION_ANNOTATION]: location,
            },
          },
        };
      }

      this.deferredEntities.push({ entity, locationKey: location });
    } else if (i.type === 'location') {
      const entity = locationSpecToLocationEntity(
        i.location,
        this.parentEntity,
      );
      const locationKey = getEntityLocationRef(entity);
      this.deferredEntities.push({ entity, locationKey });
    } else if (i.type === 'relation') {
      this.relations.push(i.relation);
    } else if (i.type === 'error') {
      this.errors.push(i.error);
    }
  }
}
