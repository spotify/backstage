/*
 * Copyright 2024 The Backstage Authors
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

import { DefaultHttpAuthService } from './httpAuthServiceFactory';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import { createRequest } from 'node-mocks-http';
import supertest from 'supertest';

describe('DefaultHttpAuthService', () => {
  it('should extract token from custom header', async () => {
    const auth = mockServices.auth.mock();
    const httpAuthService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth,
      pluginId: 'test',
      getTokenFromRequest: req => {
        let token: string | undefined;
        const header = req.headers.test;
        if (typeof header === 'string') {
          token = header;
        }
        return { token };
      },
    });
    await httpAuthService.credentials(
      createRequest({ headers: { test: 'mock-user-token' } }),
    );
    expect(auth.authenticate).toHaveBeenCalledWith('mock-user-token');
  });

  it('keeps credentials scoped to each service instance', async () => {
    const request = createRequest({
      headers: {
        authorization: mockCredentials.service.header({
          onBehalfOf: mockCredentials.service('external:test'),
          targetPluginId: 'Catalog',
        }),
      },
    });
    const firstService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth: mockServices.auth({ pluginId: 'Catalog' }),
      pluginId: 'Catalog',
    });
    const secondAuth = mockServices.auth({ pluginId: 'catalog' });
    const secondAuthenticate = jest.spyOn(secondAuth, 'authenticate');
    const secondService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth: secondAuth,
      pluginId: 'catalog',
    });

    await expect(firstService.credentials(request)).resolves.toEqual(
      mockCredentials.service('external:test'),
    );
    await expect(secondService.credentials(request)).rejects.toThrow();
    expect(secondAuthenticate).toHaveBeenCalledTimes(1);
  });

  it('issues a host-only user cookie and expires any legacy domain cookie', async () => {
    const httpAuthService = DefaultHttpAuthService.create({
      discovery: {
        getBaseUrl: async () => 'http://localhost:7007/api/test',
        getExternalBaseUrl: async () => 'https://example.com/api/test',
      },
      auth: mockServices.auth(),
      pluginId: 'test',
    });

    const app = express();
    app.post('/cookie', async (_req, res) => {
      await httpAuthService.issueUserCookie(res, {
        credentials: mockCredentials.user(),
      });
      res.end();
    });
    app.delete('/cookie', async (_req, res) => {
      await httpAuthService.issueUserCookie(res, {
        credentials: mockCredentials.none(),
      });
      res.end();
    });

    const issued = await supertest(app).post('/cookie');
    expect(issued.status).toBe(200);
    expect(issued.header['set-cookie']).toEqual([
      expect.stringMatching(
        /^backstage-auth=;.*Domain=example\.com;.*Expires=Thu, 01 Jan 1970/,
      ),
      expect.stringMatching(/^backstage-auth=mock-limited-user-token/),
    ]);
    expect(issued.header['set-cookie'][1]).not.toMatch(/Domain=/);

    const cleared = await supertest(app).delete('/cookie');
    expect(cleared.status).toBe(200);
    expect(cleared.header['set-cookie']).toEqual([
      expect.stringMatching(
        /^backstage-auth=;.*Domain=example\.com;.*Expires=Thu, 01 Jan 1970/,
      ),
      expect.stringMatching(/^backstage-auth=;.*Expires=Thu, 01 Jan 1970/),
    ]);
    expect(cleared.header['set-cookie'][1]).not.toMatch(/Domain=/);
  });
});
