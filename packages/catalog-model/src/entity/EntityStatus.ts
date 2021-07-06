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

import { SerializedError } from '@backstage/errors';

/**
 * The current status of the entity, as claimed by various sources.
 * @alpha
 */
export type UNSTABLE_EntityStatus = {
  /**
   * Specific status item on a well known format.
   */
  items?: UNSTABLE_EntityStatusItem[];
};

/**
 * A specific status item on a well known format.
 * @alpha
 */
export type UNSTABLE_EntityStatusItem = {
  /**
   * The type of status as a unique key per source.
   */
  type: string;
  /**
   * The level / severity of the status item. If the level is "error", the
   * processing of the entity may be entirely blocked. In this case the status
   * entry may apply to a different, newer version of the data than what is
   * being returned in the catalog response.
   */
  level: UNSTABLE_EntityStatusLevel;
  /**
   * A brief message describing the status, intended for human consumption.
   */
  message: string;
  /**
   * An optional serialized error object related to the status.
   */
  error?: SerializedError;
};

/**
 * Each entity status item has a level, describing its severity.
 * @alpha
 */
export type UNSTABLE_EntityStatusLevel =
  | 'info' // Only informative data
  | 'warning' // Warnings were found
  | 'error'; // Errors were found
