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
import { InputError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from '@octokit/rest';
import { createTemplateAction } from '../../createTemplateAction';
import { Config } from '@backstage/config';

const host = 'github.com';

export function createGithubActionsDispatchAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations } = options;

  const credentialsProviders = new Map(
    integrations.github.list().map(integration => {
      const provider = GithubCredentialsProvider.create(integration.config);
      return [integration.config.host, provider];
    }),
  );

  return createTemplateAction<{
    owner: string;
    repoName: string;
    workflowId: string;
    branchOrTagName: string;
  }>({
    id: 'ci:github-actions-dispatch',
    description:
      'Dispatches a GitHub Action workflow for a given branch or tag',
    schema: {
      input: {
        type: 'object',
        required: ['owner', 'repoName', 'workflowId', 'branchOrTagName'],
        properties: {
          owner: {
            title: 'Repository Owner',
            description: 'GitHub Org or User name owner of the repository',
            type: 'string',
          },
          repoName: {
            title: 'Repository Name',
            description: `Repo`,
            type: 'string',
          },
          workflowId: {
            title: 'Workflow ID',
            description: 'The GitHub Action Workflow filename',
            type: 'string',
          },
          branchOrTagName: {
            title: 'Branch or Tag name',
            description:
              'The git branch or tag name used to dispatch the workflow',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { owner, repoName, workflowId, branchOrTagName } = ctx.input;

      ctx.logger.info(
        `Dispatching workflow ${workflowId} for repo ${owner}/${repoName} on ${branchOrTagName}`,
      );

      const credentialsProvider = credentialsProviders.get(host);
      const integrationConfig = integrations.github.byHost(host);

      if (!credentialsProvider || !integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      // TODO(blam): Consider changing this API to have owner, repo interface instead of URL as the it's
      // needless to create URL and then parse again the other side.
      const { token } = await credentialsProvider.getCredentials({
        url: `https://${host}/${encodeURIComponent(owner)}/${encodeURIComponent(
          repoName,
        )}`,
      });

      if (!token) {
        throw new InputError(
          `No token available for host: ${host}, with owner ${owner}, and repo ${repoName}`,
        );
      }

      const client = new Octokit({
        auth: ctx.token ?? token,
        baseUrl: integrationConfig.config.apiBaseUrl,
        previews: ['nebula-preview'],
      });

      await client.rest.actions.createWorkflowDispatch({
        owner,
        repo,
        workflow_id: workflowId,
        ref: branchOrTagName,
      });

      ctx.logger.info(`Workflow ${workflowId} dispatched successfully`);
    },
  });
}
