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

import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  PreparerBuilder,
  TemplaterBuilder,
  TemplaterValues,
  PublisherBuilder,
} from '../scaffolder';
import { CatalogEntityClient } from '../lib/catalog';
import { validate } from 'jsonschema';
import {
  DatabaseTaskStore,
  StorageTaskBroker,
  TaskWorker,
} from '../scaffolder/tasks';
import { templateEntityToSpec } from '../scaffolder/tasks/TemplateConverter';
import { TemplateActionRegistry } from '../scaffolder/actions/TemplateActionRegistry';
import { createLegacyActions } from '../scaffolder/stages/legacy';
import { getEntityBaseUrl, getWorkingDirectory } from './helpers';
import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import { InputError, NotFoundError } from '@backstage/errors';
import { CatalogApi } from '@backstage/catalog-client';
import {
  TemplateEntityV1alpha1,
  TemplateEntityV1beta2,
  Entity,
} from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateAction } from '../scaffolder/actions';
import { createBuiltinActions } from '../scaffolder/actions/builtin/createBuiltinActions';

export interface RouterOptions {
  preparers: PreparerBuilder;
  templaters: TemplaterBuilder;
  publishers: PublisherBuilder;

  logger: Logger;
  config: Config;
  reader: UrlReader;
  database: PluginDatabaseManager;
  catalogClient: CatalogApi;
  actions?: TemplateAction<any>[];
  taskWorkers?: number;
}

function isAlpha1Template(
  entity: TemplateEntityV1alpha1 | TemplateEntityV1beta2,
): entity is TemplateEntityV1alpha1 {
  return (
    entity.apiVersion === 'backstage.io/v1alpha1' ||
    entity.apiVersion === 'backstage.io/v1beta1'
  );
}

function isBeta2Template(
  entity: TemplateEntityV1alpha1 | TemplateEntityV1beta2,
): entity is TemplateEntityV1beta2 {
  return entity.apiVersion === 'backstage.io/v1beta2';
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const {
    preparers,
    templaters,
    publishers,
    logger: parentLogger,
    config,
    reader,
    database,
    catalogClient,
    actions,
    taskWorkers,
  } = options;

  const logger = parentLogger.child({ plugin: 'scaffolder' });
  const workingDirectory = await getWorkingDirectory(config, logger);
  const entityClient = new CatalogEntityClient(catalogClient);
  const integrations = ScmIntegrations.fromConfig(config);

  const databaseTaskStore = await DatabaseTaskStore.create(
    await database.getClient(),
  );
  const taskBroker = new StorageTaskBroker(databaseTaskStore, logger);
  const actionRegistry = new TemplateActionRegistry();
  const workers = [];
  for (let i = 0; i < (taskWorkers || 1); i++) {
    const worker = new TaskWorker({
      logger,
      taskBroker,
      actionRegistry,
      workingDirectory,
    });
    workers.push(worker);
  }

  const actionsToRegister = Array.isArray(actions)
    ? actions
    : [
        ...createLegacyActions({
          preparers,
          publishers,
          templaters,
        }),
        ...createBuiltinActions({
          integrations,
          catalogClient,
          templaters,
          reader,
        }),
      ];

  actionsToRegister.forEach(action => actionRegistry.register(action));
  workers.forEach(worker => worker.start());

  router
    .get(
      '/v2/templates/:namespace/:kind/:name/parameter-schema',
      async (req, res) => {
        const { namespace, kind, name } = req.params;

        if (namespace !== 'default') {
          throw new InputError(
            `Invalid namespace, only 'default' namespace is supported`,
          );
        }
        if (kind.toLowerCase() !== 'template') {
          throw new InputError(
            `Invalid kind, only 'Template' kind is supported`,
          );
        }

        const template = await entityClient.findTemplate(name, {
          token: getBearerToken(req.headers.authorization),
        });
        if (isBeta2Template(template)) {
          const parameters = [template.spec.parameters ?? []].flat();
          res.json({
            title: template.metadata.title ?? template.metadata.name,
            steps: parameters.map(schema => ({
              title: schema.title ?? 'Fill in template parameters',
              schema,
            })),
          });
        } else if (isAlpha1Template(template)) {
          res.json({
            title: template.metadata.title ?? template.metadata.name,
            steps: [
              {
                title: 'Fill in template parameters',
                schema: template.spec.schema,
              },
              {
                title: 'Choose owner and repo',
                schema: {
                  type: 'object',
                  required: ['storePath', 'owner'],
                  properties: {
                    owner: {
                      type: 'string',
                      title: 'Owner',
                      description: 'Who is going to own this component',
                    },
                    storePath: {
                      type: 'string',
                      title: 'Store path',
                      description:
                        'A full URL to the repository that should be created. e.g https://github.com/backstage/new-repo',
                    },
                    access: {
                      type: 'string',
                      title: 'Access',
                      description:
                        'Who should have access, in org/team or user format',
                    },
                  },
                },
              },
            ],
          });
        } else {
          throw new InputError(
            `Unsupported apiVersion field in schema entity, ${
              (template as Entity).apiVersion
            }`,
          );
        }
      },
    )
    .get('/v2/actions', async (_req, res) => {
      const actionsList = actionRegistry.list().map(action => {
        return {
          id: action.id,
          description: action.description,
          schema: action.schema,
        };
      });
      res.json(actionsList);
    })
    .post('/v2/tasks', async (req, res) => {
      const templateName: string = req.body.templateName;
      const values: TemplaterValues = req.body.values;
      const token = getBearerToken(req.headers.authorization);
      const template = await entityClient.findTemplate(templateName, {
        token,
      });

      let taskSpec;
      if (isAlpha1Template(template)) {
        logger.warn(
          `[DEPRECATION] - Template: ${template.metadata.name} has version ${template.apiVersion} which is going to be deprecated. Please refer to https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2 for help on migrating`,
        );

        const result = validate(values, template.spec.schema);
        if (!result.valid) {
          res.status(400).json({ errors: result.errors });
          return;
        }

        taskSpec = templateEntityToSpec(template, values);
      } else if (isBeta2Template(template)) {
        for (const parameters of [template.spec.parameters ?? []].flat()) {
          const result = validate(values, parameters);

          if (!result.valid) {
            res.status(400).json({ errors: result.errors });
            return;
          }
        }

        const baseUrl = getEntityBaseUrl(template);

        taskSpec = {
          baseUrl,
          values,
          steps: template.spec.steps.map((step, index) => ({
            ...step,
            id: step.id ?? `step-${index + 1}`,
            name: step.name ?? step.action,
          })),
          output: template.spec.output ?? {},
        };
      } else {
        throw new InputError(
          `Unsupported apiVersion field in schema entity, ${
            (template as Entity).apiVersion
          }`,
        );
      }

      const result = await taskBroker.dispatch(taskSpec, {
        token: token,
      });

      res.status(201).json({ id: result.taskId });
    })
    .get('/v2/tasks/:taskId', async (req, res) => {
      const { taskId } = req.params;
      const task = await taskBroker.get(taskId);
      if (!task) {
        throw new NotFoundError(`Task with id ${taskId} does not exist`);
      }
      // Do not disclose secrets
      delete task.secrets;
      res.status(200).json(task);
    })
    .get('/v2/tasks/:taskId/eventstream', async (req, res) => {
      const { taskId } = req.params;
      const after = Number(req.query.after) || undefined;
      logger.debug(`Event stream observing taskId '${taskId}' opened`);

      // Mandatory headers and http status to keep connection open
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
      });

      // After client opens connection send all events as string
      const unsubscribe = taskBroker.observe(
        { taskId, after },
        (error, { events }) => {
          if (error) {
            logger.error(
              `Received error from event stream when observing taskId '${taskId}', ${error}`,
            );
          }

          for (const event of events) {
            res.write(
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
            );
            if (event.type === 'completion') {
              unsubscribe();
              // Closing the event stream here would cause the frontend
              // to automatically reconnect because it lost connection.
            }
          }
          res.flush();
        },
      );
      // When client closes connection we update the clients list
      // avoiding the disconnected one
      req.on('close', () => {
        unsubscribe();
        logger.debug(`Event stream observing taskId '${taskId}' closed`);
      });
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}

function getBearerToken(header?: string): string | undefined {
  return header?.match(/Bearer\s+(\S+)/i)?.[1];
}
