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

import { KubernetesAuthProvider } from './types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { OAuthApi } from '@backstage/core-plugin-api';

export class GoogleKubernetesAuthProvider implements KubernetesAuthProvider {
  authProvider: OAuthApi;

  constructor(authProvider: OAuthApi) {
    this.authProvider = authProvider;
  }

  async decorateRequestBodyForAuth(
    requestBody: KubernetesRequestBody,
  ): Promise<KubernetesRequestBody> {
    const googleAuthToken: string = await this.authProvider.getAccessToken(
      'https://www.googleapis.com/auth/cloud-platform',
    );
    if ('auth' in requestBody) {
      requestBody.auth!.google = googleAuthToken;
    } else {
      requestBody.auth = { google: googleAuthToken };
    }
    return requestBody;
  }
}
