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

import { ApiRef, ApiHolder } from '@backstage/core-plugin-api';

/**
 * An ApiHolder that queries multiple other holders from for
 * an Api implementation, returning the first one encountered..
 */
export class ApiAggregator implements ApiHolder {
  private readonly holders: ApiHolder[];

  constructor(...holders: ApiHolder[]) {
    this.holders = holders;
  }

  get<T>(apiRef: ApiRef<T>): T | undefined {
    for (const holder of this.holders) {
      const api = holder.get(apiRef);
      if (api) {
        return api;
      }
    }
    return undefined;
  }
}
