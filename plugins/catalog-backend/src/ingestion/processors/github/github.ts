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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { GithubCredentialType } from '@backstage/integration';
import { graphql } from '@octokit/graphql';

// Graphql types

export type QueryResponse = {
  organization?: Organization;
  repositoryOwner?: Organization | User;
};

export type Organization = {
  membersWithRole?: Connection<User>;
  team?: Team;
  teams?: Connection<Team>;
  repositories?: Connection<Repository>;
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string;
};

export type User = {
  login: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  name?: string;
  repositories?: Connection<Repository>;
};

export type Team = {
  slug: string;
  combinedSlug: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
  parentTeam?: Team;
  members: Connection<User>;
};

export type Repository = {
  name: string;
  url: string;
  isArchived: boolean;
};

export type Connection<T> = {
  pageInfo: PageInfo;
  nodes: T[];
};

/**
 * Gets all the users out of a GitHub organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client An octokit graphql client
 * @param org The slug of the org to read
 */
export async function getOrganizationUsers(
  client: typeof graphql,
  org: string,
  tokenType: GithubCredentialType,
): Promise<{ users: UserEntity[] }> {
  const query = `
    query users($org: String!, $email: Boolean!, $cursor: String) {
      organization(login: $org) {
        membersWithRole(first: 100, after: $cursor) {
          pageInfo { hasNextPage, endCursor }
          nodes {
            avatarUrl,
            bio,
            email @include(if: $email),
            login,
            name
          }
        }
      }
    }`;

  // There is no user -> teams edge, so we leave the memberships empty for
  // now and let the team iteration handle it instead
  const mapper = (user: User) => {
    const entity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: user.login,
        annotations: {
          'github.com/user-login': user.login,
        },
      },
      spec: {
        profile: {},
        memberOf: [],
      },
    };

    if (user.bio) entity.metadata.description = user.bio;
    if (user.name) entity.spec.profile!.displayName = user.name;
    if (user.email) entity.spec.profile!.email = user.email;
    if (user.avatarUrl) entity.spec.profile!.picture = user.avatarUrl;

    return entity;
  };

  const users = await queryWithPaging(
    client,
    query,
    r => r.organization?.membersWithRole,
    mapper,
    { org, email: tokenType === 'token' },
  );

  return { users };
}

/**
 * Gets all the teams out of a GitHub organization.
 *
 * Note that the teams will not have any relations apart from parent filled in.
 *
 * @param client An octokit graphql client
 * @param org The slug of the org to read
 */
export async function getOrganizationTeams(
  client: typeof graphql,
  org: string,
  orgNamespace?: string,
): Promise<{
  groups: GroupEntity[];
  groupMemberUsers: Map<string, string[]>;
}> {
  const query = `
    query teams($org: String!, $cursor: String) {
      organization(login: $org) {
        teams(first: 100, after: $cursor) {
          pageInfo { hasNextPage, endCursor }
          nodes {
            slug
            combinedSlug
            name
            description
            avatarUrl
            parentTeam { slug }
            members(first: 100, membership: IMMEDIATE) {
              pageInfo { hasNextPage }
              nodes { login }
            }
          }
        }
      }
    }`;

  // Gets populated inside the mapper below
  const groupMemberUsers = new Map<string, string[]>();

  const mapper = async (team: Team) => {
    const entity: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: team.slug,
        annotations: {
          'github.com/team-slug': team.combinedSlug,
        },
      },
      spec: {
        type: 'team',
        profile: {},
        children: [],
      },
    };

    if (orgNamespace) {
      entity.metadata.namespace = orgNamespace;
    }

    if (team.description) {
      entity.metadata.description = team.description;
    }
    if (team.name) {
      entity.spec.profile!.displayName = team.name;
    }
    if (team.avatarUrl) {
      entity.spec.profile!.picture = team.avatarUrl;
    }
    if (team.parentTeam) {
      entity.spec.parent = team.parentTeam.slug;
    }

    const memberNames: string[] = [];
    const groupKey = orgNamespace ? `${orgNamespace}/${team.slug}` : team.slug;
    groupMemberUsers.set(groupKey, memberNames);

    if (!team.members.pageInfo.hasNextPage) {
      // We got all the members in one go, run the fast path
      for (const user of team.members.nodes) {
        memberNames.push(user.login);
      }
    } else {
      // There were more than a hundred immediate members - run the slow
      // path of fetching them explicitly
      const { members } = await getTeamMembers(client, org, team.slug);
      for (const userLogin of members) {
        memberNames.push(userLogin);
      }
    }

    return entity;
  };

  const groups = await queryWithPaging(
    client,
    query,
    r => r.organization?.teams,
    mapper,
    { org },
  );

  return { groups, groupMemberUsers };
}

export async function getOrganizationRepositories(
  client: typeof graphql,
  org: string,
): Promise<{ repositories: Repository[] }> {
  const query = `
    query repositories($org: String!, $cursor: String) {
      repositoryOwner(login: $org) {
        login
        repositories(first: 100, after: $cursor) {
          nodes {
            name
            url
            isArchived
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`;

  const repositories = await queryWithPaging(
    client,
    query,
    r => r.repositoryOwner?.repositories,
    x => x,
    { org },
  );

  return { repositories };
}

/**
 * Gets all the users out of a GitHub organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client An octokit graphql client
 * @param org The slug of the org to read
 * @param teamSlug The slug of the team to read
 */
export async function getTeamMembers(
  client: typeof graphql,
  org: string,
  teamSlug: string,
): Promise<{ members: string[] }> {
  const query = `
    query members($org: String!, $teamSlug: String!, $cursor: String) {
      organization(login: $org) {
        team(slug: $teamSlug) {
          members(first: 100, after: $cursor, membership: IMMEDIATE) {
            pageInfo { hasNextPage, endCursor }
            nodes { login }
          }
        }
      }
    }`;

  const members = await queryWithPaging(
    client,
    query,
    r => r.organization?.team?.members,
    user => user.login,
    { org, teamSlug },
  );

  return { members };
}

//
// Helpers
//

/**
 * Assists in repeatedly executing a query with a paged response.
 *
 * Requires that the query accepts a $cursor variable.
 *
 * @param client The octokit client
 * @param query The query to execute
 * @param connection A function that, given the response, picks out the actual
 *                   Connection object that's being iterated
 * @param mapper A function that, given one of the nodes in the Connection,
 *               returns the model mapped form of it
 * @param variables The variable values that the query needs, minus the cursor
 */
export async function queryWithPaging<
  GraphqlType,
  OutputType,
  Variables extends {},
  Response = QueryResponse
>(
  client: typeof graphql,
  query: string,
  connection: (response: Response) => Connection<GraphqlType> | undefined,
  mapper: (item: GraphqlType) => Promise<OutputType> | OutputType,
  variables: Variables,
): Promise<OutputType[]> {
  const result: OutputType[] = [];

  let cursor: string | undefined = undefined;
  for (let j = 0; j < 1000 /* just for sanity */; ++j) {
    const response: Response = await client(query, {
      ...variables,
      cursor,
    });

    const conn = connection(response);
    if (!conn) {
      throw new Error(`Found no match for ${JSON.stringify(variables)}`);
    }

    for (const node of conn.nodes) {
      result.push(await mapper(node));
    }

    if (!conn.pageInfo.hasNextPage) {
      break;
    } else {
      cursor = conn.pageInfo.endCursor;
    }
  }

  return result;
}
