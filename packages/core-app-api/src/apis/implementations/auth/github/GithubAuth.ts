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

import GithubIcon from '@material-ui/icons/AcUnit';
import { DefaultAuthConnector } from '../../../../lib/AuthConnector';
import { GithubSession } from './types';
import {
  OAuthApi,
  SessionApi,
  SessionState,
  ProfileInfo,
  BackstageIdentity,
  AuthRequestOptions,
  Observable,
} from '@backstage/core-plugin-api';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import {
  AuthSessionStore,
  StaticAuthSessionManager,
} from '../../../../lib/AuthSessionManager';
import { OAuthApiCreateOptions } from '../types';

export type GithubAuthResponse = {
  providerInfo: {
    accessToken: string;
    scope: string;
    expiresInSeconds: number;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
};

const DEFAULT_PROVIDER = {
  id: 'github',
  title: 'GitHub',
  icon: GithubIcon,
};

class GithubAuth implements OAuthApi, SessionApi {
  static create({
    discoveryApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
    defaultScopes = ['read:user'],
  }: OAuthApiCreateOptions) {
    const connector = new DefaultAuthConnector({
      discoveryApi,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: GithubAuthResponse): GithubSession {
        return {
          ...res,
          providerInfo: {
            accessToken: res.providerInfo.accessToken,
            scopes: GithubAuth.normalizeScope(res.providerInfo.scope),
            expiresAt: new Date(
              Date.now() + res.providerInfo.expiresInSeconds * 1000,
            ),
          },
        };
      },
    });

    const sessionManager = new StaticAuthSessionManager({
      connector,
      defaultScopes: new Set(defaultScopes),
      sessionScopes: (session: GithubSession) => session.providerInfo.scopes,
    });

    const authSessionStore = new AuthSessionStore<GithubSession>({
      manager: sessionManager,
      storageKey: `${provider.id}Session`,
      sessionScopes: (session: GithubSession) => session.providerInfo.scopes,
    });

    return new GithubAuth(authSessionStore);
  }

  constructor(private readonly sessionManager: SessionManager<GithubSession>) {}

  async signIn() {
    await this.getAccessToken();
  }

  async signOut() {
    await this.sessionManager.removeSession();
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  async getAccessToken(scope?: string, options?: AuthRequestOptions) {
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: GithubAuth.normalizeScope(scope),
    });
    return session?.providerInfo.accessToken ?? '';
  }

  async getBackstageIdentity(
    options: AuthRequestOptions = {},
  ): Promise<BackstageIdentity | undefined> {
    const session = await this.sessionManager.getSession(options);
    return session?.backstageIdentity;
  }

  async getProfile(options: AuthRequestOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    return session?.profile;
  }

  static normalizeScope(scope?: string): Set<string> {
    if (!scope) {
      return new Set();
    }

    const scopeList = Array.isArray(scope)
      ? scope
      : scope.split(/[\s|,]/).filter(Boolean);

    return new Set(scopeList);
  }
}
export default GithubAuth;
