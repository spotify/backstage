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

import { LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  ScmIntegrations,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import path from 'path';
import { toAbsoluteUrl } from './LocationEntityProcessor';

describe('LocationEntityProcessor', () => {
  describe('toAbsoluteUrl', () => {
    it('handles files', () => {
      const integrations = ({} as unknown) as ScmIntegrationRegistry;
      const base: LocationSpec = {
        type: 'file',
        target: `some${path.sep}path${path.sep}catalog-info.yaml`,
      };
      expect(toAbsoluteUrl(integrations, base, `.${path.sep}c`)).toBe(
        `some${path.sep}path${path.sep}c`,
      );
      expect(toAbsoluteUrl(integrations, base, `${path.sep}c`)).toBe(
        `${path.sep}c`,
      );
    });

    it('handles urls', () => {
      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const base: LocationSpec = {
        type: 'url',
        target: 'http://a.com/b/catalog-info.yaml',
      };
      jest.spyOn(integrations, 'resolveUrl');

      expect(toAbsoluteUrl(integrations, base, './c/d')).toBe(
        'http://a.com/b/c/d',
      );
      expect(toAbsoluteUrl(integrations, base, 'c/d')).toBe(
        'http://a.com/b/c/d',
      );
      expect(toAbsoluteUrl(integrations, base, 'http://b.com/z')).toBe(
        'http://b.com/z',
      );

      expect(integrations.resolveUrl).toBeCalledTimes(3);
    });

    it('handles azure urls specifically', () => {
      const integrations = ScmIntegrations.fromConfig(
        new ConfigReader({
          integrations: {
            azure: [{ host: 'dev.azure.com' }],
          },
        }),
      );

      expect(
        toAbsoluteUrl(
          integrations,
          {
            type: 'url',
            target:
              'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
          },
          './a.yaml',
        ),
      ).toBe(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fa.yaml',
      );
    });
  });
});
