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

/** Represents any form of serializable JWK */
export interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}

/** Parameters used to issue new ID Tokens */
export type TokenParams = {
  /** The claims that will be embedded within the token */
  claims: {
    /** The token subject, i.e. User ID */
    sub: string;
    /** A list of entity references that the user claims ownership through */
    ent?: string[];
  };
};

/**
 * A TokenIssuer is able to issue verifiable ID Tokens on demand.
 */
export type TokenIssuer = {
  /**
   * Issues a new ID Token
   */
  issueToken(params: TokenParams): Promise<string>;

  /**
   * List all public keys that are currently being used to sign tokens, or have been used
   * in the past within the token expiration time, including a grace period.
   */
  listPublicKeys(): Promise<{ keys: AnyJWK[] }>;
};

/**
 * A JWK stored by a KeyStore
 */
export type StoredKey = {
  key: AnyJWK;
  createdAt: Date;
};

/**
 * A KeyStore stores JWKs for later and shared use.
 */
export type KeyStore = {
  /**
   * Store a new key to be used for signing.
   */
  addKey(key: AnyJWK): Promise<void>;

  /**
   * Remove all keys with the provided kids.
   */
  removeKeys(kids: string[]): Promise<void>;

  /**
   * List all stored keys.
   */
  listKeys(): Promise<{ items: StoredKey[] }>;
};
