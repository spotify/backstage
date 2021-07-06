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

import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { buildEntitySearch, mapToRows, traverse } from './buildEntitySearch';

describe('buildEntitySearch', () => {
  describe('traverse', () => {
    it('expands lists of strings to several rows', () => {
      const input = { a: ['b', 'c', 'd'] };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'a', value: 'b' },
        { key: 'a.b', value: true },
        { key: 'a', value: 'c' },
        { key: 'a.c', value: true },
        { key: 'a', value: 'd' },
        { key: 'a.d', value: true },
      ]);
    });

    it('expands objects', () => {
      const input = { a: { b: { c: 'd' }, e: 'f' } };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'a.b.c', value: 'd' },
        { key: 'a.e', value: 'f' },
      ]);
    });

    it('expands list of objects', () => {
      const input = { root: { list: [{ a: 1 }, { a: 2 }] } };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'root.list.a', value: 1 },
        { key: 'root.list.a', value: 2 },
      ]);
    });

    it('skips over special keys', () => {
      const input = {
        status: { x: 1 },
        attachments: [{ y: 2 }],
        relations: [{ z: 3 }],
        a: 'a',
        metadata: {
          b: 'b',
          name: 'name',
          namespace: 'namespace',
          uid: 'uid',
          etag: 'etag',
          generation: 'generation',
          c: 'c',
        },
        d: 'd',
      };
      const output = traverse(input);
      expect(output).toEqual([
        { key: 'a', value: 'a' },
        { key: 'metadata.b', value: 'b' },
        { key: 'metadata.c', value: 'c' },
        { key: 'd', value: 'd' },
      ]);
    });
  });

  describe('mapToRows', () => {
    it('converts base types to strings or null', () => {
      const input = [
        { key: 'a', value: true },
        { key: 'b', value: false },
        { key: 'c', value: 7 },
        { key: 'd', value: 'string' },
        { key: 'e', value: null },
        { key: 'f', value: undefined },
      ];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([
        { entity_id: 'eid', key: 'a', value: 'true' },
        { entity_id: 'eid', key: 'b', value: 'false' },
        { entity_id: 'eid', key: 'c', value: '7' },
        { entity_id: 'eid', key: 'd', value: 'string' },
        { entity_id: 'eid', key: 'e', value: null },
        { entity_id: 'eid', key: 'f', value: null },
      ]);
    });

    it('emits lowercase version of keys and values', () => {
      const input = [{ key: 'fOo', value: 'BaR' }];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([{ entity_id: 'eid', key: 'foo', value: 'bar' }]);
    });

    it('skips very large keys', () => {
      const input = [{ key: 'a'.repeat(10000), value: 'foo' }];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([]);
    });

    it('skips very large values', () => {
      const input = [{ key: 'foo', value: 'a'.repeat(10000) }];
      const output = mapToRows(input, 'eid');
      expect(output).toEqual([]);
    });
  });

  describe('buildEntitySearch', () => {
    it('adds special keys even if missing', () => {
      const input: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };
      expect(buildEntitySearch('eid', input)).toEqual([
        { entity_id: 'eid', key: 'apiversion', value: 'a' },
        { entity_id: 'eid', key: 'kind', value: 'b' },
        { entity_id: 'eid', key: 'metadata.name', value: 'n' },
        { entity_id: 'eid', key: 'metadata.namespace', value: null },
        { entity_id: 'eid', key: 'metadata.uid', value: null },
        {
          entity_id: 'eid',
          key: 'metadata.namespace',
          value: ENTITY_DEFAULT_NAMESPACE,
        },
      ]);
    });

    it('adds relations', () => {
      const input: Entity = {
        relations: [
          { type: 't1', target: { kind: 'k', namespace: 'ns', name: 'a' } },
          { type: 't2', target: { kind: 'k', namespace: 'ns', name: 'b' } },
        ],
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };
      expect(buildEntitySearch('eid', input)).toEqual([
        { entity_id: 'eid', key: 'apiversion', value: 'a' },
        { entity_id: 'eid', key: 'kind', value: 'b' },
        { entity_id: 'eid', key: 'metadata.name', value: 'n' },
        { entity_id: 'eid', key: 'metadata.namespace', value: null },
        { entity_id: 'eid', key: 'metadata.uid', value: null },
        {
          entity_id: 'eid',
          key: 'metadata.namespace',
          value: ENTITY_DEFAULT_NAMESPACE,
        },
        { entity_id: 'eid', key: 'relations.t1', value: 'k:ns/a' },
        { entity_id: 'eid', key: 'relations.t2', value: 'k:ns/b' },
      ]);
    });
  });
});
