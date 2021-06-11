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
import {
  BitbucketIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { getRepoSourceDirectory, parseRepoUrl } from './util';
import fetch from 'cross-fetch';
import { createTemplateAction } from '../../createTemplateAction';

const createBitbucketCloudRepository = async (opts: {
  workspace: string;
  project: string;
  repo: string;
  description: string;
  repoVisibility: 'private' | 'public';
  authorization: string;
}) => {
  const {
    workspace,
    project,
    repo,
    description,
    repoVisibility,
    authorization,
  } = opts;

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      scm: 'git',
      description: description,
      is_private: repoVisibility === 'private',
      project: { key: project },
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  let response: Response;
  try {
    response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo}`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }

  if (response.status !== 200) {
    throw new Error(
      `Unable to create repository, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();
  let remoteUrl = '';
  for (const link of r.links.clone) {
    if (link.name === 'https') {
      remoteUrl = link.href;
    }
  }

  // TODO use the urlReader to get the default branch
  const repoContentsUrl = `${r.links.html.href}/src/master`;
  return { remoteUrl, repoContentsUrl };
};

const createBitbucketServerRepository = async (opts: {
  host: string;
  project: string;
  repo: string;
  description: string;
  repoVisibility: 'private' | 'public';
  authorization: string;
}) => {
  const {
    host,
    project,
    repo,
    description,
    authorization,
    repoVisibility,
  } = opts;

  let response: Response;
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: repo,
      description: description,
      is_private: repoVisibility === 'private',
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `https://${host}/rest/api/1.0/projects/${project}/repos`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }

  if (response.status !== 201) {
    throw new Error(
      `Unable to create repository, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();
  let remoteUrl = '';
  for (const link of r.links.clone) {
    if (link.name === 'http') {
      remoteUrl = link.href;
    }
  }

  const repoContentsUrl = `${r.links.self[0].href}`;
  return { remoteUrl, repoContentsUrl };
};

const getAuthorizationHeader = (config: BitbucketIntegrationConfig) => {
  if (config.username && config.appPassword) {
    const buffer = Buffer.from(
      `${config.username}:${config.appPassword}`,
      'utf8',
    );

    return `Basic ${buffer.toString('base64')}`;
  }

  if (config.token) {
    return `Bearer ${config.token}`;
  }

  throw new Error(
    `Authorization has not been provided for Bitbucket. Please add either username + appPassword or token to the Integrations config`,
  );
};

export function createPublishBitbucketAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    description: string;
    repoVisibility: 'private' | 'public';
    sourcePath?: string;
  }>({
    id: 'publish:bitbucket',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to Bitbucket.',
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
          repoVisibility: {
            title: 'Repository Visibility',
            type: 'string',
            enum: ['private', 'public'],
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
      const { repoUrl, description, repoVisibility = 'private' } = ctx.input;

      const { workspace, project, repo, host } = parseRepoUrl(repoUrl);

      // Workspace is only required for bitbucket cloud
      if (host === 'bitbucket.org') {
        if (!workspace) {
          throw new InputError(
            `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing workspace`,
          );
        }
      }

      // Project is required for both bitbucket cloud and bitbucket server
      if (!project) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing project`,
        );
      }

      const integrationConfig = integrations.bitbucket.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const authorization = getAuthorizationHeader(integrationConfig.config);

      const createMethod =
        host === 'bitbucket.org'
          ? createBitbucketCloudRepository
          : createBitbucketServerRepository;

      const { remoteUrl, repoContentsUrl } = await createMethod({
        authorization,
        host,
        workspace: workspace || '',
        project,
        repo,
        repoVisibility,
        description,
      });

      await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
        remoteUrl,
        auth: {
          username: integrationConfig.config.username
            ? integrationConfig.config.username
            : 'x-token-auth',
          password: integrationConfig.config.appPassword
            ? integrationConfig.config.appPassword
            : integrationConfig.config.token ?? '',
        },
        logger: ctx.logger,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
