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

import os from 'os';
import fs from 'fs-extra';
import { Processor, Job, StageContext, StageInput } from './types';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import * as uuid from 'uuid';
import path from 'path';
import { TemplaterValues } from '../stages/templater';
import { makeLogStream } from './logger';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

export type JobAndDirectoryTuple = {
  job: Job;
  directory: string;
};

export class JobProcessor implements Processor {
  private readonly workingDirectory: string;
  private readonly jobs: Map<string, Job>;

  static async fromConfig({
    config,
    logger,
  }: {
    config: Config;
    logger: Logger;
  }) {
    let workingDirectory: string;
    if (config.has('backend.workingDirectory')) {
      workingDirectory = config.getString('backend.workingDirectory');
      try {
        // Check if working directory exists and is writable
        await fs.promises.access(
          workingDirectory,
          fs.constants.F_OK | fs.constants.W_OK,
        );
        logger.info(`using working directory: ${workingDirectory}`);
      } catch (err) {
        logger.error(
          `working directory ${workingDirectory} ${
            err.code === 'ENOENT' ? 'does not exist' : 'is not writable'
          }`,
        );
        throw err;
      }
    } else {
      workingDirectory = os.tmpdir();
    }

    return new JobProcessor(workingDirectory);
  }

  constructor(workingDirectory: string) {
    this.workingDirectory = workingDirectory;
    this.jobs = new Map<string, Job>();
  }

  create({
    entity,
    values,
    stages,
  }: {
    entity: TemplateEntityV1alpha1;
    values: TemplaterValues;
    stages: StageInput[];
  }): Job {
    const id = uuid.v4();
    const { logger, stream } = makeLogStream({ id });

    const context: StageContext = {
      entity,
      values,
      logger,
      logStream: stream,
      workspacePath: path.join(this.workingDirectory, id),
    };

    const job: Job = {
      id,
      context,
      stages: stages.map(stage => ({
        handler: stage.handler,
        log: [],
        name: stage.name,
        status: 'PENDING',
      })),
      status: 'PENDING',
    };

    this.jobs.set(job.id, job);

    return job;
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  async run(job: Job): Promise<void> {
    if (job.status !== 'PENDING') {
      throw new Error("Job is not in a 'PENDING' state");
    }

    await fs.mkdir(job.context.workspacePath);

    job.status = 'STARTED';

    try {
      for (const stage of job.stages) {
        // Create a logger for each stage so we can create separate
        // Streams for each step.
        const { logger, log, stream } = makeLogStream({
          id: job.id,
          stage: stage.name,
        });
        // Attach the logger to the stage, and setup some timestamps.
        stage.log = log;
        stage.startedAt = Date.now();

        try {
          // Run the handler with the context created for the Job and some
          // Additional logging helpers.
          stage.status = 'STARTED';
          const handlerResponse = await stage.handler({
            ...job.context,
            logger,
            logStream: stream,
          });

          // If the handler returns something, then let's merge this onto the
          // context for the next stage to use as it might be relevant.
          if (handlerResponse) {
            job.context = {
              ...job.context,
              ...handlerResponse,
            };
          }

          // Complete the current stage
          stage.status = 'COMPLETED';
        } catch (error) {
          // Log to the current stage the error that occurred and fail the stage.
          stage.status = 'FAILED';
          logger.error(`Stage failed with error: ${error.message}`);
          logger.debug(error.stack);
          // Throw the error so the job can be failed too.
          throw error;
        } finally {
          // Always set the stage end timestamp.
          stage.endedAt = Date.now();
        }
      }

      // If all went to plan, complete the job.
      job.status = 'COMPLETED';
    } catch (error) {
      // If something went wrong, fail the job, and set the error property on the job.
      job.error = { name: error.name, message: error.message };
      job.status = 'FAILED';
    } finally {
      await fs.remove(job.context.workspacePath);
    }
  }
}
