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

import { Entity, LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { AnnotateLocationEntityProcessor } from './AnnotateLocationEntityProcessor';

describe('AnnotateLocationEntityProcessor', () => {
  describe('preProcessEntity', () => {
    it('adds annotations', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
        },
      };

      const location: LocationSpec = {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/app/catalog-info.yaml',
      };
      const originLocation: LocationSpec = {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      };

      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const processor = new AnnotateLocationEntityProcessor({ integrations });

      expect(
        await processor.preProcessEntity(
          entity,
          location,
          () => {},
          originLocation,
        ),
      ).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/backstage/backstage/blob/master/packages/app/catalog-info.yaml',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
            'backstage.io/view-url':
              'https://github.com/backstage/backstage/blob/master/packages/app/catalog-info.yaml',
            'backstage.io/edit-url':
              'https://github.com/backstage/backstage/edit/master/packages/app/catalog-info.yaml',
            'backstage.io/source-location':
              'url:https://github.com/backstage/backstage/tree/master/packages/app/',
          },
        },
      });
    });

    it('does not override existing annotations', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'backstage.io/view-url': 'https://example.com/view',
            'backstage.io/edit-url': 'https://example.com/edit',
            'backstage.io/source-location': 'url:https://example.com/source',
          },
        },
      };

      const location: LocationSpec = {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/packages/app/catalog-info.yaml',
      };
      const originLocation: LocationSpec = {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      };

      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const processor = new AnnotateLocationEntityProcessor({ integrations });

      expect(
        await processor.preProcessEntity(
          entity,
          location,
          () => {},
          originLocation,
        ),
      ).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/backstage/backstage/blob/master/packages/app/catalog-info.yaml',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
            'backstage.io/view-url': 'https://example.com/view',
            'backstage.io/edit-url': 'https://example.com/edit',
            'backstage.io/source-location': 'url:https://example.com/source',
          },
        },
      });
    });

    it('does not output view, edit or source location annotations for non url type locations', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
        },
      };

      const location: LocationSpec = {
        type: 'file',
        target: './test.yaml',
      };
      const originLocation: LocationSpec = {
        type: 'file',
        target: './test.yaml',
      };

      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const processor = new AnnotateLocationEntityProcessor({ integrations });

      expect(
        await processor.preProcessEntity(
          entity,
          location,
          () => {},
          originLocation,
        ),
      ).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'backstage.io/managed-by-location': 'file:./test.yaml',
            'backstage.io/managed-by-origin-location': 'file:./test.yaml',
          },
        },
      });
    });
  });
});
