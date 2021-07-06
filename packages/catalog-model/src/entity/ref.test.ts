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

import { ENTITY_DEFAULT_NAMESPACE } from './constants';
import { Entity } from './Entity';
import {
  compareEntityToRef,
  parseEntityName,
  parseEntityRef,
  serializeEntityRef,
} from './ref';

describe('ref', () => {
  describe('parseEntityName', () => {
    it('handles some omissions', () => {
      expect(parseEntityName('a:b/c')).toEqual({
        kind: 'a',
        namespace: 'b',
        name: 'c',
      });
      expect(() => parseEntityName('b/c')).toThrow(/kind/);
      expect(parseEntityName('a:c')).toEqual({
        kind: 'a',
        namespace: ENTITY_DEFAULT_NAMESPACE,
        name: 'c',
      });
      expect(() => parseEntityName('c')).toThrow(/kind/);
    });

    it('rejects bad inputs', () => {
      expect(() => parseEntityName(null as any)).toThrow();
      expect(() => parseEntityName(7 as any)).toThrow();
      expect(() => parseEntityName('a:b:c')).toThrow();
      expect(() => parseEntityName('a/b/c')).toThrow();
      expect(() => parseEntityName('a/b:c')).toThrow();
      expect(() => parseEntityName('a:b/c/d')).toThrow();
      expect(() => parseEntityName('a:b/c:d')).toThrow();
    });

    it('rejects empty parts in strings', () => {
      // one is empty
      expect(() => parseEntityName(':b/c')).toThrow();
      expect(() => parseEntityName('a:/c')).toThrow();
      expect(() => parseEntityName('a:b/')).toThrow();
      // two are empty
      expect(() => parseEntityName('a:/')).toThrow();
      expect(() => parseEntityName(':b/')).toThrow();
      expect(() => parseEntityName(':/c')).toThrow();
      // three are empty
      expect(() => parseEntityName(':/')).toThrow();
      // one is left out, one empty
      expect(() => parseEntityName('/c')).toThrow();
      expect(() => parseEntityName('b/')).toThrow();
      expect(() => parseEntityName(':c')).toThrow();
      expect(() => parseEntityName('a:')).toThrow();
      // nothing at all
      expect(() => parseEntityName('')).toThrow();
    });

    it('rejects empty parts in compounds', () => {
      // one is empty
      expect(() =>
        parseEntityName({ kind: '', namespace: 'b', name: 'c' }),
      ).toThrow();
      expect(() => parseEntityName({ namespace: 'b', name: 'c' })).toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() => parseEntityName({ kind: 'a', name: 'c' })).not.toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: 'b', name: '' }),
      ).toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: 'b' } as any),
      ).toThrow();
      // two are empty
      expect(() =>
        parseEntityName({ kind: '', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() => parseEntityName({ name: 'c' })).toThrow();
      expect(() =>
        parseEntityName({ kind: '', namespace: 'b', name: '' }),
      ).toThrow();
      expect(() => parseEntityName({ namespace: 'b' } as any)).toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: '', name: '' }),
      ).toThrow();
      expect(() => parseEntityName({ kind: 'a' } as any)).toThrow();
      // three are empty
      expect(() =>
        parseEntityName({ kind: '', namespace: '', name: '' }),
      ).toThrow();
      expect(() => parseEntityName({} as any)).toThrow();
      // one is left out, one empty
      expect(() => parseEntityName({ namespace: '', name: 'c' })).toThrow();
      expect(() => parseEntityName({ namespace: 'b', name: '' })).toThrow();
      expect(() => parseEntityName({ kind: '', name: 'c' })).toThrow();
      expect(() => parseEntityName({ kind: 'a', name: '' })).toThrow();
    });

    it('adds defaults where necessary to strings', () => {
      expect(
        parseEntityName('a:b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityName('b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityName('a:c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(parseEntityName('a:c', { defaultKind: 'x' })).toEqual({
        kind: 'a',
        namespace: ENTITY_DEFAULT_NAMESPACE,
        name: 'c',
      });
      expect(
        parseEntityName('c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
      expect(parseEntityName('c', { defaultKind: 'x' })).toEqual({
        kind: 'x',
        namespace: ENTITY_DEFAULT_NAMESPACE,
        name: 'c',
      });
    });

    it('adds defaults where necessary to compounds', () => {
      expect(
        parseEntityName(
          { kind: 'a', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityName(
          { namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityName(
          { kind: 'a', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityName({ kind: 'a', name: 'c' }, { defaultKind: 'x' }),
      ).toEqual({ kind: 'a', namespace: ENTITY_DEFAULT_NAMESPACE, name: 'c' });
      expect(
        parseEntityName(
          { name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
      expect(parseEntityName({ name: 'c' }, { defaultKind: 'x' })).toEqual({
        kind: 'x',
        namespace: ENTITY_DEFAULT_NAMESPACE,
        name: 'c',
      });
      // empty strings are errors, not defaults
      expect(() =>
        parseEntityName(
          { kind: '', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/kind/);
      expect(() =>
        parseEntityName(
          { kind: 'a', namespace: '', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/namespace/);
    });
  });

  describe('parseEntityRef', () => {
    it('handles some omissions', () => {
      expect(parseEntityRef('a:b/c')).toEqual({
        kind: 'a',
        namespace: 'b',
        name: 'c',
      });
      expect(parseEntityRef('b/c')).toEqual({
        kind: undefined,
        namespace: 'b',
        name: 'c',
      });
      expect(parseEntityRef('a:c')).toEqual({
        kind: 'a',
        namespace: undefined,
        name: 'c',
      });
      expect(parseEntityRef('c')).toEqual({
        kind: undefined,
        namespace: undefined,
        name: 'c',
      });
    });

    it('rejects bad inputs', () => {
      expect(() => parseEntityRef(null as any)).toThrow();
      expect(() => parseEntityRef(7 as any)).toThrow();
      expect(() => parseEntityRef('a:b:c')).toThrow();
      expect(() => parseEntityRef('a/b/c')).toThrow();
      expect(() => parseEntityRef('a/b:c')).toThrow();
      expect(() => parseEntityRef('a:b/c/d')).toThrow();
      expect(() => parseEntityRef('a:b/c:d')).toThrow();
    });

    it('rejects empty parts in strings', () => {
      // one is empty
      expect(() => parseEntityRef(':b/c')).toThrow();
      expect(() => parseEntityRef('a:/c')).toThrow();
      expect(() => parseEntityRef('a:b/')).toThrow();
      // two are empty
      expect(() => parseEntityRef('a:/')).toThrow();
      expect(() => parseEntityRef(':b/')).toThrow();
      expect(() => parseEntityRef(':/c')).toThrow();
      // three are empty
      expect(() => parseEntityRef(':/')).toThrow();
      // one is left out, one empty
      expect(() => parseEntityRef('/c')).toThrow();
      expect(() => parseEntityRef('b/')).toThrow();
      expect(() => parseEntityRef(':c')).toThrow();
      expect(() => parseEntityRef('a:')).toThrow();
      // nothing at all
      expect(() => parseEntityRef('')).toThrow();
    });

    it('rejects empty parts in compounds', () => {
      // one is empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: 'b', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: 'b', name: '' }),
      ).toThrow();
      // two are empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: '', namespace: 'b', name: '' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: '', name: '' }),
      ).toThrow();
      // three are empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: '', name: '' }),
      ).toThrow();
      // one is left out, one empty
      expect(() => parseEntityRef({ namespace: '', name: 'c' })).toThrow();
      expect(() => parseEntityRef({ namespace: 'b', name: '' })).toThrow();
      expect(() => parseEntityRef({ kind: '', name: 'c' })).toThrow();
      expect(() => parseEntityRef({ kind: 'a', name: '' })).toThrow();
      // nothing at all
      expect(() => parseEntityRef({} as any)).toThrow();
    });

    it('adds defaults where necessary to strings', () => {
      expect(
        parseEntityRef('a:b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef('b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef('a:c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityRef('c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
    });

    it('adds defaults where necessary to compounds', () => {
      expect(
        parseEntityRef(
          { kind: 'a', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef(
          { namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef(
          { kind: 'a', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityRef(
          { name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
      // empty strings are errors, not defaults
      expect(() =>
        parseEntityRef(
          { kind: '', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/kind/);
      expect(() =>
        parseEntityRef(
          { kind: 'a', namespace: '', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/namespace/);
    });
  });

  describe('serializeEntityRef', () => {
    it('handles partials', () => {
      expect(
        serializeEntityRef({ kind: 'a', namespace: 'b', name: 'c' }),
      ).toEqual('a:b/c');
      expect(serializeEntityRef({ namespace: 'b', name: 'c' })).toEqual('b/c');
      expect(serializeEntityRef({ kind: 'a', name: 'c' })).toEqual('a:c');
      expect(serializeEntityRef({ name: 'c' })).toEqual('c');
    });

    it('handles entities', () => {
      const entityWithNamespace: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };
      const entityWithoutNamespace: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
        },
      };
      expect(serializeEntityRef(entityWithNamespace)).toEqual('b:d/c');
      expect(serializeEntityRef(entityWithoutNamespace)).toEqual('b:c');
    });

    it('picks the least complex form', () => {
      expect(
        serializeEntityRef({ kind: 'a', namespace: 'b', name: 'c' }),
      ).toEqual('a:b/c');
      expect(serializeEntityRef({ namespace: 'b', name: 'c' })).toEqual('b/c');
      expect(serializeEntityRef({ kind: 'a', name: 'c' })).toEqual('a:c');
      expect(serializeEntityRef({ name: 'c' })).toEqual('c');
      expect(
        serializeEntityRef({ kind: 'a:x', namespace: 'b', name: 'c' }),
      ).toEqual({ kind: 'a:x', namespace: 'b', name: 'c' });
      expect(
        serializeEntityRef({ kind: 'a/x', namespace: 'b', name: 'c' }),
      ).toEqual({ kind: 'a/x', namespace: 'b', name: 'c' });
      expect(
        serializeEntityRef({ kind: 'a', namespace: 'b:x', name: 'c' }),
      ).toEqual({ kind: 'a', namespace: 'b:x', name: 'c' });
      expect(
        serializeEntityRef({ kind: 'a', namespace: 'b/x', name: 'c' }),
      ).toEqual({ kind: 'a', namespace: 'b/x', name: 'c' });
      expect(
        serializeEntityRef({ kind: 'a', namespace: 'b', name: 'c:x' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c:x' });
      expect(
        serializeEntityRef({ kind: 'a', namespace: 'b', name: 'c/x' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c/x' });
    });
  });

  describe('compareEntityToRef', () => {
    const entityWithNamespace: Entity = {
      apiVersion: 'a',
      kind: 'K',
      metadata: {
        name: 'n',
        namespace: 'ns',
      },
    };
    const entityWithoutNamespace: Entity = {
      apiVersion: 'a',
      kind: 'K',
      metadata: {
        name: 'n',
      },
    };

    it('handles matching string refs', () => {
      expect(compareEntityToRef(entityWithNamespace, 'K:ns/n')).toBe(true);
      expect(compareEntityToRef(entityWithNamespace, 'k:nS/N')).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, 'K:n', {
          defaultNamespace: 'ns',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, 'K:n', {
          defaultNamespace: 'Ns',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, 'ns/n', { defaultKind: 'K' }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, 'n', {
          defaultKind: 'K',
          defaultNamespace: 'ns',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, 'N', {
          defaultKind: 'k',
          defaultNamespace: 'nS',
        }),
      ).toBe(true);

      expect(compareEntityToRef(entityWithoutNamespace, 'K:default/n')).toBe(
        true,
      );
      expect(compareEntityToRef(entityWithoutNamespace, 'K:deFault/n')).toBe(
        true,
      );
      expect(
        compareEntityToRef(entityWithoutNamespace, 'K:n', {
          defaultNamespace: 'default',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithoutNamespace, 'K:n', {
          defaultNamespace: 'deFault',
        }),
      ).toBe(true);
      expect(compareEntityToRef(entityWithoutNamespace, 'K:default/n')).toBe(
        true,
      );
      expect(compareEntityToRef(entityWithoutNamespace, 'K:n')).toBe(true);
      expect(
        compareEntityToRef(entityWithoutNamespace, 'default/n', {
          defaultKind: 'K',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithoutNamespace, 'n', {
          defaultKind: 'K',
          defaultNamespace: 'default',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithoutNamespace, 'n', {
          defaultKind: 'K',
        }),
      ).toBe(true);
    });

    it('handles mismatching string refs', () => {
      expect(compareEntityToRef(entityWithNamespace, 'X:ns/n')).toBe(false);
      expect(
        compareEntityToRef(entityWithoutNamespace, 'ns/n', {
          defaultKind: 'X',
        }),
      ).toBe(false);

      expect(compareEntityToRef(entityWithNamespace, 'K:xx/n')).toBe(false);
      expect(
        compareEntityToRef(entityWithoutNamespace, 'K:n', {
          defaultNamespace: 'xx',
        }),
      ).toBe(false);

      expect(compareEntityToRef(entityWithNamespace, 'K:ns/x')).toBe(false);
      expect(
        compareEntityToRef(entityWithoutNamespace, 'x', {
          defaultKind: 'K',
          defaultNamespace: 'ns',
        }),
      ).toBe(false);
    });

    it('handles matching compound refs', () => {
      expect(
        compareEntityToRef(entityWithNamespace, {
          kind: 'K',
          namespace: 'ns',
          name: 'n',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, {
          kind: 'k',
          namespace: 'Ns',
          name: 'N',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(
          entityWithNamespace,
          { kind: 'K', name: 'n' },
          {
            defaultNamespace: 'ns',
          },
        ),
      ).toBe(true);
      expect(
        compareEntityToRef(
          entityWithNamespace,
          { namespace: 'ns', name: 'n' },
          { defaultKind: 'K' },
        ),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, 'n', {
          defaultKind: 'K',
          defaultNamespace: 'ns',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithNamespace, 'N', {
          defaultKind: 'k',
          defaultNamespace: 'nS',
        }),
      ).toBe(true);

      expect(
        compareEntityToRef(entityWithoutNamespace, {
          kind: 'K',
          namespace: 'default',
          name: 'n',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithoutNamespace, {
          kind: 'k',
          namespace: 'deFault',
          name: 'N',
        }),
      ).toBe(true);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          { kind: 'K', name: 'n' },
          {
            defaultNamespace: 'default',
          },
        ),
      ).toBe(true);
      expect(
        compareEntityToRef(entityWithoutNamespace, { kind: 'K', name: 'n' }),
      ).toBe(true);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          { namespace: 'default', name: 'n' },
          {
            defaultKind: 'K',
          },
        ),
      ).toBe(true);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          { name: 'n' },
          {
            defaultKind: 'K',
            defaultNamespace: 'default',
          },
        ),
      ).toBe(true);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          { name: 'N' },
          {
            defaultKind: 'k',
            defaultNamespace: 'defAult',
          },
        ),
      ).toBe(true);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          { name: 'n' },
          {
            defaultKind: 'K',
          },
        ),
      ).toBe(true);
    });

    it('handles mismatching compound refs', () => {
      expect(
        compareEntityToRef(entityWithNamespace, {
          kind: 'X',
          namespace: 'ns',
          name: 'n',
        }),
      ).toBe(false);
      expect(
        compareEntityToRef(
          entityWithNamespace,
          {
            namespace: 'ns',
            name: 'n',
          },
          { defaultKind: 'X' },
        ),
      ).toBe(false);
      expect(
        compareEntityToRef(entityWithoutNamespace, {
          kind: 'X',
          namespace: 'default',
          name: 'n',
        }),
      ).toBe(false);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          {
            namespace: 'default',
            name: 'n',
          },
          { defaultKind: 'X' },
        ),
      ).toBe(false);

      expect(
        compareEntityToRef(entityWithNamespace, {
          kind: 'K',
          namespace: 'xx',
          name: 'n',
        }),
      ).toBe(false);
      expect(
        compareEntityToRef(
          entityWithNamespace,
          {
            kind: 'K',
            name: 'n',
          },
          { defaultNamespace: 'xx' },
        ),
      ).toBe(false);
      expect(
        compareEntityToRef(entityWithoutNamespace, {
          kind: 'K',
          namespace: 'xx',
          name: 'n',
        }),
      ).toBe(false);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          {
            kind: 'K',
            name: 'n',
          },
          { defaultNamespace: 'xx' },
        ),
      ).toBe(false);

      expect(
        compareEntityToRef(entityWithNamespace, {
          kind: 'K',
          namespace: 'ns',
          name: 'x',
        }),
      ).toBe(false);
      expect(
        compareEntityToRef(entityWithoutNamespace, {
          kind: 'K',
          namespace: 'default',
          name: 'x',
        }),
      ).toBe(false);
      expect(
        compareEntityToRef(
          entityWithoutNamespace,
          {
            kind: 'K',
            name: 'x',
          },
          { defaultNamespace: 'default' },
        ),
      ).toBe(false);
    });
  });
});
