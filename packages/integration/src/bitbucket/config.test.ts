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
  BitbucketIntegrationConfig,
  readBitbucketIntegrationConfig,
  readBitbucketIntegrationConfigs,
} from './config';

describe('readBitbucketIntegrationConfig', () => {
  function buildConfig(data: Partial<BitbucketIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<BitbucketIntegrationConfig>,
  ): Promise<Config> {
    const schema = await loadConfigSchema({
      dependencies: [require('../../package.json').name],
    });
    const processed = schema.process(
      [{ data: { integrations: { bitbucket: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader(
      (processed[0].data as any).integrations.bitbucket[0],
    );
  }

  it('reads all values', () => {
    const output = readBitbucketIntegrationConfig(
      buildConfig({
        host: 'a.com',
        apiBaseUrl: 'https://a.com/api',
        token: 't',
        username: 'u',
        appPassword: 'p',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      token: 't',
      username: 'u',
      appPassword: 'p',
    });
  });

  it('inserts the defaults if missing', () => {
    const output = readBitbucketIntegrationConfig(buildConfig({}));
    expect(output).toEqual(
      expect.objectContaining({
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      }),
    );
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      token: 't',
      username: 'u',
      appPassword: 'p',
    };
    expect(() =>
      readBitbucketIntegrationConfig(buildConfig({ ...valid, host: 7 })),
    ).toThrow(/host/);
    expect(() =>
      readBitbucketIntegrationConfig(buildConfig({ ...valid, apiBaseUrl: 7 })),
    ).toThrow(/apiBaseUrl/);
    expect(() =>
      readBitbucketIntegrationConfig(buildConfig({ ...valid, token: 7 })),
    ).toThrow(/token/);
    expect(() =>
      readBitbucketIntegrationConfig(buildConfig({ ...valid, username: 7 })),
    ).toThrow(/username/);
    expect(() =>
      readBitbucketIntegrationConfig(buildConfig({ ...valid, appPassword: 7 })),
    ).toThrow(/appPassword/);
  });

  it('works on the frontend', async () => {
    expect(
      readBitbucketIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          token: 't',
          username: 'u',
          appPassword: 'p',
        }),
      ),
    ).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
    });
  });
});

describe('readBitbucketIntegrationConfigs', () => {
  function buildConfig(data: Partial<BitbucketIntegrationConfig>[]): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readBitbucketIntegrationConfigs(
      buildConfig([
        {
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          token: 't',
          username: 'u',
          appPassword: 'p',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      token: 't',
      username: 'u',
      appPassword: 'p',
    });
  });

  it('adds a default Bitbucket Cloud entry when missing', () => {
    const output = readBitbucketIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      },
    ]);
  });

  it('injects the correct Bitbucket Cloud API base URL when missing', () => {
    const output = readBitbucketIntegrationConfigs(
      buildConfig([{ host: 'bitbucket.org' }]),
    );
    expect(output).toEqual([
      {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      },
    ]);
  });
});
