/*
 * Copyright 2020 Spotify AB
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

import { createApiRef } from '@backstage/core';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';

export interface KubernetesAuthProvider {
  decorateRequestBodyForAuth(
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody>;
}

export const kubernetesAuthProvidersApiRef = createApiRef<KubernetesAuthProvidersApi>(
  {
    id: 'plugin.kubernetes-auth-providers.service',
    description:
      'Used by the Kubernetes plugin to fetch KubernetesAuthProviders',
  },
);

export interface KubernetesAuthProvidersApi {
  decorateRequestBodyForAuth(
    authProvider: string,
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody>;
}
