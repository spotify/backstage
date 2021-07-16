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

import React, { useEffect } from 'react';
import { Entity } from '@backstage/catalog-model';
import {
  DefaultEntityFilters,
  EntityFilter,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';

class TechDocsFilter implements EntityFilter {
  // TODO(pkuang): Required due to https://github.com/backstage/backstage/blob/7f1ac84c60bd65c10b0f4ce3c7508eae32eb0ccf/plugins/catalog-react/src/hooks/useEntityListProvider.tsx#L143-L146
  // should be better resolved pending https://github.com/backstage/backstage/pull/6444
  getCatalogFilters(): Record<string, string | string[]> {
    return { kind: 'component' };
  }

  // TODO(pkuang): should be unnecessary once https://github.com/backstage/backstage/pull/6444 is supported
  filterEntity(entity: Entity): boolean {
    return !!entity.metadata.annotations?.['backstage.io/techdocs-ref'];
  }
}

type CustomFilters = DefaultEntityFilters & {
  techdocs?: TechDocsFilter;
};

export const TechDocsPicker = () => {
  const { updateFilters } = useEntityListProvider<CustomFilters>();

  useEffect(() => {
    updateFilters({
      techdocs: new TechDocsFilter(),
    });
  }, [updateFilters]);

  return <></>;
};
