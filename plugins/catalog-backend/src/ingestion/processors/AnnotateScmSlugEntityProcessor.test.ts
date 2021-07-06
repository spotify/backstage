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
import { Entity, LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { AnnotateScmSlugEntityProcessor } from './AnnotateScmSlugEntityProcessor';

describe('AnnotateScmSlugEntityProcessor', () => {
  describe('github', () => {
    it('adds annotation', async () => {
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
          'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      };

      const processor = AnnotateScmSlugEntityProcessor.fromConfig(
        new ConfigReader({}),
      );

      expect(await processor.preProcessEntity(entity, location)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'github.com/project-slug': 'backstage/backstage',
          },
        },
      });
    });

    it('does not override existing annotation', async () => {
      const entity: Entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'github.com/project-slug': 'backstage/community',
          },
        },
      };
      const location: LocationSpec = {
        type: 'url',
        target:
          'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      };

      const processor = AnnotateScmSlugEntityProcessor.fromConfig(
        new ConfigReader({}),
      );

      expect(await processor.preProcessEntity(entity, location)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
          annotations: {
            'github.com/project-slug': 'backstage/community',
          },
        },
      });
    });

    it('should not add annotation for other providers', async () => {
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
          'https://gitlab.com/backstage/backstage/-/blob/master/catalog-info.yaml',
      };

      const processor = AnnotateScmSlugEntityProcessor.fromConfig(
        new ConfigReader({}),
      );

      expect(await processor.preProcessEntity(entity, location)).toEqual({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'my-component',
        },
      });
    });
  });
});
