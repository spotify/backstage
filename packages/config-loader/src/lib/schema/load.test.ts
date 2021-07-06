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
import { loadConfigSchema } from './load';

describe('loadConfigSchema', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should load schema from packages or data', async () => {
    mockFs({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: {
              type: 'object',
              properties: {
                key1: { type: 'string', visibility: 'frontend' },
              },
            },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            configSchema: 'schema.json',
          }),
          'schema.json': JSON.stringify({
            name: 'a',
            configSchema: {
              type: 'object',
              properties: {
                key2: { type: 'number' },
              },
            },
          }),
        },
      },
    });

    const schema = await loadConfigSchema({
      dependencies: ['a'],
    });

    const configs = [{ data: { key1: 'a', key2: 2 }, context: 'test' }];

    expect(schema.process(configs)).toEqual(configs);
    expect(schema.process(configs, { visibility: ['frontend'] })).toEqual([
      { data: { key1: 'a' }, context: 'test' },
    ]);
    expect(
      schema.process(configs, {
        visibility: ['frontend'],
        valueTransform: () => 'X',
      }),
    ).toEqual([{ data: { key1: 'X' }, context: 'test' }]);
    expect(
      schema.process(configs, {
        valueTransform: () => 'X',
      }),
    ).toEqual([{ data: { key1: 'X', key2: 'X' }, context: 'test' }]);

    const serialized = schema.serialize();

    const schema2 = await loadConfigSchema({ serialized });
    expect(schema2.process(configs, { visibility: ['frontend'] })).toEqual([
      { data: { key1: 'a' }, context: 'test' },
    ]);
    expect(() =>
      schema2.process([...configs, { data: { key1: 3 }, context: 'test2' }]),
    ).toThrow(
      'Config validation failed, Config should be string { type=string } at /key1',
    );

    await expect(
      loadConfigSchema({
        serialized: { ...serialized, backstageConfigSchemaVersion: 2 },
      }),
    ).rejects.toThrow(
      'Serialized configuration schema is invalid or has an invalid version number',
    );
  });
});
