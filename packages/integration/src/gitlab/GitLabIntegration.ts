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

import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import {
  GitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from './config';

export class GitLabIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<GitLabIntegration> = ({ config }) => {
    const configs = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new GitLabIntegration(c)),
      i => i.config.host,
    );
  };

  constructor(private readonly integrationConfig: GitLabIntegrationConfig) {}

  get type(): string {
    return 'gitlab';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): GitLabIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    return defaultScmResolveUrl(options);
  }

  resolveEditUrl(url: string): string {
    return replaceUrlType(url, 'edit');
  }
}

export function replaceUrlType(
  url: string,
  type: 'blob' | 'tree' | 'edit',
): string {
  return url.replace(/\/\-\/(blob|tree|edit)\//, `/-/${type}/`);
}
