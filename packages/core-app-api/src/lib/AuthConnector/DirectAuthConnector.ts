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
import { AuthProvider, DiscoveryApi } from '@backstage/core-plugin-api';
import { showLoginPopup } from '../loginPopup';

type Options = {
  discoveryApi: DiscoveryApi;
  environment?: string;
  provider: AuthProvider & { id: string };
};
export class DirectAuthConnector<DirectAuthResponse> {
  private readonly discoveryApi: DiscoveryApi;
  private readonly environment: string | undefined;
  private readonly provider: AuthProvider & { id: string };

  constructor(options: Options) {
    const { discoveryApi, environment, provider } = options;

    this.discoveryApi = discoveryApi;
    this.environment = environment;
    this.provider = provider;
  }

  async createSession(): Promise<DirectAuthResponse> {
    const popupUrl = await this.buildUrl('/start');
    const payload = await showLoginPopup({
      url: popupUrl,
      name: `${this.provider.title} Login`,
      origin: new URL(popupUrl).origin,
      width: 450,
      height: 730,
    });

    return {
      ...payload,
      id: payload.profile.email,
    };
  }

  async refreshSession(): Promise<any> {}

  async removeSession(): Promise<void> {
    const res = await fetch(await this.buildUrl('/logout'), {
      method: 'POST',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    }).catch(error => {
      throw new Error(`Logout request failed, ${error}`);
    });

    if (!res.ok) {
      const error: any = new Error(`Logout request failed, ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
  }

  private async buildUrl(path: string): Promise<string> {
    const baseUrl = await this.discoveryApi.getBaseUrl('auth');
    return `${baseUrl}/${this.provider.id}${path}?env=${this.environment}`;
  }
}
