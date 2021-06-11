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
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { GitRepositoryCreateOptions } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { getRepoSourceDirectory, parseRepoUrl } from './util';
import { createTemplateAction } from '../../createTemplateAction';

export function createPublishAzureAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    sourcePath?: string;
  }>({
    id: 'publish:azure',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to Azure.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          description: {
            title: 'Repository Description',
            type: 'string',
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
      const { owner, repo, host, organization } = parseRepoUrl(
        ctx.input.repoUrl,
      );

      if (!organization) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing organization`,
        );
      }

      const integrationConfig = integrations.azure.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }
      if (!integrationConfig.config.token) {
        throw new InputError(`No token provided for Azure Integration ${host}`);
      }
      const authHandler = getPersonalAccessTokenHandler(
        integrationConfig.config.token,
      );

      const webApi = new WebApi(`https://${host}/${organization}`, authHandler);
      const client = await webApi.getGitApi();
      const createOptions: GitRepositoryCreateOptions = { name: repo };
      const returnedRepo = await client.createRepository(createOptions, owner);

      if (!returnedRepo) {
        throw new InputError(
          `Unable to create the repository with Organization ${organization}, Project ${owner} and Repo ${repo}.
          Please make sure that both the Org and Project are typed corrected and exist.`,
        );
      }
      const remoteUrl = returnedRepo.remoteUrl;

      if (!remoteUrl) {
        throw new InputError(
          'No remote URL returned from create repository for Azure',
        );
      }

      // blam: Repo contents is serialized into the path,
      // so it's just the base path I think
      const repoContentsUrl = remoteUrl;

      await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
        remoteUrl,
        auth: {
          username: 'notempty',
          password: integrationConfig.config.token,
        },
        logger: ctx.logger,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
