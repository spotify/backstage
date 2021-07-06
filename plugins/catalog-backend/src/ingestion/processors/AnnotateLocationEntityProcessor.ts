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

import {
  EDIT_URL_ANNOTATION,
  Entity,
  LocationSpec,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
  SOURCE_LOCATION_ANNOTATION,
  stringifyLocationReference,
  VIEW_URL_ANNOTATION,
} from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { identity, merge, pickBy } from 'lodash';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

type Options = {
  integrations: ScmIntegrationRegistry;
};

export class AnnotateLocationEntityProcessor implements CatalogProcessor {
  constructor(private readonly options: Options) {}

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
    _: CatalogProcessorEmit,
    originLocation: LocationSpec,
  ): Promise<Entity> {
    const { integrations } = this.options;
    let viewUrl;
    let editUrl;
    let sourceLocation;

    if (location.type === 'url') {
      const scmIntegration = integrations.byUrl(location.target);

      viewUrl = location.target;
      editUrl = scmIntegration?.resolveEditUrl(location.target);

      const sourceUrl = scmIntegration?.resolveUrl({
        url: './',
        base: location.target,
      });

      if (sourceUrl) {
        sourceLocation = stringifyLocationReference({
          type: 'url',
          target: sourceUrl,
        });
      }
    }

    return merge(
      {
        metadata: {
          annotations: pickBy(
            {
              [LOCATION_ANNOTATION]: stringifyLocationReference(location),
              [ORIGIN_LOCATION_ANNOTATION]: stringifyLocationReference(
                originLocation,
              ),
              [VIEW_URL_ANNOTATION]: viewUrl,
              [EDIT_URL_ANNOTATION]: editUrl,
              [SOURCE_LOCATION_ANNOTATION]: sourceLocation,
            },
            identity,
          ),
        },
      },
      entity,
    );
  }
}
