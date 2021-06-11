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

import { PassThrough } from 'stream';
import { Logger } from 'winston';
import * as winston from 'winston';
import { JsonValue, JsonObject } from '@backstage/config';
import { validate as validateJsonSchema } from 'jsonschema';
import { TaskBroker, Task } from './types';
import fs from 'fs-extra';
import path from 'path';
import { TemplateActionRegistry } from '../actions/TemplateActionRegistry';
import * as Handlebars from 'handlebars';
import { InputError } from '@backstage/errors';
import { parseRepoUrl } from '../actions/builtin/publish/util';

type Options = {
  logger: Logger;
  taskBroker: TaskBroker;
  workingDirectory: string;
  actionRegistry: TemplateActionRegistry;
};

export class TaskWorker {
  private readonly handlebars: typeof Handlebars;

  constructor(private readonly options: Options) {
    this.handlebars = Handlebars.create();

    // TODO(blam): this should be a public facing API but it's a little
    // scary right now, so we're going to lock it off like the component API is
    // in the frontend until we can work out a nice way to do it.
    this.handlebars.registerHelper('parseRepoUrl', repoUrl => {
      return JSON.stringify(parseRepoUrl(repoUrl));
    });

    this.handlebars.registerHelper('json', obj => JSON.stringify(obj));
  }

  start() {
    (async () => {
      for (;;) {
        const task = await this.options.taskBroker.claim();
        await this.runOneTask(task);
      }
    })();
  }

  async runOneTask(task: Task) {
    let workspacePath: string | undefined = undefined;
    try {
      const { actionRegistry } = this.options;

      workspacePath = path.join(
        this.options.workingDirectory,
        await task.getWorkspaceName(),
      );
      await fs.ensureDir(workspacePath);
      await task.emitLog(
        `Starting up task with ${task.spec.steps.length} steps`,
      );

      const templateCtx: {
        parameters: JsonObject;
        steps: {
          [stepName: string]: { output: { [outputName: string]: JsonValue } };
        };
      } = { parameters: task.spec.values, steps: {} };

      for (const step of task.spec.steps) {
        const metadata = { stepId: step.id };
        try {
          const taskLogger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              winston.format.simple(),
            ),
            defaultMeta: {},
          });

          const stream = new PassThrough();
          stream.on('data', async data => {
            const message = data.toString().trim();
            if (message?.length > 1) {
              await task.emitLog(message, metadata);
            }
          });

          taskLogger.add(new winston.transports.Stream({ stream }));
          await task.emitLog(`Beginning step ${step.name}`, {
            ...metadata,
            status: 'processing',
          });

          const action = actionRegistry.get(step.action);
          if (!action) {
            throw new Error(`Action '${step.action}' does not exist`);
          }

          const input =
            step.input &&
            JSON.parse(JSON.stringify(step.input), (_key, value) => {
              if (typeof value === 'string') {
                const templated = this.handlebars.compile(value, {
                  noEscape: true,
                  strict: true,
                  data: false,
                  preventIndent: true,
                })(templateCtx);

                // If it smells like a JSON object then give it a parse as an object and if it fails return the string
                if (
                  (templated.startsWith('{') && templated.endsWith('}')) ||
                  (templated.startsWith('[') && templated.endsWith(']'))
                ) {
                  try {
                    // Don't recursively JSON parse the values of this string.
                    // Shouldn't need to, don't want to encourage the use of returning handlebars from somewhere else
                    return JSON.parse(templated);
                  } catch {
                    return templated;
                  }
                }
                return templated;
              }

              return value;
            });

          if (action.schema?.input) {
            const validateResult = validateJsonSchema(
              input,
              action.schema.input,
            );
            if (!validateResult.valid) {
              const errors = validateResult.errors.join(', ');
              throw new InputError(
                `Invalid input passed to action ${action.id}, ${errors}`,
              );
            }
          }

          const stepOutputs: { [name: string]: JsonValue } = {};

          // Keep track of all tmp dirs that are created by the action so we can remove them after
          const tmpDirs = new Array<string>();

          await action.handler({
            baseUrl: task.spec.baseUrl,
            logger: taskLogger,
            logStream: stream,
            input,
            token: task.secrets?.token,
            workspacePath,
            async createTemporaryDirectory() {
              const tmpDir = await fs.mkdtemp(
                `${workspacePath}_step-${step.id}-`,
              );
              tmpDirs.push(tmpDir);
              return tmpDir;
            },
            output(name: string, value: JsonValue) {
              stepOutputs[name] = value;
            },
          });

          // Remove all temporary directories that were created when executing the action
          for (const tmpDir of tmpDirs) {
            await fs.remove(tmpDir);
          }

          templateCtx.steps[step.id] = { output: stepOutputs };

          await task.emitLog(`Finished step ${step.name}`, {
            ...metadata,
            status: 'completed',
          });
        } catch (error) {
          await task.emitLog(String(error.stack), {
            ...metadata,
            status: 'failed',
          });
          throw error;
        }
      }

      const output = JSON.parse(
        JSON.stringify(task.spec.output),
        (_key, value) => {
          if (typeof value === 'string') {
            return this.handlebars.compile(value, {
              noEscape: true,
              strict: true,
              data: false,
              preventIndent: true,
            })(templateCtx);
          }
          return value;
        },
      );

      await task.complete('completed', { output });
    } catch (error) {
      await task.complete('failed', {
        error: { name: error.name, message: error.message },
      });
    } finally {
      if (workspacePath) {
        await fs.remove(workspacePath);
      }
    }
  }
}
