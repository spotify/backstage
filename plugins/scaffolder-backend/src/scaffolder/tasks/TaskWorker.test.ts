/*
 * Copyright 2021 Spotify AB
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
  getVoidLogger,
  SingleConnectionDatabaseManager,
} from '@backstage/backend-common';
import { TaskWorker } from './TaskWorker';
import os from 'os';
import { ConfigReader, JsonObject } from '@backstage/config';
import { StorageTaskBroker } from './StorageTaskBroker';
import { DatabaseTaskStore } from './DatabaseTaskStore';
import { createTemplateAction, TemplateActionRegistry } from '../actions';
import { RepoSpec } from '../actions/builtin/publish/util';

async function createStore(): Promise<DatabaseTaskStore> {
  const manager = SingleConnectionDatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('scaffolder');
  return await DatabaseTaskStore.create(await manager.getClient());
}

describe('TaskWorker', () => {
  let storage: DatabaseTaskStore;
  let actionRegistry = new TemplateActionRegistry();

  beforeAll(async () => {
    storage = await createStore();
  });

  beforeEach(() => {
    actionRegistry = new TemplateActionRegistry();
    actionRegistry.register({
      id: 'test-action',
      handler: async ctx => {
        ctx.output('testOutput', 'winning');
      },
    });
  });

  const logger = getVoidLogger();

  it('should fail when action does not exist', async () => {
    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      logger,
      workingDirectory: os.tmpdir(),
      actionRegistry,
      taskBroker: broker,
    });
    const { taskId } = await broker.dispatch({
      steps: [{ id: 'test', name: 'test', action: 'not-found-action' }],
      output: {
        result: '{{ steps.test.output.testOutput }}',
      },
      values: {},
    });
    const task = await broker.claim();
    await taskWorker.runOneTask(task);
    const { events } = await storage.listEvents({ taskId });
    const event = events.find(e => e.type === 'completion');

    expect((event?.body?.error as JsonObject)?.message).toBe(
      "Template action with ID 'not-found-action' is not registered.",
    );
  });

  it('should template output', async () => {
    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      logger,
      workingDirectory: os.tmpdir(),
      actionRegistry,
      taskBroker: broker,
    });

    const { taskId } = await broker.dispatch({
      steps: [{ id: 'test', name: 'test', action: 'test-action' }],
      output: {
        result: '{{ steps.test.output.testOutput }}',
      },
      values: {},
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const event = events.find(e => e.type === 'completion');
    expect((event?.body?.output as JsonObject).result).toBe('winning');
  });

  it('should template input', async () => {
    const inputAction = createTemplateAction<{
      name: string;
    }>({
      id: 'test-input',
      schema: {
        input: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              title: 'name',
              description: 'Enter name',
              type: 'string',
            },
          },
        },
      },
      async handler(ctx) {
        if (ctx.input.name !== 'winning') {
          throw new Error(
            `expected name to be "winning" got ${ctx.input.name}`,
          );
        }
      },
    });
    actionRegistry.register(inputAction);

    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      logger,
      workingDirectory: os.tmpdir(),
      actionRegistry,
      taskBroker: broker,
    });

    const { taskId } = await broker.dispatch({
      steps: [
        { id: 'test', name: 'test', action: 'test-action' },
        {
          id: 'test-input',
          name: 'test-input',
          action: 'test-input',
          input: {
            name: '{{ steps.test.output.testOutput }}',
          },
        },
      ],
      output: {
        result: '{{ steps.test.output.testOutput }}',
      },
      values: {},
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const event = events.find(e => e.type === 'completion');
    expect((event?.body?.output as JsonObject).result).toBe('winning');
  });

  it('should parse strings as objects if possible', async () => {
    const inputAction = createTemplateAction<{
      address: { line1: string };
      list: string[];
      address2: string;
    }>({
      id: 'test-input',
      schema: {
        input: {
          type: 'object',
          required: ['address'],
          properties: {
            address: {
              title: 'address',
              description: 'Enter name',
              type: 'object',
              properties: {
                line1: {
                  type: 'string',
                },
              },
            },
            address2: {
              type: 'string',
            },
            list: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
      async handler(ctx) {
        if (ctx.input.list.length !== 1) {
          throw new Error(
            `expected list to have length "1" got ${ctx.input.list.length}`,
          );
        }
        if (ctx.input.address.line1 !== 'line 1') {
          throw new Error(
            `expected address.line1 to be "line 1" got ${ctx.input.address.line1}`,
          );
        }

        if (ctx.input.address2 !== '{"not valid"}') {
          throw new Error(
            `expected address2 to be "{"not valid"}" got ${ctx.input.address2}`,
          );
        }
        ctx.output('address', ctx.input.address.line1);
      },
    });
    actionRegistry.register(inputAction);

    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      logger,
      workingDirectory: os.tmpdir(),
      actionRegistry,
      taskBroker: broker,
    });

    const { taskId } = await broker.dispatch({
      steps: [
        {
          id: 'test-input',
          name: 'test-input',
          action: 'test-input',
          input: {
            address: JSON.stringify({ line1: 'line 1' }),
            list: JSON.stringify(['hey!']),
            address2: '{"not valid"}',
          },
        },
      ],
      output: {
        result: '{{ steps.test-input.output.address }}',
      },
      values: {},
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const event = events.find(e => e.type === 'completion');

    expect((event?.body?.output as JsonObject).result).toBe('line 1');
  });

  // TODO(blam): Can delete this test when we make the helpers a public API
  it('should provide a repoUrlParse helper for the templates', async () => {
    const inputAction = createTemplateAction<{
      destination: RepoSpec;
    }>({
      id: 'test-input',
      schema: {
        input: {
          type: 'object',
          required: ['destination'],
          properties: {
            destination: {
              title: 'destination',
              type: 'object',
              properties: {
                repo: {
                  type: 'string',
                },
                host: {
                  type: 'string',
                },
                owner: {
                  type: 'string',
                },
                organization: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      async handler(ctx) {
        ctx.output('host', ctx.input.destination.host);
        ctx.output('repo', ctx.input.destination.repo);
        ctx.output('owner', ctx.input.destination.owner);

        if (ctx.input.destination.host !== 'github.com') {
          throw new Error(
            `expected host to be "github.com" got ${ctx.input.destination.host}`,
          );
        }

        if (ctx.input.destination.repo !== 'repo') {
          throw new Error(
            `expected repo to be "repo" got ${ctx.input.destination.repo}`,
          );
        }

        if (ctx.input.destination.owner !== 'owner') {
          throw new Error(
            `expected repo to be "owner" got ${ctx.input.destination.owner}`,
          );
        }
      },
    });
    actionRegistry.register(inputAction);

    const broker = new StorageTaskBroker(storage, logger);
    const taskWorker = new TaskWorker({
      logger,
      workingDirectory: os.tmpdir(),
      actionRegistry,
      taskBroker: broker,
    });

    const { taskId } = await broker.dispatch({
      steps: [
        {
          id: 'test-input',
          name: 'test-input',
          action: 'test-input',
          input: {
            destination: '{{ parseRepoUrl parameters.repoUrl }}',
          },
        },
      ],
      output: {
        host: '{{ steps.test-input.output.host }}',
        repo: '{{ steps.test-input.output.repo }}',
        owner: '{{ steps.test-input.output.owner }}',
      },
      values: {
        repoUrl: 'github.com?repo=repo&owner=owner',
      },
    });

    const task = await broker.claim();
    await taskWorker.runOneTask(task);

    const { events } = await storage.listEvents({ taskId });
    const event = events.find(e => e.type === 'completion');

    expect((event?.body?.output as JsonObject).host).toBe('github.com');
    expect((event?.body?.output as JsonObject).repo).toBe('repo');
    expect((event?.body?.output as JsonObject).owner).toBe('owner');
  });
});
