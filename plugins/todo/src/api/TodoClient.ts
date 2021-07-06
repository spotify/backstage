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

import { serializeEntityRef } from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import { TodoApi, TodoListOptions, TodoListResult } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';

interface Options {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
}

export class TodoClient implements TodoApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  async listTodos({
    entity,
    offset,
    limit,
    orderBy,
    filters,
  }: TodoListOptions): Promise<TodoListResult> {
    const baseUrl = await this.discoveryApi.getBaseUrl('todo');
    const token = await this.identityApi.getIdToken();

    const query = new URLSearchParams();
    if (entity) {
      query.set('entity', serializeEntityRef(entity) as string);
    }
    if (typeof offset === 'number') {
      query.set('offset', String(offset));
    }
    if (typeof limit === 'number') {
      query.set('limit', String(limit));
    }
    if (orderBy) {
      query.set('orderBy', `${orderBy.field}=${orderBy.direction}`);
    }
    if (filters) {
      for (const filter of filters) {
        query.append('filter', `${filter.field}=${filter.value}`);
      }
    }

    const res = await fetch(`${baseUrl}/v1/todos?${query}`, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });

    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }

    const data: TodoListResult = await res.json();
    return data;
  }
}
