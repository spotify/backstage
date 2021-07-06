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

import { Observable, SessionState } from '@backstage/core-plugin-api';

export type GetSessionOptions = {
  optional?: boolean;
  instantPopup?: boolean;
  scopes?: Set<string>;
};

/**
 * A sessions manager keeps track of the current session and makes sure that
 * multiple simultaneous requests for sessions with different scope are handled
 * in a correct way.
 */
export type SessionManager<T> = {
  getSession(options: GetSessionOptions): Promise<T | undefined>;

  removeSession(): Promise<void>;

  sessionState$(): Observable<SessionState>;
};

/**
 * An extension of the session manager where the session can also be pushed from the manager.
 */
export interface MutableSessionManager<T> extends SessionManager<T> {
  setSession(session: T | undefined): void;
}

/**
 * A function called to determine the scopes of a session.
 */
export type SessionScopesFunc<T> = (session: T) => Set<string>;

/**
 * A function called to determine whether it's time for a session to refresh.
 *
 * This should return true before the session expires, for example, if a session
 * expires after 60 minutes, you could return true if the session is older than 45 minutes.
 */
export type SessionShouldRefreshFunc<T> = (session: T) => boolean;
