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

import parseGitUrl from 'git-url-parse';
import { GithubAppConfig, GitHubIntegrationConfig } from './config';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { DateTime } from 'luxon';

type InstallationData = {
  installationId: number;
  suspended: boolean;
  repositorySelection: 'selected' | 'all';
};

class Cache {
  private readonly tokenCache = new Map<
    string,
    { token: string; expiresAt: DateTime }
  >();

  async getOrCreateToken(
    key: string,
    supplier: () => Promise<{ token: string; expiresAt: DateTime }>,
  ): Promise<{ accessToken: string }> {
    const item = this.tokenCache.get(key);
    if (item && this.isNotExpired(item.expiresAt)) {
      return { accessToken: item.token };
    }

    const result = await supplier();
    this.tokenCache.set(key, result);
    return { accessToken: result.token };
  }

  // consider timestamps older than 50 minutes to be expired.
  private isNotExpired = (date: DateTime) =>
    date.diff(DateTime.local(), 'minutes').minutes > 50;
}

/**
 * This accept header is required when calling App APIs in GitHub Enterprise.
 * It has no effect on calls to github.com and can probably be removed entirely
 * once GitHub Apps is out of preview.
 */
const HEADERS = {
  Accept: 'application/vnd.github.machine-man-preview+json',
};

/**
 * GithubAppManager issues and caches tokens for a specific GitHub App.
 */
class GithubAppManager {
  private readonly appClient: Octokit;
  private readonly baseAuthConfig: { appId: number; privateKey: string };
  private readonly cache = new Cache();

  constructor(config: GithubAppConfig, baseUrl?: string) {
    this.baseAuthConfig = {
      appId: config.appId,
      privateKey: config.privateKey,
    };
    this.appClient = new Octokit({
      baseUrl,
      headers: HEADERS,
      authStrategy: createAppAuth,
      auth: this.baseAuthConfig,
    });
  }

  async getInstallationCredentials(
    owner: string,
    repo?: string,
  ): Promise<{ accessToken: string }> {
    const {
      installationId,
      suspended,
      repositorySelection,
    } = await this.getInstallationData(owner);
    if (suspended) {
      throw new Error(
        `The GitHub application for ${[owner, repo]
          .filter(Boolean)
          .join('/')} is suspended`,
      );
    }
    if (repositorySelection !== 'all' && !repo) {
      throw new Error(
        `The Backstage GitHub application used in the ${owner} organization must be installed for the entire organization to be able to issue credentials without a specified repository.`,
      );
    }

    const cacheKey = !repo ? owner : `${owner}/${repo}`;
    const repositories = repositorySelection !== 'all' ? [repo!] : undefined;

    // Go and grab an access token for the app scoped to a repository if provided, if not use the organisation installation.
    return this.cache.getOrCreateToken(cacheKey, async () => {
      const result = await this.appClient.apps.createInstallationAccessToken({
        installation_id: installationId,
        headers: HEADERS,
        repositories,
      });
      return {
        token: result.data.token,
        expiresAt: DateTime.fromISO(result.data.expires_at),
      };
    });
  }

  getInstallations(): Promise<
    RestEndpointMethodTypes['apps']['listInstallations']['response']['data']
  > {
    return this.appClient.paginate(this.appClient.apps.listInstallations);
  }

  private async getInstallationData(owner: string): Promise<InstallationData> {
    const allInstallations = await this.getInstallations();
    const installation = allInstallations.find(
      inst => inst.account?.login === owner,
    );
    if (installation) {
      return {
        installationId: installation.id,
        suspended: Boolean(installation.suspended_by),
        repositorySelection: installation.repository_selection,
      };
    }
    const notFoundError = new Error(
      `No app installation found for ${owner} in ${this.baseAuthConfig.appId}`,
    );
    notFoundError.name = 'NotFoundError';
    throw notFoundError;
  }
}

// GithubAppCredentialsMux corresponds to a Github installation which internally could hold several GitHub Apps.
export class GithubAppCredentialsMux {
  private readonly apps: GithubAppManager[];

  constructor(config: GitHubIntegrationConfig) {
    this.apps =
      config.apps?.map(ac => new GithubAppManager(ac, config.apiBaseUrl)) ?? [];
  }

  async getAllInstallations(): Promise<
    RestEndpointMethodTypes['apps']['listInstallations']['response']['data']
  > {
    if (!this.apps.length) {
      return [];
    }

    const installs = await Promise.all(
      this.apps.map(app => app.getInstallations()),
    );

    return installs.flat();
  }

  async getAppToken(owner: string, repo?: string): Promise<string | undefined> {
    if (this.apps.length === 0) {
      return undefined;
    }

    const results = await Promise.all(
      this.apps.map(app =>
        app.getInstallationCredentials(owner, repo).then(
          credentials => ({ credentials, error: undefined }),
          error => ({ credentials: undefined, error }),
        ),
      ),
    );

    const result = results.find(resultItem => resultItem.credentials);
    if (result) {
      return result.credentials!.accessToken;
    }

    const errors = results.map(r => r.error);
    const notNotFoundError = errors.find(err => err.name !== 'NotFoundError');
    if (notNotFoundError) {
      throw notNotFoundError;
    }

    return undefined;
  }
}

export type GithubCredentialType = 'app' | 'token';

export type GithubCredentials = {
  headers?: { [name: string]: string };
  token?: string;
  type: GithubCredentialType;
};

// TODO: Possibly move this to a backend only package so that it's not used in the frontend by mistake
export class GithubCredentialsProvider {
  static create(config: GitHubIntegrationConfig): GithubCredentialsProvider {
    return new GithubCredentialsProvider(
      new GithubAppCredentialsMux(config),
      config.token,
    );
  }

  private constructor(
    private readonly githubAppCredentialsMux: GithubAppCredentialsMux,
    private readonly token?: string,
  ) {}

  /**
   * Returns GithubCredentials for requested url.
   * Consecutive calls to this method with the same url will return cached credentials.
   * The shortest lifetime for a token returned is 10 minutes.
   * @param opts containing the organization or repository url
   * @returns {Promise} of @type {GithubCredentials}.
   * @example
   * const { token, headers } = await getCredentials({url: 'github.com/backstage/foobar'})
   */
  async getCredentials(opts: { url: string }): Promise<GithubCredentials> {
    const parsed = parseGitUrl(opts.url);

    const owner = parsed.owner || parsed.name;
    const repo = parsed.owner ? parsed.name : undefined;

    let type: GithubCredentialType = 'app';
    let token = await this.githubAppCredentialsMux.getAppToken(owner, repo);
    if (!token) {
      type = 'token';
      token = this.token;
    }

    return {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      token,
      type,
    };
  }
}
