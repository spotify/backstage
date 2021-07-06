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

import { GitReleaseClient } from './GitReleaseClient';

import { ConfigReader } from '@backstage/core-app-api';
import { OAuthApi } from '@backstage/core-plugin-api';

describe('GitReleaseClient', () => {
  it('should return the default plugin api client', () => {
    const configApi = new ConfigReader({});
    const githubAuthApi: OAuthApi = {
      getAccessToken: jest.fn(),
    };
    const gitReleaseClient = new GitReleaseClient({
      configApi,
      githubAuthApi,
    });

    expect(gitReleaseClient).toMatchInlineSnapshot(`
      GitReleaseClient {
        "apiBaseUrl": "https://api.github.com",
        "createCommit": [Function],
        "createRef": [Function],
        "createRelease": [Function],
        "createTagObject": [Function],
        "getAllReleases": [Function],
        "getAllTags": [Function],
        "getBranch": [Function],
        "getCommit": [Function],
        "getComparison": [Function],
        "getHost": [Function],
        "getLatestRelease": [Function],
        "getOwners": [Function],
        "getRecentCommits": [Function],
        "getRepoPath": [Function],
        "getRepositories": [Function],
        "getRepository": [Function],
        "getTag": [Function],
        "getUser": [Function],
        "githubAuthApi": Object {
          "getAccessToken": [MockFunction],
        },
        "host": "github.com",
        "merge": [Function],
        "updateRef": [Function],
        "updateRelease": [Function],
      }
    `);
  });
});
