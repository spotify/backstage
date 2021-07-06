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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { GitLabIntegrationConfig } from './config';
import { getGitLabFileFetchUrl } from './core';

const worker = setupServer();

describe('gitlab core', () => {
  beforeAll(() => worker.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => worker.close());
  afterEach(() => worker.resetHandlers());

  beforeEach(() => {
    worker.use(
      rest.get('*/api/v4/projects/:name', (_, res, ctx) =>
        res(ctx.status(200), ctx.json({ id: 12345 })),
      ),
    );
  });

  const configWithToken: GitLabIntegrationConfig = {
    host: 'g.com',
    token: '0123456789',
    apiBaseUrl: '<ignored>',
    baseUrl: '<ignored>',
  };

  const configWithNoToken: GitLabIntegrationConfig = {
    host: 'g.com',
    apiBaseUrl: '<ignored>',
    baseUrl: '<ignored>',
  };

  describe('getGitLabFileFetchUrl', () => {
    it.each([
      // Project URLs
      {
        config: configWithNoToken,
        url:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
        result:
          'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
      },
      {
        config: configWithNoToken,
        // Works with non URI encoded link
        url:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file with spaces.yaml',
        result:
          'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile%20with%20spaces.yaml/raw?ref=branch',
      },
      {
        config: configWithNoToken,
        url:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path%20with%20spaces/to/file.yaml',
        result:
          'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%20with%20spaces%2Fto%2Ffile.yaml/raw?ref=branch',
      },
      {
        config: configWithToken,
        url:
          'https://gitlab.example.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path%20with%20spaces/to/file.yaml',
        result:
          'https://gitlab.example.com/api/v4/projects/12345/repository/files/my%2Fpath%20with%20spaces%2Fto%2Ffile.yaml/raw?ref=branch',
      },
      {
        config: configWithNoToken,
        url:
          'https://gitlab.com/groupA/teams/teamA/repoA/-/blob/branch/my/path%20with%20spaces/to/file.yaml', // Repo not in subgroup
        result:
          'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%20with%20spaces%2Fto%2Ffile.yaml/raw?ref=branch',
      },
      // Raw URLs
      {
        config: configWithNoToken,
        url: 'https://gitlab.example.com/a/b/blob/master/c.yaml',
        result: 'https://gitlab.example.com/a/b/raw/master/c.yaml',
      },
    ])('should handle happy path %#', async ({ config, url, result }) => {
      await expect(getGitLabFileFetchUrl(url, config)).resolves.toBe(result);
    });
  });
});
