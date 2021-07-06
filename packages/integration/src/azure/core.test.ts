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

import {
  getAzureFileFetchUrl,
  getAzureDownloadUrl,
  getAzureRequestOptions,
} from './core';

describe('azure core', () => {
  describe('getAzureRequestOptions', () => {
    it('fills in the token if necessary', () => {
      expect(getAzureRequestOptions({ host: '', token: '0123456789' })).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Basic OjAxMjM0NTY3ODk=',
          }),
        }),
      );
      expect(getAzureRequestOptions({ host: '' })).toEqual(
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        }),
      );
    });
  });

  describe('getAzureFileFetchUrl', () => {
    it.each([
      {
        url:
          'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
        result:
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?path=my-template.yaml&version=master',
      },
      {
        url:
          'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml',
        result:
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?path=my-template.yaml',
      },
      {
        url:
          'https://api.com/org-name/project-name/_git/repo-name?path=my-template.yaml',
        result:
          'https://api.com/org-name/project-name/_apis/git/repositories/repo-name/items?path=my-template.yaml',
      },
      {
        url:
          'https://api.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
        result:
          'https://api.com/org-name/project-name/_apis/git/repositories/repo-name/items?path=my-template.yaml&version=master',
      },
    ])('should handle happy path %#', async ({ url, result }) => {
      expect(getAzureFileFetchUrl(url)).toBe(result);
    });

    it.each([
      {
        url: 'https://api.com/a/b/blob/master/path/to/c.yaml',
        error:
          'Incorrect URL: https://api.com/a/b/blob/master/path/to/c.yaml, Error: Wrong Azure Devops URL or Invalid file path',
      },
      {
        url: 'com/a/b/blob/master/path/to/c.yaml',
        error:
          'Incorrect URL: com/a/b/blob/master/path/to/c.yaml, TypeError: Invalid URL: com/a/b/blob/master/path/to/c.yaml',
      },
    ])('should handle error path %#', ({ url, error }) => {
      expect(() => getAzureFileFetchUrl(url)).toThrow(error);
    });
  });

  describe('getAzureDownloadUrl', () => {
    it('do not add scopePath if no path is specified', async () => {
      const result = getAzureDownloadUrl(
        'https://dev.azure.com/organization/project/_git/repository',
      );

      expect(new URL(result).searchParams.get('scopePath')).toBeNull();
    });

    it('add scopePath if a path is specified', async () => {
      const result = getAzureDownloadUrl(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fdocs',
      );
      expect(new URL(result).searchParams.get('scopePath')).toEqual('docs');
    });
  });
});
