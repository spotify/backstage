/*
 * Copyright 2021 The Backstage Authors
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

import fs from 'fs-extra';
import { dirname } from 'path';
import { InputError } from '@backstage/errors';
import { createTemplateAction } from '../../createTemplateAction';

/**
 * This task is useful for local development and testing of both the scaffolder
 * and scaffolder templates.
 *
 * This action is not installed by default and should not be installed in
 * production, as it writes the files to the local filesystem of the scaffolder.
 */
export function createPublishFileAction() {
  return createTemplateAction<{ path: string }>({
    id: 'publish:file',
    description: 'Writes contents of the workspace to a local directory',
    schema: {
      input: {
        type: 'object',
        required: ['path'],
        properties: {
          path: {
            title: 'Path to a directory where the output will be written',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { path } = ctx.input;

      const exists = await fs.pathExists(path);
      if (exists) {
        throw new InputError('Output path already exists');
      }
      await fs.ensureDir(dirname(path));
      await fs.copy(ctx.workspacePath, path);
    },
  });
}
