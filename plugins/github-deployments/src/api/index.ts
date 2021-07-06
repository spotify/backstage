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
import { parseLocationReference } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { graphql } from '@octokit/graphql';
import { createApiRef, OAuthApi } from '@backstage/core-plugin-api';

const getBaseUrl = (
  scmIntegrationsApi: ScmIntegrationRegistry,
  host: string | undefined,
): string => {
  if (host === undefined) {
    return 'https://api.github.com';
  }

  const location = parseLocationReference(host);
  if (location.type !== 'github' && location.type !== 'url') {
    return 'https://api.github.com';
  }

  const config = scmIntegrationsApi.github.byUrl(location.target);

  if (!config) {
    throw new InputError(
      `No matching GitHub integration configuration for host ${
        new URL(location.target).hostname
      }, please check your integrations config`,
    );
  }

  if (!config.config.apiBaseUrl) {
    throw new InputError(
      `No apiBaseUrl available for host ${
        new URL(location.target).hostname
      }, please check your integrations config`,
    );
  }

  return config?.config.apiBaseUrl;
};

type Node = {
  logUrl?: string;
};

export type GithubDeployment = {
  environment: string;
  state: string;
  updatedAt: string;
  commit: {
    abbreviatedOid: string;
    commitUrl: string;
  } | null;
  statuses: {
    nodes: Node[];
  };
  creator: {
    login: string;
  };
  repository: {
    nameWithOwner: string;
  };
  payload: string;
};

type QueryParams = {
  host: string | undefined;
  owner: string;
  repo: string;
  last: number;
  lastStatuses: number;
};

export interface GithubDeploymentsApi {
  listDeployments(params: QueryParams): Promise<GithubDeployment[]>;
}

export const githubDeploymentsApiRef = createApiRef<GithubDeploymentsApi>({
  id: 'plugin.github-deployments.service',
  description: 'Used by the GitHub Deployments plugin to make requests',
});

export type Options = {
  githubAuthApi: OAuthApi;
  scmIntegrationsApi: ScmIntegrationRegistry;
};

const deploymentsQuery = `
query deployments($owner: String!, $repo: String!, $last: Int, $lastStatuses: Int) {
  repository(owner: $owner, name: $repo) {
    deployments(last: $last) {
      nodes {
        state
        environment
        updatedAt
        commit {
          abbreviatedOid
          commitUrl
        }
        statuses(last: $lastStatuses) {
          nodes {
            logUrl
          }
        }
        creator {
          login
        }
        repository {
          nameWithOwner
        }
        payload
      }
    }
  }
}
`;

export type QueryResponse = {
  repository?: {
    deployments?: {
      nodes?: GithubDeployment[];
    };
  };
};

export class GithubDeploymentsApiClient implements GithubDeploymentsApi {
  private readonly githubAuthApi: OAuthApi;
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;

  constructor(options: Options) {
    this.githubAuthApi = options.githubAuthApi;
    this.scmIntegrationsApi = options.scmIntegrationsApi;
  }

  async listDeployments(params: QueryParams): Promise<GithubDeployment[]> {
    const baseUrl = getBaseUrl(this.scmIntegrationsApi, params.host);
    const token = await this.githubAuthApi.getAccessToken(['repo']);

    const graphQLWithAuth = graphql.defaults({
      baseUrl,
      headers: {
        authorization: `token ${token}`,
      },
    });

    const response: QueryResponse = await graphQLWithAuth(
      deploymentsQuery,
      params,
    );
    return response.repository?.deployments?.nodes?.reverse() || [];
  }
}
