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

import { Entity } from '../entity';

/**
 * Validates entities of a certain kind.
 */
export type KindValidator = {
  /**
   * Validates the entity as a known entity kind.
   *
   * @param entity The entity to validate
   * @returns Resolves to true, if the entity was of a kind that was known and
   *   handled by this validator, and was found to be valid. Resolves to false,
   *   if the entity was not of a kind that was known by this validator.
   *   Rejects to an Error describing the problem, if the entity was of a kind
   *   that was known by this validator and was not valid.
   */
  check(entity: Entity): Promise<boolean>;
};
