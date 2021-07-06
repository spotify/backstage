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

import { entityKindSchemaValidator } from './entityKindSchemaValidator';
import componentSchema from '../schema/kinds/Component.v1alpha1.schema.json';

describe('entityKindSchemaValidator', () => {
  const validator = entityKindSchemaValidator(componentSchema);
  let entity: any;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        uid: 'e01199ab-08cc-44c2-8e19-5c29ded82521',
        etag: 'lsndfkjsndfkjnsdfkjnsd==',
        generation: 13,
        name: 'test',
        namespace: 'ns',
        labels: {
          'backstage.io/custom': 'ValueStuff',
        },
        annotations: {
          'example.com/bindings': 'are-secret',
        },
        tags: ['java', 'data'],
        links: [
          {
            url: 'https://example.com',
            title: 'Website',
            icon: 'website',
          },
        ],
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'me',
      },
      relations: [
        { type: 't', target: { kind: 'k', namespace: 'ns', name: 'n' } },
      ],
      status: {
        items: [
          {
            type: 't',
            level: 'error',
            message: 'm',
            error: { name: 'n', message: 'm', code: '1', stack: 's' },
          },
        ],
      },
    };
  });

  it('works in the happy path', () => {
    expect(validator(entity)).toBe(entity);
  });

  it('nicely rejects an unknown kind', () => {
    entity.kind = 'Unknown';
    expect(validator(entity)).toBe(false);
  });

  it('nicely rejects an unknown apiVersion', () => {
    entity.apiVersion = 'backstage.io/v1alpha7';
    expect(validator(entity)).toBe(false);
  });

  it('nicely rejects when both kind and apiVersion mismatch', () => {
    entity.apiVersion = 'backstage.io/v1alpha7';
    entity.kind = 'Unknown';
    expect(validator(entity)).toBe(false);
  });

  it('rejects when the kind is actually breaking other rules than enum', () => {
    entity.kind = 7;
    expect(() => validator(entity)).toThrow(/kind/);
  });

  it('rejects when the apiVersion is actually breaking other rules than enum', () => {
    entity.apiVersion = 7;
    expect(() => validator(entity)).toThrow(/apiVersion/);
  });

  it('rejects nicely when there is both a nice mismatch and a fatal error', () => {
    entity.kind = 'Unknown';
    entity.metadata = 7;
    expect(validator(entity)).toBe(false);
  });

  it('rejects on errors in other parts of the schema', () => {
    entity.spec = 7;
    expect(() => validator(entity)).toThrow(/spec/);
  });
});
