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

import { MutableSessionManager, GetSessionOptions } from './types';
import { AuthConnector } from '../AuthConnector';
import { SessionScopeHelper } from './common';
import { SessionStateTracker } from './SessionStateTracker';

type Options<T> = {
  /** The connector used for acting on the auth session */
  connector: AuthConnector<T>;
  /** Used to get the scope of the session */
  sessionScopes?: (session: T) => Set<string>;
  /** The default scopes that should always be present in a session, defaults to none. */
  defaultScopes?: Set<string>;
};

/**
 * StaticAuthSessionManager manages an underlying session that does not expire.
 */
export class StaticAuthSessionManager<T> implements MutableSessionManager<T> {
  private readonly connector: AuthConnector<T>;
  private readonly helper: SessionScopeHelper<T>;
  private readonly stateTracker = new SessionStateTracker();

  private currentSession: T | undefined;

  constructor(options: Options<T>) {
    const { connector, defaultScopes = new Set(), sessionScopes } = options;

    this.connector = connector;
    this.helper = new SessionScopeHelper({ sessionScopes, defaultScopes });
  }

  setSession(session: T | undefined): void {
    this.currentSession = session;
    this.stateTracker.setIsSignedIn(Boolean(session));
  }

  async getSession(options: GetSessionOptions): Promise<T | undefined> {
    if (
      this.helper.sessionExistsAndHasScope(this.currentSession, options.scopes)
    ) {
      return this.currentSession;
    }

    // If we continue here we will show a popup, so exit if this is an optional session request.
    if (options.optional) {
      return undefined;
    }

    // We can call authRequester multiple times, the returned session will contain all requested scopes.
    this.currentSession = await this.connector.createSession({
      ...options,
      scopes: this.helper.getExtendedScope(this.currentSession, options.scopes),
    });
    this.stateTracker.setIsSignedIn(true);
    return this.currentSession;
  }

  async removeSession() {
    this.currentSession = undefined;
    await this.connector.removeSession();
    this.stateTracker.setIsSignedIn(false);
  }

  sessionState$() {
    return this.stateTracker.sessionState$();
  }
}
