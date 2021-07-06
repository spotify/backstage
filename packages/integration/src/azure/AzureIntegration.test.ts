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

import { ConfigReader } from '@backstage/config';
import { AzureIntegration } from './AzureIntegration';

describe('AzureIntegration', () => {
  it('has a working factory', () => {
    const integrations = AzureIntegration.factory({
      config: new ConfigReader({
        integrations: {
          azure: [
            {
              host: 'h.com',
              token: 'token',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('h.com');
    expect(integrations.list()[1].config.host).toBe('dev.azure.com');
  });

  it('returns the basics', () => {
    const integration = new AzureIntegration({ host: 'h.com' } as any);
    expect(integration.type).toBe('azure');
    expect(integration.title).toBe('h.com');
  });

  describe('resolveUrl', () => {
    it('works for valid urls', () => {
      const integration = new AzureIntegration({
        host: 'dev.azure.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: '../a.yaml',
          base:
            'https://dev.azure.com/organization/project/_git/repository?path=%2Ffolder%2Fcatalog-info.yaml',
        }),
      ).toBe(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fa.yaml',
      );

      expect(
        integration.resolveUrl({
          url: '/a.yaml',
          base:
            'https://dev.azure.com/organization/project/_git/repository?path=%2Ffolder%2Fcatalog-info.yaml',
          lineNumber: 14,
        }),
      ).toBe(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fa.yaml&line=14&lineEnd=15&lineStartColumn=1&lineEndColumn=1',
      );

      expect(
        integration.resolveUrl({
          url: './a.yaml',
          base: 'https://dev.azure.com/organization/project/_git/repository',
        }),
      ).toBe(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fa.yaml',
      );

      expect(
        integration.resolveUrl({
          url: 'https://absolute.com/path',
          base:
            'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
        }),
      ).toBe('https://absolute.com/path');
    });

    it('falls back to regular URL resolution if not in a repo', () => {
      const integration = new AzureIntegration({
        host: 'dev.azure.com',
      } as any);

      expect(
        integration.resolveUrl({
          url: './test',
          base: 'https://dev.azure.com/organization/project/_git',
        }),
      ).toBe('https://dev.azure.com/organization/project/test');
    });
  });

  it('resolve edit URL', () => {
    const integration = new AzureIntegration({ host: 'h.com' } as any);

    // TODO: The Azure integration doesn't support resolving an edit URL yet,
    // instead we keep the input URL.
    expect(
      integration.resolveEditUrl(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
      ),
    ).toBe(
      'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );
  });
});
