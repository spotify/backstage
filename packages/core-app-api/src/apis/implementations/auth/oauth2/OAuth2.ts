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

import OAuth2Icon from '@material-ui/icons/AcUnit';
import { DefaultAuthConnector } from '../../../../lib/AuthConnector';
import { RefreshingAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import {
  AuthRequestOptions,
  BackstageIdentity,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfo,
  ProfileInfoApi,
  SessionState,
  SessionApi,
  BackstageIdentityApi,
  Observable,
} from '@backstage/core-plugin-api';
import { OAuth2Session } from './types';
import { OAuthApiCreateOptions } from '../types';

type Options = {
  sessionManager: SessionManager<OAuth2Session>;
  scopeTransform: (scopes: string[]) => string[];
};

type CreateOptions = OAuthApiCreateOptions & {
  scopeTransform?: (scopes: string[]) => string[];
};

export type OAuth2Response = {
  providerInfo: {
    accessToken: string;
    idToken: string;
    scope: string;
    expiresInSeconds: number;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
};

const DEFAULT_PROVIDER = {
  id: 'oauth2',
  title: 'Your Identity Provider',
  icon: OAuth2Icon,
};

class OAuth2
  implements
    OAuthApi,
    OpenIdConnectApi,
    ProfileInfoApi,
    BackstageIdentityApi,
    SessionApi {
  static create({
    discoveryApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
    defaultScopes = [],
    scopeTransform = x => x,
  }: CreateOptions) {
    const connector = new DefaultAuthConnector({
      discoveryApi,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: OAuth2Response): OAuth2Session {
        return {
          ...res,
          providerInfo: {
            idToken: res.providerInfo.idToken,
            accessToken: res.providerInfo.accessToken,
            scopes: OAuth2.normalizeScopes(
              scopeTransform,
              res.providerInfo.scope,
            ),
            expiresAt: new Date(
              Date.now() + res.providerInfo.expiresInSeconds * 1000,
            ),
          },
        };
      },
    });

    const sessionManager = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set(defaultScopes),
      sessionScopes: (session: OAuth2Session) => session.providerInfo.scopes,
      sessionShouldRefresh: (session: OAuth2Session) => {
        const expiresInSec =
          (session.providerInfo.expiresAt.getTime() - Date.now()) / 1000;
        return expiresInSec < 60 * 5;
      },
    });

    return new OAuth2({ sessionManager, scopeTransform });
  }

  private readonly sessionManager: SessionManager<OAuth2Session>;
  private readonly scopeTransform: (scopes: string[]) => string[];

  constructor(options: Options) {
    this.sessionManager = options.sessionManager;
    this.scopeTransform = options.scopeTransform;
  }

  async signIn() {
    await this.getAccessToken();
  }

  async signOut() {
    await this.sessionManager.removeSession();
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  async getAccessToken(
    scope?: string | string[],
    options?: AuthRequestOptions,
  ) {
    const normalizedScopes = OAuth2.normalizeScopes(this.scopeTransform, scope);
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: normalizedScopes,
    });
    return session?.providerInfo.accessToken ?? '';
  }

  async getIdToken(options: AuthRequestOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    return session?.providerInfo.idToken ?? '';
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

  private static normalizeScopes(
    scopeTransform: (scopes: string[]) => string[],
    scopes?: string | string[],
  ): Set<string> {
    if (!scopes) {
      return new Set();
    }

    const scopeList = Array.isArray(scopes)
      ? scopes
      : scopes.split(/[\s|,]/).filter(Boolean);

    return new Set(scopeTransform(scopeList));
  }
}

export default OAuth2;
