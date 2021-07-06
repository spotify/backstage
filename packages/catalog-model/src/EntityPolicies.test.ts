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
import { EntityPolicies } from './EntityPolicies';

describe('EntityPolicies', () => {
  const p1: jest.Mocked<EntityPolicy> = { enforce: jest.fn() };
  const p2: jest.Mocked<EntityPolicy> = { enforce: jest.fn() };
  const entity1: Entity = {
    apiVersion: 'a1',
    kind: 'k1',
    metadata: { name: 'n1' },
  };
  const entity2: Entity = {
    apiVersion: 'a2',
    kind: 'k2',
    metadata: { name: 'n2' },
  };

  afterEach(() => jest.resetAllMocks());

  describe('allOf', () => {
    it('resolves when no policies', async () => {
      const policy = EntityPolicies.allOf([]);
      await expect(policy.enforce(entity1)).resolves.toBe(entity1);
    });

    it('resolves when all resolve', async () => {
      p1.enforce.mockResolvedValue(entity1);
      p2.enforce.mockResolvedValue(entity1);
      const policy = EntityPolicies.allOf([p1, p2]);
      await expect(policy.enforce(entity1)).resolves.toBe(entity1);
    });

    it('rejects when any rejects', async () => {
      p1.enforce.mockResolvedValue(entity1);
      p2.enforce.mockRejectedValue(new Error('a'));
      const policy = EntityPolicies.allOf([p1, p2]);
      await expect(policy.enforce(entity1)).rejects.toThrow('a');
    });

    it('rejects when any ignores', async () => {
      p1.enforce.mockResolvedValue(entity1);
      p2.enforce.mockResolvedValue(undefined);
      const policy = EntityPolicies.allOf([p1, p2]);
      await expect(policy.enforce(entity1)).rejects.toThrow(
        /did not return a result/,
      );
    });

    it('passes through transforms properly', async () => {
      p1.enforce.mockResolvedValue(entity2);
      p2.enforce.mockResolvedValue(entity2);
      const policy = EntityPolicies.allOf([p1, p2]);
      await expect(policy.enforce(entity1)).resolves.toBe(entity2);
      expect(p1.enforce).toBeCalledWith(entity1);
      expect(p2.enforce).toBeCalledWith(entity2);
    });
  });

  describe('oneOf', () => {
    it('rejects when no policies', async () => {
      const policy = EntityPolicies.oneOf([]);
      await expect(policy.enforce(entity1)).rejects.toThrow(/did not match/);
    });

    it('resolves when one resolves', async () => {
      p1.enforce.mockResolvedValue(undefined);
      p2.enforce.mockResolvedValue(entity1);
      const policy = EntityPolicies.oneOf([p1, p2]);
      await expect(policy.enforce(entity1)).resolves.toBe(entity1);
    });

    it('rejects when one rejects first', async () => {
      p1.enforce.mockRejectedValue(new Error('a'));
      p2.enforce.mockResolvedValue(entity1);
      const policy = EntityPolicies.oneOf([p1, p2]);
      await expect(policy.enforce(entity1)).rejects.toThrow('a');
    });

    it('resolves first resolution when several resolve', async () => {
      p1.enforce.mockResolvedValue(entity1);
      p2.enforce.mockResolvedValue(entity2);
      const policy = EntityPolicies.oneOf([p1, p2]);
      await expect(policy.enforce(entity1)).resolves.toBe(entity1);
    });

    it('rejects when all ignore', async () => {
      p1.enforce.mockResolvedValue(undefined);
      p2.enforce.mockResolvedValue(undefined);
      const policy = EntityPolicies.oneOf([p1, p2]);
      await expect(policy.enforce(entity1)).rejects.toThrow(/did not match/);
    });
  });
});
