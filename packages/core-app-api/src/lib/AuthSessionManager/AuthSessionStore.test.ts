/*
 * Copyright 2020 Spotify AB
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
import { AuthSessionStore } from './AuthSessionStore';
import { SessionManager } from './types';

const defaultOptions = {
  storageKey: 'my-key',
  sessionScopes: (session: string) => new Set(session.split(' ')),
};

class LocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

class MockManager implements SessionManager<string> {
  setSession = jest.fn();
  getSession = jest.fn();
  removeSession = jest.fn();
  sessionState$ = jest.fn();
}

describe('GheAuth AuthSessionStore', () => {
  beforeEach(() => {
    delete (window as any).localStorage;
    (window as any).localStorage = new LocalStorage();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should load session', async () => {
    localStorage.setItem('my-key', '"a b c"');

    const manager = new MockManager();
    const store = new AuthSessionStore({ manager, ...defaultOptions });

    await expect(store.getSession({})).resolves.toBe('a b c');
    expect(manager.getSession).not.toHaveBeenCalled();
    expect(manager.setSession).toHaveBeenCalledWith('a b c');
  });

  it('should not use session without enough scope', async () => {
    localStorage.setItem('my-key', '"a b c"');

    const manager = new MockManager();
    manager.getSession.mockResolvedValue('a b c d');
    const store = new AuthSessionStore({ manager, ...defaultOptions });

    await expect(store.getSession({ scopes: new Set(['d']) })).resolves.toBe(
      'a b c d',
    );
    expect(manager.getSession).toHaveBeenCalledTimes(1);
    expect(manager.setSession).not.toHaveBeenCalled();
  });

  it('should not use expired session', async () => {
    localStorage.setItem('my-key', '"a b c"');

    const manager = new MockManager();
    manager.getSession.mockResolvedValue('123');
    const store = new AuthSessionStore({
      manager,
      ...defaultOptions,
      sessionShouldRefresh: () => true,
    });

    await expect(store.getSession({})).resolves.toBe('123');
    expect(manager.getSession).toHaveBeenCalledTimes(1);
    expect(manager.setSession).not.toHaveBeenCalled();
  });

  it('should not load missing session', async () => {
    const manager = new MockManager();
    manager.getSession.mockResolvedValue('123');
    const store = new AuthSessionStore({ manager, ...defaultOptions });

    await expect(store.getSession({})).resolves.toBe('123');
    expect(manager.getSession).toHaveBeenCalledTimes(1);
    expect(manager.setSession).not.toHaveBeenCalled();

    expect(localStorage.getItem('my-key')).toBe('"123"');
  });

  it('should ignore bad session values', async () => {
    localStorage.setItem('my-key', 'derp');

    const manager = new MockManager();
    manager.getSession.mockResolvedValue('123');
    const store = new AuthSessionStore({ manager, ...defaultOptions });

    await expect(store.getSession({})).resolves.toBe('123');
    expect(manager.getSession).toHaveBeenCalledTimes(1);
    expect(manager.setSession).not.toHaveBeenCalled();
  });

  it('should clear session', () => {
    localStorage.setItem('my-key', '"a b c"');

    const manager = new MockManager();
    const store = new AuthSessionStore({ manager, ...defaultOptions });
    store.removeSession();

    expect(localStorage.getItem('my-key')).toBe(null);
    expect(manager.removeSession).toHaveBeenCalled();
  });

  it('should forward sessionState calls', () => {
    const manager = new MockManager();
    const store = new AuthSessionStore({ manager, ...defaultOptions });
    store.sessionState$();
    expect(manager.sessionState$).toHaveBeenCalled();
  });
});
