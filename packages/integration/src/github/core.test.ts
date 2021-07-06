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

import { GitHubIntegrationConfig } from './config';
import { getGitHubFileFetchUrl, getGitHubRequestOptions } from './core';

describe('github core', () => {
  describe('getGitHubRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: GitHubIntegrationConfig = {
        host: '',
        rawBaseUrl: '',
        token: 'A',
      };
      const withoutToken: GitHubIntegrationConfig = {
        host: '',
        rawBaseUrl: '',
      };
      expect(
        (getGitHubRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('token A');
      expect(
        (getGitHubRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });
  });

  describe('getGitHubFileFetchUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: GitHubIntegrationConfig = { host: '', apiBaseUrl: '' };
      expect(() => getGitHubFileFetchUrl('a/b', config)).toThrow(
        /Incorrect URL: a\/b/,
      );
    });

    it('happy path for github api', () => {
      const config: GitHubIntegrationConfig = {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
      };
      expect(
        getGitHubFileFetchUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
      expect(
        getGitHubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for ghe api', () => {
      const config: GitHubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        apiBaseUrl: 'https://ghe.mycompany.net/api/v3',
      };
      expect(
        getGitHubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        'https://ghe.mycompany.net/api/v3/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for github tree', () => {
      const config: GitHubIntegrationConfig = {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
      };
      expect(
        getGitHubFileFetchUrl(
          'https://github.com/a/b/tree/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for ghe tree', () => {
      const config: GitHubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        apiBaseUrl: 'https://ghe.mycompany.net/api/v3',
      };
      expect(
        getGitHubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/tree/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        'https://ghe.mycompany.net/api/v3/repos/a/b/contents/path/to/c.yaml?ref=branchname',
      );
    });

    it('happy path for github raw', () => {
      const config: GitHubIntegrationConfig = {
        host: 'github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
      };
      expect(
        getGitHubFileFetchUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        'https://raw.githubusercontent.com/a/b/branchname/path/to/c.yaml',
      );
    });

    it('happy path for ghe raw', () => {
      const config: GitHubIntegrationConfig = {
        host: 'ghe.mycompany.net',
        rawBaseUrl: 'https://ghe.mycompany.net/raw',
      };
      expect(
        getGitHubFileFetchUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual('https://ghe.mycompany.net/raw/a/b/branchname/path/to/c.yaml');
    });
  });
});
