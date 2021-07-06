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
  GitLabIntegrationConfig,
  readGitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from './config';

describe('readGitLabIntegrationConfig', () => {
  function buildConfig(data: Partial<GitLabIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<GitLabIntegrationConfig>,
  ): Promise<Config> {
    const schema = await loadConfigSchema({
      dependencies: [require('../../package.json').name],
    });
    const processed = schema.process(
      [{ data: { integrations: { gitlab: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.gitlab[0]);
  }

  it('reads all values', () => {
    const output = readGitLabIntegrationConfig(
      buildConfig({
        host: 'a.com',
        token: 't',
        apiBaseUrl: 'https://a.com',
        baseUrl: 'https://baseurl.for.me/gitlab',
      }),
    );

    expect(output).toEqual({
      host: 'a.com',
      token: 't',
      apiBaseUrl: 'https://a.com',
      baseUrl: 'https://baseurl.for.me/gitlab',
    });
  });

  it('inserts the defaults if missing', () => {
    const output = readGitLabIntegrationConfig(
      buildConfig({ host: 'gitlab.com' }),
    );
    expect(output).toEqual({
      host: 'gitlab.com',
      apiBaseUrl: 'https://gitlab.com/api/v4',
      baseUrl: 'https://gitlab.com',
    });
  });

  it('injects the correct GitLab API base URL when missing', () => {
    const output = readGitLabIntegrationConfig(
      buildConfig({ host: 'gitlab.com' }),
    );

    expect(output).toEqual({
      host: 'gitlab.com',
      baseUrl: 'https://gitlab.com',
      apiBaseUrl: 'https://gitlab.com/api/v4',
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
      token: 't',
    };
    expect(() =>
      readGitLabIntegrationConfig(buildConfig({ ...valid, host: 7 })),
    ).toThrow(/host/);
    expect(() =>
      readGitLabIntegrationConfig(buildConfig({ ...valid, token: 7 })),
    ).toThrow(/token/);
  });

  it('works on the frontend', async () => {
    expect(
      readGitLabIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          token: 't',
          baseUrl: 'https://a.com',
        }),
      ),
    ).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      baseUrl: 'https://a.com',
    });
  });
});

describe('readGitLabIntegrationConfigs', () => {
  function buildConfig(data: Partial<GitLabIntegrationConfig>[]): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readGitLabIntegrationConfigs(
      buildConfig([
        {
          host: 'a.com',
          token: 't',
          apiBaseUrl: 'https://a.com/api/v4',
          baseUrl: 'https://a.com',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: 'a.com',
      token: 't',
      apiBaseUrl: 'https://a.com/api/v4',
      baseUrl: 'https://a.com',
    });
  });

  it('adds a default entry when missing', () => {
    const output = readGitLabIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        host: 'gitlab.com',
        apiBaseUrl: 'https://gitlab.com/api/v4',
        baseUrl: 'https://gitlab.com',
      },
    ]);
  });
});
