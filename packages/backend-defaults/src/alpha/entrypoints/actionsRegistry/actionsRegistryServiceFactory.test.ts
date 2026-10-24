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
import { createBackendPlugin } from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { httpRouterServiceFactory } from '../../../entrypoints/httpRouter';
import request from 'supertest';
import { actionsRegistryServiceFactory } from './actionsRegistryServiceFactory';
import { InputError, NotFoundError } from '@backstage/errors';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';
import type { JsonObject } from '@backstage/types';

describe('actionsRegistryServiceFactory', () => {
  const defaultServices = [
    actionsRegistryServiceFactory,
    httpRouterServiceFactory,
    mockServices.httpAuth.factory({
      defaultCredentials: mockCredentials.service('user:default/mock'),
    }),
  ];

  describe('typescript tests', () => {
    it('should properly infer the input types', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z =>
                    z.object({
                      test: z.string(),
                    }),
                  output: z =>
                    z.object({
                      ok: z.boolean(),
                    }),
                },
                action: async ({ input: { test } }) => {
                  // @ts-expect-error - test is not a boolean
                  const _t: boolean = test;
                  return { output: { ok: true } };
                },
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });

    it('should properly infer the output types', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z =>
                    z.object({
                      test: z.string(),
                    }),
                  output: z =>
                    z.object({
                      ok: z.boolean(),
                    }),
                },
                // @ts-expect-error - ok is not a boolean
                action: async () => {
                  return { output: { ok: 'bo' } };
                },
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });

    it('should enforce types on example input and output', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
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
                    }),
                },
                examples: [
                  {
                    title: 'Valid example',
                    input: { name: 'test' },
                    output: { ok: true },
                  },
                  {
                    title: 'Bad input',
                    // @ts-expect-error - name must be a string
                    input: { name: 123 },
                  },
                  {
                    title: 'Bad output',
                    input: { name: 'test' },
                    // @ts-expect-error - ok must be a boolean
                    output: { ok: 'yes' },
                  },
                ],
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });

    it('should properly infer the secrets types', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z => z.object({ test: z.string() }),
                  output: z => z.object({ ok: z.boolean() }),
                  secrets: z => z.object({ token: z.string() }),
                },
                action: async ({ secrets: { token } }) => {
                  // @ts-expect-error - token is not a boolean
                  const _t: boolean = token;
                  return { output: { ok: true } };
                },
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });

    it('should allow actions without secrets schema', () => {
      createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z => z.object({ test: z.string() }),
                  output: z => z.object({ ok: z.boolean() }),
                },
                action: async () => {
                  return { output: { ok: true } };
                },
              });
            },
          });
        },
      });

      expect(true).toBe(true);
    });
  });

  describe('/.backstage/actions/v1/actions', () => {
    it('should allow registering of actions', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
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
                    }),
                },
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            title: 'Test',
            description: 'Test',
            schema: {
              input: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                },
              },
              output: {
                type: 'object',
                properties: {
                  ok: {
                    type: 'boolean',
                  },
                },
              },
            },
          },
        ],
      });
    });

    it('should set default attributes', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: { ok: true } }),
              });
              actionsRegistry.register({
                name: 'read-only',
                title: 'Read Only',
                description: 'Read Only',
                attributes: {
                  readOnly: true,
                },
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            attributes: {
              destructive: true,
              idempotent: false,
              readOnly: false,
            },
          },
          {
            name: 'read-only',
            attributes: {
              destructive: false,
              idempotent: false,
              readOnly: true,
            },
          },
        ],
      });
    });

    it('should allow setting attributes', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                attributes: {
                  destructive: false,
                  idempotent: true,
                  readOnly: false,
                },
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: { ok: true } }),
              });
              actionsRegistry.register({
                name: 'read-only',
                title: 'Read Only',
                description: 'Read Only',
                attributes: {
                  destructive: true,
                  readOnly: true,
                },
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            title: 'Test',
            description: 'Test',
            attributes: {
              destructive: false,
              idempotent: true,
              readOnly: false,
            },
          },
          {
            name: 'read-only',
            attributes: {
              destructive: true,
              idempotent: false,
              readOnly: true,
            },
          },
        ],
      });
    });

    it('should return examples in the action list', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
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
                    }),
                },
                examples: [
                  {
                    title: 'Basic usage',
                    description: 'A simple example',
                    input: { name: 'world' },
                    output: { ok: true },
                  },
                  {
                    title: 'Without output',
                    input: { name: 'test' },
                  },
                ],
                action: async () => ({ output: { ok: true } }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            examples: [
              {
                title: 'Basic usage',
                description: 'A simple example',
                input: { name: 'world' },
                output: { ok: true },
              },
              {
                title: 'Without output',
                input: { name: 'test' },
              },
            ],
          },
        ],
      });
    });

    it('should forces registration of input and output schema as objects', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  // @ts-expect-error - z.undefined is not a valid schema
                  input: z => z.undefined(),
                  // @ts-expect-error - z.string is not a valid schema
                  output: z => z.string(),
                },
                // @ts-expect-error - output is not a valid, needs to be an object
                action: async () => ({ output: 'ok' }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);

      expect(body).toMatchObject({
        actions: [
          {
            name: 'test',
            title: 'Test',
            description: 'Test',
            schema: {
              input: {},
              output: {},
            },
          },
        ],
      });
    });

    it('should return secrets schema in action list when declared', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                  secrets: z =>
                    z.object({
                      token: z.string(),
                    }),
                },
                action: async () => ({ output: {} }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);
      expect(body.actions[0].schema.secrets).toMatchObject({
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      });
    });

    it('should not include secrets schema when not declared', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'test',
                title: 'Test',
                description: 'Test',
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: {} }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);
      expect(body.actions[0].schema.secrets).toBeUndefined();
    });
  });

  describe('/.backstage/actions/v1/status', () => {
    function createPlugin(
      pluginId: string,
      options: {
        registerAction: boolean;
        visibilityPermission?: ReturnType<typeof createPermission>;
      },
    ) {
      return createBackendPlugin({
        pluginId,
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              if (options.registerAction) {
                actionsRegistry.register({
                  name: 'test',
                  title: 'Test',
                  description: 'Test',
                  visibilityPermission: options.visibilityPermission,
                  schema: {
                    input: z => z.object({}),
                    output: z => z.object({}),
                  },
                  action: async () => ({ output: {} }),
                });
              }
            },
          });
        },
      });
    }

    it('reports actions independently of action configuration and visibility permissions', async () => {
      const visibilityPermission = createPermission({
        name: 'test.action.use',
        attributes: {},
      });
      const permissionsMock = mockServices.permissions.mock({
        authorize: async () => [{ result: AuthorizeResult.DENY }],
      });
      const pluginSubject = createPlugin('my-plugin', {
        registerAction: true,
        visibilityPermission,
      });

      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.service('test-service'),
          }),
          mockServices.rootConfig.factory({
            data: {
              backend: {
                actions: {
                  pluginSources: ['other-plugin'],
                  filter: { exclude: [{ id: 'my-plugin:*' }] },
                },
              },
            },
          }),
          permissionsMock.factory,
        ],
      });

      await request(server)
        .get('/api/my-plugin/.backstage/actions/v1/actions')
        .expect(200, { actions: [] });
      await request(server)
        .get('/api/my-plugin/.backstage/actions/v1/status')
        .expect(200, { hasActions: true });
      expect(permissionsMock.authorize).not.toHaveBeenCalled();
    });

    it('reports no actions when none are registered', async () => {
      const emptyPlugin = createPlugin('empty-plugin', {
        registerAction: false,
      });

      const { server } = await startTestBackend({
        features: [emptyPlugin, ...defaultServices],
      });

      await request(server)
        .get('/api/empty-plugin/.backstage/actions/v1/status')
        .expect(200, { hasActions: false });
    });

    it('rejects user principals', async () => {
      const pluginSubject = createPlugin('my-plugin', {
        registerAction: false,
      });

      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.user(),
          }),
        ],
      });

      const response = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/status',
      );

      expect(response.status).toBe(403);
      expect(response.body.error.name).toBe('NotAllowedError');
    });
  });

  describe('/.backstage/actions/v1/actions/:actionId/invoke', () => {
    const mockAction = jest.fn();
    const mockSecretAction = jest.fn();

    beforeEach(() => {
      mockAction.mockReset();
      mockSecretAction.mockReset();
      mockAction.mockResolvedValue({ output: { ok: true } });
    });

    const pluginSubject = createBackendPlugin({
      pluginId: 'my-plugin',
      register(reg) {
        reg.registerInit({
          deps: {
            actionsRegistry: actionsRegistryServiceRef,
          },
          async init({ actionsRegistry }) {
            actionsRegistry.register({
              name: 'test',
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
                  }),
              },
              action: mockAction,
            });
          },
        });
      },
    });

    it('should throw an error if the action is not found', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server).post(
        '/api/my-plugin/.backstage/actions/v1/actions/test/invoke',
      );

      expect(status).toBe(404);
      expect(body).toMatchObject({
        error: {
          message: 'Action "test" not found',
        },
      });
    });

    it('should throw an error if the action input does not match the schema', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 123,
        });

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: {
          message: expect.stringMatching(
            'Invalid input to action "my-plugin:test"',
          ),
        },
      });
    });

    it('should call the action with the input', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(mockAction).toHaveBeenCalledWith({
        input: {
          name: 'test',
        },
        secrets: undefined,
        credentials: expect.objectContaining({
          $$type: '@backstage/BackstageCredentials',
          version: 'v1',
          principal: {
            type: 'service',
            subject: 'user:default/mock',
          },
        }),
        logger: expect.anything(),
        signal: expect.any(AbortSignal),
      });
    });

    it('should allow actions to be invoked by a user', async () => {
      const testServices = [
        actionsRegistryServiceFactory,
        httpRouterServiceFactory,
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.user(),
        }),
      ];

      const { server } = await startTestBackend({
        features: [pluginSubject, ...testServices],
      });

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(200);
      expect(body).toMatchObject({ output: { ok: true } });
    });

    it('should validate the output of the action if provided', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      mockAction.mockResolvedValue({ ok: 'blob' });

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: {
          message: expect.stringMatching(
            'Invalid output from action "my-plugin:test"',
          ),
        },
      });
    });

    it('should return the output of the action', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(200);
      expect(body).toMatchObject({ output: { ok: true } });
    });

    it('should forward the original error when the action throws a known error', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      mockAction.mockRejectedValue(new InputError('test'));

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: {
          name: 'InputError',
          message: 'test',
        },
      });
    });

    it('should forward a NotFoundError from the action with 404 status', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      mockAction.mockRejectedValue(new NotFoundError('entity not found'));

      const { body, status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({
          name: 'test',
        });

      expect(status).toBe(404);
      expect(body).toMatchObject({
        error: {
          name: 'NotFoundError',
          message: 'entity not found',
        },
      });
    });

    const pluginWithSecrets = createBackendPlugin({
      pluginId: 'my-plugin',
      register(reg) {
        reg.registerInit({
          deps: { actionsRegistry: actionsRegistryServiceRef },
          async init({ actionsRegistry }) {
            actionsRegistry.register({
              name: 'secret-action',
              title: 'Secret Action',
              description: 'Needs secrets',
              schema: {
                input: z => z.object({ repo: z.string() }),
                output: z => z.object({ ok: z.boolean() }),
                secrets: z => z.object({ token: z.string() }),
              },
              action: mockSecretAction,
            });
          },
        });
      },
    });

    it('should pass secrets to the action handler when using wrapped body format', async () => {
      mockSecretAction.mockResolvedValue({ output: { ok: true } });

      const { server } = await startTestBackend({
        features: [pluginWithSecrets, ...defaultServices],
      });

      const { status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v2/actions/my-plugin:secret-action/invoke',
        )
        .send({ input: { repo: 'test' }, secrets: { token: 'my-secret' } });

      expect(status).toBe(200);
      expect(mockSecretAction).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { repo: 'test' },
          secrets: { token: 'my-secret' },
        }),
      );
    });

    it('should return 400 when action requires secrets but none provided', async () => {
      mockSecretAction.mockResolvedValue({ output: { ok: true } });

      const { server } = await startTestBackend({
        features: [pluginWithSecrets, ...defaultServices],
      });

      const { status, body } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v2/actions/my-plugin:secret-action/invoke',
        )
        .send({ input: { repo: 'test' } });

      expect(status).toBe(400);
      expect(body.error.message).toMatch(/requires secrets/);
    });

    it('should validate secrets against the schema', async () => {
      mockSecretAction.mockResolvedValue({ output: { ok: true } });

      const { server } = await startTestBackend({
        features: [pluginWithSecrets, ...defaultServices],
      });

      const { status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v2/actions/my-plugin:secret-action/invoke',
        )
        .send({ input: { repo: 'test' }, secrets: { token: 123 } });

      expect(status).toBe(400);
    });

    it('should return 400 when secrets are sent to an action that does not accept them', async () => {
      mockAction.mockResolvedValue({ output: { ok: true } });

      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { status, body } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v2/actions/my-plugin:test/invoke',
        )
        .send({ input: { name: 'test' }, secrets: { token: 'unexpected' } });

      expect(status).toBe(400);
      expect(body.error.message).toMatch(/does not accept secrets/);
    });

    it('should still accept raw body format for backward compatibility', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      const { status } = await request(server)
        .post(
          '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:test/invoke',
        )
        .send({ name: 'test' });

      expect(status).toBe(200);
      expect(mockAction).toHaveBeenCalledWith(
        expect.objectContaining({
          input: { name: 'test' },
        }),
      );
    });
  });

  describe('configured action invocation', () => {
    const mockAction = jest.fn();
    const pluginSubject = createBackendPlugin({
      pluginId: 'my-plugin',
      register(reg) {
        reg.registerInit({
          deps: {
            actionsRegistry: actionsRegistryServiceRef,
          },
          async init({ actionsRegistry }) {
            actionsRegistry.register({
              name: 'test',
              title: 'Test',
              description: 'Test',
              schema: {
                input: z => z.object({ name: z.string() }),
                output: z => z.object({ ok: z.boolean() }),
              },
              action: mockAction,
            });
          },
        });
      },
    });

    function createRegistryServices(actions: JsonObject) {
      return [
        actionsRegistryServiceFactory,
        httpRouterServiceFactory,
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.service('user:default/mock'),
        }),
        mockServices.rootConfig.factory({
          data: { backend: { actions } },
        }),
      ];
    }

    beforeEach(() => {
      mockAction.mockReset();
      mockAction.mockResolvedValue({ output: { ok: true } });
    });

    describe.each([
      { version: 'v1', body: { name: 'test' } },
      { version: 'v2', body: { input: { name: 'test' } } },
    ])('$version', ({ version, body }) => {
      const path = `/.backstage/actions/${version}/actions/my-plugin:test/invoke`;
      const excludedFilters: Array<[string, JsonObject]> = [
        ['id', { exclude: [{ id: 'my-plugin:test' }] }],
        ['attribute', { exclude: [{ attributes: { destructive: true } }] }],
      ];

      it('should reject actions from sources that are not configured', async () => {
        const { server } = await startTestBackend({
          features: [
            pluginSubject,
            ...createRegistryServices({
              pluginSources: ['other-plugin'],
            }),
          ],
        });

        const response = await request(server)
          .post(`/api/my-plugin${path}`)
          .send(body);

        expect(response.status).toBe(404);
        expect(response.body.error.message).toBe(
          'Action "my-plugin:test" not found',
        );
        expect(mockAction).not.toHaveBeenCalled();
      });

      it.each(excludedFilters)(
        'should reject actions excluded by an %s filter',
        async (_, filter) => {
          const { server } = await startTestBackend({
            features: [
              pluginSubject,
              ...createRegistryServices({
                pluginSources: ['my-plugin'],
                filter,
              }),
            ],
          });

          const response = await request(server)
            .post(`/api/my-plugin${path}`)
            .send(body);

          expect(response.status).toBe(404);
          expect(response.body.error.message).toBe(
            'Action "my-plugin:test" not found',
          );
          expect(mockAction).not.toHaveBeenCalled();
        },
      );

      it('should invoke actions allowed by source and action filters', async () => {
        const { server } = await startTestBackend({
          features: [
            pluginSubject,
            ...createRegistryServices({
              pluginSources: ['my-plugin'],
              filter: {
                include: [
                  { id: 'my-plugin:*', attributes: { destructive: true } },
                ],
              },
            }),
          ],
        });

        const response = await request(server)
          .post(`/api/my-plugin${path}`)
          .send(body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ output: { ok: true } });
        expect(mockAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('permissions', () => {
    const testPermission = createPermission({
      name: 'test.action.use',
      attributes: {},
    });

    it('should filter out actions with denied permissions when listing', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'public-action',
                title: 'Public Action',
                description: 'No permission required',
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: {} }),
              });
              actionsRegistry.register({
                name: 'protected-action',
                title: 'Protected Action',
                description: 'Permission required',
                visibilityPermission: testPermission,
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: {} }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.service('user:default/mock'),
          }),
          mockServices.permissions.factory({
            result: AuthorizeResult.DENY,
          }),
        ],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);
      expect(body.actions).toHaveLength(1);
      expect(body.actions[0].name).toBe('public-action');
    });

    it('should include actions with allowed permissions when listing', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'protected-action',
                title: 'Protected Action',
                description: 'Permission required',
                visibilityPermission: testPermission,
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: {} }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.service('user:default/mock'),
          }),
          mockServices.permissions.factory({
            result: AuthorizeResult.ALLOW,
          }),
        ],
      });

      const { body, status } = await request(server).get(
        '/api/my-plugin/.backstage/actions/v1/actions',
      );

      expect(status).toBe(200);
      expect(body.actions).toHaveLength(1);
      expect(body.actions[0].name).toBe('protected-action');
    });

    it('should return 404 when invoking an action with denied permission', async () => {
      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'protected-action',
                title: 'Protected Action',
                description: 'Permission required',
                visibilityPermission: testPermission,
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: {} }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.service('user:default/mock'),
          }),
          mockServices.permissions.factory({
            result: AuthorizeResult.DENY,
          }),
        ],
      });

      const { body, status } = await request(server).post(
        '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:protected-action/invoke',
      );

      expect(status).toBe(404);
      expect(body).toMatchObject({
        error: {
          message: 'Action "my-plugin:protected-action" not found',
        },
      });
    });

    it('should allow invoking an action when permission is granted', async () => {
      const mockAction = jest.fn().mockResolvedValue({ output: { ok: true } });

      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'protected-action',
                title: 'Protected Action',
                description: 'Permission required',
                visibilityPermission: testPermission,
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({ ok: z.boolean() }),
                },
                action: mockAction,
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.service('user:default/mock'),
          }),
          mockServices.permissions.factory({
            result: AuthorizeResult.ALLOW,
          }),
        ],
      });

      const { body, status } = await request(server).post(
        '/api/my-plugin/.backstage/actions/v1/actions/my-plugin:protected-action/invoke',
      );

      expect(status).toBe(200);
      expect(body).toMatchObject({ output: { ok: true } });
      expect(mockAction).toHaveBeenCalled();
    });

    it('should pass the correct permission to the authorize call', async () => {
      const permissionsMock = mockServices.permissions.mock({
        authorize: async () => [{ result: AuthorizeResult.ALLOW }],
      });

      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'protected-action',
                title: 'Protected Action',
                description: 'Permission required',
                visibilityPermission: testPermission,
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: {} }),
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.service('user:default/mock'),
          }),
          permissionsMock.factory,
        ],
      });

      await request(server).get('/api/my-plugin/.backstage/actions/v1/actions');

      expect(permissionsMock.authorize).toHaveBeenCalledWith(
        [{ permission: testPermission }],
        expect.objectContaining({ credentials: expect.anything() }),
      );
    });

    it('should register the permission with the permissions registry', async () => {
      const permissionsRegistryMock = mockServices.permissionsRegistry.mock();

      const pluginSubject = createBackendPlugin({
        pluginId: 'my-plugin',
        register(reg) {
          reg.registerInit({
            deps: {
              actionsRegistry: actionsRegistryServiceRef,
            },
            async init({ actionsRegistry }) {
              actionsRegistry.register({
                name: 'protected-action',
                title: 'Protected Action',
                description: 'Permission required',
                visibilityPermission: testPermission,
                schema: {
                  input: z => z.object({}),
                  output: z => z.object({}),
                },
                action: async () => ({ output: {} }),
              });
            },
          });
        },
      });

      await startTestBackend({
        features: [
          pluginSubject,
          actionsRegistryServiceFactory,
          httpRouterServiceFactory,
          mockServices.httpAuth.factory({
            defaultCredentials: mockCredentials.service('user:default/mock'),
          }),
          permissionsRegistryMock.factory,
        ],
      });

      expect(permissionsRegistryMock.addPermissions).toHaveBeenCalledWith([
        testPermission,
      ]);
    });
  });
});
