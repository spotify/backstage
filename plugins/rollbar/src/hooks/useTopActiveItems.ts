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

import { useAsync } from 'react-use';
import { Entity } from '@backstage/catalog-model';
import { rollbarApiRef } from '../api';
import { RollbarTopActiveItem } from '../api/types';
import { useProjectSlugFromEntity } from './useProject';
import { useApi } from '@backstage/core-plugin-api';

export function useTopActiveItems(entity: Entity) {
  const api = useApi(rollbarApiRef);
  const { organization, project } = useProjectSlugFromEntity(entity);
  const { value, loading, error } = useAsync(() => {
    if (!project) {
      return Promise.resolve([]);
    }

    return api
      .getTopActiveItems(project, 168)
      .then(data =>
        data.sort((a, b) => b.item.occurrences - a.item.occurrences),
      );
  }, [api, organization, project, entity]);

  return {
    items: value as RollbarTopActiveItem[],
    organization,
    project,
    loading,
    error,
  };
}
