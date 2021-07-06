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
  ResourceEntityV1alpha1,
  resourceEntityV1alpha1Validator as validator,
} from './ResourceEntityV1alpha1';

describe('ResourceV1alpha1Validator', () => {
  let entity: ResourceEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Resource',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'database',
        owner: 'me',
        dependsOn: ['component:component-0', 'resource:resource-0'],
        system: 'system',
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects wrong owner', async () => {
    (entity as any).spec.owner = 7;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('accepts missing dependsOn', async () => {
    delete (entity as any).spec.dependsOn;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty dependsOn', async () => {
    (entity as any).spec.dependsOn = [''];
    await expect(validator.check(entity)).rejects.toThrow(/dependsOn/);
  });

  it('rejects undefined dependsOn', async () => {
    (entity as any).spec.dependsOn = [undefined];
    await expect(validator.check(entity)).rejects.toThrow(/dependsOn/);
  });

  it('accepts no dependsOn', async () => {
    (entity as any).spec.dependsOn = [];
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('accepts missing system', async () => {
    delete (entity as any).spec.system;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects wrong system', async () => {
    (entity as any).spec.system = 7;
    await expect(validator.check(entity)).rejects.toThrow(/system/);
  });

  it('rejects empty system', async () => {
    (entity as any).spec.system = '';
    await expect(validator.check(entity)).rejects.toThrow(/system/);
  });
});
