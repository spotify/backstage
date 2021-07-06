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

import { entityEnvelopeSchemaValidator } from './entityEnvelopeSchemaValidator';

describe('entityEnvelopeSchemaValidator', () => {
  const validator = entityEnvelopeSchemaValidator();
  let entity: any;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test',
        namespace: 'ns',
      },
    };
  });

  it('happy path: accepts valid data', () => {
    expect(() => validator(entity)).not.toThrow();
  });

  //
  // apiVersion and kind
  //

  it('rejects wrong root type', () => {
    expect(() => validator(7)).toThrow(/object/);
  });

  it('accepts unknown root fields', () => {
    entity.blah = 7;
    expect(() => validator(entity)).not.toThrow();
  });

  it('rejects missing apiVersion', () => {
    delete entity.apiVersion;
    expect(() => validator(entity)).toThrow(/apiVersion/);
  });

  it('rejects bad apiVersion type', () => {
    entity.apiVersion = 7;
    expect(() => validator(entity)).toThrow(/apiVersion/);
  });

  it('rejects empty apiVersion', () => {
    entity.apiVersion = '';
    expect(() => validator(entity)).toThrow(/apiVersion/);
  });

  it('rejects missing kind', () => {
    delete entity.kind;
    expect(() => validator(entity)).toThrow(/kind/);
  });

  it('rejects bad kind type', () => {
    entity.kind = 7;
    expect(() => validator(entity)).toThrow(/kind/);
  });

  it('rejects empty kind', () => {
    entity.kind = '';
    expect(() => validator(entity)).toThrow(/kind/);
  });

  //
  // metadata
  //

  it('rejects missing metadata', () => {
    delete entity.metadata;
    expect(() => validator(entity)).toThrow(/metadata/);
  });

  it('rejects bad metadata type', () => {
    entity.metadata = 7;
    expect(() => validator(entity)).toThrow(/metadata/);
  });

  it('rejects missing name', () => {
    delete entity.metadata.name;
    expect(() => validator(entity)).toThrow(/name/);
  });

  it('rejects empty name', () => {
    entity.metadata.name = '';
    expect(() => validator(entity)).toThrow(/name/);
  });

  it('rejects bad name type', () => {
    entity.metadata.name = 7;
    expect(() => validator(entity)).toThrow(/name/);
  });

  it('accepts missing namespace', () => {
    delete entity.metadata.namespace;
    expect(() => validator(entity)).not.toThrow();
  });

  it('rejects empty namespace', () => {
    entity.metadata.namespace = '';
    expect(() => validator(entity)).toThrow(/namespace/);
  });

  it('rejects bad namespace type', () => {
    entity.metadata.namespace = 7;
    expect(() => validator(entity)).toThrow(/namespace/);
  });

  it('accepts unknown metadata fields', () => {
    entity.metadata.blah = 7;
    expect(() => validator(entity)).not.toThrow();
  });
});
