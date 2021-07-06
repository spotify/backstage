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

import MockOAuthApi from './MockOAuthApi';
import PowerIcon from '@material-ui/icons/Power';

describe('MockOAuthApi', () => {
  it('should trigger all requests', async () => {
    const authResult = { is: 'done' };
    const mock = new MockOAuthApi();

    const authHandler1 = jest.fn().mockImplementation(() => authResult);
    const requester1 = mock.createAuthRequester({
      provider: { icon: PowerIcon, title: 'Test' },
      onAuthRequest: authHandler1,
    });

    const authHandler2 = jest.fn().mockResolvedValue('other');
    const requester2 = mock.createAuthRequester({
      provider: { icon: PowerIcon, title: 'Test' },
      onAuthRequest: authHandler2,
    });

    const promises = [
      requester1(new Set(['a'])),
      requester1(new Set(['b'])),
      requester2(new Set(['a', 'b'])),
      requester2(new Set(['b', 'c'])),
      requester2(new Set(['c', 'a'])),
    ];

    await expect(
      Promise.race([Promise.all(promises), 'waiting']),
    ).resolves.toBe('waiting');

    await mock.triggerAll();

    await expect(Promise.all(promises)).resolves.toEqual([
      authResult,
      authResult,
      'other',
      'other',
      'other',
    ]);

    expect(authHandler1).toHaveBeenCalledTimes(1);
    expect(authHandler1).toHaveBeenCalledWith(new Set(['a', 'b']));
    expect(authHandler2).toHaveBeenCalledTimes(1);
    expect(authHandler2).toHaveBeenCalledWith(new Set(['a', 'b', 'c']));
  });

  it('should reject all requests', async () => {
    const mock = new MockOAuthApi();

    const authHandler1 = jest.fn();
    const requester1 = mock.createAuthRequester({
      provider: { icon: PowerIcon, title: 'Test' },
      onAuthRequest: authHandler1,
    });

    const authHandler2 = jest.fn();
    const requester2 = mock.createAuthRequester({
      provider: { icon: PowerIcon, title: 'Test' },
      onAuthRequest: authHandler2,
    });

    const promises = [
      requester1(new Set(['a'])),
      requester1(new Set(['b'])),
      requester2(new Set(['a', 'b'])),
      requester2(new Set(['b', 'c'])),
      requester2(new Set(['c', 'a'])),
    ];

    await expect(
      Promise.race([Promise.all(promises), 'waiting']),
    ).resolves.toBe('waiting');

    await mock.rejectAll();

    for (const promise of promises) {
      await expect(promise).rejects.toMatchObject({ name: 'RejectedError' });
    }

    expect(authHandler1).not.toHaveBeenCalled();
    expect(authHandler2).not.toHaveBeenCalled();
  });
});
