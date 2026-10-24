/*
 * Copyright 2026 The Backstage Authors
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

import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { authenticateWebSocket } from './authenticateWebSocket';

function request(headers: IncomingMessage['headers']): IncomingMessage {
  const req = new IncomingMessage(new Socket());
  req.headers = headers;
  return req;
}

describe('authenticateWebSocket', () => {
  it('tries opaque protocol values in order and enforces principal policies', async () => {
    const auth = mockServices.auth();
    const authenticate = jest.spyOn(auth, 'authenticate');
    const config = mockServices.rootConfig();
    const req = request({
      'sec-websocket-protocol': `application, ${mockCredentials.service.token()}, ${mockCredentials.user.token()}`,
    });
    await expect(
      authenticateWebSocket({ auth, config, request: req, authPolicy: 'user' }),
    ).resolves.toEqual({
      credentials: mockCredentials.user(),
      authProtocol: mockCredentials.user.token(),
    });
    expect(authenticate.mock.calls.map(([token]) => token)).toEqual([
      'application',
      mockCredentials.service.token(),
      mockCredentials.user.token(),
    ]);
    authenticate.mockClear();
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'authenticated',
      }),
    ).resolves.toEqual({
      credentials: mockCredentials.service(),
      authProtocol: mockCredentials.service.token(),
    });
    expect(authenticate).toHaveBeenCalledTimes(2);
    req.headers.authorization = mockCredentials.user.header();
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'authenticated',
      }),
    ).resolves.toEqual({
      credentials: mockCredentials.user(),
      authProtocol: undefined,
    });
    for (const headers of [
      {},
      { 'sec-websocket-protocol': 'invalid, other' },
      { 'sec-websocket-protocol': mockCredentials.service.token() },
    ]) {
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: request(headers),
          authPolicy: 'user',
        }),
      ).rejects.toThrow('Missing or invalid');
    }
  });

  it('allows limited tokens and cookies only with the cookie policy and checks cookie origins', async () => {
    const auth = mockServices.auth();
    const config = mockServices.rootConfig({
      data: {
        app: { baseUrl: 'https://app.example.com/path' },
        backend: { cors: { origin: ['https://*.trusted.example.com'] } },
      },
    });
    const token = mockCredentials.limitedUser.token();
    const req = request({
      cookie: `backstage-auth=${encodeURIComponent(token)}`,
      origin: 'https://app.example.com',
    });
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'user-cookie',
      }),
    ).resolves.toEqual({ credentials: mockCredentials.user() });
    for (const authPolicy of ['authenticated', 'user'] as const) {
      await expect(
        authenticateWebSocket({ auth, config, request: req, authPolicy }),
      ).rejects.toThrow('Missing or invalid');
    }
    req.headers.origin = 'https://preview.trusted.example.com';
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'user-cookie',
      }),
    ).resolves.toEqual({ credentials: mockCredentials.user() });
    for (const origin of [undefined, 'https://untrusted.example.com']) {
      req.headers.origin = origin;
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: req,
          authPolicy: 'user-cookie',
        }),
      ).rejects.toThrow('origin is not allowed');
    }
    const protocolRequest = request({ 'sec-websocket-protocol': token });
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: protocolRequest,
        authPolicy: 'user-cookie',
      }),
    ).resolves.toEqual({
      credentials: mockCredentials.user(),
      authProtocol: token,
    });
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: protocolRequest,
        authPolicy: 'authenticated',
      }),
    ).rejects.toThrow('Missing or invalid');
    req.headers.origin = 'https://app.example.com';
    req.headers.cookie = `backstage-auth=${mockCredentials.service.token()}`;
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'user-cookie',
      }),
    ).rejects.toThrow('Missing or invalid');
  });

  it('makes unauthenticated access explicit and preserves the default-policy escape hatch', async () => {
    const auth = mockServices.auth();
    const authenticate = jest.spyOn(auth, 'authenticate');
    const config = mockServices.rootConfig({
      data: {
        backend: { auth: { dangerouslyDisableDefaultAuthPolicy: true } },
      },
    });
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: request({ 'sec-websocket-protocol': 'invalid' }),
        authPolicy: 'unauthenticated',
      }),
    ).resolves.toEqual({ credentials: mockCredentials.none() });
    expect(authenticate).not.toHaveBeenCalled();
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: request({}),
        authPolicy: 'authenticated',
      }),
    ).resolves.toEqual({ credentials: mockCredentials.none() });
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: request({}),
        authPolicy: 'user',
      }),
    ).rejects.toThrow('Missing or invalid');
  });
});
