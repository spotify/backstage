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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Gitlab } from '@gitbeaker/node';
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { getRepoSourceDirectory, parseRepoUrl } from './util';
import { createTemplateAction } from '../../createTemplateAction';

export function createPublishGitlabAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    repoVisibility: 'private' | 'internal' | 'public';
    sourcePath?: string;
  }>({
    id: 'publish:gitlab',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to GitLab.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          repoVisibility: {
            title: 'Repository Visibility',
            type: 'string',
            enum: ['private', 'public', 'internal'],
          },
          sourcePath: {
            title:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          remoteUrl: {
            title: 'A URL to the repository with the provider',
            type: 'string',
          },
          repoContentsUrl: {
            title: 'A URL to the root of the repository',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { repoUrl, repoVisibility = 'private' } = ctx.input;

      const { owner, repo, host } = parseRepoUrl(repoUrl);

      const integrationConfig = integrations.gitlab.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      if (!integrationConfig.config.token) {
        throw new InputError(`No token available for host ${host}`);
      }

      const client = new Gitlab({
        host: integrationConfig.config.baseUrl,
        token: integrationConfig.config.token,
      });

      let { id: targetNamespace } = (await client.Namespaces.show(owner)) as {
        id: number;
      };

      if (!targetNamespace) {
        const { id } = (await client.Users.current()) as {
          id: number;
        };
        targetNamespace = id;
      }

      const { http_url_to_repo } = await client.Projects.create({
        namespace_id: targetNamespace,
        name: repo,
        visibility: repoVisibility,
      });

      const remoteUrl = (http_url_to_repo as string).replace(/\.git$/, '');
      const repoContentsUrl = `${remoteUrl}/-/blob/master`;

      await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
        remoteUrl: http_url_to_repo as string,
        auth: {
          username: 'oauth2',
          password: integrationConfig.config.token,
        },
        logger: ctx.logger,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
