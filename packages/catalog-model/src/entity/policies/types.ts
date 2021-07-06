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

import type { Entity } from '../Entity';

/**
 * A policy for validation or mutation to be applied to entities as they are
 * entering the system.
 */
export type EntityPolicy = {
  /**
   * Applies validation or mutation on an entity.
   *
   * @param entity The entity, as validated/mutated so far in the policy tree
   * @returns The incoming entity, or a mutated version of the same, or
   *          undefined if this processor could not handle the entity
   * @throws An error if the entity should be rejected
   */
  enforce(entity: Entity): Promise<Entity | undefined>;
};
