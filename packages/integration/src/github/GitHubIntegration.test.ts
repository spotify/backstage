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
import { GitHubIntegration, replaceUrlType } from './GitHubIntegration';

describe('GitHubIntegration', () => {
  it('has a working factory', () => {
    const integrations = GitHubIntegration.factory({
      config: new ConfigReader({
        integrations: {
          github: [
            {
              host: 'h.com',
              apiBaseUrl: 'a',
              rawBaseUrl: 'r',
              token: 't',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('h.com');
    expect(integrations.list()[1].config.host).toBe('github.com');
  });

  it('returns the basics', () => {
    const integration = new GitHubIntegration({
      host: 'h.com',
      apiBaseUrl: 'a',
      rawBaseUrl: 'r',
      token: 't',
    });
    expect(integration.type).toBe('github');
    expect(integration.title).toBe('h.com');
    expect(integration.config.host).toBe('h.com');
  });

  it('resolveUrl', () => {
    const integration = new GitHubIntegration({ host: 'h.com' });

    expect(
      integration.resolveUrl({
        url: '../a.yaml',
        base:
          'https://github.com/backstage/backstage/blob/master/test/README.md',
        lineNumber: 17,
      }),
    ).toBe('https://github.com/backstage/backstage/tree/master/a.yaml#L17');

    expect(
      integration.resolveUrl({
        url: './',
        base:
          'https://github.com/backstage/backstage/blob/master/test/README.md',
      }),
    ).toBe('https://github.com/backstage/backstage/tree/master/test/');
  });

  it('resolve edit URL', () => {
    const integration = new GitHubIntegration({ host: 'h.com' });

    expect(
      integration.resolveEditUrl(
        'https://github.com/backstage/backstage/blob/master/README.md',
      ),
    ).toBe('https://github.com/backstage/backstage/edit/master/README.md');
  });
});

describe('replaceUrlType', () => {
  it('should replace with expected type', () => {
    expect(
      replaceUrlType(
        'https://github.com/backstage/backstage/blob/master/README.md',
        'edit',
      ),
    ).toBe('https://github.com/backstage/backstage/edit/master/README.md');
    expect(
      replaceUrlType(
        'https://github.com/webmodules/blob/blob/master/test',
        'tree',
      ),
    ).toBe('https://github.com/webmodules/blob/tree/master/test');
    expect(
      replaceUrlType('https://github.com/blob/blob/blob/master/test', 'tree'),
    ).toBe('https://github.com/blob/blob/tree/master/test');
    expect(
      replaceUrlType(
        'https://github.com/backstage/backstage/edit/tree/README.md',
        'blob',
      ),
    ).toBe('https://github.com/backstage/backstage/blob/tree/README.md');
  });
});
