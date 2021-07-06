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

import { createSubstitutionTransform } from './substitution';

const env = jest.fn(async (name: string) => {
  return ({
    SECRET: 'my-secret',
    TOKEN: 'my-token',
  } as { [name: string]: string })[name];
});

const substituteTransform = createSubstitutionTransform(env);

describe('substituteTransform', () => {
  it('should not transform unknown values', async () => {
    await expect(substituteTransform(false, '/')).resolves.toEqual({
      applied: false,
    });
    await expect(substituteTransform([1], '/')).resolves.toEqual({
      applied: false,
    });
    await expect(substituteTransform(1, '/')).resolves.toEqual({
      applied: false,
    });
    await expect(substituteTransform({ x: 'y' }, '/')).resolves.toEqual({
      applied: false,
    });
    await expect(substituteTransform(null, '/')).resolves.toEqual({
      applied: false,
    });
  });

  it('should substitute env var', async () => {
    await expect(substituteTransform('hello ${SECRET}', '/')).resolves.toEqual({
      applied: true,
      value: 'hello my-secret',
    });
    await expect(
      substituteTransform('${SECRET      } $${} ${TOKEN }', '/'),
    ).resolves.toEqual({ applied: true, value: 'my-secret ${} my-token' });
    await expect(substituteTransform('foo ${MISSING}', '/')).resolves.toEqual({
      applied: true,
      value: undefined,
    });
    await expect(
      substituteTransform('empty substitute ${}', '/'),
    ).resolves.toEqual({
      applied: true,
      value: undefined,
    });
    await expect(
      substituteTransform('foo ${MISSING} ${SECRET}', '/'),
    ).resolves.toEqual({ applied: true, value: undefined });
    await expect(
      substituteTransform('foo ${SECRET} ${SECRET}', '/'),
    ).resolves.toEqual({ applied: true, value: 'foo my-secret my-secret' });
    await expect(
      substituteTransform('foo ${SECRET} $$${ESCAPE_ME}', '/'),
    ).resolves.toEqual({ applied: true, value: 'foo my-secret $${ESCAPE_ME}' });
    await expect(
      substituteTransform('foo $${ESCAPE_ME} $$${ESCAPE_ME_TOO} $${}', '/'),
    ).resolves.toEqual({
      applied: true,
      value: 'foo ${ESCAPE_ME} $${ESCAPE_ME_TOO} ${}',
    });
  });
});
