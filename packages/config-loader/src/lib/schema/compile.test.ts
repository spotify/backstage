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

import { compileConfigSchemas } from './compile';

describe('compileConfigSchemas', () => {
  it('should merge schemas', () => {
    const validate = compileConfigSchemas([
      {
        path: 'a',
        value: { type: 'object', properties: { a: { type: 'string' } } },
      },
      {
        path: 'b',
        value: { type: 'object', properties: { b: { type: 'number' } } },
      },
    ]);
    expect(validate([{ data: { a: 1 }, context: 'test' }])).toEqual({
      errors: ['Config should be string { type=string } at /a'],
      visibilityByPath: new Map(),
    });
    expect(validate([{ data: { b: 'b' }, context: 'test' }])).toEqual({
      errors: ['Config should be number { type=number } at /b'],
      visibilityByPath: new Map(),
    });
  });

  it('should discover visibilities', () => {
    const validate = compileConfigSchemas([
      {
        path: 'a1',
        value: {
          type: 'object',
          properties: {
            a: { type: 'string', visibility: 'frontend' },
            b: { type: 'string', visibility: 'backend' },
            c: { type: 'string' },
            d: {
              type: 'array',
              visibility: 'secret',
              items: { type: 'string', visibility: 'frontend' },
            },
          },
        },
      },
      {
        path: 'a2',
        value: {
          type: 'object',
          properties: {
            a: { type: 'string' },
            b: { type: 'string', visibility: 'secret' },
            c: { type: 'string', visibility: 'backend' },
            d: {
              type: 'array',
              visibility: 'secret',
              items: { type: 'string' },
            },
          },
        },
      },
    ]);
    expect(
      validate([
        { data: { a: 'a', b: 'b', c: 'c', d: ['d'] }, context: 'test' },
      ]),
    ).toEqual({
      visibilityByPath: new Map(
        Object.entries({
          '/a': 'frontend',
          '/b': 'secret',
          '/d': 'secret',
          '/d/0': 'frontend',
        }),
      ),
    });
  });

  it('should reject visibility conflicts', () => {
    expect(() =>
      compileConfigSchemas([
        {
          path: 'a1',
          value: {
            type: 'object',
            properties: { a: { type: 'string', visibility: 'frontend' } },
          },
        },
        {
          path: 'a2',
          value: {
            type: 'object',
            properties: { a: { type: 'string', visibility: 'secret' } },
          },
        },
      ]),
    ).toThrow(
      "Config schema visibility is both 'frontend' and 'secret' for properties/a/visibility",
    );
  });
});
