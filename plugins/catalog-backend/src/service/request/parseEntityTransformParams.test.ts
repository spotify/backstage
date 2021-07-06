/*
 * Copyright 2021 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { parseEntityTransformParams } from './parseEntityTransformParams';

describe('parseEntityTransformParams', () => {
  const entity: Entity = {
    apiVersion: 'av',
    kind: 'k',
    metadata: {
      name: 'n',
      tags: ['t1', 't2'],
    },
    spec: {
      type: 't',
    },
  };

  it('returns undefined when no fields given', () => {
    expect(parseEntityTransformParams({})).toBeUndefined();
    expect(parseEntityTransformParams({ fields: '' })).toBeUndefined();
    expect(parseEntityTransformParams({ fields: [] })).toBeUndefined();
    expect(parseEntityTransformParams({ fields: [''] })).toBeUndefined();
    expect(parseEntityTransformParams({ fields: [','] })).toBeUndefined();
  });

  it('rejects attempts at array filtering', () => {
    expect(() =>
      parseEntityTransformParams({ fields: 'metadata.tags[0]' })!(entity),
    ).toThrow(/invalid fields, array type fields are not supported/i);
  });

  it('accepts both strings and arrays of strings as input', () => {
    expect(parseEntityTransformParams({ fields: 'kind' })!(entity)).toEqual({
      kind: 'k',
    });
    expect(parseEntityTransformParams({ fields: ['kind'] })!(entity)).toEqual({
      kind: 'k',
    });
    expect(
      parseEntityTransformParams({ fields: ['kind', 'apiVersion'] })!(entity),
    ).toEqual({ apiVersion: 'av', kind: 'k' });
  });

  it('supports sub-selection properly', () => {
    expect(
      parseEntityTransformParams({ fields: 'kind,metadata.name' })!(entity),
    ).toEqual({ kind: 'k', metadata: { name: 'n' } });
    expect(
      parseEntityTransformParams({ fields: 'metadata' })!(entity),
    ).toEqual({ metadata: { name: 'n', tags: ['t1', 't2'] } });
  });
});
