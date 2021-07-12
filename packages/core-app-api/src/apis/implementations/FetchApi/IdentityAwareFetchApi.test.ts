/*
 * Copyright 2021 The Backstage Authors
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

import { msw } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { IdentityAwareFetchApi } from './IdentityAwareFetchApi';

describe('IdentityAwareFetchApi', () => {
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(
      rest.get('http://example.com/1', (req, res, ctx) => {
        return res(ctx.json({ token: req.headers.get('backstage-token') }));
      }),
      rest.post('http://example.com/2', (req, res, ctx) => {
        return res(ctx.json({ token: req.headers.get('backstage-token') }));
      }),
    );
  });

  it.each([
    ['http://example.com/1', undefined],
    ['http://example.com/1', {}],
    ['http://example.com/1', { method: 'GET' }],
    [new Request('http://example.com/1'), undefined],
    [new Request('http://example.com/1'), {}],
    [new Request('http://example.com/1'), { method: 'GET' }],
    ['http://example.com/2', { method: 'POST' }],
    [new Request('http://example.com/2'), { method: 'POST' }],
  ])(
    'does a raw fetch before sign in, adds token after sign in, reverts on sign out',
    async (input: RequestInfo, init?: RequestInit | undefined) => {
      const impl = new IdentityAwareFetchApi();

      expect(await impl.fetch(input, init).then(r => r.json())).toEqual({
        token: null,
      });

      impl.onSignIn({ getIdToken: jest.fn(async () => 'someToken') });

      expect(await impl.fetch(input, init).then(r => r.json())).toEqual({
        token: 'someToken',
      });

      impl.onSignOut();

      expect(await impl.fetch(input, init).then(r => r.json())).toEqual({
        token: null,
      });
    },
  );
});
