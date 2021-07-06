/*
 * Copyright 2020 The Backstage Authors
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

import { PublisherBase, PublisherOptions, PublisherResult } from './types';
import { initRepoAndPush } from './helpers';
import fetch from 'cross-fetch';
import { BitbucketIntegrationConfig } from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import path from 'path';

export type RepoVisibilityOptions = 'private' | 'public';

// TODO(blam): We should probably start to use a bitbucket client here that we can change
// the baseURL to point at on-prem or public bitbucket versions like we do for
// github and ghe. There's to much logic and not enough types here for us to say that this way is better than using
// a supported bitbucket client if one exists.
export class BitbucketPublisher implements PublisherBase {
  static async fromConfig(
    config: BitbucketIntegrationConfig,
    { repoVisibility }: { repoVisibility: RepoVisibilityOptions },
  ) {
    if (config.host !== 'bitbucket.org' && !config.username)
      throw new Error(
        'Bitbucket server requires the username to be set in your config',
      );

    return new BitbucketPublisher({
      host: config.host,
      token: config.token,
      appPassword: config.appPassword,
      username: config.username,
      apiBaseUrl: config.apiBaseUrl,
      repoVisibility,
    });
  }

  constructor(
    private readonly config: {
      host: string;
      token?: string;
      appPassword?: string;
      username?: string;
      apiBaseUrl?: string;
      repoVisibility: RepoVisibilityOptions;
    },
  ) {}

  async publish({
    values,
    workspacePath,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { owner: project, name } = parseGitUrl(values.storePath);

    const description = values.description as string;
    const result = await this.createRemote({
      project,
      name,
      description,
    });

    await initRepoAndPush({
      dir: path.join(workspacePath, 'result'),
      remoteUrl: result.remoteUrl,
      auth: {
        username: this.config.username ? this.config.username : 'x-token-auth',
        password: this.config.appPassword
          ? this.config.appPassword
          : this.config.token ?? '',
      },
      logger,
    });
    return result;
  }

  private async createRemote(opts: {
    project: string;
    name: string;
    description: string;
  }): Promise<PublisherResult> {
    if (this.config.host === 'bitbucket.org') {
      return this.createBitbucketCloudRepository(opts);
    }
    return this.createBitbucketServerRepository(opts);
  }

  private async createBitbucketCloudRepository(opts: {
    project: string;
    name: string;
    description: string;
  }): Promise<PublisherResult> {
    const { project, name, description } = opts;

    let response: Response;

    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        scm: 'git',
        description: description,
        is_private: this.config.repoVisibility === 'private',
      }),
      headers: {
        Authorization: this.getAuthorizationHeader(),
        'Content-Type': 'application/json',
      },
    };
    try {
      response = await fetch(
        `https://api.bitbucket.org/2.0/repositories/${project}/${name}`,
        options,
      );
    } catch (e) {
      throw new Error(`Unable to create repository, ${e}`);
    }
    if (response.status === 200) {
      const r = await response.json();
      let remoteUrl = '';
      for (const link of r.links.clone) {
        if (link.name === 'https') {
          remoteUrl = link.href;
        }
      }

      // TODO use the urlReader to get the default branch
      const catalogInfoUrl = `${r.links.html.href}/src/master/catalog-info.yaml`;
      return { remoteUrl, catalogInfoUrl };
    }
    throw new Error(`Not a valid response code ${await response.text()}`);
  }

  private getAuthorizationHeader(): string {
    if (this.config.username && this.config.appPassword) {
      const buffer = Buffer.from(
        `${this.config.username}:${this.config.appPassword}`,
        'utf8',
      );

      return `Basic ${buffer.toString('base64')}`;
    }

    if (this.config.token) {
      return `Bearer ${this.config.token}`;
    }

    throw new Error(
      `Authorization has not been provided for Bitbucket. Please add either username + appPassword or token to the Integrations config`,
    );
  }

  private async createBitbucketServerRepository(opts: {
    project: string;
    name: string;
    description: string;
  }): Promise<PublisherResult> {
    const { project, name, description } = opts;

    let response: Response;
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        description: description,
        public: this.config.repoVisibility === 'public',
      }),
      headers: {
        Authorization: this.getAuthorizationHeader(),
        'Content-Type': 'application/json',
      },
    };

    try {
      const baseUrl = this.config.apiBaseUrl
        ? this.config.apiBaseUrl
        : `https://${this.config.host}/rest/api/1.0`;

      response = await fetch(`${baseUrl}/projects/${project}/repos`, options);
    } catch (e) {
      throw new Error(`Unable to create repository, ${e}`);
    }
    if (response.status === 201) {
      const r = await response.json();
      let remoteUrl = '';
      for (const link of r.links.clone) {
        if (link.name === 'http') {
          remoteUrl = link.href;
        }
      }
      const catalogInfoUrl = `${r.links.self[0].href}/catalog-info.yaml`;
      return { remoteUrl, catalogInfoUrl };
    }
    throw new Error(`Not a valid response code ${await response.text()}`);
  }
}
