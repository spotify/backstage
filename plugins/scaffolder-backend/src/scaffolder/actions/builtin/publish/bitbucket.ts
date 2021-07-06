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
  BitbucketIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import fetch from 'cross-fetch';
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { createTemplateAction } from '../../createTemplateAction';
import { getRepoSourceDirectory, parseRepoUrl } from './util';

const createBitbucketCloudRepository = async (opts: {
  owner: string;
  repo: string;
  description: string;
  repoVisibility: 'private' | 'public';
  authorization: string;
}) => {
  const { owner, repo, description, repoVisibility, authorization } = opts;

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      scm: 'git',
      description: description,
      is_private: repoVisibility === 'private',
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  let response: Response;
  try {
    response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}`,
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
  owner: string;
  repo: string;
  description: string;
  repoVisibility: 'private' | 'public';
  authorization: string;
  apiBaseUrl?: string;
}) => {
  const {
    host,
    owner,
    repo,
    description,
    authorization,
    repoVisibility,
    apiBaseUrl,
  } = opts;

  let response: Response;
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: repo,
      description: description,
      public: repoVisibility === 'public',
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    const baseUrl = apiBaseUrl ? apiBaseUrl : `https://${host}/rest/api/1.0`;
    response = await fetch(`${baseUrl}/projects/${owner}/repos`, options);
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

const performEnableLFS = async (opts: {
  authorization: string;
  host: string;
  owner: string;
  repo: string;
}) => {
  const { authorization, host, owner, repo } = opts;

  const options: RequestInit = {
    method: 'PUT',
    headers: {
      Authorization: authorization,
    },
  };

  const { ok, status, statusText } = await fetch(
    `https://${host}/rest/git-lfs/admin/projects/${owner}/repos/${repo}/enabled`,
    options,
  );

  if (!ok)
    throw new Error(
      `Failed to enable LFS in the repository, ${status}: ${statusText}`,
    );
};

export function createPublishBitbucketAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    description: string;
    defaultBranch?: string;
    repoVisibility: 'private' | 'public';
    sourcePath?: string;
    enableLFS: boolean;
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
          defaultBranch: {
            title: 'Default Branch',
            type: 'string',
            description: `Sets the default branch on the repository. The default value is 'master'`,
          },
          sourcePath: {
            title:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
          enableLFS: {
            title:
              'Enable LFS for the repository. Only available for hosted Bitbucket.',
            type: 'boolean',
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
      const {
        repoUrl,
        description,
        defaultBranch = 'master',
        repoVisibility = 'private',
        enableLFS = false,
      } = ctx.input;

      const { owner, repo, host } = parseRepoUrl(repoUrl);

      const integrationConfig = integrations.bitbucket.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const authorization = getAuthorizationHeader(integrationConfig.config);
      const apiBaseUrl = integrationConfig.config.apiBaseUrl;

      const createMethod =
        host === 'bitbucket.org'
          ? createBitbucketCloudRepository
          : createBitbucketServerRepository;

      const { remoteUrl, repoContentsUrl } = await createMethod({
        authorization,
        host,
        owner,
        repo,
        repoVisibility,
        description,
        apiBaseUrl,
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
        defaultBranch,
        logger: ctx.logger,
      });

      if (enableLFS && host !== 'bitbucket.org') {
        await performEnableLFS({ authorization, host, owner, repo });
      }

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
