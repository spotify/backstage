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

import { getOwnedResources } from './owner';
import * as fixture from '../__fixtures__/2-deployments.json';

describe('owner', () => {
  describe('getOwnedResources', () => {
    it('should find replicaset ownership from deployment', () => {
      const result = getOwnedResources(
        fixture.deployments[0] as any,
        fixture.replicaSets as any,
      );
      expect(result).toHaveLength(1);
      expect(result[0]?.metadata?.name).toBe('dice-roller-6c8646bfd');
    });
  });
});
