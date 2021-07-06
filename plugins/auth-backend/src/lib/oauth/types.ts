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

import express from 'express';
import { Profile as PassportProfile } from 'passport';
import { AuthResponse, RedirectInfo } from '../../providers/types';

/**
 * Common options for passport.js-based OAuth providers
 */
export type OAuthProviderOptions = {
  /**
   * Client ID of the auth provider.
   */
  clientId: string;
  /**
   * Client Secret of the auth provider.
   */
  clientSecret: string;
  /**
   * Callback URL to be passed to the auth provider to redirect to after the user signs in.
   */
  callbackUrl: string;
};

export type OAuthResult = {
  fullProfile: PassportProfile;
  params: {
    id_token?: string;
    scope: string;
    expires_in: number;
  };
  accessToken: string;
  refreshToken?: string;
};

export type OAuthResponse = AuthResponse<OAuthProviderInfo>;

export type OAuthProviderInfo = {
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  /**
   * (Optional) Id token issued for the signed in user.
   */
  idToken?: string;
  /**
   * Expiry of the access token in seconds.
   */
  expiresInSeconds?: number;
  /**
   * Scopes granted for the access token.
   */
  scope: string;
  /**
   * A refresh token issued for the signed in user
   */
  refreshToken?: string;
};

export type OAuthState = {
  /* A type for the serialized value in the `state` parameter of the OAuth authorization flow
   */
  nonce: string;
  env: string;
};

export type OAuthStartRequest = express.Request<{}> & {
  scope: string;
  state: OAuthState;
};

export type OAuthRefreshRequest = express.Request<{}> & {
  scope: string;
  refreshToken: string;
};

/**
 * Any OAuth provider needs to implement this interface which has provider specific
 * handlers for different methods to perform authentication, get access tokens,
 * refresh tokens and perform sign out.
 */
export interface OAuthHandlers {
  /**
   * This method initiates a sign in request with an auth provider.
   * @param {express.Request} req
   * @param options
   */
  start(req: OAuthStartRequest): Promise<RedirectInfo>;

  /**
   * Handles the redirect from the auth provider when the user has signed in.
   * @param {express.Request} req
   */
  handler(
    req: express.Request,
  ): Promise<{
    response: AuthResponse<OAuthProviderInfo>;
    refreshToken?: string;
  }>;

  /**
   * (Optional) Given a refresh token and scope fetches a new access token from the auth provider.
   * @param {string} refreshToken
   * @param {string} scope
   */
  refresh?(req: OAuthRefreshRequest): Promise<AuthResponse<OAuthProviderInfo>>;

  /**
   * (Optional) Sign out of the auth provider.
   */
  logout?(): Promise<void>;
}
