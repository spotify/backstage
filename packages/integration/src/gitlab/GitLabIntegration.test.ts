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
import { GitLabIntegration, replaceUrlType } from './GitLabIntegration';

describe('GitLabIntegration', () => {
  it('has a working factory', () => {
    const integrations = GitLabIntegration.factory({
      config: new ConfigReader({
        integrations: {
          gitlab: [
            {
              host: 'h.com',
              token: 't',
              apiBaseUrl: 'https://h.com/api/v4',
              baseUrl: 'https://h.com',
            },
          ],
        },
      }),
    });
    expect(integrations.list().length).toBe(2); // including default
    expect(integrations.list()[0].config.host).toBe('h.com');
    expect(integrations.list()[1].config.host).toBe('gitlab.com');
  });

  it('returns the basics', () => {
    const integration = new GitLabIntegration({ host: 'h.com' } as any);
    expect(integration.type).toBe('gitlab');
    expect(integration.title).toBe('h.com');
  });

  it('resolve edit URL', () => {
    const integration = new GitLabIntegration({ host: 'h.com' } as any);

    expect(
      integration.resolveEditUrl(
        'https://gitlab.com/my-org/my-project/-/blob/develop/README.md',
      ),
    ).toBe('https://gitlab.com/my-org/my-project/-/edit/develop/README.md');
  });
});

describe('replaceUrlType', () => {
  it('should replace with expected type', () => {
    expect(
      replaceUrlType(
        'https://gitlab.com/my-org/my-project/-/blob/develop/README.md',
        'edit',
      ),
    ).toBe('https://gitlab.com/my-org/my-project/-/edit/develop/README.md');
    expect(
      replaceUrlType(
        'https://gitlab.com/webmodules/blob/-/blob/develop/test',
        'tree',
      ),
    ).toBe('https://gitlab.com/webmodules/blob/-/tree/develop/test');
    expect(
      replaceUrlType(
        'https://gitlab.com/blob/blob/-/blob/develop/test',
        'tree',
      ),
    ).toBe('https://gitlab.com/blob/blob/-/tree/develop/test');
    expect(
      replaceUrlType(
        'https://gitlab.com/blob/blob/-/edit/develop/README.md',
        'tree',
      ),
    ).toBe('https://gitlab.com/blob/blob/-/tree/develop/README.md');
  });
});
