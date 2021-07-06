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
import { InputError } from '@backstage/errors';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { spawn } from 'child_process';
import { PassThrough, Writable } from 'stream';

export type RunCommandOptions = {
  command: string;
  args: string[];
  logStream?: Writable;
};

/**
 * Gets the templater key to use for templating from the entity
 * @param entity Template entity
 */
export const getTemplaterKey = (entity: TemplateEntityV1alpha1): string => {
  const { templater } = entity.spec;

  if (!templater) {
    throw new InputError('Template does not have a required templating key');
  }

  return templater;
};

/**
 *
 * @param options the options object
 * @param options.command the command to run
 * @param options.args the arguments to pass the command
 * @param options.logStream the log streamer to capture log messages
 */
export const runCommand = async ({
  command,
  args,
  logStream = new PassThrough(),
}: RunCommandOptions) => {
  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args);

    process.stdout.on('data', stream => {
      logStream.write(stream);
    });

    process.stderr.on('data', stream => {
      logStream.write(stream);
    });

    process.on('error', error => {
      return reject(error);
    });

    process.on('close', code => {
      if (code !== 0) {
        return reject(`Command ${command} failed, exit code: ${code}`);
      }
      return resolve();
    });
  });
};
