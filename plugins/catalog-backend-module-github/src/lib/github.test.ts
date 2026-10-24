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
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { graphql as graphqlOctokit } from '@octokit/graphql';
import { CacheService } from '@backstage/backend-plugin-api';
import { graphql as graphqlMsw, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { TeamTransformer, UserTransformer } from './defaultTransformers';
import {
  getOrganizationsFromUser,
  getOrganizationTeams,
  getOrganizationUsers,
  getTeamMembers,
  getOrganizationRepositories,
  getOrganizationRepository,
  QueryResponse,
  GithubUser,
  GithubTeam,
  createAddEntitiesOperation,
  createRemoveEntitiesOperation,
  createReplaceEntitiesOperation,
  createGraphqlClient,
  createRestClient,
  getOrganizationTeamsForUser,
  isSuspended,
  isGitHubEnterprise,
} from './github';
import { Octokit } from '@octokit/core';
import { throttling } from '@octokit/plugin-throttling';
import { retry } from '@octokit/plugin-retry';

// Note: We do NOT mock @octokit/core globally because createRestClient
// needs a real Octokit.plugin. The createGraphqlClient tests use a local
// jest.spyOn instead.

describe('github', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const graphql = graphqlOctokit.defaults({});

  describe('getOrganizationTeamsForUser', () => {
    const org = 'my-org';
    const userLogin = 'testuser';

    it('returns teams for a user', async () => {
      server.use(
        graphqlMsw.query('teams', () =>
          HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      slug: 'team1',
                      combinedSlug: 'my-org/team1',
                      name: 'Team 1',
                      description: 'desc',
                      avatarUrl: '',
                      editTeamUrl: '',
                      parentTeam: null,
                    },
                  ],
                },
              },
            },
          }),
        ),
      );

      const mockTransformer = jest.fn().mockImplementation(async team => ({
        kind: 'Group',
        metadata: { name: team.slug },
      }));

      const { teams } = await getOrganizationTeamsForUser(
        graphql as any,
        org,
        userLogin,
        mockTransformer as any,
      );
      expect(Array.isArray(teams)).toBe(true);
      expect(teams[0]).toEqual({ kind: 'Group', metadata: { name: 'team1' } });
      expect(mockTransformer).toHaveBeenCalled();
    });

    it('returns an empty array if no teams found', async () => {
      server.use(
        graphqlMsw.query('teams', () =>
          HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [],
                },
              },
            },
          }),
        ),
      );
      const mockTransformer = jest.fn().mockResolvedValue(undefined);
      const { teams } = await getOrganizationTeamsForUser(
        graphql as any,
        org,
        userLogin,
        mockTransformer as any,
      );
      expect(Array.isArray(teams)).toBe(true);
      expect(teams.length).toBe(0);
    });
  });

  describe('getOrganizationUsers using defaultUserMapper', () => {
    it('reads members', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({ name: 'a', description: 'c' }),
            spec: {
              profile: { displayName: 'b', email: 'd', picture: 'e' },
              memberOf: [],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token'),
      ).resolves.toEqual(output);
    });

    it('reads members excluding suspended users', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
                suspendedAt: '2025-01-01',
              },
              {
                login: 'a',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
                suspendedAt: undefined,
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({ name: 'a', description: 'c' }),
            spec: {
              profile: { displayName: 'b', email: 'd', picture: 'e' },
              memberOf: [],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token', undefined, undefined, true),
      ).resolves.toEqual(output);
    });

    it('reads members excluding suspended users via REST when restClient provided', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'suspended-user',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
              {
                login: 'active-user',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'active-user',
              description: 'c',
            }),
            spec: {
              profile: { displayName: 'b', email: 'd', picture: 'e' },
              memberOf: [],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      const mockRestClient = {
        request: jest.fn().mockImplementation((route: string, params: any) => {
          if (route === 'GET /versions') {
            return Promise.resolve({
              headers: { 'x-github-enterprise-version': '3.12.0' },
            });
          }
          if (route === 'GET /users/{username}') {
            if (params.username === 'suspended-user') {
              return { data: { suspended_at: '2025-01-01T00:00:00Z' } };
            }
            return { data: { suspended_at: null } };
          }
          return { data: { role: 'member', state: 'active' } };
        }),
      } as any;

      await expect(
        getOrganizationUsers(
          graphql,
          'a',
          'token',
          undefined,
          undefined,
          true,
          mockRestClient,
        ),
      ).resolves.toEqual(output);
    });

    it('reads members excluding org-membership-suspended users via REST', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'org-suspended-user',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
              {
                login: 'active-user',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
            ],
          },
        },
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      const mockRestClient = {
        request: jest.fn().mockImplementation((route: string, params: any) => {
          if (route === 'GET /versions') {
            return Promise.resolve({
              headers: { 'x-github-enterprise-version': '3.12.0' },
            });
          }
          if (route === 'GET /users/{username}') {
            return { data: { suspended_at: null } };
          }
          if (route === 'GET /orgs/{org}/memberships/{username}') {
            if (params.username === 'org-suspended-user') {
              return { data: { role: 'suspended', state: 'active' } };
            }
            return { data: { role: 'member', state: 'active' } };
          }
          return { data: {} };
        }),
      } as any;

      const result = await getOrganizationUsers(
        graphql,
        'a',
        'token',
        undefined,
        undefined,
        true,
        mockRestClient,
      );

      expect(result.users).toHaveLength(1);
      expect(result.users[0].metadata.name).toBe('active-user');
    });

    it('skips REST suspended user check on non-enterprise GitHub', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'suspended-user',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
              {
                login: 'active-user',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
            ],
          },
        },
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      const nonEnterpriseRestClient = {
        request: jest.fn().mockImplementation((route: string) => {
          if (route === 'GET /versions') {
            return Promise.resolve({ headers: {} });
          }
          throw new Error('isSuspended should not be called');
        }),
      } as any;

      const result = await getOrganizationUsers(
        graphql,
        'a',
        'token',
        undefined,
        undefined,
        true,
        nonEnterpriseRestClient,
      );

      // Both users should be returned because the REST check is skipped
      // on non-enterprise (no suspendedAt field in query either since restClient is provided)
      expect(result.users).toHaveLength(2);
      expect(nonEnterpriseRestClient.request).toHaveBeenCalledTimes(1);
      expect(nonEnterpriseRestClient.request).toHaveBeenCalledWith(
        'GET /versions',
      );
    });
  });

  describe('getOrganizationUsers using custom UserTransformer', () => {
    const customUserTransformer: UserTransformer = async (
      item: GithubUser,
      {},
    ) => {
      if (item.login === 'aa') {
        return undefined;
      }

      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: `${item.login}-custom`,
          annotations: {
            'github.com/user-login': item.login,
          },
        },
        spec: {
          profile: {},
          memberOf: [],
        },
      } as UserEntity;
    };

    it('reads members', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'a-custom',
            }),
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token', customUserTransformer),
      ).resolves.toEqual(output);
    });

    it('reads members if undefined is returned from transformer', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
              {
                login: 'aa',
                name: 'bb',
                bio: 'cc',
                email: 'dd',
                avatarUrl: 'ee',
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'a-custom',
            }),
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      const users = await getOrganizationUsers(
        graphql,
        'a',
        'token',
        customUserTransformer,
      );

      expect(users.users).toHaveLength(1);
      expect(users).toEqual(output);
    });

    it('reads members including suspended users', async () => {
      const input: QueryResponse = {
        organization: {
          membersWithRole: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a',
                name: 'b',
                bio: 'c',
                email: 'd',
                avatarUrl: 'e',
              },
              {
                login: 'ab',
                name: 'bb',
                bio: 'cc',
                email: 'dd',
                avatarUrl: 'ee',
                suspendedAt: '2025-01-01',
              },
            ],
          },
        },
      };

      const output = {
        users: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'a-custom',
            }),
          }),
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'ab-custom',
            }),
          }),
        ],
      };

      server.use(
        graphqlMsw.query('users', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationUsers(
          graphql,
          'a',
          'token',
          customUserTransformer,
          undefined,
          false,
        ),
      ).resolves.toEqual(output);
    });
  });

  describe('getOrganizationTeams using default TeamTransformer', () => {
    let input: QueryResponse;

    beforeEach(() => {
      input = {
        organization: {
          teams: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                slug: 'team',
                combinedSlug: 'blah/team',
                name: 'Team',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
            ],
          },
        },
      };
    });

    it('reads teams', async () => {
      const output = {
        teams: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'team',
              description: 'The one and only team',
              annotations: {
                'github.com/team-slug': 'blah/team',
                'backstage.io/edit-url':
                  'http://example.com/orgs/blah/teams/team/edit',
              },
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
              members: ['user'],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('teams', () => HttpResponse.json({ data: input })),
      );

      await expect(getOrganizationTeams(graphql, 'a')).resolves.toEqual(output);
    });
  });

  describe('getOrganizationTeams using custom TeamTransformer', () => {
    let input: QueryResponse;

    const customTeamTransformer: TeamTransformer = async (
      item: GithubTeam,
      {},
    ) => {
      if (item.name === 'aa') {
        return undefined;
      }

      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: `${item.name}-custom`,
          annotations: {
            'github.com/team-slug': 'blah/team',
            'backstage.io/edit-url':
              'http://example.com/orgs/blah/teams/team/edit',
          },
          description: item.description,
        },
        spec: {
          type: 'team',
          profile: {
            displayName: `${item.name}-custom`,
            picture: 'http://example.com/team.jpeg',
          },
          parent: 'parent',
          children: [],
          members: ['user'],
        },
      } as GroupEntity;
    };

    beforeEach(() => {
      input = {
        organization: {
          teams: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                slug: 'team',
                combinedSlug: 'blah/team',
                name: 'Team',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
            ],
          },
        },
      };
    });

    it('reads teams', async () => {
      const output = {
        teams: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'Team-custom',
              description: 'The one and only team',
              annotations: {
                'github.com/team-slug': 'blah/team',
                'backstage.io/edit-url':
                  'http://example.com/orgs/blah/teams/team/edit',
              },
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team-custom',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
              members: ['user'],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('teams', () => HttpResponse.json({ data: input })),
      );

      await expect(
        getOrganizationTeams(graphql, 'a', customTeamTransformer),
      ).resolves.toEqual(output);
    });

    it('reads teams if undefined is returned', async () => {
      input = {
        organization: {
          teams: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                slug: 'team',
                combinedSlug: 'blah/team',
                name: 'Team',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
              {
                slug: 'team',
                combinedSlug: 'blah/team',
                name: 'aa',
                description: 'The one and only team',
                avatarUrl: 'http://example.com/team.jpeg',
                editTeamUrl: 'http://example.com/orgs/blah/teams/team/edit',
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: [],
                },
                members: {
                  pageInfo: { hasNextPage: false },
                  nodes: [{ login: 'user' }],
                },
              },
            ],
          },
        },
      };

      const output = {
        teams: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'Team-custom',
              description: 'The one and only team',
              annotations: {
                'github.com/team-slug': 'blah/team',
                'backstage.io/edit-url':
                  'http://example.com/orgs/blah/teams/team/edit',
              },
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team-custom',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
              members: ['user'],
            },
          }),
        ],
      };

      server.use(
        graphqlMsw.query('teams', () => HttpResponse.json({ data: input })),
      );

      const teams = await getOrganizationTeams(
        graphql,
        'a',
        customTeamTransformer,
      );

      expect(teams.teams).toHaveLength(1);
      expect(teams).toEqual(output);
    });
  });

  describe('getOrganizationsFromUser', () => {
    it('reads orgs from user', async () => {
      const input: QueryResponse = {
        user: {
          organizations: {
            pageInfo: { hasNextPage: false },
            nodes: [
              {
                login: 'a',
              },
              {
                login: 'b',
              },
              {
                login: 'c',
              },
            ],
          },
        },
      };

      server.use(
        graphqlMsw.query('orgs', () => HttpResponse.json({ data: input })),
      );

      await expect(getOrganizationsFromUser(graphql, 'foo')).resolves.toEqual({
        orgs: ['a', 'b', 'c'],
      });
    });
  });

  describe('getTeamMembers', () => {
    it('reads team members', async () => {
      const input: QueryResponse = {
        organization: {
          team: {
            slug: '',
            combinedSlug: '',
            members: {
              pageInfo: { hasNextPage: false },
              nodes: [{ login: 'user' }],
            },
          },
        },
      };

      const output = {
        members: [{ login: 'user' }],
      };

      server.use(
        graphqlMsw.query('members', () => HttpResponse.json({ data: input })),
      );

      await expect(getTeamMembers(graphql, 'a', 'b')).resolves.toEqual(output);
    });
  });

  describe('getOrganizationRepositories', () => {
    it('read repositories', async () => {
      const input: QueryResponse = {
        repositoryOwner: {
          repositories: {
            nodes: [
              {
                name: 'backstage',
                url: 'https://github.com/backstage/backstage',
                isArchived: false,
                isFork: false,
                repositoryTopics: {
                  nodes: [{ topic: { name: 'blah' } }],
                },
                defaultBranchRef: {
                  name: 'main',
                },
                catalogInfoFile: null,
                visibility: 'public',
              },
              {
                name: 'demo',
                url: 'https://github.com/backstage/demo',
                isArchived: true,
                isFork: true,
                repositoryTopics: { nodes: [] },
                defaultBranchRef: {
                  name: 'main',
                },
                catalogInfoFile: {
                  __typename: 'Blob',
                  id: 'acb123',
                  text: 'some yaml',
                },
                visibility: 'private',
              },
            ],
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      };

      const output = {
        repositories: [
          {
            name: 'backstage',
            url: 'https://github.com/backstage/backstage',
            isArchived: false,
            isFork: false,
            repositoryTopics: {
              nodes: [{ topic: { name: 'blah' } }],
            },
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: null,
            visibility: 'public',
          },
          {
            name: 'demo',
            url: 'https://github.com/backstage/demo',
            isArchived: true,
            isFork: true,
            repositoryTopics: { nodes: [] },
            defaultBranchRef: {
              name: 'main',
            },
            catalogInfoFile: {
              __typename: 'Blob',
              id: 'acb123',
              text: 'some yaml',
            },
            visibility: 'private',
          },
        ],
        nextCursor: undefined,
      };

      server.use(
        graphqlMsw.query('repositories', ({ variables }) => {
          expect(variables.catalogPathRef).toBe('HEAD:catalog-info.yaml');
          return HttpResponse.json({ data: input });
        }),
      );

      await expect(
        getOrganizationRepositories(graphql, 'a', 'catalog-info.yaml'),
      ).resolves.toEqual(output);
    });

    it('uses provided branch for catalog path ref', async () => {
      server.use(
        graphqlMsw.query('repositories', ({ variables }) => {
          expect(variables.catalogPathRef).toBe('develop:catalog-info.yaml');
          return HttpResponse.json({
            data: {
              repositoryOwner: {
                repositories: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      name: 'repo1',
                      url: 'https://github.com/my-org/repo1',
                      isArchived: false,
                      isFork: false,
                      visibility: 'public',
                      defaultBranchRef: { name: 'main' },
                      catalogInfoFile: null,
                      repositoryTopics: { nodes: [] },
                    },
                  ],
                },
              },
            },
          });
        }),
      );

      await getOrganizationRepositories(
        graphql as any,
        'my-org',
        '/catalog-info.yaml',
        undefined,
        'develop',
      );
    });

    it('passes startCursor and returns nextCursor when chunkSize is reached', async () => {
      server.use(
        graphqlMsw.query('repositories', ({ variables }) => {
          if (variables.cursor === 'start-cursor') {
            return HttpResponse.json({
              data: {
                repositoryOwner: {
                  repositories: {
                    pageInfo: { hasNextPage: true, endCursor: 'end-cursor' },
                    nodes: [
                      {
                        name: 'repo1',
                        url: 'https://github.com/my-org/repo1',
                        isArchived: false,
                        isFork: false,
                        visibility: 'public',
                        defaultBranchRef: { name: 'main' },
                        catalogInfoFile: null,
                        repositoryTopics: { nodes: [] },
                      },
                    ],
                  },
                },
              },
            });
          }
          return HttpResponse.json({
            data: {
              repositoryOwner: {
                repositories: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [],
                },
              },
            },
          });
        }),
      );

      const { repositories, nextCursor } = await getOrganizationRepositories(
        graphql as any,
        'my-org',
        '/catalog-info.yaml',
        undefined,
        undefined,
        { startCursor: 'start-cursor', chunkSize: 1 },
      );

      expect(repositories).toHaveLength(1);
      expect(nextCursor).toBe('end-cursor');
    });
  });

  describe('getOrganizationRepository', () => {
    const repositoryData = {
      repositoryOwner: {
        repository: {
          name: 'my-repo',
          url: 'https://github.com/my-org/my-repo',
          isArchived: false,
          isFork: false,
          visibility: 'public',
          defaultBranchRef: { name: 'main' },
          catalogInfoFile: null,
          repositoryTopics: { nodes: [] },
        },
      },
    };

    it('defaults catalogPathRef to HEAD when no branch is provided', async () => {
      server.use(
        graphqlMsw.query('repository', ({ variables }) => {
          expect(variables.catalogPathRef).toBe('HEAD:catalog-info.yaml');
          return HttpResponse.json({ data: repositoryData });
        }),
      );

      await getOrganizationRepository(
        graphql as any,
        'my-org',
        'my-repo',
        'catalog-info.yaml',
      );
    });

    it('uses provided branch for catalogPathRef', async () => {
      server.use(
        graphqlMsw.query('repository', ({ variables }) => {
          expect(variables.catalogPathRef).toBe(
            'my-feature-branch:catalog-info.yaml',
          );
          return HttpResponse.json({ data: repositoryData });
        }),
      );

      await getOrganizationRepository(
        graphql as any,
        'my-org',
        'my-repo',
        'catalog-info.yaml',
        'my-feature-branch',
      );
    });
  });

  describe('createAddEntitiesOperation', () => {
    it('create a function to add deferred entities to a delta operation', () => {
      const operation = createAddEntitiesOperation('my-id', 'host');

      const userEntity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/githubuser',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/githubuser',
            'github.com/user-login': 'githubuser',
          },
        },
        spec: {
          memberOf: ['new-team'],
        },
      };
      expect(operation('org', [userEntity])).toEqual({
        added: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
        removed: [],
      });
    });
  });

  describe('createRemoveEntitiesOperation', () => {
    it('create a function to remove deferred entities to a delta operation', () => {
      const operation = createRemoveEntitiesOperation('my-id', 'host');

      const userEntity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/githubuser',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/githubuser',
            'github.com/user-login': 'githubuser',
          },
        },
        spec: {
          memberOf: ['new-team'],
        },
      };
      expect(operation('org', [userEntity])).toEqual({
        removed: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
        added: [],
      });
    });
  });
  describe('createReplaceEntitiesOperation', () => {
    it('create a function to replace deferred entities to a delta operation', () => {
      const operation = createReplaceEntitiesOperation('my-id', 'host');

      const userEntity: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'githubuser',
          annotations: {
            'backstage.io/managed-by-location':
              'url:https://github.com/githubuser',
            'backstage.io/managed-by-origin-location':
              'url:https://github.com/githubuser',
            'github.com/user-login': 'githubuser',
          },
        },
        spec: {
          memberOf: ['new-team'],
        },
      };
      expect(operation('org', [userEntity])).toEqual({
        removed: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
        added: [
          {
            locationKey: 'github-org-provider:my-id',
            entity: userEntity,
          },
        ],
      });
    });
  });

  describe('createGraphqlClient', () => {
    const headers = {};

    const baseUrl = 'https://api.github.com';

    const logger = mockServices.rootLogger();

    const mockClient = jest.fn().mockImplementation();

    const graphqlDefaults = jest.fn().mockReturnValue(mockClient);
    const mockedOctokit = jest.fn().mockImplementation(() => ({
      graphql: {
        defaults: graphqlDefaults,
      },
    }));

    let pluginSpy: jest.SpyInstance;

    beforeEach(() => {
      pluginSpy = jest
        .spyOn(Octokit, 'plugin')
        .mockReturnValue(mockedOctokit as any);
    });

    afterEach(() => {
      pluginSpy.mockRestore();
    });

    const rateLimitOptions = {
      method: 'POST',
      url: '/graphql',
    };

    it('should return a graphql client with throttling and retry', async () => {
      const client = createGraphqlClient({
        headers,
        baseUrl,
        logger,
      });
      expect(client).toBeDefined();
      expect(Octokit.plugin).toHaveBeenCalledWith(throttling, retry);
    });

    it('should return a graphql client with the correct options', async () => {
      createGraphqlClient({
        headers,
        baseUrl,
        logger,
      });
      expect(graphqlDefaults).toHaveBeenCalledWith({
        baseUrl,
        headers,
      });
    });

    describe('onRateLimit', () => {
      it.each([
        { retryCount: 0, expectedResult: true },
        { retryCount: 1, expectedResult: true },
        { retryCount: 2, expectedResult: false },
      ])('should return %s', async ({ retryCount, expectedResult }) => {
        createGraphqlClient({ headers, baseUrl, logger });

        const throttleOptions = mockedOctokit.mock.calls[0][0].throttle;

        const result = throttleOptions.onRateLimit(
          60,
          rateLimitOptions,
          undefined,
          retryCount,
        );

        expect(result).toBe(expectedResult);
      });
    });

    describe('onSecondaryRateLimit', () => {
      it.each([
        { retryCount: 0, expectedResult: true },
        { retryCount: 1, expectedResult: true },
        { retryCount: 2, expectedResult: false },
      ])('should return %s', async ({ retryCount, expectedResult }) => {
        createGraphqlClient({ headers, baseUrl, logger });

        const throttleOptions = mockedOctokit.mock.calls[0][0].throttle;

        const result = throttleOptions.onSecondaryRateLimit(
          60,
          rateLimitOptions,
          undefined,
          retryCount,
        );

        expect(result).toBe(expectedResult);
      });
    });
  });

  describe('createRestClient', () => {
    const baseUrl = 'https://api.github.com';
    const orgUrl = 'https://github.com/my-org';

    const mockCredentialsProvider = {
      getCredentials: jest.fn().mockResolvedValue({
        type: 'token' as const,
        headers: { authorization: 'token test-token' },
      }),
    };

    describe('conditional request caching', () => {
      function createMockCache(): CacheService & {
        store: Map<string, unknown>;
      } {
        const store = new Map<string, unknown>();
        const cache: CacheService & { store: Map<string, unknown> } = {
          store,
          async get(key: string) {
            return store.get(key) as any;
          },
          async set(key: string, value: unknown) {
            store.set(key, value);
          },
          async delete(key: string) {
            store.delete(key);
          },
          withOptions() {
            return cache;
          },
        };
        return cache;
      }

      it('caches responses using last-modified header', async () => {
        let requestCount = 0;
        server.use(
          http.get(`${baseUrl}/users/testuser`, () => {
            requestCount++;
            return HttpResponse.json(
              { login: 'testuser', suspended_at: null },
              { headers: { 'Last-Modified': 'Thu, 01 Jan 2025 00:00:00 GMT' } },
            );
          }),
        );

        const cache = createMockCache();
        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
          cache,
        });

        await octokit.request('GET /users/{username}', {
          username: 'testuser',
        });

        expect(requestCount).toBe(1);
        const cached = cache.store.get(
          `catalog-backend-module-github:GET:${baseUrl}/users/testuser`,
        ) as any;
        expect(cached.lastModified).toBe('Thu, 01 Jan 2025 00:00:00 GMT');
        expect(cached.data).toEqual({ login: 'testuser', suspended_at: null });
      });

      it('sends if-modified-since on subsequent requests', async () => {
        let receivedHeaders: Record<string, string> = {};
        server.use(
          http.get(`${baseUrl}/users/testuser`, ({ request }) => {
            receivedHeaders = Object.fromEntries(request.headers.entries());
            return HttpResponse.json(
              { login: 'testuser', suspended_at: null },
              { headers: { 'Last-Modified': 'Thu, 01 Jan 2025 00:00:00 GMT' } },
            );
          }),
        );

        const cache = createMockCache();
        cache.store.set(
          `catalog-backend-module-github:GET:${baseUrl}/users/testuser`,
          {
            lastModified: 'Wed, 01 Jan 2025 00:00:00 GMT',
            data: { login: 'testuser', suspended_at: null },
          },
        );

        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
          cache,
        });

        await octokit.request('GET /users/{username}', {
          username: 'testuser',
        });

        expect(receivedHeaders['if-modified-since']).toBe(
          'Wed, 01 Jan 2025 00:00:00 GMT',
        );
      });

      it('sends if-none-match when only etag is cached', async () => {
        let receivedHeaders: Record<string, string> = {};
        server.use(
          http.get(`${baseUrl}/users/testuser`, ({ request }) => {
            receivedHeaders = Object.fromEntries(request.headers.entries());
            return HttpResponse.json(
              { login: 'testuser', suspended_at: null },
              { headers: { ETag: '"new-etag"' } },
            );
          }),
        );

        const cache = createMockCache();
        cache.store.set(
          `catalog-backend-module-github:GET:${baseUrl}/users/testuser`,
          {
            etag: '"old-etag"',
            data: { login: 'testuser', suspended_at: null },
          },
        );

        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
          cache,
        });

        await octokit.request('GET /users/{username}', {
          username: 'testuser',
        });

        expect(receivedHeaders['if-none-match']).toBe('"old-etag"');
        expect(receivedHeaders['if-modified-since']).toBeUndefined();
      });

      it('returns cached data and headers on 304 response', async () => {
        const cachedData = { login: 'testuser', suspended_at: null };
        const cachedHeaders = {
          'x-github-enterprise-version': '3.12.0',
          'last-modified': 'Thu, 01 Jan 2025 00:00:00 GMT',
        };

        server.use(
          http.get(`${baseUrl}/users/testuser`, () => {
            return new HttpResponse(null, { status: 304 });
          }),
        );

        const cache = createMockCache();
        cache.store.set(
          `catalog-backend-module-github:GET:${baseUrl}/users/testuser`,
          {
            lastModified: 'Thu, 01 Jan 2025 00:00:00 GMT',
            headers: cachedHeaders,
            data: cachedData,
          },
        );

        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
          cache,
        });

        const response = await octokit.request('GET /users/{username}', {
          username: 'testuser',
        });

        expect(response.data).toEqual(cachedData);
        expect(response.headers['x-github-enterprise-version']).toBe('3.12.0');
      });

      it('propagates non-304 errors', async () => {
        server.use(
          http.get(`${baseUrl}/users/testuser`, () => {
            return new HttpResponse(JSON.stringify({ message: 'Not Found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            });
          }),
        );

        const cache = createMockCache();
        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
          cache,
        });

        await expect(
          octokit.request('GET /users/{username}', { username: 'testuser' }),
        ).rejects.toThrow();
      });

      it('prefers last-modified over etag for conditional headers', async () => {
        let receivedHeaders: Record<string, string> = {};
        server.use(
          http.get(`${baseUrl}/users/testuser`, ({ request }) => {
            receivedHeaders = Object.fromEntries(request.headers.entries());
            return HttpResponse.json({ login: 'testuser' });
          }),
        );

        const cache = createMockCache();
        cache.store.set(
          `catalog-backend-module-github:GET:${baseUrl}/users/testuser`,
          {
            lastModified: 'Thu, 01 Jan 2025 00:00:00 GMT',
            etag: '"some-etag"',
            data: { login: 'testuser' },
          },
        );

        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
          cache,
        });

        await octokit.request('GET /users/{username}', {
          username: 'testuser',
        });

        expect(receivedHeaders['if-modified-since']).toBe(
          'Thu, 01 Jan 2025 00:00:00 GMT',
        );
        expect(receivedHeaders['if-none-match']).toBeUndefined();
      });

      it('uses distinct cache keys per user', async () => {
        server.use(
          http.get(`${baseUrl}/users/:username`, ({ params }) => {
            return HttpResponse.json(
              { login: params.username, suspended_at: null },
              { headers: { 'Last-Modified': 'Thu, 01 Jan 2025 00:00:00 GMT' } },
            );
          }),
        );

        const cache = createMockCache();
        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
          cache,
        });

        await octokit.request('GET /users/{username}', {
          username: 'user-a',
        });
        await octokit.request('GET /users/{username}', {
          username: 'user-b',
        });

        expect(
          cache.store.has(
            `catalog-backend-module-github:GET:${baseUrl}/users/user-a`,
          ),
        ).toBe(true);
        expect(
          cache.store.has(
            `catalog-backend-module-github:GET:${baseUrl}/users/user-b`,
          ),
        ).toBe(true);
      });

      it('works without a cache', async () => {
        server.use(
          http.get(`${baseUrl}/users/testuser`, () => {
            return HttpResponse.json({ login: 'testuser' });
          }),
        );

        const octokit = createRestClient({
          baseUrl,
          orgUrl,
          credentialsProvider: mockCredentialsProvider,
          logger: mockServices.logger.mock(),
        });

        const response = await octokit.request('GET /users/{username}', {
          username: 'testuser',
        });

        expect(response.data).toEqual({ login: 'testuser' });
      });
    });
  });

  describe('isSuspended', () => {
    it('returns true when the user account is suspended', async () => {
      const octokit = {
        request: jest.fn().mockImplementation((route: string) => {
          if (route === 'GET /users/{username}') {
            return { data: { suspended_at: '2025-01-01T00:00:00Z' } };
          }
          return { data: { role: 'member', state: 'active' } };
        }),
      } as any;

      await expect(
        isSuspended('suspended-user', octokit, { org: 'my-org' }),
      ).resolves.toBe(true);
    });

    it('returns false for an active user', async () => {
      const octokit = {
        request: jest.fn().mockImplementation((route: string) => {
          if (route === 'GET /users/{username}') {
            return { data: { suspended_at: null } };
          }
          return { data: { role: 'member', state: 'active' } };
        }),
      } as any;

      await expect(
        isSuspended('active-user', octokit, { org: 'my-org' }),
      ).resolves.toBe(false);
    });

    it('returns true when org membership is suspended', async () => {
      const octokit = {
        request: jest.fn().mockImplementation((route: string) => {
          if (route === 'GET /users/{username}') {
            return { data: { suspended_at: null } };
          }
          return { data: { role: 'suspended', state: 'active' } };
        }),
      } as any;

      await expect(
        isSuspended('org-suspended', octokit, { org: 'my-org' }),
      ).resolves.toBe(true);
    });

    it('checks both user suspension and org membership', async () => {
      const octokit = {
        request: jest.fn().mockImplementation((route: string) => {
          if (route === 'GET /users/{username}') {
            return { data: { suspended_at: null } };
          }
          return { data: { role: 'member', state: 'active' } };
        }),
      } as any;

      await isSuspended('some-user', octokit, { org: 'my-org' });

      expect(octokit.request).toHaveBeenCalledTimes(2);
      expect(octokit.request).toHaveBeenCalledWith('GET /users/{username}', {
        username: 'some-user',
      });
      expect(octokit.request).toHaveBeenCalledWith(
        'GET /orgs/{org}/memberships/{username}',
        { org: 'my-org', username: 'some-user' },
      );
    });
  });

  describe('isGitHubEnterprise', () => {
    it('returns true when x-github-enterprise-version header is present', async () => {
      const octokit = {
        request: jest.fn().mockResolvedValue({
          headers: { 'x-github-enterprise-version': '3.12.0' },
        }),
      } as any;

      await expect(isGitHubEnterprise(octokit)).resolves.toBe(true);
      expect(octokit.request).toHaveBeenCalledWith('GET /versions');
    });

    it('returns false when x-github-enterprise-version header is absent', async () => {
      const octokit = {
        request: jest.fn().mockResolvedValue({ headers: {} }),
      } as any;

      await expect(isGitHubEnterprise(octokit)).resolves.toBe(false);
    });

    it('returns false when the request throws', async () => {
      const octokit = {
        request: jest.fn().mockRejectedValue(new Error('Not Found')),
      } as any;

      await expect(isGitHubEnterprise(octokit)).resolves.toBe(false);
    });
  });

  describe('Page sizes configuration', () => {
    const org = 'my-org';

    it('uses custom page sizes for getOrganizationTeams', async () => {
      server.use(
        graphqlMsw.query('teams', ({ variables }) => {
          expect(variables.teamsPageSize).toBe(10);
          expect(variables.membersPageSize).toBe(20);
          return HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      slug: 'team1',
                      combinedSlug: 'my-org/team1',
                      name: 'Team 1',
                      description: 'desc',
                      avatarUrl: '',
                      editTeamUrl: '',
                      parentTeam: null,
                      members: {
                        pageInfo: { hasNextPage: false },
                        nodes: [{ login: 'user1' }],
                      },
                    },
                  ],
                },
              },
            },
          });
        }),
      );

      await getOrganizationTeams(graphql as any, org, undefined, {
        teams: 10,
        teamMembers: 20,
        organizationMembers: 20,
        repositories: 10,
      });
    });

    it('uses custom page sizes for getOrganizationUsers', async () => {
      server.use(
        graphqlMsw.query('users', ({ variables }) => {
          expect(variables.organizationMembersPageSize).toBe(30);
          return HttpResponse.json({
            data: {
              organization: {
                membersWithRole: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      login: 'user1',
                      name: 'User 1',
                      bio: '',
                      avatarUrl: '',
                      email: 'user1@example.com',
                      organizationVerifiedDomainEmails: [],
                    },
                  ],
                },
              },
            },
          });
        }),
      );

      await getOrganizationUsers(graphql as any, org, 'token', undefined, {
        teams: 10,
        teamMembers: 20,
        organizationMembers: 30,
        repositories: 10,
      });
    });

    it('uses custom page sizes for getOrganizationRepositories', async () => {
      server.use(
        graphqlMsw.query('repositories', ({ variables }) => {
          expect(variables.repositoriesPageSize).toBe(15);
          return HttpResponse.json({
            data: {
              repositoryOwner: {
                repositories: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [
                    {
                      name: 'repo1',
                      url: 'https://github.com/my-org/repo1',
                      isArchived: false,
                      isFork: false,
                      visibility: 'public',
                      defaultBranchRef: { name: 'main' },
                      catalogInfoFile: null,
                      repositoryTopics: { nodes: [] },
                    },
                  ],
                },
              },
            },
          });
        }),
      );

      await expect(
        getOrganizationRepositories(graphql as any, org, '/catalog-info.yaml', {
          teams: 10,
          teamMembers: 20,
          organizationMembers: 30,
          repositories: 15,
        }),
      ).resolves.toEqual({
        repositories: [
          {
            name: 'repo1',
            url: 'https://github.com/my-org/repo1',
            isArchived: false,
            isFork: false,
            visibility: 'public',
            defaultBranchRef: { name: 'main' },
            catalogInfoFile: null,
            repositoryTopics: { nodes: [] },
          },
        ],
        nextCursor: undefined,
      });
    });

    it('uses default page sizes when not specified', async () => {
      server.use(
        graphqlMsw.query('teams', ({ variables }) => {
          expect(variables.teamsPageSize).toBe(25);
          expect(variables.membersPageSize).toBe(50);
          return HttpResponse.json({
            data: {
              organization: {
                teams: {
                  pageInfo: { hasNextPage: false, endCursor: null },
                  nodes: [],
                },
              },
            },
          });
        }),
      );

      await getOrganizationTeams(graphql as any, org);
    });
  });
});
