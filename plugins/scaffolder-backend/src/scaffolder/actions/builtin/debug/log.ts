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

import { readdir, stat } from 'fs-extra';
import { relative, resolve } from 'path';
import { createTemplateAction } from '../../createTemplateAction';

/**
 * This task is useful for local development and testing of both the scaffolder
 * and scaffolder templates.
 */
export function createDebugLogAction() {
  return createTemplateAction<{ message?: string; listWorkspace?: boolean }>({
    id: 'debug:log',
    description:
      'Writes a message into the log or list all files in the workspace.',
    schema: {
      input: {
        type: 'object',
        properties: {
          message: {
            title: 'Message to output.',
            type: 'string',
          },
          listWorkspace: {
            title: 'List all files in the workspace, if true.',
            type: 'boolean',
          },
        },
      },
    },
    async handler(ctx) {
      if (ctx.input?.message) {
        ctx.logStream.write(ctx.input.message);
      }

      if (ctx.input?.listWorkspace) {
        const files = await recursiveReadDir(ctx.workspacePath);
        ctx.logStream.write(
          `Workspace:\n${files
            .map(f => `  - ${relative(ctx.workspacePath, f)}`)
            .join('\n')}`,
        );
      }
    },
  });
}

export async function recursiveReadDir(dir: string): Promise<string[]> {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? recursiveReadDir(res) : [res];
    }),
  );
  return files.reduce((a, f) => a.concat(f), []);
}
