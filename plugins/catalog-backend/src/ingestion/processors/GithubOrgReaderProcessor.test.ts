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
jest.mock('@octokit/graphql');
import { getVoidLogger } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import {
  ScmIntegrations,
  GithubCredentialsProvider,
} from '@backstage/integration';
import { GithubOrgReaderProcessor, parseUrl } from './GithubOrgReaderProcessor';
import { graphql } from '@octokit/graphql';
import { ConfigReader } from '@backstage/config';

describe('GithubOrgReaderProcessor', () => {
  describe('parseUrl', () => {
    it('only supports clean org urls, and decodes them', () => {
      expect(() => parseUrl('https://github.com')).toThrow();
      expect(() => parseUrl('https://github.com/org/foo')).toThrow();
      expect(() => parseUrl('https://github.com/org/foo/teams')).toThrow();
      expect(parseUrl('https://github.com/foo%32')).toEqual({ org: 'foo2' });
    });
  });

  describe('implementation', () => {
    const logger = getVoidLogger();
    const integrations = ScmIntegrations.fromConfig(
      new ConfigReader({
        integrations: {
          github: [
            {
              host: 'github.com',
            },
          ],
        },
      }),
    );

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('rejects unknown targets from integrations', async () => {
      const processor = new GithubOrgReaderProcessor({
        integrations,
        logger,
      });
      const location: LocationSpec = {
        type: 'github-org',
        target: 'https://not.github.com/apa',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no GitHub Org provider that matches https:\/\/not.github.com\/apa/,
      );
    });

    it('should not query for email addresses when GitHub Apps is used for authentication', async () => {
      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'app',
      });

      const mockClient = jest.fn();

      mockClient
        .mockResolvedValueOnce({
          organization: {
            membersWithRole: { pageInfo: { hasNextPage: false }, nodes: [{}] },
          },
        })
        .mockResolvedValueOnce({
          organization: {
            teams: {
              pageInfo: { hasNextPage: false },
              nodes: [
                { members: { pageInfo: { hasNextPage: false }, nodes: [{}] } },
              ],
            },
          },
        });

      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      jest.spyOn(GithubCredentialsProvider, 'create').mockReturnValue({
        getCredentials: mockGetCredentials,
      } as any);

      const processor = new GithubOrgReaderProcessor({
        integrations,
        logger,
      });
      const location: LocationSpec = {
        type: 'github-org',
        target: 'https://github.com/backstage',
      };

      await processor.readLocation(location, false, () => {});

      expect(mockClient).toHaveBeenCalledWith(
        expect.stringContaining('@include(if: $email)'),
        expect.objectContaining({ email: false }),
      );
    });

    it('should query for email addresses when token is used for authentication', async () => {
      const mockGetCredentials = jest.fn().mockReturnValue({
        headers: { token: 'blah' },
        type: 'token',
      });

      const mockClient = jest.fn();

      mockClient
        .mockResolvedValueOnce({
          organization: {
            membersWithRole: { pageInfo: { hasNextPage: false }, nodes: [{}] },
          },
        })
        .mockResolvedValueOnce({
          organization: {
            teams: {
              pageInfo: { hasNextPage: false },
              nodes: [
                { members: { pageInfo: { hasNextPage: false }, nodes: [{}] } },
              ],
            },
          },
        });

      (graphql.defaults as jest.Mock).mockReturnValue(mockClient);

      jest.spyOn(GithubCredentialsProvider, 'create').mockReturnValue({
        getCredentials: mockGetCredentials,
      } as any);

      const processor = new GithubOrgReaderProcessor({
        integrations,
        logger,
      });
      const location: LocationSpec = {
        type: 'github-org',
        target: 'https://github.com/backstage',
      };

      await processor.readLocation(location, false, () => {});

      expect(mockClient).toHaveBeenCalledWith(
        expect.stringContaining('@include(if: $email)'),
        expect.objectContaining({ email: true }),
      );
    });
  });
});
