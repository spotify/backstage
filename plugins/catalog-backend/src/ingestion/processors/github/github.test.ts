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

import { msw } from '@backstage/test-utils';
import { graphql } from '@octokit/graphql';
import { graphql as graphqlMsw } from 'msw';
import { setupServer } from 'msw/node';
import {
  getOrganizationTeams,
  getOrganizationUsers,
  getTeamMembers,
  getOrganizationRepositories,
  QueryResponse,
} from './github';

describe('github', () => {
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  describe('getOrganizationUsers', () => {
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
        graphqlMsw.query('users', (_req, res, ctx) => res(ctx.data(input))),
      );

      await expect(
        getOrganizationUsers(graphql, 'a', 'token'),
      ).resolves.toEqual(output);
    });
  });

  describe('getOrganizationTeams', () => {
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
                parentTeam: {
                  slug: 'parent',
                  combinedSlug: '',
                  members: { pageInfo: { hasNextPage: false }, nodes: [] },
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
        groups: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'team',
              description: 'The one and only team',
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
            },
          }),
        ],
        groupMemberUsers: new Map([['team', ['user']]]),
      };

      server.use(
        graphqlMsw.query('teams', (_req, res, ctx) => res(ctx.data(input))),
      );

      await expect(getOrganizationTeams(graphql, 'a')).resolves.toEqual(output);
    });

    it('applies namespaces', async () => {
      const output = {
        groups: [
          expect.objectContaining({
            metadata: expect.objectContaining({
              name: 'team',
              namespace: 'foo',
              description: 'The one and only team',
            }),
            spec: {
              type: 'team',
              profile: {
                displayName: 'Team',
                picture: 'http://example.com/team.jpeg',
              },
              parent: 'parent',
              children: [],
            },
          }),
        ],
        groupMemberUsers: new Map([['foo/team', ['user']]]),
      };

      server.use(
        graphqlMsw.query('teams', (_req, res, ctx) => res(ctx.data(input))),
      );

      await expect(getOrganizationTeams(graphql, 'a', 'foo')).resolves.toEqual(
        output,
      );
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
        members: ['user'],
      };

      server.use(
        graphqlMsw.query('members', (_req, res, ctx) => res(ctx.data(input))),
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
              },
              {
                name: 'demo',
                url: 'https://github.com/backstage/demo',
                isArchived: true,
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
          },
          {
            name: 'demo',
            url: 'https://github.com/backstage/demo',
            isArchived: true,
          },
        ],
      };

      server.use(
        graphqlMsw.query('repositories', (_req, res, ctx) =>
          res(ctx.data(input)),
        ),
      );

      await expect(getOrganizationRepositories(graphql, 'a')).resolves.toEqual(
        output,
      );
    });
  });
});
