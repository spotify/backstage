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
import { FieldFormatEntityPolicy } from './FieldFormatEntityPolicy';

describe('FieldFormatEntityPolicy', () => {
  let data: any;
  let policy: FieldFormatEntityPolicy;

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
          - data-service
        links:
          - url: https://example.org
            title: Website
            icon: website
      spec:
        custom: stuff
    `);
    policy = new FieldFormatEntityPolicy();
  });

  it('works for the happy path', async () => {
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad apiVersion', async () => {
    data.apiVersion = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/apiVersion/);
    data.apiVersion = 'a#b';
    await expect(policy.enforce(data)).rejects.toThrow(/apiVersion/);
  });

  it('rejects bad kind', async () => {
    data.kind = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/kind/);
    data.kind = 'a#b';
    await expect(policy.enforce(data)).rejects.toThrow(/kind/);
  });

  it('handles missing metadata gracefully', async () => {
    delete data.medatata;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('handles missing spec gracefully', async () => {
    delete data.spec;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects bad name', async () => {
    data.metadata.name = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/name.*7/);
    data.metadata.name = 'a'.repeat(1000);
    await expect(policy.enforce(data)).rejects.toThrow(/name.*aaaa/);
  });

  it('rejects bad namespace', async () => {
    data.metadata.namespace = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/namespace.*7/);
    data.metadata.namespace = 'a'.repeat(1000);
    await expect(policy.enforce(data)).rejects.toThrow(/namespace.*aaaa/);
  });

  it('rejects bad label key', async () => {
    data.metadata.labels['a#b'] = 'value';
    await expect(policy.enforce(data)).rejects.toThrow(/label.*a#b/i);
  });

  it('rejects bad label value', async () => {
    data.metadata.labels.a = 'a#b';
    await expect(policy.enforce(data)).rejects.toThrow(/label.*a#b/i);
  });

  it('rejects bad annotation key', async () => {
    data.metadata.annotations['a#b'] = 'value';
    await expect(policy.enforce(data)).rejects.toThrow(/annotation.*a#b/i);
  });

  it('rejects bad annotation value', async () => {
    data.metadata.annotations.a = 7;
    await expect(policy.enforce(data)).rejects.toThrow(/annotation.*7/i);
  });

  it('rejects bad tag value', async () => {
    data.metadata.tags.push('Hello World');
    await expect(policy.enforce(data)).rejects.toThrow(/tags.*"Hello World"/i);
  });

  it('accepts missing links', async () => {
    delete data.metadata.links;
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('accepts empty links array', async () => {
    data.metadata.links = [];
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('accepts multiple links', async () => {
    data.metadata.links = [{ url: 'http://foo' }, { url: 'https://bar' }];
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects missing link url value', async () => {
    data.metadata.links = [{}];
    await expect(policy.enforce(data)).rejects.toThrow(/links.0.url/i);
  });

  it('rejects a single bad missing link url value', async () => {
    data.metadata.links = [{ url: 'http://good' }, { url: '' }];
    await expect(policy.enforce(data)).rejects.toThrow(
      /links.1.url.*valid url/i,
    );
  });

  it('rejects empty link url value', async () => {
    data.metadata.links = [{ url: '' }];
    await expect(policy.enforce(data)).rejects.toThrow(/links.0.url.*/i);
  });

  it('rejects bad link url value', async () => {
    data.metadata.links = [{ url: 'invalid' }];
    await expect(policy.enforce(data)).rejects.toThrow(
      /links.0.url.*"invalid"/i,
    );
  });

  it('accepts missing link title', async () => {
    data.metadata.links = [{ url: 'http://foo', icon: 'dashboard' }];
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects empty link title', async () => {
    data.metadata.links = [{ url: 'http://foo', title: '' }];
    await expect(policy.enforce(data)).rejects.toThrow(/links.0.title.*""/i);
  });

  it('rejects bad link title', async () => {
    data.metadata.links = [{ url: 'http://foo', title: 123 }];
    await expect(policy.enforce(data)).rejects.toThrow(/links.0.title.*"123"/i);
  });

  it.each([[123], [{}], [[]]])(
    'rejects bad link title %s',
    async (title: unknown) => {
      data.metadata.links = [{ url: 'http://foo', title }];
      await expect(policy.enforce(data)).rejects.toThrow(/links.0.title.*/i);
    },
  );

  it('rejects a single bad link title', async () => {
    data.metadata.links = [
      { url: 'http://foo', title: 'good' },
      { url: 'http://foo', title: '' },
    ];
    await expect(policy.enforce(data)).rejects.toThrow(/links.1.title.*""/i);
  });

  it('accepts missing link icon', async () => {
    data.metadata.links = [{ url: 'http://foo', title: 'foo' }];
    await expect(policy.enforce(data)).resolves.toBe(data);
  });

  it('rejects empty link icon', async () => {
    data.metadata.links = [{ url: 'http://foo', icon: '' }];
    await expect(policy.enforce(data)).rejects.toThrow(/links.0.icon.*""/i);
  });

  it.each([['dashboard'], ['admin-dashboard'], ['foo_dashboard']])(
    'accepts valid link icon',
    async icon => {
      data.metadata.links = [{ url: 'http://foo', icon }];
      await expect(policy.enforce(data)).resolves.toBe(data);
    },
  );

  it.each([[123], [{}], [[]], ['abc xyz']])(
    'rejects bad link icon value %s',
    async (icon: unknown) => {
      data.metadata.links = [{ url: 'http://foo', icon }];
      await expect(policy.enforce(data)).rejects.toThrow(/links.0.icon.*/i);
    },
  );

  it('rejects a single bad link icon value', async () => {
    data.metadata.links = [
      { url: 'http://foo', icon: 'good' },
      { url: 'http://foo', icon: 'not good' },
    ];
    await expect(policy.enforce(data)).rejects.toThrow(
      /links.1.icon.*"not good"/i,
    );
  });
});
