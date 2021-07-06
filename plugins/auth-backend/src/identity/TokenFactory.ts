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

import { TokenIssuer, TokenParams, KeyStore, AnyJWK } from './types';
import { JSONWebKey, JWK, JWS } from 'jose';
import { Logger } from 'winston';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';

const MS_IN_S = 1000;

type Options = {
  logger: Logger;
  /** Value of the issuer claim in issued tokens */
  issuer: string;
  /** Key store used for storing signing keys */
  keyStore: KeyStore;
  /** Expiration time of signing keys in seconds */
  keyDurationSeconds: number;
};

/**
 * A token issuer that is able to issue tokens in a distributed system
 * backed by a single database. Tokens are issued using lazily generated
 * signing keys, where each running instance of the auth service uses its own
 * signing key.
 *
 * The public parts of the keys are all stored in the shared key storage,
 * and any of the instances of the auth service will return the full list
 * of public keys that are currently in storage.
 *
 * Signing keys are automatically rotated at the same interval as the token
 * duration. Expired keys are kept in storage until there are no valid tokens
 * in circulation that could have been signed by that key.
 */
export class TokenFactory implements TokenIssuer {
  private readonly issuer: string;
  private readonly logger: Logger;
  private readonly keyStore: KeyStore;
  private readonly keyDurationSeconds: number;

  private keyExpiry?: Date;
  private privateKeyPromise?: Promise<JSONWebKey>;

  constructor(options: Options) {
    this.issuer = options.issuer;
    this.logger = options.logger;
    this.keyStore = options.keyStore;
    this.keyDurationSeconds = options.keyDurationSeconds;
  }

  async issueToken(params: TokenParams): Promise<string> {
    const key = await this.getKey();

    const iss = this.issuer;
    const sub = params.claims.sub;
    const ent = params.claims.ent;
    const aud = 'backstage';
    const iat = Math.floor(Date.now() / MS_IN_S);
    const exp = iat + this.keyDurationSeconds;

    this.logger.info(`Issuing token for ${sub}, with entities ${ent ?? []}`);

    return JWS.sign({ iss, sub, aud, iat, exp, ent }, key, {
      alg: key.alg,
      kid: key.kid,
    });
  }

  // This will be called by other services that want to verify ID tokens.
  // It is important that it returns a list of all public keys that could
  // have been used to sign tokens that have not yet expired.
  async listPublicKeys(): Promise<{ keys: AnyJWK[] }> {
    const { items: keys } = await this.keyStore.listKeys();

    const validKeys = [];
    const expiredKeys = [];

    for (const key of keys) {
      // Allow for a grace period of another full key duration before we remove the keys from the database
      const expireAt = DateTime.fromJSDate(key.createdAt).plus({
        seconds: 3 * this.keyDurationSeconds,
      });
      if (expireAt < DateTime.local()) {
        expiredKeys.push(key);
      } else {
        validKeys.push(key);
      }
    }

    // Lazily prune expired keys. This may cause duplicate removals if we have concurrent callers, but w/e
    if (expiredKeys.length > 0) {
      const kids = expiredKeys.map(({ key }) => key.kid);

      this.logger.info(`Removing expired signing keys, '${kids.join("', '")}'`);

      // We don't await this, just let it run in the background
      this.keyStore.removeKeys(kids).catch(error => {
        this.logger.error(`Failed to remove expired keys, ${error}`);
      });
    }

    // NOTE: we're currently only storing public keys, but if we start storing private keys we'd have to convert here
    return { keys: validKeys.map(({ key }) => key) };
  }

  private async getKey(): Promise<JSONWebKey> {
    // Make sure that we only generate one key at a time
    if (this.privateKeyPromise) {
      if (
        this.keyExpiry &&
        DateTime.fromJSDate(this.keyExpiry) > DateTime.local()
      ) {
        return this.privateKeyPromise;
      }
      this.logger.info(`Signing key has expired, generating new key`);
      delete this.privateKeyPromise;
    }

    this.keyExpiry = DateTime.utc()
      .plus({
        seconds: this.keyDurationSeconds,
      })
      .toJSDate();
    const promise = (async () => {
      // This generates a new signing key to be used to sign tokens until the next key rotation
      const key = await JWK.generate('EC', 'P-256', {
        use: 'sig',
        kid: uuid(),
        alg: 'ES256',
      });

      // We're not allowed to use the key until it has been successfully stored
      // TODO: some token verification implementations aggressively cache the list of keys, and
      //       don't attempt to fetch new ones even if they encounter an unknown kid. Therefore we
      //       may want to keep using the existing key for some period of time until we switch to
      //       the new one. This also needs to be implemented cross-service though, meaning new services
      //       that boot up need to be able to grab an existing key to use for signing.
      this.logger.info(`Created new signing key ${key.kid}`);
      await this.keyStore.addKey((key.toJWK(false) as unknown) as AnyJWK);

      // At this point we are allowed to start using the new key
      return key as JSONWebKey;
    })();

    this.privateKeyPromise = promise;

    try {
      // If we fail to generate a new key, we need to clear the state so that
      // the next caller will try to generate another key.
      await promise;
    } catch (error) {
      this.logger.error(`Failed to generate new signing key, ${error}`);
      delete this.keyExpiry;
      delete this.privateKeyPromise;
    }

    return promise;
  }
}
