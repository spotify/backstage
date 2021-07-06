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
import { BitbucketIntegration } from './BitbucketIntegration';

describe('BitbucketIntegration', () => {
  it('has a working factory', () => {
    const integrations = BitbucketIntegration.factory({
      config: new ConfigReader({
        integrations: {
          bitbucket: [
            {
              host: 'h.com',
              apiBaseUrl: 'a',
              token: 't',
              username: 'u',
              appPassword: 'p',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('h.com');
    expect(integrations.list()[1].config.host).toBe('bitbucket.org');
  });

  it('returns the basics', () => {
    const integration = new BitbucketIntegration({ host: 'h.com' } as any);
    expect(integration.type).toBe('bitbucket');
    expect(integration.title).toBe('h.com');
  });

  it('resolves url line number correctly', () => {
    const integration = new BitbucketIntegration({ host: 'h.com' } as any);

    expect(
      integration.resolveUrl({
        url: './a.yaml',
        base: 'https://bitbucket.org/my-owner/my-project/src/master/README.md',
        lineNumber: 14,
      }),
    ).toBe(
      'https://bitbucket.org/my-owner/my-project/src/master/a.yaml#a.yaml-14',
    );
  });

  it('resolve edit URL', () => {
    const integration = new BitbucketIntegration({ host: 'h.com' } as any);

    expect(
      integration.resolveEditUrl(
        'https://bitbucket.org/my-owner/my-project/src/master/README.md',
      ),
    ).toBe(
      'https://bitbucket.org/my-owner/my-project/src/master/README.md?mode=edit&spa=0&at=master',
    );
  });
});
