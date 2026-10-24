/*
 * Copyright 2022 The Backstage Authors
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

import {
  ServiceFactoryTester,
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { httpRouterServiceFactory } from './httpRouterServiceFactory';
import request from 'supertest';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';
import { request as httpRequest, IncomingMessage, Server } from 'node:http';
import { Duplex } from 'node:stream';
import { once } from 'node:events';

describe('httpRouterFactory', () => {
  it('should register plugin paths', async () => {
    const rootHttpRouter = mockServices.rootHttpRouter.mock();
    const tester = ServiceFactoryTester.from(httpRouterServiceFactory, {
      dependencies: [rootHttpRouter.factory],
    });

    const router1 = await tester.getSubject('test1');
    router1.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(1);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/api/test1',
      expect.any(Function),
    );

    const handler = jest.fn();
    router1.addWebSocketHandler({
      path: '/events',
      handler: handler,
      authPolicy: 'unauthenticated',
    });
    expect(rootHttpRouter.addWebSocketHandler).toHaveBeenCalledWith({
      path: '/api/test1/events',
      handler: expect.any(Function),
    });
    expect(() =>
      router1.addWebSocketHandler({ path: 'events', handler: handler }),
    ).toThrow('must start with /');

    const router2 = await tester.getSubject('test2');
    router2.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(2);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/api/test2',
      expect.any(Function),
    );
  });

  it('routes the first WebSocket request by plugin path and preserves upgrade data', async () => {
    const handlers = [jest.fn(), jest.fn()];
    const { server } = await startTestBackend({
      features: ['first', 'second'].map((pluginId, index) =>
        createBackendPlugin({
          pluginId,
          register(reg) {
            reg.registerInit({
              deps: { http: coreServices.httpRouter },
              async init({ http }) {
                http.addWebSocketHandler({
                  path: '/events',
                  handler: async ({ request: req, socket, head }) => {
                    handlers[index](
                      req.url,
                      req.headers['sec-websocket-protocol'],
                      head.toString(),
                    );
                    await Promise.resolve();
                    socket.write(
                      'HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Protocol: example\r\n\r\n',
                    );
                    socket.write(head);
                    socket.pipe(socket);
                  },
                  authPolicy: 'unauthenticated',
                });
              },
            });
          },
        }),
      ),
    });

    const first = await upgrade(
      server,
      '/api/first/events?filter=all',
      'initial',
    );
    const second = await upgrade(server, '/api/second/events');
    try {
      expect(first.response.headers['sec-websocket-protocol']).toBe('example');
      expect(handlers[0]).toHaveBeenCalledWith(
        '/api/first/events?filter=all',
        'example',
        'initial',
      );
      expect(handlers[1]).toHaveBeenCalledWith(
        '/api/second/events',
        'example',
        '',
      );
      expect(first.head.toString()).toBe('initial');
      const data = once(first.socket, 'data');
      first.socket.write('forwarded');
      expect((await data)[0].toString()).toBe('forwarded');
      await expect(upgrade(server, '/api/first/events/')).rejects.toThrow(
        '404',
      );
      await expect(upgrade(server, '/api/first/events/child')).rejects.toThrow(
        '404',
      );
      await expect(upgrade(server, '/api/FIRST/events')).rejects.toThrow('404');
      await expect(upgrade(server, '/api/missing/events')).rejects.toThrow(
        '404',
      );
      expect(handlers[0]).toHaveBeenCalledTimes(1);
      expect(handlers[1]).toHaveBeenCalledTimes(1);
      await request(server).get('/api/first/events').expect(404);
    } finally {
      first.socket.destroy();
      second.socket.destroy();
    }
  });

  it('authenticates upgrades by default before invoking the raw handler', async () => {
    const handler = jest.fn();
    const backend = await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'secure',
          register(reg) {
            reg.registerInit({
              deps: { http: coreServices.httpRouter },
              async init({ http }) {
                http.addWebSocketHandler({
                  path: '/',
                  handler: context => {
                    handler(context);
                    const { socket } = context;
                    socket.write(
                      'HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n\r\n',
                    );
                  },
                });
              },
            });
          },
        }),
      ],
    });
    await expect(upgrade(backend.server, '/api/secure')).rejects.toThrow('401');
    expect(handler).not.toHaveBeenCalled();
    const accepted = await upgrade(backend.server, '/api/secure', '', {
      'sec-websocket-protocol': `application, ${mockCredentials.user.token()}`,
    });
    expect(handler).toHaveBeenCalledWith({
      request: expect.objectContaining({ url: '/api/secure' }),
      socket: expect.any(Duplex),
      head: Buffer.alloc(0),
      credentials: mockCredentials.user(),
      authProtocol: mockCredentials.user.token(),
    });
    accepted.socket.destroy();
  });

  describe('auth services', () => {
    const pluginSubject = createBackendPlugin({
      pluginId: 'test',
      register(reg) {
        reg.registerInit({
          deps: {
            httpRouter: coreServices.httpRouter,
            auth: coreServices.auth,
            httpAuth: coreServices.httpAuth,
          },
          async init({ httpRouter, auth, httpAuth }) {
            const router = Router();
            httpRouter.use(router);
            httpRouter.addAuthPolicy({
              path: '/public',
              allow: 'unauthenticated',
            });
            httpRouter.addAuthPolicy({
              path: '/cookie',
              allow: 'user-cookie',
            });

            router.get('/public', (_req, res) => {
              res.json({ ok: true });
            });
            router.get('/cookie', (_req, res) => {
              res.json({ ok: true });
            });
            router.get('/protected/no-checks', (_req, res) => {
              res.json({ ok: true });
            });
            router.get('/protected/only-users', async (req, res) => {
              await httpAuth.credentials(req, { allow: ['user'] });
              res.json({ ok: true });
            });
            router.get('/protected/only-services', async (req, res) => {
              await httpAuth.credentials(req, { allow: ['service'] });
              res.json({ ok: true });
            });
            router.get('/protected/credentials', async (req, res) => {
              res.json({
                credentials: await httpAuth.credentials(req),
              });
            });
            router.get('/protected/service-token', async (req, res) => {
              res.json(
                await auth.getPluginRequestToken({
                  onBehalfOf: await httpAuth.credentials(req),
                  targetPluginId: 'test',
                }),
              );
            });
          },
        });
      },
    });

    const defaultServices = [
      httpRouterServiceFactory,
      mockServices.httpAuth.factory({
        defaultCredentials: mockCredentials.none(),
      }),
    ];

    it('should block unauthenticated requests by default', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      await expect(
        request(server).get('/api/test/public'),
      ).resolves.toMatchObject({
        status: 200,
      });

      // TODO: cookie

      await expect(
        request(server).get('/api/test/protected/no-checks'),
      ).resolves.toMatchObject({
        status: 401,
      });
    });

    it('should not block unauthenticated requests if default policy is disabled', async () => {
      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          ...defaultServices,
          mockServices.rootConfig.factory({
            data: {
              backend: { auth: { dangerouslyDisableDefaultAuthPolicy: true } },
            },
          }),
        ],
      });

      await expect(
        request(server).get('/api/test/public'),
      ).resolves.toMatchObject({
        status: 200,
      });

      // TODO: cookie

      await expect(
        request(server).get('/api/test/protected/no-checks'),
      ).resolves.toMatchObject({
        status: 200,
        body: { ok: true },
      });

      await expect(
        request(server).get('/api/test/protected/only-users'),
      ).resolves.toMatchObject({
        status: 401,
      });

      await expect(
        request(server).get('/api/test/protected/only-services'),
      ).resolves.toMatchObject({
        status: 401,
      });

      await expect(
        request(server).get('/api/test/protected/credentials'),
      ).resolves.toMatchObject({
        status: 200,
        body: { credentials: mockCredentials.none() },
      });

      await expect(
        request(server)
          .get('/api/test/protected/credentials')
          .set('authorization', mockCredentials.user.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: { credentials: mockCredentials.user() },
      });

      await expect(
        request(server)
          .get('/api/test/protected/credentials')
          .set('authorization', mockCredentials.service.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: { credentials: mockCredentials.service() },
      });

      await expect(
        request(server).get('/api/test/protected/service-token'),
      ).resolves.toMatchObject({
        status: 200,
        body: { token: '' },
      });

      await expect(
        request(server)
          .get('/api/test/protected/service-token')
          .set('authorization', mockCredentials.user.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: {
          token: mockCredentials.service.token({
            onBehalfOf: mockCredentials.user(),
            targetPluginId: 'test',
          }),
        },
      });

      await expect(
        request(server)
          .get('/api/test/protected/service-token')
          .set('authorization', mockCredentials.service.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: {
          token: mockCredentials.service.token({
            onBehalfOf: mockCredentials.service(),
            targetPluginId: 'test',
          }),
        },
      });
    });
  });
});

async function upgrade(
  server: Server,
  path: string,
  head = '',
  headers: Record<string, string> = {},
): Promise<{
  response: IncomingMessage;
  socket: Duplex;
  head: Buffer;
}> {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Expected a listening test server');
  }
  return new Promise((resolve, reject) => {
    const req = httpRequest({
      hostname: 'localhost',
      port: address.port,
      path,
      headers: {
        connection: 'Upgrade',
        upgrade: 'websocket',
        'sec-websocket-protocol': 'example',
        ...headers,
      },
    });
    req.once('error', reject);
    req.once('response', response => {
      response.resume();
      reject(new Error(`Upgrade rejected: ${response.statusCode}`));
    });
    req.once('upgrade', (response, socket, data) => {
      resolve({ response, socket, head: data });
    });
    req.end(head);
  });
}
