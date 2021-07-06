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

import { Config, ConfigReader } from '@backstage/config';
import { loadConfigSchema } from '@backstage/config-loader';
import {
  GitHubIntegrationConfig,
  readGitHubIntegrationConfig,
  readGitHubIntegrationConfigs,
} from './config';

describe('readGitHubIntegrationConfig', () => {
  function buildConfig(provider: Partial<GitHubIntegrationConfig>) {
    return new ConfigReader(provider);
  }

  async function buildFrontendConfig(
    data: Partial<GitHubIntegrationConfig>,
  ): Promise<Config> {
    const schema = await loadConfigSchema({
      dependencies: [require('../../package.json').name],
    });
    const processed = schema.process(
      [{ data: { integrations: { github: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.github[0]);
  }

  it('reads all values', () => {
    const output = readGitHubIntegrationConfig(
      buildConfig({
        host: 'a.com',
        apiBaseUrl: 'https://a.com/api',
        rawBaseUrl: 'https://a.com/raw',
        token: 't',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
      token: 't',
    });
  });

  it('injects the correct GitHub API base URL when missing', () => {
    const output = readGitHubIntegrationConfig(
      buildConfig({ host: 'github.com' }),
    );
    expect(output).toEqual({
      host: 'github.com',
      apiBaseUrl: 'https://api.github.com',
      rawBaseUrl: 'https://raw.githubusercontent.com',
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
      token: 't',
    };
    expect(() =>
      readGitHubIntegrationConfig(buildConfig({ ...valid, host: 7 })),
    ).toThrow(/host/);
    expect(() =>
      readGitHubIntegrationConfig(buildConfig({ ...valid, apiBaseUrl: 7 })),
    ).toThrow(/apiBaseUrl/);
    expect(() =>
      readGitHubIntegrationConfig(buildConfig({ ...valid, rawBaseUrl: 7 })),
    ).toThrow(/rawBaseUrl/);
    expect(() =>
      readGitHubIntegrationConfig(buildConfig({ ...valid, token: 7 })),
    ).toThrow(/token/);
  });

  it('works on the frontend', async () => {
    expect(
      readGitHubIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          rawBaseUrl: 'https://a.com/raw',
          token: 't',
        }),
      ),
    ).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
    });
  });
});

describe('readGitHubIntegrationConfigs', () => {
  function buildConfig(
    providers: Partial<GitHubIntegrationConfig>[],
  ): Config[] {
    return providers.map(provider => new ConfigReader(provider));
  }

  it('reads all values', () => {
    const output = readGitHubIntegrationConfigs(
      buildConfig([
        {
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          rawBaseUrl: 'https://a.com/raw',
          token: 't',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
      token: 't',
    });
  });

  it('adds a default GitHub entry when missing', () => {
    const output = readGitHubIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
      },
    ]);
  });
});
