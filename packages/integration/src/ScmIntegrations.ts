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

import { Config } from '@backstage/config';
import { AzureIntegration } from './azure/AzureIntegration';
import { BitbucketIntegration } from './bitbucket/BitbucketIntegration';
import { GitHubIntegration } from './github/GitHubIntegration';
import { GitLabIntegration } from './gitlab/GitLabIntegration';
import { defaultScmResolveUrl } from './helpers';
import { ScmIntegration, ScmIntegrationsGroup } from './types';
import { ScmIntegrationRegistry } from './registry';

type IntegrationsByType = {
  azure: ScmIntegrationsGroup<AzureIntegration>;
  bitbucket: ScmIntegrationsGroup<BitbucketIntegration>;
  github: ScmIntegrationsGroup<GitHubIntegration>;
  gitlab: ScmIntegrationsGroup<GitLabIntegration>;
};

export class ScmIntegrations implements ScmIntegrationRegistry {
  private readonly byType: IntegrationsByType;

  static fromConfig(config: Config): ScmIntegrations {
    return new ScmIntegrations({
      azure: AzureIntegration.factory({ config }),
      bitbucket: BitbucketIntegration.factory({ config }),
      github: GitHubIntegration.factory({ config }),
      gitlab: GitLabIntegration.factory({ config }),
    });
  }

  constructor(integrationsByType: IntegrationsByType) {
    this.byType = integrationsByType;
  }

  get azure(): ScmIntegrationsGroup<AzureIntegration> {
    return this.byType.azure;
  }

  get bitbucket(): ScmIntegrationsGroup<BitbucketIntegration> {
    return this.byType.bitbucket;
  }

  get github(): ScmIntegrationsGroup<GitHubIntegration> {
    return this.byType.github;
  }

  get gitlab(): ScmIntegrationsGroup<GitLabIntegration> {
    return this.byType.gitlab;
  }

  list(): ScmIntegration[] {
    return Object.values(this.byType).flatMap(
      i => i.list() as ScmIntegration[],
    );
  }

  byUrl(url: string | URL): ScmIntegration | undefined {
    return Object.values(this.byType)
      .map(i => i.byUrl(url))
      .find(Boolean);
  }

  byHost(host: string): ScmIntegration | undefined {
    return Object.values(this.byType)
      .map(i => i.byHost(host))
      .find(Boolean);
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    const integration = this.byUrl(options.base);
    if (!integration) {
      return defaultScmResolveUrl(options);
    }

    return integration.resolveUrl(options);
  }

  resolveEditUrl(url: string): string {
    const integration = this.byUrl(url);
    if (!integration) {
      return url;
    }

    return integration.resolveEditUrl(url);
  }
}
