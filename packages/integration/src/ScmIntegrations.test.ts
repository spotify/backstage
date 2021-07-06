/*
 * Copyright 2021 The Backstage Authors
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

import { AzureIntegrationConfig } from './azure';
import { AzureIntegration } from './azure/AzureIntegration';
import { BitbucketIntegrationConfig } from './bitbucket';
import { BitbucketIntegration } from './bitbucket/BitbucketIntegration';
import { GitHubIntegrationConfig } from './github';
import { GitHubIntegration } from './github/GitHubIntegration';
import { GitLabIntegrationConfig } from './gitlab';
import { GitLabIntegration } from './gitlab/GitLabIntegration';
import { basicIntegrations } from './helpers';
import { ScmIntegrations } from './ScmIntegrations';

describe('ScmIntegrations', () => {
  const azure = new AzureIntegration({
    host: 'azure.local',
  } as AzureIntegrationConfig);

  const bitbucket = new BitbucketIntegration({
    host: 'bitbucket.local',
  } as BitbucketIntegrationConfig);

  const github = new GitHubIntegration({
    host: 'github.local',
  } as GitHubIntegrationConfig);

  const gitlab = new GitLabIntegration({
    host: 'gitlab.local',
  } as GitLabIntegrationConfig);

  const i = new ScmIntegrations({
    azure: basicIntegrations([azure], item => item.config.host),
    bitbucket: basicIntegrations([bitbucket], item => item.config.host),
    github: basicIntegrations([github], item => item.config.host),
    gitlab: basicIntegrations([gitlab], item => item.config.host),
  });

  it('can get the specifics', () => {
    expect(i.azure.byUrl('https://azure.local')).toBe(azure);
    expect(i.bitbucket.byUrl('https://bitbucket.local')).toBe(bitbucket);
    expect(i.github.byUrl('https://github.local')).toBe(github);
    expect(i.gitlab.byUrl('https://gitlab.local')).toBe(gitlab);
  });

  it('can list', () => {
    expect(i.list()).toEqual(
      expect.arrayContaining([azure, bitbucket, github, gitlab]),
    );
  });

  it('can select by url and host', () => {
    expect(i.byUrl('https://azure.local')).toBe(azure);
    expect(i.byUrl('https://bitbucket.local')).toBe(bitbucket);
    expect(i.byUrl('https://github.local')).toBe(github);
    expect(i.byUrl('https://gitlab.local')).toBe(gitlab);

    expect(i.byHost('azure.local')).toBe(azure);
    expect(i.byHost('bitbucket.local')).toBe(bitbucket);
    expect(i.byHost('github.local')).toBe(github);
    expect(i.byHost('gitlab.local')).toBe(gitlab);
  });

  it('can resolveUrl using fallback', () => {
    expect(
      i.resolveUrl({
        url: '../b.yaml',
        base: 'https://no-matching-integration.com/x/a.yaml',
      }),
    ).toBe('https://no-matching-integration.com/b.yaml');
    expect(
      i.resolveUrl({
        url: 'https://absolute.com/path',
        base: 'https://no-matching-integration.com/x/a.yaml',
      }),
    ).toBe('https://absolute.com/path');
  });

  it('can resolveEditUrl using fallback', () => {
    expect(i.resolveEditUrl('http://example.com/x/a.yaml')).toBe(
      'http://example.com/x/a.yaml',
    );
  });
});
