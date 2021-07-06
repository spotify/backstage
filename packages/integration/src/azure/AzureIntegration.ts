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

import parseGitUrl from 'git-url-parse';
import { basicIntegrations, isValidUrl } from '../helpers';
import { ScmIntegration, ScmIntegrationsFactory } from '../types';
import { AzureIntegrationConfig, readAzureIntegrationConfigs } from './config';

export class AzureIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<AzureIntegration> = ({ config }) => {
    const configs = readAzureIntegrationConfigs(
      config.getOptionalConfigArray('integrations.azure') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new AzureIntegration(c)),
      i => i.config.host,
    );
  };

  constructor(private readonly integrationConfig: AzureIntegrationConfig) {}

  get type(): string {
    return 'azure';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): AzureIntegrationConfig {
    return this.integrationConfig;
  }

  /*
   * Azure repo URLs on the form with a `path` query param are treated specially.
   *
   * Example base URL: https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml
   */
  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    const { url, base } = options;

    // If we can parse the url, it is absolute - then return it verbatim
    if (isValidUrl(url)) {
      return url;
    }

    const parsed = parseGitUrl(base);
    const { organization, owner, name, filepath } = parsed;

    // If not an actual file path within a repo, treat the URL as raw
    if (!organization || !owner || !name) {
      return new URL(url, base).toString();
    }

    const path = filepath?.replace(/^\//, '') || '';
    const mockBaseUrl = new URL(`https://a.com/${path}`);
    const updatedPath = new URL(url, mockBaseUrl).pathname;

    const newUrl = new URL(base);
    newUrl.searchParams.set('path', updatedPath);

    if (options.lineNumber) {
      newUrl.searchParams.set('line', String(options.lineNumber));
      newUrl.searchParams.set('lineEnd', String(options.lineNumber + 1));
      newUrl.searchParams.set('lineStartColumn', '1');
      newUrl.searchParams.set('lineEndColumn', '1');
    }

    return newUrl.toString();
  }

  resolveEditUrl(url: string): string {
    // TODO: Implement edit URL for Azure, fallback to view url as I don't know
    // how azure works.
    return url;
  }
}
