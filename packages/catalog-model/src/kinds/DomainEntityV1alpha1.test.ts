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
  DomainEntityV1alpha1,
  domainEntityV1alpha1Validator as validator,
} from './DomainEntityV1alpha1';

describe('DomainV1alpha1Validator', () => {
  let entity: DomainEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Domain',
      metadata: {
        name: 'test',
      },
      spec: {
        owner: 'me',
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
});
