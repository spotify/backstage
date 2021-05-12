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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { ConfigApi, createApiRef, DiscoveryApi } from '@backstage/core';
import { ResponseError } from '@backstage/errors';
import { ApiResponse, UptimerobotApi } from './types';

export const uptimerobotApiRef = createApiRef<UptimerobotApi>({
  id: 'plugin.uptimerobot.service',
  description: 'Used by the UptimeRobot plugin to make requests',
});

export class UptimerobotClient implements UptimerobotApi {
  public configApi: ConfigApi;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: ConfigApi;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  private async fetch<T = any>(path: string): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('uptimerobot');

    const response = await fetch(`${baseUrl}/${path}`);
    if (!response.ok) throw await ResponseError.fromResponse(response);
    return await response.json();
  }

  getUpdateInterval() {
    return (
      this.configApi.getOptionalNumber('uptimerobot.updateInterval') || 120
    );
  }

  async getAllMonitors() {
    return await this.fetch<ApiResponse>('monitors');
  }

  async getSingleMonitor(entity?: Entity) {
    if (!entity) return Promise.reject({ message: 'Missing entity' });
    return await this.fetch<ApiResponse>(
      `monitors?entity=${stringifyEntityRef(entity)}`,
    );
  }
}
