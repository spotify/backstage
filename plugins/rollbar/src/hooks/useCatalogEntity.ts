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
  catalogApiRef,
  useEntityCompoundName,
} from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';

export function useCatalogEntity() {
  const catalogApi = useApi(catalogApiRef);
  const { namespace, name } = useEntityCompoundName();

  const { value: entity, error, loading } = useAsync(
    () => catalogApi.getEntityByName({ kind: 'Component', namespace, name }),
    [catalogApi, namespace, name],
  );

  return { entity, error, loading };
}
