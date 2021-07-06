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

import { StaticAuthSessionManager } from './StaticAuthSessionManager';

const defaultOptions = {
  sessionScopes: (session: string) => new Set(session.split(' ')),
};

describe('StaticAuthSessionManager', () => {
  const baseConnector = {
    refreshSession() {
      throw new Error('refreshSession should not be called');
    },
    removeSession() {
      throw new Error('removeSession should not be called');
    },
  };

  it('should get session by creating session once', async () => {
    const createSession = jest.fn().mockResolvedValue('my-session');
    const manager = new StaticAuthSessionManager({
      connector: { createSession, ...baseConnector },
      ...defaultOptions,
    });

    expect(createSession).toHaveBeenCalledTimes(0);
    await expect(manager.getSession({})).resolves.toBe('my-session');
    expect(createSession).toHaveBeenCalledTimes(1);
    await expect(manager.getSession({})).resolves.toBe('my-session');
    expect(createSession).toHaveBeenCalledTimes(1);
  });

  it('should fail to get session if user rejects the request', async () => {
    const createSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new StaticAuthSessionManager({
      connector: { createSession, ...baseConnector },
      ...defaultOptions,
    });

    expect(createSession).toHaveBeenCalledTimes(0);
    await expect(manager.getSession({})).rejects.toThrow('NOPE');
    expect(createSession).toHaveBeenCalledTimes(1);
    await expect(manager.getSession({ optional: true })).resolves.toBe(
      undefined,
    );
  });

  it('should only request auth once for same scopes', async () => {
    const createSession = jest
      .fn()
      .mockImplementation(({ scopes }) => [...scopes].join(' '));
    const manager = new StaticAuthSessionManager({
      connector: { createSession, ...baseConnector },
      ...defaultOptions,
    });

    expect(createSession).toHaveBeenCalledTimes(0);
    await expect(manager.getSession({ scopes: new Set(['a']) })).resolves.toBe(
      'a',
    );
    expect(createSession).toHaveBeenCalledTimes(1);
    await expect(manager.getSession({ scopes: new Set(['a']) })).resolves.toBe(
      'a',
    );
    expect(createSession).toHaveBeenCalledTimes(1);
    await expect(manager.getSession({ scopes: new Set(['b']) })).resolves.toBe(
      'a b',
    );
    expect(createSession).toHaveBeenCalledTimes(2);
  });

  it('should remove session and reload', async () => {
    const removeSession = jest.fn();
    const manager = new StaticAuthSessionManager({
      connector: { removeSession },
      ...defaultOptions,
    } as any);

    await manager.removeSession();
    expect(removeSession).toHaveBeenCalled();
    expect(await manager.getSession({ optional: true })).toBe(undefined);
  });
});
