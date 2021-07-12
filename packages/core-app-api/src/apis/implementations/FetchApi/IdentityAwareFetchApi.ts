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

import { FetchApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';

export class IdentityAwareFetchApi {
  private implementation: FetchApi = crossFetch;

  get fetch(): FetchApi {
    // Return a wrapper to make sure that it's always the latest implementation
    // that gets used on each invocation
    return (...args) => this.implementation(...args);
  }

  onSignIn(result: { getIdToken?: () => Promise<string> }) {
    const { getIdToken } = result;
    if (!getIdToken) {
      this.implementation = crossFetch;
      return;
    }

    this.implementation = async function identityPassingFetch(
      input: RequestInfo,
      init?: RequestInit | undefined,
    ): Promise<Response> {
      const token = await getIdToken();
      if (!token) {
        return crossFetch(input, init);
      }

      const request = new Request(input, init);
      request.headers.set('backstage-token', token);
      return crossFetch(request);
    };
  }

  onSignOut() {
    this.implementation = crossFetch;
  }
}
