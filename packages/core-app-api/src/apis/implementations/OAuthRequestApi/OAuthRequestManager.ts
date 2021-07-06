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
  PendingAuthRequest,
  AuthRequester,
  AuthRequesterOptions,
  Observable,
} from '@backstage/core-plugin-api';
import { OAuthPendingRequests, PendingRequest } from './OAuthPendingRequests';
import { BehaviorSubject } from '../../../lib/subjects';

/**
 * The OAuthRequestManager is an implementation of the OAuthRequestApi.
 *
 * The purpose of this class and the API is to read a stream of incoming requests
 * of OAuth access tokens from different providers with varying scope, and funnel
 * them all together into a single request for each OAuth provider.
 */
export class OAuthRequestManager implements OAuthRequestApi {
  private readonly subject = new BehaviorSubject<PendingAuthRequest[]>([]);
  private currentRequests: PendingAuthRequest[] = [];
  private handlerCount = 0;

  createAuthRequester<T>(options: AuthRequesterOptions<T>): AuthRequester<T> {
    const handler = new OAuthPendingRequests<T>();

    const index = this.handlerCount;
    this.handlerCount++;

    handler.pending().subscribe({
      next: scopeRequest => {
        const newRequests = this.currentRequests.slice();
        const request = this.makeAuthRequest(scopeRequest, options);
        if (!request) {
          delete newRequests[index];
        } else {
          newRequests[index] = request;
        }
        this.currentRequests = newRequests;
        // Convert from sparse array to array of present items only
        this.subject.next(newRequests.filter(Boolean));
      },
    });

    return scopes => {
      return handler.request(scopes);
    };
  }

  // Converts the pending request and popup options into a popup request that we can forward to subscribers.
  private makeAuthRequest(
    request: PendingRequest<any>,
    options: AuthRequesterOptions<any>,
  ): PendingAuthRequest | undefined {
    const { scopes } = request;
    if (!scopes) {
      return undefined;
    }

    return {
      provider: options.provider,
      trigger: async () => {
        const result = await options.onAuthRequest(scopes);
        request.resolve(result);
      },
      reject: () => {
        const error = new Error('Login failed, rejected by user');
        error.name = 'RejectedError';
        request.reject(error);
      },
    };
  }

  authRequest$(): Observable<PendingAuthRequest[]> {
    return this.subject;
  }
}
