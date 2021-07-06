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
  UserEntityV1alpha1,
  userEntityV1alpha1Validator as validator,
} from './UserEntityV1alpha1';

describe('userEntityV1alpha1Validator', () => {
  let entity: UserEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'doe',
      },
      spec: {
        profile: {
          displayName: 'John Doe',
          email: 'john@doe.org',
          picture: 'https://doe.org/john.jpeg',
        },
        memberOf: ['team-a', 'developers'],
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  // root

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

  it('spec accepts unknown additional fields', async () => {
    (entity as any).spec.foo = 'data';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  // profile

  it('accepts missing profile', async () => {
    delete (entity as any).spec.profile;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects wrong profile', async () => {
    (entity as any).spec.profile = 7;
    await expect(validator.check(entity)).rejects.toThrow(/profile/);
  });

  it('profile accepts missing displayName', async () => {
    delete (entity as any).spec.profile.displayName;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('profile rejects wrong displayName', async () => {
    (entity as any).spec.profile.displayName = 7;
    await expect(validator.check(entity)).rejects.toThrow(/displayName/);
  });

  it('profile rejects empty displayName', async () => {
    (entity as any).spec.profile.displayName = '';
    await expect(validator.check(entity)).rejects.toThrow(/displayName/);
  });

  it('profile accepts missing email', async () => {
    delete (entity as any).spec.profile.email;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('profile rejects wrong email', async () => {
    (entity as any).spec.profile.email = 7;
    await expect(validator.check(entity)).rejects.toThrow(/email/);
  });

  it('profile rejects empty email', async () => {
    (entity as any).spec.profile.email = '';
    await expect(validator.check(entity)).rejects.toThrow(/email/);
  });

  it('profile accepts missing picture', async () => {
    delete (entity as any).spec.profile.picture;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('profile rejects wrong picture', async () => {
    (entity as any).spec.profile.picture = 7;
    await expect(validator.check(entity)).rejects.toThrow(/picture/);
  });

  it('profile rejects empty picture', async () => {
    (entity as any).spec.profile.picture = '';
    await expect(validator.check(entity)).rejects.toThrow(/picture/);
  });

  it('profile accepts unknown additional fields', async () => {
    (entity as any).spec.profile.foo = 'data';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  // memberOf

  it('rejects missing memberOf', async () => {
    delete (entity as any).spec.memberOf;
    await expect(validator.check(entity)).rejects.toThrow(/memberOf/);
  });

  it('rejects wrong memberOf', async () => {
    (entity as any).spec.memberOf = 7;
    await expect(validator.check(entity)).rejects.toThrow(/memberOf/);
  });

  it('rejects wrong memberOf item', async () => {
    (entity as any).spec.memberOf[0] = 7;
    await expect(validator.check(entity)).rejects.toThrow(/memberOf/);
  });

  it('accepts empty memberOf', async () => {
    (entity as any).spec.memberOf = [];
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects null memberOf', async () => {
    (entity as any).spec.memberOf = null;
    await expect(validator.check(entity)).rejects.toThrow(/memberOf/);
  });
});
