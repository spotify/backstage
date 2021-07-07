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

import { JWK, JWT, JWKS, JSONWebKey } from 'jose';
import { Logger } from 'winston';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { BackstageIdentity } from '../providers';
import { DatabaseKeyStore } from './DatabaseKeyStore';
import { TokenFactory } from './TokenFactory';
import { TokenParams } from './types';

const CLOCK_MARGIN_S = 10;

/**
 * A identity client to interact with auth-backend
 * and authenticate backstage identity tokens
 *
 * @experimental This is not a stable API yet
 */
export class IdentityClient {
  static async create(options: {
    database: PluginDatabaseManager;
    discovery: PluginEndpointDiscovery;
    logger: Logger;
  }): Promise<IdentityClient> {
    const issuer = await options.discovery.getExternalBaseUrl('auth');
    return new IdentityClient(
      issuer,
      new TokenFactory({
        issuer: issuer,
        logger: options.logger.child({ component: 'token-factory' }),
        keyStore: await DatabaseKeyStore.create({
          database: await options.database.getClient(),
        }),
        keyDurationSeconds: 3600,
      }),
      new JWKS.KeyStore(),
      0,
    );
  }

  constructor(
    private readonly issuer: string,
    private readonly tokenFactory: TokenFactory,
    private publicKeyStore: JWKS.KeyStore,
    private publicKeyStoreUpdated: number,
  ) {
    // Clearly throw to identify breaking change from earlier version
    if (typeof tokenFactory === 'undefined') {
      throw Error('tokenFactory required when initializing IdentityClient');
    }
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
   * Issues a backstage identity token that can be used
   * to authenticate server to server requests.
   * This should be used with care - use default flows to
   * authenticate users and forward their tokens where appropriate instead
   */
  async issueToken(params: TokenParams): Promise<string> {
    if (typeof params.claims?.sub === 'undefined') {
      throw Error('claims.sub required when issuing token');
    }
    return this.tokenFactory.issueToken(params);
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
    const keyStoreHasKey = !!this.publicKeyStore.get({ kid: header.kid });
    const issuedAfterLastRefresh =
      payload?.iat && payload.iat > this.publicKeyStoreUpdated - CLOCK_MARGIN_S;
    if (!keyStoreHasKey && issuedAfterLastRefresh) {
      await this.refreshKeyStore();
    }

    return this.publicKeyStore.get({ kid: header.kid });
  }

  /**
   * Lists public part of keys used to sign Backstage Identity tokens
   */
  async listPublicKeys(): Promise<{
    keys: JSONWebKey[];
  }> {
    return (await this.tokenFactory.listPublicKeys()) as { keys: JSONWebKey[] };
  }

  /**
   * Fetches public keys and caches them locally
   */
  private async refreshKeyStore(): Promise<void> {
    const now = Date.now() / 1000;
    const publicKeys = await this.listPublicKeys();
    this.publicKeyStore = JWKS.asKeyStore({
      keys: publicKeys.keys.map(key => key as JSONWebKey),
    });
    this.publicKeyStoreUpdated = now;
  }
}
