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
  OAuthRequestApi,
  AuthRequesterOptions,
} from '@backstage/core-plugin-api';
import { OAuthRequestManager } from './OAuthRequestManager';

export default class MockOAuthApi implements OAuthRequestApi {
  private readonly real = new OAuthRequestManager();

  createAuthRequester<T>(options: AuthRequesterOptions<T>) {
    return this.real.createAuthRequester(options);
  }

  authRequest$() {
    return this.real.authRequest$();
  }

  async triggerAll() {
    await Promise.resolve(); // Wait a tick to allow new requests to get forwarded

    return new Promise<void>(resolve => {
      const subscription = this.authRequest$().subscribe(requests => {
        subscription.unsubscribe();
        Promise.all(requests.map(request => request.trigger())).then(() =>
          resolve(),
        );
      });
    });
  }

  async rejectAll() {
    await Promise.resolve(); // Wait a tick to allow new requests to get forwarded

    return new Promise<void>(resolve => {
      const subscription = this.authRequest$().subscribe(requests => {
        subscription.unsubscribe();
        requests.map(request => request.reject());
        resolve();
      });
    });
  }
}
