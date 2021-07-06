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
import { IGitApi } from 'azure-devops-node-api/GitApi';
import { GitRepositoryCreateOptions } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { initRepoAndPush } from './helpers';
import { AzureIntegrationConfig } from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import path from 'path';

export class AzurePublisher implements PublisherBase {
  static async fromConfig(config: AzureIntegrationConfig) {
    if (!config.token) {
      return undefined;
    }
    return new AzurePublisher({ token: config.token });
  }

  constructor(private readonly config: { token: string }) {}

  async publish({
    values,
    workspacePath,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { owner, name, organization, resource } = parseGitUrl(
      values.storePath,
    );
    const authHandler = getPersonalAccessTokenHandler(this.config.token);
    const webApi = new WebApi(
      `https://${resource}/${organization}`,
      authHandler,
    );
    const client = await webApi.getGitApi();

    const remoteUrl = await this.createRemote({
      project: owner,
      name,
      client,
    });

    const catalogInfoUrl = `${remoteUrl}?path=%2Fcatalog-info.yaml`;

    await initRepoAndPush({
      dir: path.join(workspacePath, 'result'),
      remoteUrl,
      auth: {
        username: 'notempty',
        password: this.config.token,
      },
      logger,
    });

    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(opts: {
    name: string;
    project: string;
    client: IGitApi;
  }) {
    const { name, project, client } = opts;
    const createOptions: GitRepositoryCreateOptions = { name };
    const repo = await client.createRepository(createOptions, project);

    return repo.remoteUrl || '';
  }
}
