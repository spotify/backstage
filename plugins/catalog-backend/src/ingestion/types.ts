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
  Location,
  LocationSpec,
} from '@backstage/catalog-model';
import { RecursivePartial } from '../util/RecursivePartial';

//
// HigherOrderOperation
//

export type HigherOrderOperation = {
  addLocation(
    spec: LocationSpec,
    options?: { dryRun?: boolean },
  ): Promise<AddLocationResult>;
  refreshAllLocations(): Promise<void>;
};

export type AddLocationResult = {
  location: Location;
  entities: Entity[];
};

//
// LocationReader
//

export type LocationReader = {
  /**
   * Reads the contents of a location.
   *
   * @param location The location to read
   * @throws An error if the location was handled by this reader, but could not
   *         be read
   */
  read(location: LocationSpec): Promise<ReadLocationResult>;
};

export type ReadLocationResult = {
  entities: ReadLocationEntity[];
  errors: ReadLocationError[];
};

export type ReadLocationEntity = {
  location: LocationSpec;
  entity: Entity;
  relations: EntityRelationSpec[];
};

export type ReadLocationError = {
  location: LocationSpec;
  error: Error;
};

//
// LocationAnalyzer
//

export type LocationAnalyzer = {
  /**
   * Generates an entity configuration for given git repository. It's used for
   * importing new component to the backstage app.
   *
   * @param location Git repository to analyze and generate config for.
   */
  analyzeLocation(
    location: AnalyzeLocationRequest,
  ): Promise<AnalyzeLocationResponse>;
};

export type AnalyzeLocationRequest = {
  location: LocationSpec;
};

export type AnalyzeLocationResponse = {
  existingEntityFiles: AnalyzeLocationExistingEntity[];
  generateEntities: AnalyzeLocationGenerateEntity[];
};

// If the folder pointed to already contained catalog info yaml files, they are
// read and emitted like this so that the frontend can inform the user that it
// located them and can make sure to register them as well if they weren't
// already
type AnalyzeLocationExistingEntity = {
  location: LocationSpec;
  isRegistered: boolean;
  entity: Entity;
};

// This is some form of representation of what the analyzer could deduce.
// We should probably have a chat about how this can best be conveyed to
// the frontend. It'll probably contain a (possibly incomplete) entity, plus
// enough info for the frontend to know what form data to show to the user
// for overriding/completing the info.
type AnalyzeLocationGenerateEntity = {
  // Some form of partial representation of the entity
  entity: RecursivePartial<Entity>;
  // Lists the suggestions that the user may want to override
  fields: AnalyzeLocationEntityField[];
};

// This is where I get really vague. Something like this perhaps? Or it could be
// something like a json-schema that contains enough info for the frontend to
// be able to present a form and explanations
type AnalyzeLocationEntityField = {
  // e.g. "spec.owner"? The frontend needs to know how to "inject" the field into the
  // entity again if the user wants to change it
  field: string;

  // The outcome of the analysis for this particular field
  state:
    | 'analysisSuggestedValue'
    | 'analysisSuggestedNoValue'
    | 'needsUserInput';

  // If the analysis did suggest a value, this is where it would be. Not sure if we want
  // to limit this to strings or if we want it to be any JsonValue
  value: string | null;

  // A text to show to the user to inform about the choices made. Like, it could say
  // "Found a CODEOWNERS file that covers this target, so we suggest leaving this
  // field empty; which would currently make it owned by X" where X is taken from the
  // codeowners file.
  description: string;
};
