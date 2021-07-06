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

import lodash from 'lodash';
import {
  generateEntityEtag,
  generateEntityUid,
  entityHasChanges,
  generateUpdatedEntity,
} from './util';
import { Entity } from './Entity';

describe('util', () => {
  describe('generateEntityUid', () => {
    it('generates randomness', () => {
      expect(generateEntityUid()).not.toEqual('');
      expect(generateEntityUid()).not.toEqual(generateEntityUid());
    });
  });

  describe('generateEntityEtag', () => {
    it('generates randomness', () => {
      expect(generateEntityEtag()).not.toEqual('');
      expect(generateEntityEtag()).not.toEqual(generateEntityEtag());
    });
  });

  describe('entityHasChanges', () => {
    let a: Entity;
    beforeEach(() => {
      a = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'name',
          custom: 'custom',
          labels: {
            labelKey: 'labelValue',
          },
          annotations: {
            annotationKey: 'annotationValue',
          },
        },
        spec: {
          a: 'a',
        },
      };
    });

    it('happy path: clone has no changes', () => {
      const b = lodash.cloneDeep(a);
      expect(entityHasChanges(a, b)).toBe(false);
    });

    it('detects root field changes', () => {
      let b: any = lodash.cloneDeep(a);
      b.apiVersion += 'a';
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      delete b.apiVersion;
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      b.kind += 'a';
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      delete b.kind;
      expect(entityHasChanges(a, b)).toBe(true);
    });

    it('detects metadata changes', () => {
      let b: any = lodash.cloneDeep(a);
      b.metadata.name += 'a';
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      delete b.metadata.custom;
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      delete b.metadata.custom;
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      b.metadata.labels.n = 'n';
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      b.metadata.labels.labelKey += 'a';
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      b.metadata.annotations.annotationKey += 'a';
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      delete b.metadata.annotations.annotationKey;
      expect(entityHasChanges(a, b)).toBe(true);
    });

    it('detects spec changes', () => {
      let b: any = lodash.cloneDeep(a);
      b.spec.a += 'a';
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      delete b.spec.a;
      expect(entityHasChanges(a, b)).toBe(true);
      b = lodash.cloneDeep(a);
      b.spec.n = 'n';
      expect(entityHasChanges(a, b)).toBe(true);
    });
  });

  describe('generateUpdatedEntity', () => {
    let a: Entity;
    let b: any;
    beforeEach(() => {
      a = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: 'da921f56-f655-4e6e-9b8b-bb19a57818d8',
          etag: 'NzY5NDA5NzQtYmEwNC00MDY0LWFiYmItNTYxYzQxM2JhZDcx',
          generation: 2,
          name: 'name',
          custom: 'custom',
          labels: {
            labelKey: 'labelValue',
          },
          annotations: {
            annotationKey: 'annotationValue',
          },
        },
        spec: {
          a: 'a',
        },
      };
      b = lodash.cloneDeep(a);
      delete b.metadata.uid;
      delete b.metadata.etag;
      delete b.metadata.generation;
    });

    it('happy path: running on itself leaves it unchanged', () => {
      const result = generateUpdatedEntity(a, b);
      expect(result).toEqual(a);
    });

    it('bumps etag and generation when spec is changed', () => {
      b.spec.a += 'a';
      const result = generateUpdatedEntity(a, b);
      expect(result.metadata.uid).toEqual(a.metadata.uid);
      expect(result.metadata.etag).not.toEqual(a.metadata.etag);
      expect(result.metadata.generation).toEqual(a.metadata.generation! + 1);
      expect(result.spec).toEqual({ a: 'aa' });
    });

    it('bumps only etag when other things than spec are changed', () => {
      b.metadata.n = 'n';
      const result = generateUpdatedEntity(a, b);
      expect(result.metadata.uid).toEqual(a.metadata.uid);
      expect(result.metadata.etag).not.toEqual(a.metadata.etag);
      expect(result.metadata.generation).toEqual(a.metadata.generation);
      expect(result.metadata.n).toEqual('n');
    });

    it('retains new annotations', () => {
      b.metadata.annotations.annotationKey = 'changedValue';
      b.metadata.annotations.newKey = 'newValue';
      const result = generateUpdatedEntity(a, b);
      expect(result.metadata.uid).toEqual(a.metadata.uid);
      expect(result.metadata.etag).not.toEqual(a.metadata.etag);
      expect(result.metadata.generation).toEqual(a.metadata.generation);
      expect(result.metadata.annotations).toEqual({
        annotationKey: 'changedValue',
        newKey: 'newValue',
      });
    });

    it('retains old annotations', () => {
      b.metadata.annotations.newKey = 'newValue';
      const result = generateUpdatedEntity(a, b);
      expect(result.metadata.uid).toEqual(a.metadata.uid);
      expect(result.metadata.etag).not.toEqual(a.metadata.etag);
      expect(result.metadata.generation).toEqual(a.metadata.generation);
      expect(result.metadata.annotations).toEqual({
        annotationKey: 'annotationValue',
        newKey: 'newValue',
      });
    });
  });
});
