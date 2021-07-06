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

import { waitFor } from '@testing-library/react';
import { OAuthPendingRequests } from './OAuthPendingRequests';

describe('OAuthPendingRequests', () => {
  it('notifies new observers about current state', async () => {
    const target = new OAuthPendingRequests<string>();
    const next = jest.fn();
    const error = jest.fn();

    const input = new Set(['a', 'b']);
    target.pending().subscribe({ next, error });
    target.request(input);

    await waitFor(() => expect(next).toBeCalledTimes(2));
    expect(next.mock.calls[0][0].scopes).toBeUndefined();
    expect(next.mock.calls[1][0].scopes.toString()).toBe(input.toString());
    expect(error.mock.calls.length).toBe(0);
  });

  it('resolves requests and notifies observers', async () => {
    const target = new OAuthPendingRequests<string>();
    const next = jest.fn();
    const error = jest.fn();

    const request1 = target.request(new Set(['a']));
    const request2 = target.request(new Set(['a']));
    target.pending().subscribe({ next, error });
    target.resolve(new Set(['a']), 'session1');
    target.resolve(new Set(['a']), 'session2');

    await expect(request1).resolves.toBe('session1');
    await expect(request2).resolves.toBe('session1');
    expect(next).toBeCalledTimes(3); // once on subscription, twice on resolve
    expect(error).toBeCalledTimes(0);
  });

  it('can resolve through the observable', async () => {
    const target = new OAuthPendingRequests<string>();
    const next = jest.fn(pendingRequest => pendingRequest.resolve('done'));
    const error = jest.fn();

    const request1 = target.request(new Set(['a']));
    target.pending().subscribe({ next, error });

    await expect(request1).resolves.toBe('done');
    expect(next).toBeCalledTimes(2); // once with data on subscription, once empty after resolution
    expect(error).toBeCalledTimes(0);
  });

  it('rejects requests and notifies observers only once', async () => {
    const target = new OAuthPendingRequests<string>();
    const next = jest.fn();
    const error = jest.fn();
    const rejection = new Error('eek');

    const request1 = target.request(new Set(['a']));
    const request2 = target.request(new Set(['a']));
    target.pending().subscribe({ next, error });
    target.reject(rejection);
    target.resolve(new Set(['a']), 'session');

    await expect(request1).rejects.toBe(rejection);
    await expect(request2).rejects.toBe(rejection);
    expect(next).toBeCalledTimes(3); // once on subscription, once or reject, once on resolve
    expect(error).toBeCalledTimes(0);
  });

  it('can reject through the observable', async () => {
    const target = new OAuthPendingRequests<string>();
    const rejection = new Error('nope');
    const next = jest.fn(pendingRequest => pendingRequest.reject(rejection));
    const error = jest.fn();

    const request1 = target.request(new Set(['a']));
    target.pending().subscribe({ next, error });

    await expect(request1).rejects.toBe(rejection);
    expect(next).toBeCalledTimes(2);
  });
});
