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

import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import { ROLLBAR_ANNOTATION } from '../constants';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export function useRollbarEntities() {
  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);

  const organization =
    configApi.getOptionalString('rollbar.organization') ??
    configApi.getString('organization.name');

  const { value, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities();
    return response.items.filter(entity => {
      return !!entity.metadata.annotations?.[ROLLBAR_ANNOTATION];
    });
  }, [catalogApi]);

  return { entities: value, organization, loading, error };
}
