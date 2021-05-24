/*
 * Copyright 2020 Spotify AB
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

import { Entity } from '@backstage/catalog-model';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogClient } from './CatalogClient';
import { CatalogListResponse, DiscoveryApi } from './types';

const server = setupServer();
const token = 'fake-token';
const mockBaseUrl = 'http://backstage:9191/i-am-a-mock-base';
const discoveryApi: DiscoveryApi = {
  async getBaseUrl(_pluginId) {
    return mockBaseUrl;
  },
};

describe('CatalogClient', () => {
  let client: CatalogClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    client = new CatalogClient({ discoveryApi });
  });

  describe('getEntities', () => {
    const defaultServiceResponse: Entity[] = [
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'Test1',
          namespace: 'test1',
        },
      },
      {
        apiVersion: '1',
        kind: 'Component',
        metadata: {
          name: 'Test2',
          namespace: 'test1',
        },
      },
    ];
    const defaultResponse: CatalogListResponse<Entity> = {
      items: defaultServiceResponse,
    };

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/entities`, (_, res, ctx) => {
          return res(ctx.json(defaultServiceResponse));
        }),
      );
    });

    it('should entities from correct endpoint', async () => {
      const response = await client.getEntities({}, { token });
      expect(response).toEqual(defaultResponse);
    });

    it('builds multiple entity search filters properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe(
            '?filter=a=1,b=2,b=3,%C3%B6=%3D&filter=a=2',
          );
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities(
        {
          filter: [
            {
              a: '1',
              b: ['2', '3'],
              ö: '=',
            },
            {
              a: '2',
            },
          ],
        },
        { token },
      );

      expect(response.items).toEqual([]);
    });

    it('builds single entity search filter properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe('?filter=a=1,b=2,b=3,%C3%B6=%3D');
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities(
        {
          filter: {
            a: '1',
            b: ['2', '3'],
            ö: '=',
          },
        },
        { token },
      );

      expect(response.items).toEqual([]);
    });

    it('builds entity field selectors properly', async () => {
      expect.assertions(2);

      server.use(
        rest.get(`${mockBaseUrl}/entities`, (req, res, ctx) => {
          expect(req.url.search).toBe('?fields=a.b,%C3%B6');
          return res(ctx.json([]));
        }),
      );

      const response = await client.getEntities(
        {
          fields: ['a.b', 'ö'],
        },
        { token },
      );

      expect(response.items).toEqual([]);
    });
  });

  describe('getLocationById', () => {
    const defaultResponse = {
      data: {
        id: '42',
      },
    };

    beforeEach(() => {
      server.use(
        rest.get(`${mockBaseUrl}/locations/42`, (_, res, ctx) => {
          return res(ctx.json(defaultResponse));
        }),
      );
    });

    it('should locations from correct endpoint', async () => {
      const response = await client.getLocationById('42', { token });
      expect(response).toEqual(defaultResponse);
    });

    it('forwards authorization token', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/locations/42`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
          return res(ctx.json(defaultResponse));
        }),
      );

      await client.getLocationById('42', { token });
    });

    it('skips authorization header if token is omitted', async () => {
      expect.assertions(1);

      server.use(
        rest.get(`${mockBaseUrl}/locations/42`, (req, res, ctx) => {
          expect(req.headers.get('authorization')).toBeNull();
          return res(ctx.json(defaultResponse));
        }),
      );

      await client.getLocationById('42');
    });
  });

  describe('getAttachment', () => {
    it('should load attachment as blob, includes token in request', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/entities/by-name/my-kind/my-namespace/my-name/attachments/backstage.io%2Fattachment-key`,
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
            return res(ctx.text('Hello World'));
          },
        ),
      );

      const attachment = await client.getAttachment(
        { kind: 'my-kind', name: 'my-name', namespace: 'my-namespace' },
        'backstage.io/attachment-key',
        { token },
      );
      const blob = await attachment.blob();

      expect(blob).toBeDefined();
      expect(blob!.type).toBe('text/plain');
      expect(await blob!.text()).toBe('Hello World');
    });

    it('should load attachment as blob, without token', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/entities/by-name/my-kind/my-namespace/my-name/attachments/backstage.io%2Fattachment-key`,
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBeNull();
            return res(ctx.text('Hello World'));
          },
        ),
      );

      const attachment = await client.getAttachment(
        { kind: 'my-kind', name: 'my-name', namespace: 'my-namespace' },
        'backstage.io/attachment-key',
      );
      const blob = await attachment.blob();

      expect(blob).toBeDefined();
      expect(blob!.type).toBe('text/plain');
      expect(await blob!.text()).toBe('Hello World');
    });

    it('should load attachment as blob, return undefined if attachment does not exist', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/entities/by-name/my-kind/my-namespace/my-name/attachments/backstage.io%2Fattachment-key`,
          (_, res, ctx) => {
            return res(ctx.status(404));
          },
        ),
      );

      const attachment = await client.getAttachment(
        { kind: 'my-kind', name: 'my-name', namespace: 'my-namespace' },
        'backstage.io/attachment-key',
      );
      const blob = await attachment.blob();

      expect(blob).toBeUndefined();
    });

    it('should load attachment as text', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/entities/by-name/my-kind/my-namespace/my-name/attachments/backstage.io%2Fattachment-key`,
          (_, res, ctx) => res(ctx.text('Hello World')),
        ),
      );

      const attachment = await client.getAttachment(
        { kind: 'my-kind', name: 'my-name', namespace: 'my-namespace' },
        'backstage.io/attachment-key',
        { token },
      );
      const text = await attachment.text();

      expect(text).toBe('Hello World');
    });

    it('should load attachment as text, return undefined if attachment does not exist', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/entities/by-name/my-kind/my-namespace/my-name/attachments/backstage.io%2Fattachment-key`,
          (_, res, ctx) => res(ctx.status(404)),
        ),
      );

      const attachment = await client.getAttachment(
        { kind: 'my-kind', name: 'my-name', namespace: 'my-namespace' },
        'backstage.io/attachment-key',
        { token },
      );
      const text = await attachment.text();

      expect(text).toBeUndefined();
    });

    // TODO: This test doesn't work as the Blob return from fetch doesn't seem
    // to be compatible with the one from jsdom, so that FileReader fails with:
    // TypeError: Failed to execute 'readAsDataURL' on 'FileReader': parameter 1
    // is not of type 'Blob'.
    it.skip('should generate attachment url, builds data: uri if token is included', async () => {
      server.use(
        rest.get(
          `${mockBaseUrl}/entities/by-name/my-kind/my-namespace/my-name/attachments/backstage.io%2Fattachment-key`,
          (req, res, ctx) => {
            expect(req.headers.get('authorization')).toBe(`Bearer ${token}`);
            return res(ctx.text('Hello World'));
          },
        ),
      );

      const attachment = await client.getAttachment(
        { kind: 'my-kind', name: 'my-name', namespace: 'my-namespace' },
        'backstage.io/attachment-key',
        { token },
      );
      const url = await attachment.url();
      expect(url).toEqual('data:text/plain;base64,SGVsbG8gV29ybGQ=');
    });

    it('should generate attachment url, without token', async () => {
      const attachment = await client.getAttachment(
        { kind: 'my-kind', name: 'my-name', namespace: 'my-namespace' },
        'backstage.io/attachment-key',
      );
      const url = await attachment.url();

      expect(url).toEqual(
        'http://backstage:9191/i-am-a-mock-base/entities/by-name/my-kind/my-namespace/my-name/attachments/backstage.io%2Fattachment-key',
      );
    });
  });
});
