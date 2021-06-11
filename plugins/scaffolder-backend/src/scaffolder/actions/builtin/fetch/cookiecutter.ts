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

import { UrlReader } from '@backstage/backend-common';
import { JsonObject } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { TemplaterBuilder, TemplaterValues } from '../../../stages/templater';
import { createTemplateAction } from '../../createTemplateAction';
import { fetchContents } from './helpers';

export function createFetchCookiecutterAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
  templaters: TemplaterBuilder;
}) {
  const { reader, templaters, integrations } = options;

  return createTemplateAction<{
    url: string;
    targetPath?: string;
    values: JsonObject;
    copyWithoutRender?: string[];
    extensions?: string[];
    imageName?: string;
  }>({
    id: 'fetch:cookiecutter',
    description:
      'Downloads a template from the given URL into the workspace, and runs cookiecutter on it.',
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
          values: {
            title: 'Template Values',
            description: 'Values to pass on to cookiecutter for templating',
            type: 'object',
          },
          copyWithoutRender: {
            title: 'Copy Without Render',
            description:
              'Avoid rendering directories and files in the template',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          extensions: {
            title: 'Template Extensions',
            description:
              "Jinja2 extensions to add filters, tests, globals or extend the parser. Extensions must be installed in the container or on the host where Cookiecutter executes. See the contrib directory in Backstage's repo for more information",
            type: 'array',
            items: {
              type: 'string',
            },
          },
          imageName: {
            title: 'Cookiecutter Docker image',
            description:
              "Specify a custom Docker image to run cookiecutter, to override the default: 'spotify/backstage-cookiecutter'. This can be used to execute cookiecutter with Template Extensions. Used only when a local cookiecutter is not found.",
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching and then templating using cookiecutter');
      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolvePath(workDir, 'template');
      const templateContentsDir = resolvePath(
        templateDir,
        "{{cookiecutter and 'contents'}}",
      );
      const resultDir = resolvePath(workDir, 'result');

      if (
        ctx.input.copyWithoutRender &&
        !Array.isArray(ctx.input.copyWithoutRender)
      ) {
        throw new InputError(
          'Fetch action input copyWithoutRender must be an Array',
        );
      }
      if (ctx.input.extensions && !Array.isArray(ctx.input.extensions)) {
        throw new InputError('Fetch action input extensions must be an Array');
      }

      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: templateContentsDir,
      });

      const cookiecutter = templaters.get('cookiecutter');
      const values = {
        ...(ctx.input.values as TemplaterValues),
        _copy_without_render: ctx.input.copyWithoutRender,
        _extensions: ctx.input.extensions,
        imageName: ctx.input.imageName,
      };

      // Will execute the template in ./template and put the result in ./result
      await cookiecutter.run({
        workspacePath: workDir,
        logStream: ctx.logStream,
        values,
      });

      // Finally move the template result into the task workspace
      const targetPath = ctx.input.targetPath ?? './';
      const outputPath = resolvePath(ctx.workspacePath, targetPath);
      if (!outputPath.startsWith(ctx.workspacePath)) {
        throw new InputError(
          `Fetch action targetPath may not specify a path outside the working directory`,
        );
      }
      await fs.copy(resultDir, outputPath);
    },
  });
}
