/*
 * Copyright 2021 The Backstage Authors
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
import fetch from 'cross-fetch';

import {
  BitbucketIntegrationConfig,
  getBitbucketRequestOptions,
} from '@backstage/integration';

export class BitbucketClient {
  private readonly config: BitbucketIntegrationConfig;

  constructor(options: { config: BitbucketIntegrationConfig }) {
    this.config = options.config;
  }

  async listProjects(options?: ListOptions): Promise<PagedResponse<any>> {
    return this.pagedRequest(`${this.config.apiBaseUrl}/projects`, options);
  }

  async listRepositories(
    projectKey: string,
    options?: ListOptions,
  ): Promise<PagedResponse<any>> {
    return this.pagedRequest(
      `${this.config.apiBaseUrl}/projects/${projectKey}/repos`,
      options,
    );
  }

  private async pagedRequest(
    endpoint: string,
    options?: ListOptions,
  ): Promise<PagedResponse<any>> {
    const request = new URL(endpoint);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key]!.toString());
      }
    }

    const response = await fetch(
      request.toString(),
      getBitbucketRequestOptions(this.config),
    );
    if (!response.ok) {
      throw new Error(
        `Unexpected response when fetching ${request.toString()}. Expected 200 but got ${
          response.status
        } - ${response.statusText}`,
      );
    }
    return response.json().then(repositories => {
      return repositories as PagedResponse<any>;
    });
  }
}

export type ListOptions = {
  [key: string]: number | undefined;
  limit?: number | undefined;
  start?: number | undefined;
};

export type PagedResponse<T> = {
  size: number;
  limit: number;
  start: number;
  isLastPage: boolean;
  values: T[];
  nextPageStart: number;
};

export async function* paginated(
  request: (options: ListOptions) => Promise<PagedResponse<any>>,
  options?: ListOptions,
) {
  const opts = options || { start: 0 };
  let res;
  do {
    res = await request(opts);
    opts.start = res.nextPageStart;
    for (const item of res.values) {
      yield item;
    }
  } while (!res.isLastPage);
}
