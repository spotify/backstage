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

import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';

export type NewRelicApplication = {
  id: number;
  application_summary: NewRelicApplicationSummary;
  name: string;
  language: string;
  health_status: string;
  reporting: boolean;
  settings: NewRelicApplicationSettings;
  links?: NewRelicApplicationLinks;
};

export type NewRelicApplicationSummary = {
  apdex_score: number;
  error_rate: number;
  host_count: number;
  instance_count: number;
  response_time: number;
  throughput: number;
};

export type NewRelicApplicationSettings = {
  app_apdex_threshold: number;
  end_user_apdex_threshold: number;
  enable_real_user_monitoring: boolean;
  use_server_side_config: boolean;
};

export type NewRelicApplicationLinks = {
  application_instances: Array<any>;
  servers: Array<any>;
  application_hosts: Array<any>;
};

export type NewRelicApplications = {
  applications: NewRelicApplication[];
};

export const newRelicApiRef = createApiRef<NewRelicApi>({
  id: 'plugin.newrelic.service',
  description: 'Used by the NewRelic plugin to make requests',
});

const DEFAULT_PROXY_PATH_BASE = '/newrelic';

type Options = {
  discoveryApi: DiscoveryApi;
  /**
   * Path to use for requests via the proxy, defaults to /newrelic
   */
  proxyPathBase?: string;
};

export interface NewRelicApi {
  getApplications(): Promise<NewRelicApplications>;
}

export class NewRelicClient implements NewRelicApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPathBase: string;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.proxyPathBase = options.proxyPathBase ?? DEFAULT_PROXY_PATH_BASE;
  }

  async getApplications(): Promise<NewRelicApplications> {
    const url = await this.getApiUrl('apm', 'applications.json');
    const response = await fetch(url);
    let responseJson;

    try {
      responseJson = await response.json();
    } catch (e) {
      responseJson = { applications: [] };
    }

    if (response.status !== 200) {
      throw new Error(
        `Error communicating with New Relic: ${
          responseJson?.error?.title || response.statusText
        }`,
      );
    }

    return responseJson;
  }

  private async getApiUrl(product: string, path: string) {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return `${proxyUrl}${this.proxyPathBase}/${product}/api/${path}`;
  }
}
