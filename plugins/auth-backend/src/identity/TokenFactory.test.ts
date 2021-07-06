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

import { MemoryKeyStore } from './MemoryKeyStore';
import { TokenFactory } from './TokenFactory';
import { getVoidLogger } from '@backstage/backend-common';
import { JWKS, JSONWebKey, JWT } from 'jose';

const logger = getVoidLogger();

function jwtKid(jwt: string): string {
  const { header } = JWT.decode(jwt, { complete: true }) as {
    header: { kid: string };
  };
  return header.kid;
}

describe('TokenFactory', () => {
  it('should issue valid tokens signed by a listed key', async () => {
    const keyDurationSeconds = 5;
    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds,
      logger,
    });

    await expect(factory.listPublicKeys()).resolves.toEqual({ keys: [] });
    const token = await factory.issueToken({ claims: { sub: 'foo' } });

    const { keys } = await factory.listPublicKeys();
    const keyStore = JWKS.asKeyStore({
      keys: keys.map(key => key as JSONWebKey),
    });

    const payload = JWT.verify(token, keyStore) as object & {
      iat: number;
      exp: number;
    };
    expect(payload).toEqual({
      iss: 'my-issuer',
      aud: 'backstage',
      sub: 'foo',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    expect(payload.exp).toBe(payload.iat + keyDurationSeconds);
  });

  it('should generate new signing keys when the current one expires', async () => {
    const fixedTime = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => fixedTime);

    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds: 5,
      logger,
    });

    const token1 = await factory.issueToken({ claims: { sub: 'foo' } });
    const token2 = await factory.issueToken({ claims: { sub: 'foo' } });
    expect(jwtKid(token1)).toBe(jwtKid(token2));

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [
        expect.objectContaining({
          kid: jwtKid(token1),
        }),
      ],
    });

    jest.spyOn(Date, 'now').mockImplementation(() => fixedTime + 60000);

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [],
    });

    const token3 = await factory.issueToken({ claims: { sub: 'foo' } });
    expect(jwtKid(token3)).not.toBe(jwtKid(token2));

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [
        expect.objectContaining({
          kid: jwtKid(token3),
        }),
      ],
    });
  });
});
