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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { buildMemberOf, buildOrgHierarchy } from './org';

function g(
  name: string,
  parent: string | undefined,
  children: string[],
): GroupEntity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: { name },
    spec: { type: 'team', parent, children },
  };
}

describe('buildOrgHierarchy', () => {
  it('adds groups to their parent.children', () => {
    const a = g('a', undefined, []);
    const b = g('b', 'a', []);
    const c = g('c', 'b', []);
    const d = g('d', 'a', []);
    buildOrgHierarchy([a, b, c, d]);
    expect(a.spec.children).toEqual(expect.arrayContaining(['b', 'd']));
    expect(b.spec.children).toEqual(expect.arrayContaining(['c']));
    expect(c.spec.children).toEqual([]);
    expect(d.spec.children).toEqual([]);
  });

  it('sets parent of groups children', () => {
    const a = g('a', undefined, ['b', 'd']);
    const b = g('b', undefined, ['c']);
    const c = g('c', undefined, []);
    const d = g('d', undefined, []);
    buildOrgHierarchy([a, b, c, d]);
    expect(a.spec.parent).toBeUndefined();
    expect(b.spec.parent).toBe('a');
    expect(c.spec.parent).toBe('b');
    expect(d.spec.parent).toBe('a');
  });
});

describe('buildMemberOf', () => {
  it('fills indirect member of groups', () => {
    const a = g('a', undefined, []);
    const b = g('b', 'a', []);
    const c = g('c', 'b', []);
    const u: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'n' },
      spec: { profile: {}, memberOf: ['c'] },
    };

    const groups = [a, b, c];
    buildOrgHierarchy(groups);
    buildMemberOf(groups, [u]);
    expect(u.spec.memberOf).toEqual(expect.arrayContaining(['a', 'b', 'c']));
  });

  it('takes group spec.members into account', () => {
    const a = g('a', undefined, []);
    const b = g('b', 'a', []);
    const c = g('c', 'b', []);
    c.spec.members = ['n'];
    const u: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'n' },
      spec: { profile: {}, memberOf: [] },
    };

    const groups = [a, b, c];
    buildOrgHierarchy(groups);
    buildMemberOf(groups, [u]);
    expect(u.spec.memberOf).toEqual(expect.arrayContaining(['a', 'b', 'c']));
  });
});
