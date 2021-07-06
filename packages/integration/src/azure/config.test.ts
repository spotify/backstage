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
  AzureIntegrationConfig,
  readAzureIntegrationConfig,
  readAzureIntegrationConfigs,
} from './config';

describe('readAzureIntegrationConfig', () => {
  function buildConfig(data: Partial<AzureIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<AzureIntegrationConfig>,
  ): Promise<Config> {
    const schema = await loadConfigSchema({
      dependencies: [require('../../package.json').name],
    });
    const processed = schema.process(
      [{ data: { integrations: { azure: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.azure[0]);
  }

  it('reads all values', () => {
    const output = readAzureIntegrationConfig(
      buildConfig({
        host: 'a.com',
        token: 't',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      token: 't',
    });
  });

  it('inserts the defaults if missing', () => {
    const output = readAzureIntegrationConfig(buildConfig({}));
    expect(output).toEqual({ host: 'dev.azure.com' });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
      token: 't',
    };
    expect(() =>
      readAzureIntegrationConfig(buildConfig({ ...valid, host: 7 })),
    ).toThrow(/host/);
    expect(() =>
      readAzureIntegrationConfig(buildConfig({ ...valid, token: 7 })),
    ).toThrow(/token/);
  });

  it('works on the frontend', async () => {
    expect(
      readAzureIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          token: 't',
        }),
      ),
    ).toEqual({
      host: 'a.com',
    });
  });
});

describe('readAzureIntegrationConfigs', () => {
  function buildConfig(data: Partial<AzureIntegrationConfig>[]): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readAzureIntegrationConfigs(
      buildConfig([
        {
          host: 'a.com',
          token: 't',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: 'a.com',
      token: 't',
    });
  });

  it('adds a default entry when missing', () => {
    const output = readAzureIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        host: 'dev.azure.com',
      },
    ]);
  });
});
