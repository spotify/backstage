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

import { UrlReader, resolveSafeChildPath } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';

export function createFetchPlainAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction<{ url: string; targetPath?: string }>({
    id: 'fetch:plain',
    description:
      "Downloads content and places it in the workspace, or optionally in a subdirectory specified by the 'targetPath' input option.",
    schema: {
      input: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            title: 'Fetch URL',
            description:
              'Relative path or absolute URL pointing to the directory tree to fetch',
            type: 'string',
          },
          targetPath: {
            title: 'Target Path',
            description:
              'Target path within the working directory to download the contents to.',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      // Finally move the template result into the task workspace
      const targetPath = ctx.input.targetPath ?? './';
      const outputPath = resolveSafeChildPath(ctx.workspacePath, targetPath);

      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath,
      });
    },
  });
}
