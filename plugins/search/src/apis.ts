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

import { SearchQuery, SearchResultSet } from '@backstage/search-common';
import qs from 'qs';
import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';

export const searchApiRef = createApiRef<SearchApi>({
  id: 'plugin.search.queryservice',
  description: 'Used to make requests against the search API',
});

export interface SearchApi {
  query(query: SearchQuery): Promise<SearchResultSet>;
}

export class SearchClient implements SearchApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async query(query: SearchQuery): Promise<SearchResultSet> {
    const token = await this.identityApi.getIdToken();
    const queryString = qs.stringify(query);
    const url = `${await this.discoveryApi.getBaseUrl(
      'search/query',
    )}?${queryString}`;
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.json();
  }
}
