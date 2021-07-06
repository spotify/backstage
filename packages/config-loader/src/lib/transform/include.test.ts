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

import * as os from 'os';
import { resolve as resolvePath } from 'path';
import { createIncludeTransform } from './include';
import { TransformFunc } from './types';

const root = os.platform() === 'win32' ? 'C:\\' : '/';
const substituteMe = '${MY_SUBSTITUTION}';
const mySubstitution = 'fooSubstitution';

const env = jest.fn(async (name: string) => {
  return ({
    SECRET: 'my-secret',
  } as { [name: string]: string })[name];
});

const substitute: TransformFunc = async value => {
  if (typeof value !== 'string') {
    return { applied: false };
  }
  if (value.includes(substituteMe)) {
    return {
      applied: true,
      value: value.replace(substituteMe, mySubstitution),
    };
  }

  return { applied: false };
};

const readFile = jest.fn(async (path: string) => {
  const content = ({
    [resolvePath(root, 'my-secret')]: 'secret',
    [resolvePath(root, 'my-data.json')]: '{"a":{"b":{"c":42}}}',
    [resolvePath(root, 'my-data.yaml')]: 'some:\n yaml:\n  key: 7',
    [resolvePath(root, 'my-data.yml')]: 'different: { key: hello }',
    [resolvePath(root, 'invalid.yaml')]: 'foo: [}',
    [resolvePath(root, `${mySubstitution}/my-data.json`)]: '{"foo":"bar"}',
  } as { [key: string]: string })[path];

  if (!content) {
    throw new Error('File not found!');
  }
  return content;
});

const includeTransform = createIncludeTransform(env, readFile, substitute);

describe('includeTransform', () => {
  it('should not transform unknown values', async () => {
    await expect(includeTransform('foo', root)).resolves.toEqual({
      applied: false,
    });
    await expect(includeTransform([1], root)).resolves.toEqual({
      applied: false,
    });
    await expect(includeTransform(1, root)).resolves.toEqual({
      applied: false,
    });
    await expect(includeTransform({ x: 'y' }, root)).resolves.toEqual({
      applied: false,
    });
    await expect(includeTransform(null, root)).resolves.toEqual({
      applied: false,
    });
  });

  it('should include text files', async () => {
    await expect(
      includeTransform({ $file: 'my-secret' }, root),
    ).resolves.toEqual({ applied: true, value: 'secret' });
    await expect(
      includeTransform({ $file: 'no-secret' }, root),
    ).rejects.toThrow('File not found!');
  });

  it('should include env vars', async () => {
    await expect(includeTransform({ $env: 'SECRET' }, root)).resolves.toEqual({
      applied: true,
      value: 'my-secret',
    });
    await expect(
      includeTransform({ $env: 'NO_SECRET' }, root),
    ).resolves.toEqual({
      applied: true,
      value: undefined,
    });
  });

  it('should include config files', async () => {
    // New format with path in fragment
    await expect(
      includeTransform({ $include: 'my-data.json#a.b.c' }, root),
    ).resolves.toEqual({ applied: true, value: 42 });
    await expect(
      includeTransform({ $include: 'my-data.json#a.b' }, root),
    ).resolves.toEqual({ applied: true, value: { c: 42 } });
    await expect(
      includeTransform({ $include: 'my-data.yaml#some.yaml.key' }, root),
    ).resolves.toEqual({ applied: true, value: 7 });
    await expect(
      includeTransform({ $include: 'my-data.yaml' }, root),
    ).resolves.toEqual({
      applied: true,
      value: {
        some: { yaml: { key: 7 } },
      },
    });
    await expect(
      includeTransform({ $include: 'my-data.yaml#' }, root),
    ).resolves.toEqual({
      applied: true,
      value: {
        some: { yaml: { key: 7 } },
      },
    });
    await expect(
      includeTransform({ $include: 'my-data.yml#different.key' }, root),
    ).resolves.toEqual({ applied: true, value: 'hello' });
  });

  it('should reject invalid includes', async () => {
    await expect(
      includeTransform({ $include: 'no-parser.js' }, root),
    ).rejects.toThrow(
      'no configuration parser available for included file no-parser.js',
    );
    await expect(
      includeTransform({ $include: 'no-data.yml#different.key' }, root),
    ).rejects.toThrow('File not found!');
    await expect(
      includeTransform({ $include: 'my-data.yml#missing.key' }, root),
    ).rejects.toThrow(
      "value at 'missing' in included file my-data.yml is not an object",
    );
    await expect(
      includeTransform({ $include: 'invalid.yaml' }, root),
    ).rejects.toThrow(
      'failed to parse included file invalid.yaml, YAMLSyntaxError: Flow sequence contains an unexpected }',
    );
  });

  it('should call substitute prior to handling includes directive', async () => {
    await expect(
      includeTransform({ $include: `${substituteMe}/my-data.json` }, root),
    ).resolves.toEqual({
      applied: true,
      value: { foo: 'bar' },
      newBaseDir: resolvePath(root, mySubstitution),
    });
  });
});
