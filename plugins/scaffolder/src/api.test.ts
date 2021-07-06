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

import { ScmIntegrations } from '@backstage/integration';
import { ScaffolderClient } from './api';
import { ConfigReader } from '@backstage/core-app-api';

describe('api', () => {
  const discoveryApi = {} as any;
  const identityApi = {} as any;
  const scmIntegrationsApi = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [
          {
            host: 'hello.com',
          },
        ],
      },
    }),
  );
  const apiClient = new ScaffolderClient({
    scmIntegrationsApi,
    discoveryApi,
    identityApi,
  });

  it('should return default and custom integrations', async () => {
    const allowedHosts = [
      'hello.com',
      'gitlab.com',
      'github.com',
      'dev.azure.com',
      'bitbucket.org',
    ];
    const integrations = await apiClient.getIntegrationsList({ allowedHosts });
    integrations.forEach(integration =>
      expect(allowedHosts).toContain(integration.host),
    );
  });
});
