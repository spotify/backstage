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

import {
  AuthRequester,
  OAuthRequestApi,
  AuthProvider,
  DiscoveryApi,
} from '@backstage/core-plugin-api';
import { showLoginPopup } from '../loginPopup';
import { AuthConnector, CreateSessionOptions } from './types';

type Options<AuthSession> = {
  /**
   * DiscoveryApi instance used to locate the auth backend endpoint.
   */
  discoveryApi: DiscoveryApi;
  /**
   * Environment hint passed on to auth backend, for example 'production' or 'development'
   */
  environment: string;
  /**
   * Information about the auth provider to be shown to the user.
   * The ID Must match the backend auth plugin configuration, for example 'google'.
   */
  provider: AuthProvider & { id: string };
  /**
   * API used to instantiate an auth requester.
   */
  oauthRequestApi: OAuthRequestApi;
  /**
   * Function used to join together a set of scopes, defaults to joining with a space character.
   */
  joinScopes?: (scopes: Set<string>) => string;
  /**
   * Function used to transform an auth response into the session type.
   */
  sessionTransform?(response: any): AuthSession | Promise<AuthSession>;
};

function defaultJoinScopes(scopes: Set<string>) {
  return [...scopes].join(' ');
}

/**
 * DefaultAuthConnector is the default auth connector in Backstage. It talks to the
 * backend auth plugin through the standardized API, and requests user permission
 * via the OAuthRequestApi.
 */
export class DefaultAuthConnector<AuthSession>
  implements AuthConnector<AuthSession> {
  private readonly discoveryApi: DiscoveryApi;
  private readonly environment: string;
  private readonly provider: AuthProvider & { id: string };
  private readonly joinScopesFunc: (scopes: Set<string>) => string;
  private readonly authRequester: AuthRequester<AuthSession>;
  private readonly sessionTransform: (response: any) => Promise<AuthSession>;

  constructor(options: Options<AuthSession>) {
    const {
      discoveryApi,
      environment,
      provider,
      joinScopes = defaultJoinScopes,
      oauthRequestApi,
      sessionTransform = id => id,
    } = options;

    this.authRequester = oauthRequestApi.createAuthRequester({
      provider,
      onAuthRequest: scopes => this.showPopup(scopes),
    });

    this.discoveryApi = discoveryApi;
    this.environment = environment;
    this.provider = provider;
    this.joinScopesFunc = joinScopes;
    this.sessionTransform = sessionTransform;
  }

  async createSession(options: CreateSessionOptions): Promise<AuthSession> {
    if (options.instantPopup) {
      return this.showPopup(options.scopes);
    }
    return this.authRequester(options.scopes);
  }

  async refreshSession(): Promise<any> {
    const res = await fetch(
      await this.buildUrl('/refresh', { optional: true }),
      {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
        credentials: 'include',
      },
    ).catch(error => {
      throw new Error(`Auth refresh request failed, ${error}`);
    });

    if (!res.ok) {
      const error: any = new Error(
        `Auth refresh request failed, ${res.statusText}`,
      );
      error.status = res.status;
      throw error;
    }

    const authInfo = await res.json();

    if (authInfo.error) {
      const error = new Error(authInfo.error.message);
      if (authInfo.error.name) {
        error.name = authInfo.error.name;
      }
      throw error;
    }
    return await this.sessionTransform(authInfo);
  }

  async removeSession(): Promise<void> {
    const res = await fetch(await this.buildUrl('/logout'), {
      method: 'POST',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    }).catch(error => {
      throw new Error(`Logout request failed, ${error}`);
    });

    if (!res.ok) {
      const error: any = new Error(`Logout request failed, ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
  }

  private async showPopup(scopes: Set<string>): Promise<AuthSession> {
    const scope = this.joinScopesFunc(scopes);
    const popupUrl = await this.buildUrl('/start', { scope });

    const payload = await showLoginPopup({
      url: popupUrl,
      name: `${this.provider.title} Login`,
      origin: new URL(popupUrl).origin,
      width: 450,
      height: 730,
    });

    return await this.sessionTransform(payload);
  }

  private async buildUrl(
    path: string,
    query?: { [key: string]: string | boolean | undefined },
  ): Promise<string> {
    const baseUrl = await this.discoveryApi.getBaseUrl('auth');
    const queryString = this.buildQueryString({
      ...query,
      env: this.environment,
    });

    return `${baseUrl}/${this.provider.id}${path}${queryString}`;
  }

  private buildQueryString(query?: {
    [key: string]: string | boolean | undefined;
  }): string {
    if (!query) {
      return '';
    }

    const queryString = Object.entries<string | boolean | undefined>(query)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        } else if (value) {
          return encodeURIComponent(key);
        }
        return undefined;
      })
      .filter(Boolean)
      .join('&');

    if (!queryString) {
      return '';
    }
    return `?${queryString}`;
  }
}
