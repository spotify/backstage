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

import { Entity, EntityRelationSpec } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import { Transaction } from '../../database/types';
import { DeferredEntity } from '../processing/types';

export type AddUnprocessedEntitiesOptions =
  | {
      sourceEntityRef: string;
      entities: DeferredEntity[];
    }
  | {
      sourceKey: string;
      entities: DeferredEntity[];
    };

export type AddUnprocessedEntitiesResult = {};

export type UpdateProcessedEntityOptions = {
  id: string;
  processedEntity: Entity;
  state?: Map<string, JsonObject>;
  errors?: string;
  relations: EntityRelationSpec[];
  deferredEntities: DeferredEntity[];
  locationKey?: string;
};

export type UpdateProcessedEntityErrorsOptions = {
  id: string;
  errors?: string;
};

export type RefreshStateItem = {
  id: string;
  entityRef: string;
  unprocessedEntity: Entity;
  processedEntity?: Entity;
  nextUpdateAt: string;
  lastDiscoveryAt: string; // remove?
  state: Map<string, JsonObject>;
  errors?: string;
  locationKey?: string;
};

export type GetProcessableEntitiesResult = {
  items: RefreshStateItem[];
};

export type ReplaceUnprocessedEntitiesOptions =
  | {
      sourceKey: string;
      items: DeferredEntity[];
      type: 'full';
    }
  | {
      sourceKey: string;
      added: DeferredEntity[];
      removed: DeferredEntity[];
      type: 'delta';
    };

export interface ProcessingDatabase {
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  replaceUnprocessedEntities(
    txOpaque: Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<void>;
  getProcessableEntities(
    txOpaque: Transaction,
    request: { processBatchSize: number },
  ): Promise<GetProcessableEntitiesResult>;

  /**
   * Updates a processed entity
   */
  updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void>;

  /**
   * Updates only the errors of a processed entity
   */
  updateProcessedEntityErrors(
    txOpaque: Transaction,
    options: UpdateProcessedEntityErrorsOptions,
  ): Promise<void>;
}
