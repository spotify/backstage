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

import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { KubernetesAuthProvider, KubernetesAuthProvidersApi } from './types';
import { GoogleKubernetesAuthProvider } from './GoogleKubernetesAuthProvider';
import { ServiceAccountKubernetesAuthProvider } from './ServiceAccountKubernetesAuthProvider';
import { AwsKubernetesAuthProvider } from './AwsKubernetesAuthProvider';
import { OAuthApi } from '@backstage/core-plugin-api';

export class KubernetesAuthProviders implements KubernetesAuthProvidersApi {
  private readonly kubernetesAuthProviderMap: Map<
    string,
    KubernetesAuthProvider
  >;

  constructor(options: { googleAuthApi: OAuthApi }) {
    this.kubernetesAuthProviderMap = new Map<string, KubernetesAuthProvider>();
    this.kubernetesAuthProviderMap.set(
      'google',
      new GoogleKubernetesAuthProvider(options.googleAuthApi),
    );
    this.kubernetesAuthProviderMap.set(
      'serviceAccount',
      new ServiceAccountKubernetesAuthProvider(),
    );
    this.kubernetesAuthProviderMap.set('aws', new AwsKubernetesAuthProvider());
  }

  async decorateRequestBodyForAuth(
    authProvider: string,
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody> {
    const kubernetesAuthProvider:
      | KubernetesAuthProvider
      | undefined = this.kubernetesAuthProviderMap.get(authProvider);
    if (kubernetesAuthProvider) {
      return await kubernetesAuthProvider.decorateRequestBodyForAuth(
        requestBody,
      );
    }
    throw new Error(
      `authProvider "${authProvider}" has no KubernetesAuthProvider defined for it`,
    );
  }
}
