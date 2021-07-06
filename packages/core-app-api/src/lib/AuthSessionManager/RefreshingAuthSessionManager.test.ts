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

import { RefreshingAuthSessionManager } from './RefreshingAuthSessionManager';
import { SessionState } from '@backstage/core-plugin-api';

const defaultOptions = {
  sessionScopes: (session: { scopes: Set<string> }) => session.scopes,
  sessionShouldRefresh: (session: { expired: boolean }) => session.expired,
};

describe('RefreshingAuthSessionManager', () => {
  it('should save result from createSession', async () => {
    const createSession = jest.fn().mockResolvedValue({ expired: false });
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const removeSession = jest.fn();
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession, removeSession },
      ...defaultOptions,
    } as any);
    const stateSubscriber = jest.fn();
    manager.sessionState$().subscribe(stateSubscriber);

    await Promise.resolve(); // Wait a tick for observer to post a value

    expect(stateSubscriber.mock.calls).toEqual([[SessionState.SignedOut]]);
    await manager.getSession({});
    expect(createSession).toBeCalledTimes(1);

    expect(stateSubscriber.mock.calls).toEqual([
      [SessionState.SignedOut],
      [SessionState.SignedIn],
    ]);
    await manager.getSession({});
    expect(createSession).toBeCalledTimes(1);

    expect(refreshSession).toBeCalledTimes(1);
    expect(stateSubscriber.mock.calls).toEqual([
      [SessionState.SignedOut],
      [SessionState.SignedIn],
    ]);

    expect(removeSession).toHaveBeenCalledTimes(0);
    await manager.removeSession();
    expect(removeSession).toHaveBeenCalledTimes(1);
    expect(stateSubscriber.mock.calls).toEqual([
      [SessionState.SignedOut],
      [SessionState.SignedIn],
      [SessionState.SignedOut],
    ]);
  });

  it('should ask consent only if scopes have changed', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    createSession.mockResolvedValue({
      scopes: new Set(['a']),
      expired: false,
    });
    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);

    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);

    await manager.getSession({ scopes: new Set(['b']) });
    expect(createSession).toBeCalledTimes(2);
  });

  it('should check for session expiry', async () => {
    const createSession = jest.fn();
    const refreshSession = jest
      .fn()
      .mockRejectedValueOnce(new Error('NOPE'))
      .mockResolvedValue({ scopes: new Set(['a']) });
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    createSession.mockResolvedValue({
      scopes: new Set(['a']),
      expired: true,
    });

    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);
    expect(refreshSession).toBeCalledTimes(1);

    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);
    expect(refreshSession).toBeCalledTimes(2);
  });

  it('should handle user closed popup', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    createSession.mockRejectedValueOnce(new Error('some error'));
    await expect(
      manager.getSession({ scopes: new Set(['a']) }),
    ).rejects.toThrow('some error');
  });

  it('should not get optional session', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    expect(await manager.getSession({ optional: true })).toBe(undefined);
    expect(createSession).toBeCalledTimes(0);
    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should forward option to instantly show auth popup and not attempt refresh', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    expect(await manager.getSession({ instantPopup: true })).toBe(undefined);
    expect(createSession).toBeCalledTimes(1);
    expect(createSession).toHaveBeenCalledWith({
      scopes: new Set(),
      instantPopup: true,
    });
    expect(refreshSession).toBeCalledTimes(0);
  });

  it('should remove session straight away', async () => {
    const removeSession = jest.fn();
    const manager = new RefreshingAuthSessionManager({
      connector: { removeSession },
      ...defaultOptions,
    } as any);

    await manager.removeSession();
    expect(removeSession).toHaveBeenCalled();
    expect(await manager.getSession({ optional: true })).toBe(undefined);
  });
});
