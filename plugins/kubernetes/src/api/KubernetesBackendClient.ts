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

import { KubernetesApi } from './types';
import {
  KubernetesRequestBody,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

export class KubernetesBackendClient implements KubernetesApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const payload = await response.text();
      let message;
      switch (response.status) {
        case 404:
          message =
            'Could not find the Kubernetes Backend (HTTP 404). Make sure the plugin has been fully installed.';
          break;
        default:
          message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      }
      throw new Error(message);
    }

    return await response.json();
  }

  private async postRequired(
    path: string,
    requestBody: KubernetesRequestBody,
  ): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('kubernetes')}${path}`;
    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
      body: JSON.stringify(requestBody),
    });

    return this.handleResponse(response);
  }

  async getObjectsByEntity(
    requestBody: KubernetesRequestBody,
  ): Promise<ObjectsByEntityResponse> {
    return await this.postRequired(
      `/services/${requestBody.entity.metadata.name}`,
      requestBody,
    );
  }

  async getClusters(): Promise<{ name: string; authProvider: string }[]> {
    const url = `${await this.discoveryApi.getBaseUrl('kubernetes')}/clusters`;

    const response = await fetch(url, {
      method: 'GET',
    });

    return (await this.handleResponse(response)).items;
  }
}
