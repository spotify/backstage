/*
 * Copyright 2020 Spotify AB
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

import { IdentityApi, UrlPatternDiscovery } from '@backstage/core';
import { msw } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FindingSummary, FossaApi, FossaClient } from './index';

const server = setupServer();

const identityApi: IdentityApi = {
  getUserId() {
    return 'jane-fonda';
  },
  getProfile() {
    return { email: 'jane-fonda@spotify.com' };
  },
  async getIdToken() {
    return Promise.resolve('fake-id-token');
  },
  async signOut() {
    return Promise.resolve();
  },
};

describe('FossaClient', () => {
  msw.setupDefaultHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api/proxy';
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  let client: FossaApi;

  beforeEach(() => {
    client = new FossaClient({
      discoveryApi,
      identityApi,
      organizationId: '8736',
    });
  });

  describe('getFindingSummary', () => {
    it('should report finding summary', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
          const expectedQuery =
            'count=1000&page=0&sort=title%2B&organizationId=8736&title=our-service';
          if (req.url.searchParams.toString() !== expectedQuery) {
            return res(
              ctx.status(500),
              ctx.body(
                `${req.url.searchParams.toString()} !== ${expectedQuery}`,
              ),
            );
          }

          return res(
            ctx.json([
              {
                locator: 'custom+8736/our-service',
                title: 'our-service',
                default_branch: 'develop',
                revisions: [
                  {
                    updatedAt: '2020-01-01T00:00:00Z',
                    dependency_count: 160,
                    unresolved_licensing_issue_count: 5,
                    unresolved_issue_count: 100,
                  },
                ],
              },
            ]),
          );
        }),
      );

      const summary = await client.getFindingSummary('our-service');

      expect(summary).toEqual({
        timestamp: '2020-01-01T00:00:00Z',
        issueCount: 5,
        dependencyCount: 160,
        projectDefaultBranch: 'develop',
        projectUrl:
          'https://app.fossa.com/projects/custom%2B8736%2Four-service',
      } as FindingSummary);
    });

    it('should report finding summary without licensing_issue_count', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (_req, res, ctx) => {
          return res(
            ctx.json([
              {
                locator: 'custom+8736/our-service',
                title: 'our-service',
                default_branch: 'refs/master',
                revisions: [
                  {
                    updatedAt: '2020-01-01T00:00:00Z',
                    dependency_count: 160,
                    unresolved_issue_count: 100,
                  },
                ],
              },
            ]),
          );
        }),
      );

      const summary = await client.getFindingSummary('our-service');

      expect(summary).toEqual({
        timestamp: '2020-01-01T00:00:00Z',
        issueCount: 100,
        dependencyCount: 160,
        projectDefaultBranch: 'refs/master',
        projectUrl:
          'https://app.fossa.com/projects/custom%2B8736%2Four-service',
      } as FindingSummary);
    });

    it('should handle empty result', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (_req, res, ctx) => {
          return res(ctx.json([]));
        }),
      );

      const summary = await client.getFindingSummary('our-service');

      expect(summary).toBeUndefined();
    });

    it('should ignore result with invalid title', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (_req, res, ctx) => {
          return res(ctx.json([{ title: 'our-service-2' }]));
        }),
      );

      const summary = await client.getFindingSummary('our-service');

      expect(summary).toBeUndefined();
    });

    it('should skip organizationId', async () => {
      client = new FossaClient({ discoveryApi, identityApi });

      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
          const expectedQuery =
            'count=1000&page=0&sort=title%2B&title=our-service';
          if (req.url.searchParams.toString() !== expectedQuery) {
            return res(
              ctx.status(500),
              ctx.body(
                `${req.url.searchParams.toString()} !== ${expectedQuery}`,
              ),
            );
          }

          return res(ctx.json([]));
        }),
      );

      const summary = await client.getFindingSummary('our-service');

      expect(summary).toBeUndefined();
    });

    it('should handle 404 status', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      await expect(client.getFindingSummary('our-service')).rejects.toThrow();
    });
  });

  describe('getFindingSummaries', () => {
    it('should report finding summary', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
          const expectedQuery =
            'count=1000&page=0&sort=title%2B&organizationId=8736';
          if (req.url.searchParams.toString() !== expectedQuery) {
            return res(
              ctx.status(500),
              ctx.body(
                `${req.url.searchParams.toString()} !== ${expectedQuery}`,
              ),
            );
          }

          return res(
            ctx.json([
              {
                locator: 'custom+8736/our-service',
                title: 'our-service',
                default_branch: 'develop',
                revisions: [
                  {
                    updatedAt: '2020-01-01T00:00:00Z',
                    dependency_count: 160,
                    unresolved_licensing_issue_count: 5,
                    unresolved_issue_count: 100,
                  },
                ],
              },
              {
                locator: 'custom+8736/our-service-2',
                title: 'our-service-2',
                default_branch: 'develop',
                revisions: [
                  {
                    updatedAt: '2020-01-01T00:00:00Z',
                    dependency_count: 160,
                    unresolved_licensing_issue_count: 5,
                    unresolved_issue_count: 100,
                  },
                ],
              },
              {
                locator: 'custom+8736/our-service-3',
                title: 'our-service-3',
                default_branch: 'develop',
                revisions: [
                  {
                    updatedAt: '2020-01-01T00:00:00Z',
                    dependency_count: 160,
                    unresolved_licensing_issue_count: 5,
                    unresolved_issue_count: 100,
                  },
                ],
              },
            ]),
          );
        }),
      );

      const summary = await client.getFindingSummaries([
        'our-service',
        'our-service-2',
      ]);

      expect(summary).toEqual(
        new Map<string, FindingSummary>([
          [
            'our-service',
            {
              timestamp: '2020-01-01T00:00:00Z',
              issueCount: 5,
              dependencyCount: 160,
              projectDefaultBranch: 'develop',
              projectUrl:
                'https://app.fossa.com/projects/custom%2B8736%2Four-service',
            },
          ],
          [
            'our-service-2',
            {
              timestamp: '2020-01-01T00:00:00Z',
              issueCount: 5,
              dependencyCount: 160,
              projectDefaultBranch: 'develop',
              projectUrl:
                'https://app.fossa.com/projects/custom%2B8736%2Four-service-2',
            },
          ],
        ]),
      );
    });

    it('should handle multiple pages', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (req, res, ctx) => {
          const page = req.url.searchParams.get('page');

          if (page === '0') {
            return res(
              ctx.json(
                [...Array(1000)].map(() => ({
                  locator: 'custom+8736/our-service',
                  title: 'our-service-2',
                  default_branch: 'develop',
                  revisions: [
                    {
                      updatedAt: '2020-01-01T00:00:00Z',
                      dependency_count: 160,
                      unresolved_licensing_issue_count: 5,
                      unresolved_issue_count: 100,
                    },
                  ],
                })),
              ),
            );
          }

          return res(
            ctx.json([
              {
                locator: 'custom+8736/our-service',
                title: 'our-service',
                default_branch: 'develop',
                revisions: [
                  {
                    updatedAt: '2020-01-01T00:00:00Z',
                    dependency_count: 160,
                    unresolved_licensing_issue_count: 5,
                    unresolved_issue_count: 100,
                  },
                ],
              },
            ]),
          );
        }),
      );

      const summary = await client.getFindingSummaries(['our-service']);

      expect(summary).toEqual(
        new Map<string, FindingSummary>([
          [
            'our-service',
            {
              timestamp: '2020-01-01T00:00:00Z',
              issueCount: 5,
              dependencyCount: 160,
              projectDefaultBranch: 'develop',
              projectUrl:
                'https://app.fossa.com/projects/custom%2B8736%2Four-service',
            },
          ],
        ]),
      );
    });

    it('should handle empty result', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (_req, res, ctx) => {
          return res(ctx.json([]));
        }),
      );

      const summary = await client.getFindingSummaries([
        'our-service',
        'our-service-2',
      ]);

      expect(summary).toEqual(new Map());
    });

    it('should handle 404 status', async () => {
      server.use(
        rest.get(`${mockBaseUrl}/fossa/projects`, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      await expect(
        client.getFindingSummaries(['our-service', 'our-service-2']),
      ).rejects.toThrow();
    });
  });
});
