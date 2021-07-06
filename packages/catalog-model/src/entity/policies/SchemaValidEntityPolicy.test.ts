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

import yaml from 'yaml';
import { Entity } from '../Entity';
import { SchemaValidEntityPolicy } from './SchemaValidEntityPolicy';

describe('SchemaValidEntityPolicy', () => {
  let data: any;
  let policy: SchemaValidEntityPolicy;

  beforeEach(() => {
    data = yaml.parse(`
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        uid: e01199ab-08cc-44c2-8e19-5c29ded82521
        etag: lsndfkjsndfkjnsdfkjnsd==
        generation: 13
        name: my-component-yay
        namespace: the-namespace
        labels:
          backstage.io/custom: ValueStuff
        annotations:
          example.com/bindings: are-secret
        tags:
          - java
          - data
        links:
          - url: https://example.com
            title: Website
            icon: website
      spec:
        custom: stuff
    `);
    policy = new SchemaValidEntityPolicy();
  });

  it('works for the happy path', async () => {
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  //
  // apiVersion and kind
  //

  it('rejects wrong root type', async () => {
    await expect(policy.enforce((7 as unknown) as Entity)).rejects.toThrow(
      /object/,
    );
  });

  it('rejects missing apiVersion', async () => {
    delete data.apiVersion;
    await expect(policy.enforce(data)).rejects.toThrow(/apiVersion/);
  });

  it('rejects bad apiVersion type', async () => {
    data.apiVersion = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/apiVersion/);
  });

  it('rejects missing kind', async () => {
    delete data.kind;
    await expect(policy.enforce(data)).rejects.toThrow(/kind/);
  });

  it('rejects bad kind type', async () => {
    data.kind = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/kind/);
  });

  //
  // metadata
  //

  it('rejects missing metadata', async () => {
    delete data.metadata;
    await expect(policy.enforce(data)).rejects.toThrow(/metadata/);
  });

  it('rejects bad metadata type', async () => {
    data.metadata = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/metadata/);
  });

  it('accepts missing uid', async () => {
    delete data.metadata.uid;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad uid type', async () => {
    data.metadata.uid = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/uid/);
  });

  it('rejects empty uid', async () => {
    data.metadata.uid = '';
    await expect(policy.enforce(data)).rejects.toThrow(/uid/);
  });

  it('accepts missing etag', async () => {
    delete data.metadata.etag;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad etag type', async () => {
    data.metadata.etag = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/etag/);
  });

  it('rejects empty etag', async () => {
    data.metadata.etag = '';
    await expect(policy.enforce(data)).rejects.toThrow(/etag/);
  });

  it('accepts missing generation', async () => {
    delete data.metadata.generation;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad generation type', async () => {
    data.metadata.generation = 'a';
    await expect(policy.enforce(data)).rejects.toThrow(/generation/);
  });

  it('rejects zero generation', async () => {
    data.metadata.generation = 0;
    await expect(policy.enforce(data)).rejects.toThrow(/generation/);
  });

  it('rejects non-integer generation', async () => {
    data.metadata.generation = 1.5;
    await expect(policy.enforce(data)).rejects.toThrow(/generation/);
  });

  it('rejects missing name', async () => {
    delete data.metadata.name;
    await expect(policy.enforce(data)).rejects.toThrow(/name/);
  });

  it('rejects bad name type', async () => {
    data.metadata.name = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/name/);
  });

  it('accepts missing namespace', async () => {
    delete data.metadata.namespace;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad namespace type', async () => {
    data.metadata.namespace = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/namespace/);
  });

  it('accepts missing description', async () => {
    delete data.metadata.description;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad description type', async () => {
    data.metadata.description = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/description/);
  });

  it('accepts missing labels', async () => {
    delete data.metadata.labels;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad labels type', async () => {
    data.metadata.labels = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/labels/);
  });

  it('accepts missing annotations', async () => {
    delete data.metadata.annotations;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad annotations type', async () => {
    data.metadata.annotations = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/annotations/);
  });

  it('rejects bad tags type', async () => {
    data.metadata.tags = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/tags/);
  });

  it('accepts missing links', async () => {
    delete data.metadata.links;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('accepts empty links array', async () => {
    data.metadata.links = [];
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it.each([['invalid type'], [123], [{}], [{ url: 'https://foo' }]])(
    'rejects bad links type %s',
    async (val: unknown) => {
      data.metadata.links = val;
      await expect(policy.enforce(data)).rejects.toThrow(/links/);
    },
  );

  //
  // spec
  //

  it('accepts missing spec', async () => {
    delete data.spec;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects non-object spec', async () => {
    data.spec = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/spec/);
  });
});
