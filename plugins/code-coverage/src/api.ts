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

import { EntityName, stringifyEntityRef } from '@backstage/catalog-model';
import { createApiRef, DiscoveryApi } from '@backstage/core';
import { ResponseError } from '@backstage/errors';
import { JsonCodeCoverage, JsonCoverageHistory } from './types';

export type CodeCoverageApi = {
  discovery: DiscoveryApi;
  getCoverageForEntity: (entity: EntityName) => Promise<JsonCodeCoverage>;
  getFileContentFromEntity: (
    entity: EntityName,
    filePath: string,
  ) => Promise<string>;
  getCoverageHistoryForEntity: (
    entity: EntityName,
    limit?: number,
  ) => Promise<JsonCoverageHistory>;
};

export const codeCoverageApiRef = createApiRef<CodeCoverageApi>({
  id: 'plugin.code-coverage.service',
  description: 'Used by the code coverage plugin to make requests',
});

export class CodeCoverageRestApi implements CodeCoverageApi {
  url: string = '';

  constructor(public discovery: DiscoveryApi) {}

  private async fetch<T = unknown | string | JsonCoverageHistory>(
    path: string,
    init?: RequestInit,
  ): Promise<T | string> {
    if (!this.url) {
      this.url = await this.discovery.getBaseUrl('code-coverage');
    }
    const resp = await fetch(`${this.url}${path}`, init);
    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
    if (resp.headers.get('content-type')?.includes('application/json')) {
      return await resp.json();
    }
    return await resp.text();
  }

  async getCoverageForEntity(
    entityName: EntityName,
  ): Promise<JsonCodeCoverage> {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    return (await this.fetch<JsonCodeCoverage>(
      `/report?entity=${entity}`,
    )) as JsonCodeCoverage;
  }

  async getFileContentFromEntity(
    entityName: EntityName,
    filePath: string,
  ): Promise<string> {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    return await this.fetch<string>(
      `/file-content?entity=${entity}&path=${encodeURI(filePath)}`,
    );
  }

  async getCoverageHistoryForEntity(
    entityName: EntityName,
    limit?: number,
  ): Promise<JsonCoverageHistory> {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    const hasValidLimit = limit && limit > 0;
    return (await this.fetch<JsonCoverageHistory>(
      `/history?entity=${entity}${
        hasValidLimit ? `&limit=${encodeURIComponent(String(limit))}` : ''
      }`,
    )) as JsonCoverageHistory;
  }
}
