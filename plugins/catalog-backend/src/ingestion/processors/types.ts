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
  Entity,
  EntityRelationSpec,
  LocationSpec,
} from '@backstage/catalog-model';

export type CatalogProcessor = {
  /**
   * Reads the contents of a location.
   *
   * @param location The location to read
   * @param optional Whether a missing target should trigger an error
   * @param emit A sink for items resulting from the read
   * @param parser A parser, that is able to take the raw catalog descriptor
   *               data and turn it into the actual result pieces.
   * @returns True if handled by this processor, false otherwise
   */
  readLocation?(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
    parser: CatalogProcessorParser,
  ): Promise<boolean>;

  /**
   * Pre-processes an emitted entity, after it has been emitted but before it
   * has been validated.
   *
   * This type of processing usually involves enriching the entity with
   * additional data, and the input entity may actually still be incomplete
   * when the processor is invoked.
   *
   * @param entity The (possibly partial) entity to process
   * @param location The location that the entity came from
   * @param emit A sink for auxiliary items resulting from the processing
   * @param originLocation The location that the entity originally came from.
   *   While location resolves to the direct parent location, originLocation
   *   tells which location was used to start the ingestion loop.
   * @returns The same entity or a modified version of it
   */
  preProcessEntity?(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
    originLocation: LocationSpec,
  ): Promise<Entity>;

  /**
   * Validates the entity as a known entity kind, after it has been pre-
   * processed and has passed through basic overall validation.
   *
   * @param entity The entity to validate
   * @returns Resolves to true, if the entity was of a kind that was known and
   *   handled by this processor, and was found to be valid. Resolves to false,
   *   if the entity was not of a kind that was known by this processor.
   *   Rejects to an Error describing the problem, if the entity was of a kind
   *   that was known by this processor and was not valid.
   */
  validateEntityKind?(entity: Entity): Promise<boolean>;

  /**
   * Post-processes an emitted entity, after it has been validated.
   *
   * @param entity The entity to process
   * @param location The location that the entity came from
   * @param emit A sink for auxiliary items resulting from the processing
   * @returns The same entity or a modified version of it
   */
  postProcessEntity?(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity>;

  /**
   * Handles an emitted error.
   *
   * @param error The error
   * @param location The location where the error occurred
   * @param emit A sink for items resulting from this handling
   * @returns Nothing
   */
  handleError?(
    error: Error,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<void>;
};

/**
 * A parser, that is able to take the raw catalog descriptor data and turn it
 * into the actual result pieces. The default implementation performs a YAML
 * document parsing.
 */
export type CatalogProcessorParser = (options: {
  data: Buffer;
  location: LocationSpec;
}) => AsyncIterable<CatalogProcessorResult>;

export type CatalogProcessorEmit = (generated: CatalogProcessorResult) => void;

export type CatalogProcessorLocationResult = {
  type: 'location';
  location: LocationSpec;
  optional: boolean;
};

export type CatalogProcessorEntityResult = {
  type: 'entity';
  entity: Entity;
  location: LocationSpec;
};

export type CatalogProcessorRelationResult = {
  type: 'relation';
  relation: EntityRelationSpec;
  entityRef?: string;
};

export type CatalogProcessorErrorResult = {
  type: 'error';
  error: Error;
  location: LocationSpec;
};

export type CatalogProcessorResult =
  | CatalogProcessorLocationResult
  | CatalogProcessorEntityResult
  | CatalogProcessorRelationResult
  | CatalogProcessorErrorResult;
