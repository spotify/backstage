/*
 * Copyright 2025 The Backstage Authors
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
  mockCredentials,
  mockServices,
  registerMswTestHooks,
  ServiceFactoryTester,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { actionsRegistryServiceFactory } from '../actionsRegistry';
import { httpRouterServiceFactory } from '../../../entrypoints/httpRouter';
import { actionsServiceFactory } from './actionsServiceFactory';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { json } from 'express';
import Router from 'express-promise-router';
import request from 'supertest';
import { ActionsServiceAction } from '@backstage/backend-plugin-api/alpha';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { actionsServiceRef } from '@backstage/backend-plugin-api/alpha';

const server = setupServer();

describe('actionsServiceFactory', () => {
  describe('client', () => {
    registerMswTestHooks(server);
    const mockActionsListEndpoint = jest.fn();
    const mockNotFoundActionsListEndpoint = jest.fn();

    const defaultServices = [
      mockServices.rootConfig.factory({
        data: {
          backend: {
            actions: {
              pluginSources: ['my-plugin', 'not-found-plugin'],
            },
          },
        },
      }),
      actionsServiceFactory,
      httpRouterServiceFactory,
      mockServices.httpAuth.factory({
        defaultCredentials: mockCredentials.service('user:default/mock'),
      }),
      mockServices.discovery.factory(),
      actionsRegistryServiceFactory,
    ];

    const mockActionsDefinition: ActionsServiceAction = {
      description: 'my mock description',
      id: 'my-plugin:test',
      pluginId: 'my-plugin',
      name: 'testy',
      title: 'Test',
      schema: {
        input: {},
        output: {},
      },
      attributes: {
        destructive: false,
        idempotent: false,
        readOnly: false,
      },
    };

    beforeEach(() => {
      server.use(
        http.get(
          'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
          mockActionsListEndpoint.mockImplementation(() =>
            HttpResponse.json({
              actions: [mockActionsDefinition],
            }),
          ),
        ),
        http.get(
          'http://localhost:0/api/not-found-plugin/.backstage/actions/v1/actions',
          mockNotFoundActionsListEndpoint.mockImplementation(
            () => new HttpResponse(null, { status: 404 }),
          ),
        ),
      );
    });

    describe('list', () => {
      it('should list all plugins in config to find actions and handle failures gracefully', async () => {
        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions).toEqual([mockActionsDefinition]);

        expect(mockActionsListEndpoint).toHaveBeenCalledTimes(1);
        expect(mockNotFoundActionsListEndpoint).toHaveBeenCalledTimes(1);
      });

      it('should filter actions based on include patterns', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:get-entity',
            name: 'get-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:delete-entity',
            name: 'delete-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'other-plugin:get-thing',
            name: 'get-thing',
          },
        ];

        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            () =>
              HttpResponse.json({
                actions: multipleActions.filter(a =>
                  a.id.startsWith('my-plugin:'),
                ),
              }),
          ),
          http.get(
            'http://localhost:0/api/other-plugin/.backstage/actions/v1/actions',
            () =>
              HttpResponse.json({
                actions: multipleActions.filter(a =>
                  a.id.startsWith('other-plugin:'),
                ),
              }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin', 'other-plugin'],
                    filter: {
                      include: [{ id: 'my-plugin:*' }],
                    },
                  },
                },
              },
            }),
            actionsServiceFactory,
            httpRouterServiceFactory,
            mockServices.httpAuth.factory({
              defaultCredentials: mockCredentials.service('user:default/mock'),
            }),
            mockServices.discovery.factory(),
            actionsRegistryServiceFactory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual([
          'my-plugin:get-entity',
          'my-plugin:delete-entity',
        ]);
      });

      it('should filter actions based on exclude patterns', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:get-entity',
            name: 'get-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:delete-entity',
            name: 'delete-entity',
          },
        ];

        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            () => HttpResponse.json({ actions: multipleActions }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      exclude: [{ id: '*:delete-*' }],
                    },
                  },
                },
              },
            }),
            actionsServiceFactory,
            httpRouterServiceFactory,
            mockServices.httpAuth.factory({
              defaultCredentials: mockCredentials.service('user:default/mock'),
            }),
            mockServices.discovery.factory(),
            actionsRegistryServiceFactory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual(['my-plugin:get-entity']);
      });

      it('should have exclude take precedence over include', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:get-entity',
            name: 'get-entity',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:delete-entity',
            name: 'delete-entity',
          },
        ];

        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            () => HttpResponse.json({ actions: multipleActions }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      include: [{ id: 'my-plugin:*' }],
                      exclude: [{ id: 'my-plugin:delete-entity' }],
                    },
                  },
                },
              },
            }),
            actionsServiceFactory,
            httpRouterServiceFactory,
            mockServices.httpAuth.factory({
              defaultCredentials: mockCredentials.service('user:default/mock'),
            }),
            mockServices.discovery.factory(),
            actionsRegistryServiceFactory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual(['my-plugin:get-entity']);
      });

      it('should always apply exclude rules even when action matches include', async () => {
        // This tests that exclude is checked FIRST and always wins,
        // regardless of whether the action would match an include rule
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:safe-action',
            name: 'safe-action',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:dangerous-action',
            name: 'dangerous-action',
            attributes: {
              destructive: true,
              readOnly: false,
              idempotent: false,
            },
          },
        ];

        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            () => HttpResponse.json({ actions: multipleActions }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      // Include all my-plugin actions
                      include: [{ id: 'my-plugin:*' }],
                      // But exclude any destructive ones
                      exclude: [{ attributes: { destructive: true } }],
                    },
                  },
                },
              },
            }),
            actionsServiceFactory,
            httpRouterServiceFactory,
            mockServices.httpAuth.factory({
              defaultCredentials: mockCredentials.service('user:default/mock'),
            }),
            mockServices.discovery.factory(),
            actionsRegistryServiceFactory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        // dangerous-action matches include (my-plugin:*) but is excluded due to destructive: true
        expect(actions.map(a => a.id)).toEqual(['my-plugin:safe-action']);
      });

      it('should filter actions based on attribute constraints', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:read-action',
            name: 'read-action',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:write-action',
            name: 'write-action',
            attributes: {
              destructive: true,
              readOnly: false,
              idempotent: false,
            },
          },
        ];

        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            () => HttpResponse.json({ actions: multipleActions }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    filter: {
                      include: [
                        {
                          attributes: {
                            readOnly: true,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            }),
            actionsServiceFactory,
            httpRouterServiceFactory,
            mockServices.httpAuth.factory({
              defaultCredentials: mockCredentials.service('user:default/mock'),
            }),
            mockServices.discovery.factory(),
            actionsRegistryServiceFactory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual(['my-plugin:read-action']);
      });

      it('should combine pattern and attribute filtering with AND logic', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:safe-read',
            name: 'safe-read',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:dangerous-read',
            name: 'dangerous-read',
            attributes: {
              destructive: true,
              readOnly: true,
              idempotent: false,
            },
          },
          {
            ...mockActionsDefinition,
            id: 'other-plugin:safe-read',
            name: 'safe-read',
            attributes: {
              destructive: false,
              readOnly: true,
              idempotent: true,
            },
          },
        ];

        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            () =>
              HttpResponse.json({
                actions: multipleActions.filter(a =>
                  a.id.startsWith('my-plugin:'),
                ),
              }),
          ),
          http.get(
            'http://localhost:0/api/other-plugin/.backstage/actions/v1/actions',
            () =>
              HttpResponse.json({
                actions: multipleActions.filter(a =>
                  a.id.startsWith('other-plugin:'),
                ),
              }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin', 'other-plugin'],
                    filter: {
                      include: [
                        {
                          id: 'my-plugin:*',
                          attributes: {
                            destructive: false,
                          },
                        },
                      ],
                    },
                  },
                },
              },
            }),
            actionsServiceFactory,
            httpRouterServiceFactory,
            mockServices.httpAuth.factory({
              defaultCredentials: mockCredentials.service('user:default/mock'),
            }),
            mockServices.discovery.factory(),
            actionsRegistryServiceFactory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        // Only my-plugin:safe-read matches: my-plugin:* pattern AND destructive: false
        expect(actions.map(a => a.id)).toEqual(['my-plugin:safe-read']);
      });

      it('should return all actions when no filter config is provided', async () => {
        const multipleActions: ActionsServiceAction[] = [
          {
            ...mockActionsDefinition,
            id: 'my-plugin:action-one',
            name: 'action-one',
          },
          {
            ...mockActionsDefinition,
            id: 'my-plugin:action-two',
            name: 'action-two',
          },
        ];

        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions',
            () => HttpResponse.json({ actions: multipleActions }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: [
            mockServices.rootConfig.factory({
              data: {
                backend: {
                  actions: {
                    pluginSources: ['my-plugin'],
                    // No filter config
                  },
                },
              },
            }),
            actionsServiceFactory,
            httpRouterServiceFactory,
            mockServices.httpAuth.factory({
              defaultCredentials: mockCredentials.service('user:default/mock'),
            }),
            mockServices.discovery.factory(),
            actionsRegistryServiceFactory,
          ],
        }).getSubject();

        const { actions } = await subject.list({
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(actions.map(a => a.id)).toEqual([
          'my-plugin:action-one',
          'my-plugin:action-two',
        ]);
      });
    });

    describe('invoke', () => {
      it('should invoke the action and return the output', async () => {
        server.use(
          http.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            () => HttpResponse.json({ output: { ok: true } }),
          ),
        );
        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        const { output } = await subject.invoke({
          id: 'my-plugin:test',
          credentials: mockCredentials.service('user:default/mock'),
        });

        expect(output).toEqual({ ok: true });
      });

      it('should throw a 404 if the action does not exist', async () => {
        server.use(
          http.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            () => new HttpResponse(null, { status: 404 }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        await expect(
          subject.invoke({
            id: 'my-plugin:test',
            credentials: mockCredentials.service('user:default/mock'),
          }),
        ).rejects.toThrow('404');
      });

      it('should throw a 400 if the action returns an invalid input', async () => {
        server.use(
          http.post(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
            () => new HttpResponse(null, { status: 400 }),
          ),
        );

        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        await expect(
          subject.invoke({
            id: 'my-plugin:test',
            credentials: mockCredentials.service('user:default/mock'),
          }),
        ).rejects.toThrow('400');
      });
    });

    describe('readUi', () => {
      it('reads an action UI from the owning plugin', async () => {
        const endpoint = jest.fn(() =>
          HttpResponse.json({
            html: '<main>Example</main>',
            csp: { connectDomains: ['https://example.com'] },
            permissions: { clipboardWrite: {} },
          }),
        );
        server.use(
          http.get(
            'http://localhost:0/api/my-plugin/.backstage/actions/v1/actions/my-plugin%3Atest/ui',
            endpoint,
          ),
        );
        const subject = await ServiceFactoryTester.from(actionsServiceFactory, {
          dependencies: defaultServices,
        }).getSubject();

        await expect(
          subject.readUi?.({
            id: 'my-plugin:test',
            credentials: mockCredentials.service('user:default/mock'),
          }),
        ).resolves.toEqual({
          html: '<main>Example</main>',
          csp: { connectDomains: ['https://example.com'] },
          permissions: { clipboardWrite: {} },
        });
        expect(endpoint).toHaveBeenCalledTimes(1);
      });
    });

    describe('integration', () => {
      beforeAll(() => {
        // disable the msw server for this test.
        server.close();
      });

      const features = [
        actionsServiceFactory,
        httpRouterServiceFactory,
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.service('user:default/mock'),
        }),
        actionsRegistryServiceFactory,
        mockServices.rootConfig.factory({
          data: {
            backend: {
              actions: { pluginSources: ['plugin-with-action'] },
            },
          },
        }),

        createBackendPlugin({
          pluginId: 'plugin-with-action',
          register({ registerInit }) {
            registerInit({
              deps: { actionsRegistry: actionsRegistryServiceRef },
              async init({ actionsRegistry }) {
                actionsRegistry.register({
                  name: 'with-validation',
                  title: 'Test',
                  description: 'Test',
                  schema: {
                    input: z =>
                      z.object({
                        name: z.string(),
                      }),
                    output: z =>
                      z.object({
                        ok: z.boolean(),
                        string: z.string(),
                      }),
                  },
                  action: async ({ input }) => {
                    return {
                      output: {
                        ok: true,
                        string: `hello ${input.name}`,
                      },
                    };
                  },
                });
              },
            });
          },
        }),
        createBackendPlugin({
          pluginId: 'test-harness',
          register({ registerInit }) {
            registerInit({
              deps: {
                actionsService: actionsServiceRef,
                router: coreServices.httpRouter,
                httpAuth: coreServices.httpAuth,
              },
              async init({ actionsService, router, httpAuth }) {
                const innerRouter = Router();
                innerRouter.use(json());
                router.use(innerRouter);

                innerRouter.post('/invoke', async (req, res) => {
                  const { id, input } = req.body;
                  const response = await actionsService.invoke({
                    id,
                    input,
                    credentials: await httpAuth.credentials(req),
                  });
                  res.json(response);
                });

                innerRouter.get('/actions', async (req, res) => {
                  const response = await actionsService.list({
                    credentials: await httpAuth.credentials(req),
                  });

                  res.json(response);
                });
              },
            });
          },
        }),
      ];

      it('should list the actions and return the output', async () => {
        const { server: testHarnessServer } = await startTestBackend({
          features,
        });

        const { body, status } = await request(testHarnessServer).get(
          '/api/test-harness/actions',
        );

        expect(status).toBe(200);
        expect(body).toEqual({
          actions: [
            {
              description: 'Test',
              id: 'plugin-with-action:with-validation',
              pluginId: 'plugin-with-action',
              name: 'with-validation',
              schema: {
                input: {
                  $schema: 'http://json-schema.org/draft-07/schema#',
                  additionalProperties: false,
                  properties: {
                    name: {
                      type: 'string',
                    },
                  },
                  required: ['name'],
                  type: 'object',
                },
                output: {
                  $schema: 'http://json-schema.org/draft-07/schema#',
                  additionalProperties: false,
                  properties: {
                    ok: {
                      type: 'boolean',
                    },
                    string: {
                      type: 'string',
                    },
                  },
                  required: ['ok', 'string'],
                  type: 'object',
                },
              },
              attributes: {
                destructive: true,
                idempotent: false,
                readOnly: false,
              },
              title: 'Test',
            },
          ],
        });
      });

      it('should invoke the action and return the output', async () => {
        const { server: testHarnessServer } = await startTestBackend({
          features,
        });

        const { body, status } = await request(testHarnessServer)
          .post('/api/test-harness/invoke')
          .send({
            id: 'plugin-with-action:with-validation',
            input: {
              name: 'world',
            },
          });

        expect(body).toEqual({ output: { ok: true, string: 'hello world' } });
        expect(status).toBe(200);
      });
    });
  });
});
