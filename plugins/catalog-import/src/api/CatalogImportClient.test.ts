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

const octokit = {
  repos: {
    get: () => Promise.resolve({ data: { default_branch: 'main' } }),
    createOrUpdateFileContents: jest.fn().mockImplementation(async () => {}),
  },
  search: {
    code: jest.fn(),
  },
  git: {
    getRef: async () => ({
      data: { object: { sha: 'any' } },
    }),
    createRef: jest.fn().mockImplementation(async () => {}),
  },
  pulls: {
    create: jest.fn().mockImplementation(async () => ({
      data: {
        html_url: 'http://pull/request/0',
      },
    })),
  },
};

jest.doMock('@octokit/rest', () => {
  class Octokit {
    constructor() {
      return octokit;
    }
  }
  return { Octokit };
});

import { ScmIntegrations } from '@backstage/integration';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { msw } from '@backstage/test-utils';
import { Octokit } from '@octokit/rest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { CatalogImportClient } from './CatalogImportClient';

import { ConfigReader, UrlPatternDiscovery } from '@backstage/core-app-api';
import { OAuthApi } from '@backstage/core-plugin-api';

describe('CatalogImportClient', () => {
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/catalog';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);

  const githubAuthApi: jest.Mocked<OAuthApi> = {
    getAccessToken: jest.fn(),
  };
  const identityApi = {
    getUserId: () => {
      return 'user';
    },
    getProfile: () => {
      return {};
    },
    getIdToken: () => {
      return Promise.resolve('token');
    },
    signOut: () => {
      return Promise.resolve();
    },
  };

  const scmIntegrationsApi = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'example.com' }],
        gitlab: [
          {
            host: 'registered-but-not-github.com',
            apiBaseUrl: 'https://registered-but-not-github.com',
          },
        ],
      },
    }),
  );

  const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
  };

  let catalogImportClient: CatalogImportClient;

  beforeEach(() => {
    catalogImportClient = new CatalogImportClient({
      discoveryApi,
      githubAuthApi,
      scmIntegrationsApi,
      identityApi,
      catalogApi,
    });
  });

  describe('analyzeUrl', () => {
    it('should add yaml location', async () => {
      catalogApi.addLocation.mockResolvedValueOnce({
        location: {
          id: 'id-0',
          type: 'url',
          target: 'http://example.com/folder/catalog-info.yaml',
        },
        entities: [
          {
            apiVersion: '1',
            kind: 'Component',
            metadata: {
              name: 'my-entity',
              namespace: 'my-namespace',
            },
          },
        ],
      });

      await expect(
        catalogImportClient.analyzeUrl(
          'http://example.com/folder/catalog-info.yaml',
        ),
      ).resolves.toEqual({
        locations: [
          {
            entities: [
              {
                kind: 'Component',
                name: 'my-entity',
                namespace: 'my-namespace',
              },
            ],
            target: 'http://example.com/folder/catalog-info.yaml',
          },
        ],
        type: 'locations',
      });

      expect(catalogApi.addLocation).toBeCalledTimes(1);
      expect(catalogApi.addLocation.mock.calls[0][0]).toEqual({
        type: 'url',
        target: 'http://example.com/folder/catalog-info.yaml',
        dryRun: true,
      });
    });

    it('should reject for integrations that are not github ones', async () => {
      await expect(
        catalogImportClient.analyzeUrl(
          'https://registered-but-not-github.com/backstage/backstage',
        ),
      ).rejects.toThrow(
        new Error(
          'The registered-but-not-github.com integration only supports full URLs to catalog-info.yaml files. Did you try to pass in the URL of a directory instead?',
        ),
      );
    });

    it('should reject when unable to match with any integration', async () => {
      await expect(
        catalogImportClient.analyzeUrl(
          'https://not-registered-as-integration.com/foo/bar',
        ),
      ).rejects.toThrow(
        new Error(
          'This URL was not recognized as a valid GitHub URL because there was no configured integration that matched the given host name. You could try to paste the full URL to a catalog-info.yaml file instead.',
        ),
      );
    });

    it('should find locations from github', async () => {
      ((new Octokit().search.code as any) as jest.Mock).mockResolvedValueOnce({
        data: {
          total_count: 2,
          items: [
            { path: 'simple/path/catalog-info.yaml' },
            { path: 'co/mple/x/path/catalog-info.yaml' },
            { path: 'catalog-info.yaml' },
          ],
        },
      });

      catalogApi.addLocation.mockImplementation(async ({ type, target }) => ({
        location: {
          id: 'id-0',
          type: type ?? 'url',
          target,
        },
        entities: [
          {
            apiVersion: '1',
            kind: 'k',
            metadata: {
              name: 'e',
              namespace: 'n',
            },
          },
        ],
      }));

      await expect(
        catalogImportClient.analyzeUrl(
          'https://github.com/backstage/backstage',
        ),
      ).resolves.toEqual({
        locations: [
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            target:
              'https://github.com/backstage/backstage/blob/main/simple/path/catalog-info.yaml',
          },
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            target:
              'https://github.com/backstage/backstage/blob/main/co/mple/x/path/catalog-info.yaml',
          },
          {
            entities: [{ kind: 'k', name: 'e', namespace: 'n' }],
            target:
              'https://github.com/backstage/backstage/blob/main/catalog-info.yaml',
          },
        ],
        type: 'locations',
      });
    });

    it('should find repository from github', async () => {
      ((new Octokit().search.code as any) as jest.Mock).mockResolvedValueOnce({
        data: { total_count: 0, items: [] },
      });

      server.use(
        rest.post(`${mockBaseUrl}/analyze-location`, (req, res, ctx) => {
          expect(req.body).toEqual({
            location: {
              target: 'https://github.com/backstage/backstage',
              type: 'url',
            },
          });

          return res(
            ctx.json({
              generateEntities: [
                {
                  entity: {
                    kind: 'k',
                    metadata: { name: 'e', namespace: 'n' },
                  },
                  fields: [],
                },
              ],
              existingEntityFiles: [],
            }),
          );
        }),
      );

      await expect(
        catalogImportClient.analyzeUrl(
          'https://github.com/backstage/backstage',
        ),
      ).resolves.toEqual({
        type: 'repository',
        url: 'https://github.com/backstage/backstage',
        integrationType: 'github',
        generatedEntities: [
          {
            kind: 'k',
            metadata: { name: 'e', namespace: 'n' },
          },
        ],
      });
    });
  });

  describe('submitPullRequest', () => {
    it('should create GitHub pull request', async () => {
      await expect(
        catalogImportClient.submitPullRequest({
          repositoryUrl: 'https://github.com/backstage/backstage',
          fileContent: 'some content 🤖',
          title: 'A title/message',
          body: 'A body',
        }),
      ).resolves.toEqual({
        link: 'http://pull/request/0',
        location:
          'https://github.com/backstage/backstage/blob/main/catalog-info.yaml',
      });

      expect(
        ((new Octokit().git.createRef as any) as jest.Mock).mock.calls[0][0],
      ).toEqual({
        owner: 'backstage',
        repo: 'backstage',
        ref: 'refs/heads/backstage-integration',
        sha: 'any',
      });
      expect(
        ((new Octokit().repos.createOrUpdateFileContents as any) as jest.Mock)
          .mock.calls[0][0],
      ).toEqual({
        owner: 'backstage',
        repo: 'backstage',
        path: 'catalog-info.yaml',
        message: 'A title/message',
        content: 'c29tZSBjb250ZW50IPCfpJY=',
        branch: 'backstage-integration',
      });
      expect(
        ((new Octokit().pulls.create as any) as jest.Mock).mock.calls[0][0],
      ).toEqual({
        owner: 'backstage',
        repo: 'backstage',
        title: 'A title/message',
        head: 'backstage-integration',
        body: 'A body',
        base: 'main',
      });
    });
  });
});
