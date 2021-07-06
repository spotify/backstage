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

import { ApiRef, createApiRef } from '../system';
import { Observable } from '../../types';

/**
 * This file contains declarations for common interfaces of auth-related APIs.
 * The declarations should be used to signal which type of authentication and
 * authorization methods each separate auth provider supports.
 *
 * For example, a Google OAuth provider that supports OAuth 2 and OpenID Connect,
 * would be declared as follows:
 *
 * const googleAuthApiRef = createApiRef<OAuthApi & OpenIDConnectApi>({ ... })
 */

/**
 * An array of scopes, or a scope string formatted according to the
 * auth provider, which is typically a space separated list.
 *
 * See the documentation for each auth provider for the list of scopes
 * supported by each provider.
 */
export type OAuthScope = string | string[];

export type AuthRequestOptions = {
  /**
   * If this is set to true, the user will not be prompted to log in,
   * and an empty response will be returned if there is no existing session.
   *
   * This can be used to perform a check whether the user is logged in, or if you don't
   * want to force a user to be logged in, but provide functionality if they already are.
   *
   * @default false
   */
  optional?: boolean;

  /**
   * If this is set to true, the request will bypass the regular oauth login modal
   * and open the login popup directly.
   *
   * The method must be called synchronously from a user action for this to work in all browsers.
   *
   * @default false
   */
  instantPopup?: boolean;
};

/**
 * This API provides access to OAuth 2 credentials. It lets you request access tokens,
 * which can be used to act on behalf of the user when talking to APIs.
 */
export type OAuthApi = {
  /**
   * Requests an OAuth 2 Access Token, optionally with a set of scopes. The access token allows
   * you to make requests on behalf of the user, and the copes may grant you broader access, depending
   * on the auth provider.
   *
   * Each auth provider has separate handling of scope, so you need to look at the documentation
   * for each one to know what scope you need to request.
   *
   * This method is cheap and should be called each time an access token is used. Do not for example
   * store the access token in React component state, as that could cause the token to expire. Instead
   * fetch a new access token for each request.
   *
   * Be sure to include all required scopes when requesting an access token. When testing your implementation
   * it is best to log out the Backstage session and then visit your plugin page directly, as
   * you might already have some required scopes in your existing session. Not requesting the correct
   * scopes can lead to 403 or other authorization errors, which can be tricky to debug.
   *
   * If the user has not yet granted access to the provider and the set of requested scopes, the user
   * will be prompted to log in. The returned promise will not resolve until the user has
   * successfully logged in. The returned promise can be rejected, but only if the user rejects the login request.
   */
  getAccessToken(
    scope?: OAuthScope,
    options?: AuthRequestOptions,
  ): Promise<string>;
};

/**
 * This API provides access to OpenID Connect credentials. It lets you request ID tokens,
 * which can be passed to backend services to prove the user's identity.
 */
export type OpenIdConnectApi = {
  /**
   * Requests an OpenID Connect ID Token.
   *
   * This method is cheap and should be called each time an ID token is used. Do not for example
   * store the id token in React component state, as that could cause the token to expire. Instead
   * fetch a new id token for each request.
   *
   * If the user has not yet logged in to Google inside Backstage, the user will be prompted
   * to log in. The returned promise will not resolve until the user has successfully logged in.
   * The returned promise can be rejected, but only if the user rejects the login request.
   */
  getIdToken(options?: AuthRequestOptions): Promise<string>;
};

/**
 * This API provides access to profile information of the user from an auth provider.
 */
export type ProfileInfoApi = {
  /**
   * Get profile information for the user as supplied by this auth provider.
   *
   * If the optional flag is not set, a session is guaranteed to be returned, while if
   * the optional flag is set, the session may be undefined. See @AuthRequestOptions for more details.
   */
  getProfile(options?: AuthRequestOptions): Promise<ProfileInfo | undefined>;
};

/**
 * This API provides access to the user's identity within Backstage.
 *
 * An auth provider that implements this interface can be used to sign-in to backstage. It is
 * not intended to be used directly from a plugin, but instead serves as a connection between
 * this authentication method and the app's @IdentityApi
 */
export type BackstageIdentityApi = {
  /**
   * Get the user's identity within Backstage. This should normally not be called directly,
   * use the @IdentityApi instead.
   *
   * If the optional flag is not set, a session is guaranteed to be returned, while if
   * the optional flag is set, the session may be undefined. See @AuthRequestOptions for more details.
   */
  getBackstageIdentity(
    options?: AuthRequestOptions,
  ): Promise<BackstageIdentity | undefined>;
};

export type BackstageIdentity = {
  /**
   * The backstage user ID.
   */
  id: string;

  /**
   * An ID token that can be used to authenticate the user within Backstage.
   */
  idToken: string;
};

/**
 * Profile information of the user.
 */
export type ProfileInfo = {
  /**
   * Email ID.
   */
  email?: string;

  /**
   * Display name that can be presented to the user.
   */
  displayName?: string;

  /**
   * URL to an avatar image of the user.
   */
  picture?: string;
};

/**
 * Session state values passed to subscribers of the SessionApi.
 */
export enum SessionState {
  SignedIn = 'SignedIn',
  SignedOut = 'SignedOut',
}

/**
 * The SessionApi provides basic controls for any auth provider that is tied to a persistent session.
 */
export type SessionApi = {
  /**
   * Sign in with a minimum set of permissions.
   */
  signIn(): Promise<void>;

  /**
   * Sign out from the current session. This will reload the page.
   */
  signOut(): Promise<void>;

  /**
   * Observe the current state of the auth session. Emits the current state on subscription.
   */
  sessionState$(): Observable<SessionState>;
};

/**
 * Provides authentication towards Google APIs and identities.
 *
 * See https://developers.google.com/identity/protocols/googlescopes for a full list of supported scopes.
 *
 * Note that the ID token payload is only guaranteed to contain the user's numerical Google ID,
 * email and expiration information. Do not rely on any other fields, as they might not be present.
 */
export const googleAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'core.auth.google',
});

/**
 * Provides authentication towards GitHub APIs.
 *
 * See https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/
 * for a full list of supported scopes.
 */
export const githubAuthApiRef: ApiRef<
  OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'core.auth.github',
});

/**
 * Provides authentication towards Okta APIs.
 *
 * See https://developer.okta.com/docs/guides/implement-oauth-for-okta/scopes/
 * for a full list of supported scopes.
 */
export const oktaAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'core.auth.okta',
});

/**
 * Provides authentication towards GitLab APIs.
 *
 * See https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#limiting-scopes-of-a-personal-access-token
 * for a full list of supported scopes.
 */
export const gitlabAuthApiRef: ApiRef<
  OAuthApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'core.auth.gitlab',
});

/**
 * Provides authentication towards Auth0 APIs.
 *
 * See https://auth0.com/docs/scopes/current/oidc-scopes
 * for a full list of supported scopes.
 */
export const auth0AuthApiRef: ApiRef<
  OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'core.auth.auth0',
});

/**
 * Provides authentication towards Microsoft APIs and identities.
 *
 * For more info and a full list of supported scopes, see:
 * - https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
 * - https://docs.microsoft.com/en-us/graph/permissions-reference
 */
export const microsoftAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'core.auth.microsoft',
});

/**
 * Provides authentication for custom identity providers.
 */
export const oauth2ApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'core.auth.oauth2',
});

/**
 * Provides authentication for custom OpenID Connect identity providers.
 */
export const oidcAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'core.auth.oidc',
});

/**
 * Provides authentication for saml based identity providers
 */
export const samlAuthApiRef: ApiRef<
  ProfileInfoApi & BackstageIdentityApi & SessionApi
> = createApiRef({
  id: 'core.auth.saml',
});

export const oneloginAuthApiRef: ApiRef<
  OAuthApi &
    OpenIdConnectApi &
    ProfileInfoApi &
    BackstageIdentityApi &
    SessionApi
> = createApiRef({
  id: 'core.auth.onelogin',
});
