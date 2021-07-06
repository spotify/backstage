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

import { Observable } from '@backstage/core-plugin-api';
import { BehaviorSubject } from '../../../lib/subjects';

type RequestQueueEntry<ResultType> = {
  scopes: Set<string>;
  resolve: (value: ResultType | PromiseLike<ResultType>) => void;
  reject: (reason: Error) => void;
};

export type PendingRequest<ResultType> = {
  scopes: Set<string> | undefined;
  resolve: (value: ResultType) => void;
  reject: (reason: Error) => void;
};

export function hasScopes(
  searched: Set<string>,
  searchFor: Set<string>,
): boolean {
  for (const scope of searchFor) {
    if (!searched.has(scope)) {
      return false;
    }
  }
  return true;
}

export function joinScopes(
  scopes: Set<string>,
  ...moreScopess: Set<string>[]
): Set<string> {
  const result = new Set(scopes);

  for (const moreScopes of moreScopess) {
    for (const scope of moreScopes) {
      result.add(scope);
    }
  }

  return result;
}

/**
 * The OAuthPendingRequests class is a utility for managing and observing
 * a stream of requests for oauth scopes for a single provider, and resolving
 * them correctly once requests are fulfilled.
 */
export class OAuthPendingRequests<ResultType> {
  private requests: RequestQueueEntry<ResultType>[] = [];
  private subject = new BehaviorSubject<PendingRequest<ResultType>>(
    this.getCurrentPending(),
  );

  request(scopes: Set<string>): Promise<ResultType> {
    return new Promise((resolve, reject) => {
      this.requests.push({ scopes, resolve, reject });

      this.subject.next(this.getCurrentPending());
    });
  }

  resolve(scopes: Set<string>, result: ResultType): void {
    this.requests = this.requests.filter(request => {
      if (hasScopes(scopes, request.scopes)) {
        request.resolve(result);
        return false;
      }
      return true;
    });

    this.subject.next(this.getCurrentPending());
  }

  reject(error: Error) {
    this.requests.forEach(request => request.reject(error));
    this.requests = [];

    this.subject.next(this.getCurrentPending());
  }

  pending(): Observable<PendingRequest<ResultType>> {
    return this.subject;
  }

  private getCurrentPending(): PendingRequest<ResultType> {
    const currentScopes =
      this.requests.length === 0
        ? undefined
        : this.requests
            .slice(1)
            .reduce(
              (acc, current) => joinScopes(acc, current.scopes),
              this.requests[0].scopes,
            );

    return {
      scopes: currentScopes,
      resolve: (value: ResultType) => {
        if (currentScopes) {
          this.resolve(currentScopes, value);
        }
      },
      reject: (reason: Error) => {
        if (currentScopes) {
          this.reject(reason);
        }
      },
    };
  }
}
