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

import { Entity, EntityPolicy } from './entity';

// Helper that requires that all of a set of policies can be successfully
// applied
class AllEntityPolicies implements EntityPolicy {
  constructor(private readonly policies: EntityPolicy[]) {}

  async enforce(entity: Entity): Promise<Entity> {
    let result = entity;
    for (const policy of this.policies) {
      const output = await policy.enforce(result);
      if (!output) {
        throw new Error(
          `Policy ${policy.constructor.name} did not return a result`,
        );
      }
      result = output;
    }
    return result;
  }
}

// Helper that requires that at least one of a set of policies can be
// successfully applied
class AnyEntityPolicy implements EntityPolicy {
  constructor(private readonly policies: EntityPolicy[]) {}

  async enforce(entity: Entity): Promise<Entity> {
    for (const policy of this.policies) {
      const output = await policy.enforce(entity);
      if (output) {
        return output;
      }
    }
    throw new Error(`The entity did not match any known policy`);
  }
}

export const EntityPolicies = {
  allOf(policies: EntityPolicy[]) {
    return new AllEntityPolicies(policies);
  },
  oneOf(policies: EntityPolicy[]) {
    return new AnyEntityPolicy(policies);
  },
};
