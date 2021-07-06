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

import fetch from 'cross-fetch';
import { JWK, JWT, JWKS, JSONWebKey } from 'jose';
import { BackstageIdentity } from '../providers';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

const CLOCK_MARGIN_S = 10;

/**
 * A identity client to interact with auth-backend
 * and authenticate backstage identity tokens
 *
 * @experimental This is not a stable API yet
 */
export class IdentityClient {
  private readonly discovery: PluginEndpointDiscovery;
  private readonly issuer: string;
  private keyStore: JWKS.KeyStore;
  private keyStoreUpdated: number;

  constructor(options: { discovery: PluginEndpointDiscovery; issuer: string }) {
    this.discovery = options.discovery;
    this.issuer = options.issuer;
    this.keyStore = new JWKS.KeyStore();
    this.keyStoreUpdated = 0;
  }

  /**
   * Verifies the given backstage identity token
   * Returns a BackstageIdentity (user) matching the token.
   * The method throws an error if verification fails.
   */
  async authenticate(token: string | undefined): Promise<BackstageIdentity> {
    // Extract token from header
    if (!token) {
      throw new Error('No token specified');
    }
    // Get signing key matching token
    const key = await this.getKey(token);
    if (!key) {
      throw new Error('No signing key matching token found');
    }
    // Verify token claims and signature
    // Note: Claims must match those set by TokenFactory when issuing tokens
    // Note: verify throws if verification fails
    const decoded = JWT.IdToken.verify(token, key, {
      algorithms: ['ES256'],
      audience: 'backstage',
      issuer: this.issuer,
    }) as { sub: string };
    // Verified, return the matching user as BackstageIdentity
    // TODO: Settle internal user format/properties
    const user: BackstageIdentity = {
      id: decoded.sub,
      idToken: token,
    };
    return user;
  }

  /**
   * Parses the given authorization header and returns
   * the bearer token, or null if no bearer token is given
   */
  static getBearerToken(
    authorizationHeader: string | undefined,
  ): string | undefined {
    if (typeof authorizationHeader !== 'string') {
      return undefined;
    }
    const matches = authorizationHeader.match(/Bearer\s+(\S+)/i);
    return matches?.[1];
  }

  /**
   * Returns the public signing key matching the given jwt token,
   * or null if no matching key was found
   */
  private async getKey(rawJwtToken: string): Promise<JWK.Key | null> {
    const { header, payload } = JWT.decode(rawJwtToken, {
      complete: true,
    }) as {
      header: { kid: string };
      payload: { iat: number };
    };

    // Refresh public keys if needed
    // Add a small margin in case clocks are out of sync
    const keyStoreHasKey = !!this.keyStore.get({ kid: header.kid });
    const issuedAfterLastRefresh =
      payload?.iat && payload.iat > this.keyStoreUpdated - CLOCK_MARGIN_S;
    if (!keyStoreHasKey && issuedAfterLastRefresh) {
      await this.refreshKeyStore();
    }

    return this.keyStore.get({ kid: header.kid });
  }

  /**
   * Lists public part of keys used to sign Backstage Identity tokens
   */
  async listPublicKeys(): Promise<{
    keys: JSONWebKey[];
  }> {
    const url = `${await this.discovery.getBaseUrl(
      'auth',
    )}/.well-known/jwks.json`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    const publicKeys: { keys: JSONWebKey[] } = await response.json();

    return publicKeys;
  }

  /**
   * Fetches public keys and caches them locally
   */
  private async refreshKeyStore(): Promise<void> {
    const now = Date.now() / 1000;
    const publicKeys = await this.listPublicKeys();
    this.keyStore = JWKS.asKeyStore({
      keys: publicKeys.keys.map(key => key as JSONWebKey),
    });
    this.keyStoreUpdated = now;
  }
}
