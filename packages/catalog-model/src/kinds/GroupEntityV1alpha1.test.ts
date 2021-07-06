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
  GroupEntityV1alpha1,
  groupEntityV1alpha1Validator as validator,
} from './GroupEntityV1alpha1';

describe('GroupV1alpha1Validator', () => {
  let entity: GroupEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: 'doe-squad',
        description: 'A squad for John and Jane',
      },
      spec: {
        type: 'squad',
        profile: {
          displayName: 'Doe Squad',
          email: 'doe@doe.org',
          picture: 'https://doe.org/doe',
        },
        parent: 'group-a',
        children: ['child-a', 'child-b'],
        members: ['jdoe'],
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

  // parent

  it('accepts missing parent', async () => {
    delete (entity as any).spec.parent;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty parent', async () => {
    (entity as any).spec.parent = '';
    await expect(validator.check(entity)).rejects.toThrow(/parent/);
  });

  // children

  it('rejects missing children', async () => {
    delete (entity as any).spec.children;
    await expect(validator.check(entity)).rejects.toThrow(/children/);
  });

  it('rejects empty children', async () => {
    (entity as any).spec.children = [''];
    await expect(validator.check(entity)).rejects.toThrow(/children/);
  });

  it('rejects undefined children', async () => {
    (entity as any).spec.children = [undefined];
    await expect(validator.check(entity)).rejects.toThrow(/children/);
  });

  it('accepts no children', async () => {
    (entity as any).spec.children = [];
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  // members

  it('accepts missing members', async () => {
    delete (entity as any).spec.members;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty members', async () => {
    (entity as any).spec.members = [''];
    await expect(validator.check(entity)).rejects.toThrow(/members/);
  });

  it('rejects undefined members', async () => {
    (entity as any).spec.members = [undefined];
    await expect(validator.check(entity)).rejects.toThrow(/members/);
  });

  it('accepts no members', async () => {
    (entity as any).spec.members = [];
    await expect(validator.check(entity)).resolves.toBe(true);
  });
});
