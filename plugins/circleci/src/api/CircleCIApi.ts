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

import {
  CircleCIOptions,
  getMe,
  getBuildSummaries,
  getFullBuild,
  postBuildActions,
  BuildAction,
  BuildWithSteps,
  BuildStepAction,
  BuildSummary,
  GitType,
} from 'circleci-api';
import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';

export { GitType };
export type { BuildWithSteps, BuildStepAction, BuildSummary };

export const circleCIApiRef = createApiRef<CircleCIApi>({
  id: 'plugin.circleci.service',
  description: 'Used by the CircleCI plugin to make requests',
});

const DEFAULT_PROXY_PATH = '/circleci/api';

type Options = {
  discoveryApi: DiscoveryApi;
  /**
   * Path to use for requests via the proxy, defaults to /circleci/api
   */
  proxyPath?: string;
};

export class CircleCIApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.proxyPath = options.proxyPath ?? DEFAULT_PROXY_PATH;
  }

  async retry(buildNumber: number, options: Partial<CircleCIOptions>) {
    return postBuildActions('', buildNumber, BuildAction.RETRY, {
      circleHost: await this.getApiUrl(),
      ...options.vcs,
    });
  }

  async getBuilds(
    { limit = 10, offset = 0 }: { limit: number; offset: number },
    options: Partial<CircleCIOptions>,
  ) {
    return getBuildSummaries('', {
      options: {
        limit,
        offset,
      },
      vcs: {},
      circleHost: await this.getApiUrl(),
      ...options,
    });
  }

  async getUser(options: Partial<CircleCIOptions>) {
    return getMe('', { circleHost: await this.getApiUrl(), ...options });
  }

  async getBuild(buildNumber: number, options: Partial<CircleCIOptions>) {
    return getFullBuild('', buildNumber, {
      circleHost: await this.getApiUrl(),
      ...options.vcs,
    });
  }

  private async getApiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}
