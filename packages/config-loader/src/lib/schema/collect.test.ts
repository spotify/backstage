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

import mockFs from 'mock-fs';
import { collectConfigSchemas } from './collect';
import path from 'path';

const mockSchema = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
      visibility: 'frontend',
    },
  },
};

// We need to load in actual TS libraries when using mock-fs.
// This lookup is to allow the `typescript` dependency to exist either
// at top level or inside node_modules of typescript-json-schema
const typescriptModuleDir = path.dirname(
  require.resolve('typescript/package.json', {
    paths: [require.resolve('typescript-json-schema')],
  }),
);

describe('collectConfigSchemas', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should not find any schemas without packages', async () => {
    mockFs({
      'lerna.json': JSON.stringify({
        packages: ['packages/*'],
      }),
    });

    await expect(collectConfigSchemas([])).resolves.toEqual([]);
  });

  it('should find schema in a local package', async () => {
    mockFs({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: mockSchema,
          }),
        },
      },
    });

    await expect(collectConfigSchemas(['a'])).resolves.toEqual([
      {
        path: path.join('node_modules', 'a', 'package.json'),
        value: mockSchema,
      },
    ]);
  });

  it('should find schema in transitive dependencies', async () => {
    mockFs({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: { b: '0.0.0', '@backstage/mock': '0.0.0' },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              c1: '0.0.0',
              c2: '0.0.0',
              '@backstage/mock': '0.0.0',
            },
            configSchema: { ...mockSchema, title: 'b' },
          }),
        },
        c1: {
          'package.json': JSON.stringify({
            name: 'c1',
            dependencies: { d1: '0.0.0' },
            configSchema: { ...mockSchema, title: 'c1' },
          }),
        },
        c2: {
          'package.json': JSON.stringify({
            name: 'c2',
            dependencies: { d2: '0.0.0' },
          }),
        },
        d1: {
          'package.json': JSON.stringify({
            name: 'd1',
            dependencies: {},
            configSchema: { ...mockSchema, title: 'd1' },
          }),
        },
        d2: {
          'package.json': JSON.stringify({
            name: 'd2',
            dependencies: {},
            configSchema: { ...mockSchema, title: 'd2' },
          }),
        },
      },
    });

    await expect(collectConfigSchemas(['a'])).resolves.toEqual([
      {
        path: path.join('node_modules', 'b', 'package.json'),
        value: { ...mockSchema, title: 'b' },
      },
      {
        path: path.join('node_modules', 'c1', 'package.json'),
        value: { ...mockSchema, title: 'c1' },
      },
      {
        path: path.join('node_modules', 'd1', 'package.json'),
        value: { ...mockSchema, title: 'd1' },
      },
    ]);
  });

  it('should schema of different types', async () => {
    mockFs({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: { ...mockSchema, title: 'inline' },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            configSchema: 'schema.json',
          }),
          'schema.json': JSON.stringify({ ...mockSchema, title: 'external' }),
        },
        c: {
          'package.json': JSON.stringify({
            name: 'c',
            configSchema: 'schema.d.ts',
          }),
          'schema.d.ts': `export interface Config {
              /** @visibility secret */
              tsKey: string
            }`,
        },
      },
      // TypeScript compilation needs to load some real files inside the typescript dir
      [typescriptModuleDir]: (mockFs as any).load(typescriptModuleDir),
    });

    await expect(collectConfigSchemas(['a', 'b', 'c'])).resolves.toEqual([
      {
        path: path.join('node_modules', 'a', 'package.json'),
        value: { ...mockSchema, title: 'inline' },
      },
      {
        path: path.join('node_modules', 'b', 'schema.json'),
        value: { ...mockSchema, title: 'external' },
      },
      {
        path: path.join('node_modules', 'c', 'schema.d.ts'),
        value: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            tsKey: {
              type: 'string',
              visibility: 'secret',
            },
          },
          required: ['tsKey'],
        },
      },
    ]);
  });

  it('should not allow unknown schema file types', async () => {
    mockFs({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: 'schema.yaml',
          }),
          'schema.yaml': mockSchema,
        },
      },
    });

    await expect(collectConfigSchemas(['a'])).rejects.toThrow(
      'Config schema files must be .json or .d.ts, got schema.yaml',
    );
  });

  it('should reject typescript config declaration without a Config type', async () => {
    mockFs({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: 'schema.d.ts',
          }),
          'schema.d.ts': `export interface NotConfig {}`,
        },
      },
      // TypeScript compilation needs to load some real files inside the typescript dir
      [typescriptModuleDir]: (mockFs as any).load(typescriptModuleDir),
    });

    await expect(collectConfigSchemas(['a'])).rejects.toThrow(
      `Invalid schema in ${path.join(
        'node_modules',
        'a',
        'schema.d.ts',
      )}, missing Config export`,
    );
  });
});
