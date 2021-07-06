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

import { RollbarApi } from './RollbarApi';
import {
  RollbarItemsResponse,
  RollbarProject,
  RollbarTopActiveItem,
} from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

export class RollbarClient implements RollbarApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async getAllProjects(): Promise<RollbarProject[]> {
    return await this.get(`/projects`);
  }

  async getProject(projectName: string): Promise<RollbarProject> {
    return await this.get(`/projects/${projectName}`);
  }

  async getTopActiveItems(
    project: string,
    hours = 24,
    environment = 'production',
  ): Promise<RollbarTopActiveItem[]> {
    return await this.get(
      `/projects/${project}/top_active_items?environment=${environment}&hours=${hours}`,
    );
  }

  async getProjectItems(project: string): Promise<RollbarItemsResponse> {
    return await this.get(`/projects/${project}/items`);
  }

  private async get(path: string): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('rollbar')}${path}`;
    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(url, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
    });

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    return await response.json();
  }
}
