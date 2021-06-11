/*
 * Copyright 2021 Spotify AB
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

import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core';
import { kubernetesApiRef } from '../api/types';
import { kubernetesAuthProvidersApiRef } from '../kubernetes-auth-provider/types';
import { useEffect, useState } from 'react';
import {
  KubernetesRequestBody,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';

export interface KubernetesObjects {
  kubernetesObjects: ObjectsByEntityResponse | undefined;
  error: string | undefined;
}

export const useKubernetesObjects = (entity: Entity): KubernetesObjects => {
  const kubernetesApi = useApi(kubernetesApiRef);
  const kubernetesAuthProvidersApi = useApi(kubernetesAuthProvidersApiRef);
  const [kubernetesObjects, setKubernetesObjects] = useState<
    ObjectsByEntityResponse | undefined
  >(undefined);

  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      let clusters = [];

      try {
        clusters = await kubernetesApi.getClusters();
      } catch (e) {
        setError(e.message);
        return;
      }

      const authProviders: string[] = [
        ...new Set(clusters.map(c => c.authProvider)),
      ];
      // For each auth type, invoke decorateRequestBodyForAuth on corresponding KubernetesAuthProvider
      let requestBody: KubernetesRequestBody = {
        entity,
      };
      for (const authProviderStr of authProviders) {
        // Multiple asyncs done sequentially instead of all at once to prevent same requestBody from being modified simultaneously
        try {
          requestBody = await kubernetesAuthProvidersApi.decorateRequestBodyForAuth(
            authProviderStr,
            requestBody,
          );
        } catch (e) {
          setError(e.message);
          return;
        }
      }

      try {
        setKubernetesObjects(
          await kubernetesApi.getObjectsByEntity(requestBody),
        );
      } catch (e) {
        setError(e.message);
        return;
      }
    })();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [entity.metadata.name, kubernetesApi, kubernetesAuthProvidersApi]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    kubernetesObjects,
    error,
  };
};
