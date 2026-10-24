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

import { Entity } from '@backstage/catalog-model';
import {
  GithubCredentials,
  GithubCredentialsProvider,
  GithubCredentialType,
} from '@backstage/integration';
import { graphql } from '@octokit/graphql';
import { OctokitResponse, RequestParameters } from '@octokit/types';
import {
  defaultOrganizationTeamTransformer,
  defaultUserTransformer,
  TeamTransformer,
  TransformerContext,
  UserTransformer,
} from './defaultTransformers';
import { withLocations } from './withLocations';

import { DeferredEntity } from '@backstage/plugin-catalog-node';
import { Octokit } from '@octokit/core';
import { CacheService, LoggerService } from '@backstage/backend-plugin-api';
import { throttling, ThrottlingOptions } from '@octokit/plugin-throttling';
import { retry } from '@octokit/plugin-retry';
import { JsonValue } from '@backstage/types';

/**
 * Configuration for GitHub GraphQL API page sizes.
 *
 * @public
 */
export type GithubPageSizes = {
  /**
   * Number of teams to fetch per page when querying organization teams.
   * Default: 25
   */
  teams: number;
  /**
   * Number of team members to fetch per page when querying team members.
   * Default: 50
   */
  teamMembers: number;
  /**
   * Number of organization members to fetch per page when querying org members.
   * Default: 50
   */
  organizationMembers: number;
  /**
   * Number of repositories to fetch per page when querying repositories.
   * Default: 25
   */
  repositories: number;
};

/**
 * Configuration for GitHub GraphQL API
 *
 * @public
 */
export type GithubQueryLimits = {
  /**
   * Number of repositories to fetch per chunk in a GraphQL client session.
   * Helps avoiding token expiration and 502 errors during long-running fetches.
   * Default: undefined (no chunking, fetch all repositories in one session)
   */
  repositoryChunkSize?: number;
};

/**
 * Default page sizes for GitHub GraphQL API queries.
 * These values are reduced to prevent RESOURCE_LIMITS_EXCEEDED errors with large organizations.
 *
 * @public
 */
export const DEFAULT_PAGE_SIZES: GithubPageSizes = {
  teams: 25,
  teamMembers: 50,
  organizationMembers: 50,
  repositories: 25,
};

export const DEFAULT_QUERY_LIMITS: GithubQueryLimits = {
  repositoryChunkSize: undefined,
};

// Graphql types

export type QueryResponse = {
  organization?: OrganizationResponse;
  repositoryOwner?: RepositoryOwnerResponse;
  user?: UserResponse;
  rateLimit?: {
    cost?: number;
    remaining?: number;
    resetAt?: string;
  };
};

type RepositoryOwnerResponse = {
  repositories?: Connection<RepositoryResponse>;
  repository?: RepositoryResponse;
};

export type OrganizationResponse = {
  membersWithRole?: Connection<GithubUser>;
  team?: GithubTeamResponse;
  teams?: Connection<GithubTeamResponse>;
  repositories?: Connection<RepositoryResponse>;
};

export type UserResponse = {
  organizations?: Connection<GithubOrg>;
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string;
};

export type GithubOrg = {
  login: string;
};

/**
 * Github User
 *
 * @public
 */
export type GithubUser = {
  login: string;
  id?: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  name?: string;
  organizationVerifiedDomainEmails?: string[];
  suspendedAt?: string;
};

/**
 * Github Team
 *
 * @public
 */
export type GithubTeam = {
  slug: string;
  combinedSlug: string;
  name?: string;
  description?: string;
  avatarUrl?: string;
  editTeamUrl?: string;
  parentTeam?: GithubTeam;
  members: GithubUser[];
};

export type GithubTeamResponse = Omit<GithubTeam, 'members'> & {
  members: Connection<GithubUser>;
};

export type RepositoryResponse = {
  name: string;
  url: string;
  isArchived: boolean;
  isFork: boolean;
  repositoryTopics: RepositoryTopics;
  defaultBranchRef: {
    name: string;
  } | null;
  catalogInfoFile: {
    __typename: string;
    id: string;
    text: string;
  } | null;
  visibility: string;
};

type RepositoryTopics = {
  nodes: TopicNodes[];
};

type TopicNodes = {
  topic: {
    name: string;
  };
};

export type Connection<T> = {
  pageInfo: PageInfo;
  nodes: T[];
};

/**
 * Gets all the users out of a Github organization.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 * @param tokenType - The type of GitHub credential
 * @param userTransformer - Optional transformer for user entities
 * @param pageSizes - Optional page sizes configuration
 * @param excludeSuspendedUsers - Optional flag to exclude suspended users (only for GitHub Enterprise instances)
 * @param restClient - Optional Octokit REST client; when provided alongside excludeSuspendedUsers, the REST API is used instead of the GraphQL suspendedAt field
 */
export async function getOrganizationUsers(
  client: typeof graphql,
  org: string,
  tokenType: GithubCredentialType,
  userTransformer: UserTransformer = defaultUserTransformer,
  pageSizes: GithubPageSizes = DEFAULT_PAGE_SIZES,
  excludeSuspendedUsers: boolean = false,
  restClient?: Octokit,
): Promise<{ users: Entity[] }> {
  const useRestForSuspension = excludeSuspendedUsers && !!restClient;
  const suspendedAtField =
    excludeSuspendedUsers && !useRestForSuspension ? 'suspendedAt,' : '';
  const query = `
    query users($org: String!, $email: Boolean!, $cursor: String, $organizationMembersPageSize: Int!) {
      organization(login: $org) {
        membersWithRole(first: $organizationMembersPageSize, after: $cursor) {
          pageInfo { hasNextPage, endCursor }
          nodes {
            avatarUrl,
            bio,
            email @include(if: $email),
            id,
            login,
            name,
            ${suspendedAtField}
            organizationVerifiedDomainEmails(login: $org)
          }
        }
      }
    }`;

  let restFilter:
    | ((user: GithubUser) => Promise<boolean> | boolean)
    | undefined;

  if (useRestForSuspension) {
    const isEnterprise = await isGitHubEnterprise(restClient);
    if (isEnterprise) {
      restFilter = async (user: GithubUser) =>
        !(await isSuspended(user.login, restClient, { org }));
    }
  }

  // There is no user -> teams edge, so we leave the memberships empty for
  // now and let the team iteration handle it instead

  const { result: users } = await queryWithPaging({
    client,
    query,
    org,
    connection: r => r.organization?.membersWithRole,
    transformer: userTransformer,
    variables: {
      org,
      email: tokenType === 'token',
      organizationMembersPageSize: pageSizes.organizationMembers,
    },
    filter: useRestForSuspension
      ? restFilter
      : u => (excludeSuspendedUsers ? !u.suspendedAt : true),
  });

  return { users };
}

/**
 * Gets all the teams out of a Github organization.
 *
 * Note that the teams will not have any relations apart from parent filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 * @param teamTransformer - Optional transformer for team entities
 * @param pageSizes - Optional page sizes configuration
 */
export async function getOrganizationTeams(
  client: typeof graphql,
  org: string,
  teamTransformer: TeamTransformer = defaultOrganizationTeamTransformer,
  pageSizes: GithubPageSizes = DEFAULT_PAGE_SIZES,
): Promise<{
  teams: Entity[];
}> {
  const query = `
    query teams($org: String!, $cursor: String, $teamsPageSize: Int!, $membersPageSize: Int!) {
      organization(login: $org) {
        teams(first: $teamsPageSize, after: $cursor) {
          pageInfo { hasNextPage, endCursor }
          nodes {
            slug
            combinedSlug
            name
            description
            avatarUrl
            editTeamUrl
            parentTeam { slug }
            members(first: $membersPageSize, membership: IMMEDIATE) {
              pageInfo { hasNextPage }
              nodes {
                avatarUrl,
                bio,
                email,
                id,
                login,
                name,
                organizationVerifiedDomainEmails(login: $org)
               }
            }
          }
        }
      }
    }`;

  const materialisedTeams = async (
    item: GithubTeamResponse,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> => {
    const memberNames: GithubUser[] = [];

    if (!item.members.pageInfo.hasNextPage) {
      // We got all the members in one go, run the fast path
      for (const user of item.members.nodes) {
        memberNames.push(user);
      }
    } else {
      // There were more immediate members than page size - run the slow
      // path of fetching them explicitly
      const { members } = await getTeamMembers(
        ctx.client,
        ctx.org,
        item.slug,
        pageSizes,
      );
      for (const userLogin of members) {
        memberNames.push(userLogin);
      }
    }

    const team: GithubTeam = {
      ...item,
      members: memberNames,
    };

    return await teamTransformer(team, ctx);
  };

  const { result: teams } = await queryWithPaging({
    client,
    query,
    org,
    connection: r => r.organization?.teams,
    transformer: materialisedTeams,
    variables: {
      org,
      teamsPageSize: pageSizes.teams,
      membersPageSize: pageSizes.teamMembers,
    },
  });

  return { teams };
}

export async function getOrganizationTeamsFromUsers(
  client: typeof graphql,
  org: string,
  userLogins: string[],
  teamTransformer: TeamTransformer = defaultOrganizationTeamTransformer,
  pageSizes: GithubPageSizes = DEFAULT_PAGE_SIZES,
): Promise<{
  teams: Entity[];
}> {
  const query = `
   query teams($org: String!, $cursor: String, $userLogins: [String!] = "", $teamsPageSize: Int!, $membersPageSize: Int!) {
  organization(login: $org) {
    teams(first: $teamsPageSize, after: $cursor, userLogins: $userLogins) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        combinedSlug
        name
        description
        avatarUrl
        editTeamUrl
        parentTeam {
          slug
        }
        members(first: $membersPageSize, membership: IMMEDIATE) {
          pageInfo {
            hasNextPage
          }
          nodes {
            avatarUrl,
            bio,
            email,
            id,
            login,
            name,
            organizationVerifiedDomainEmails(login: $org)
          }
        }
      }
    }
  }
}`;

  const materialisedTeams = async (
    item: GithubTeamResponse,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> => {
    const memberNames: GithubUser[] = [];

    if (!item.members.pageInfo.hasNextPage) {
      // We got all the members in one go, run the fast path
      for (const user of item.members.nodes) {
        memberNames.push(user);
      }
    } else {
      // There were more immediate members than page size - run the slow
      // path of fetching them explicitly
      const { members } = await getTeamMembers(
        ctx.client,
        ctx.org,
        item.slug,
        pageSizes,
      );
      for (const userLogin of members) {
        memberNames.push(userLogin);
      }
    }

    const team: GithubTeam = {
      ...item,
      members: memberNames,
    };

    return await teamTransformer(team, ctx);
  };

  const { result: teams } = await queryWithPaging({
    client,
    query,
    org,
    connection: r => r.organization?.teams,
    transformer: materialisedTeams,
    variables: {
      org,
      userLogins,
      teamsPageSize: pageSizes.teams,
      membersPageSize: pageSizes.teamMembers,
    },
  });

  return { teams };
}

export async function getOrganizationTeamsForUser(
  client: typeof graphql,
  org: string,
  userLogin: string,
  teamTransformer: TeamTransformer,
  pageSizes: GithubPageSizes = DEFAULT_PAGE_SIZES,
): Promise<{ teams: Entity[] }> {
  const query = `
   query teams($org: String!, $cursor: String, $userLogins: [String!] = "", $teamsPageSize: Int!) {
  organization(login: $org) {
    teams(first: $teamsPageSize, after: $cursor, userLogins: $userLogins) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        combinedSlug
        name
        description
        avatarUrl
        editTeamUrl
        parentTeam {
          slug
        }
      }
    }
  }
}`;

  const materialisedTeams = async (
    item: GithubTeamResponse,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> => {
    const team: GithubTeam = {
      ...item,
      members: [{ login: userLogin }],
    };

    return await teamTransformer(team, ctx);
  };

  const { result: teams } = await queryWithPaging({
    client,
    query,
    org,
    connection: r => r.organization?.teams,
    transformer: materialisedTeams,
    variables: { org, userLogins: [userLogin], teamsPageSize: pageSizes.teams },
  });

  return { teams };
}

export async function getOrganizationsFromUser(
  client: typeof graphql,
  user: string,
): Promise<{
  orgs: string[];
}> {
  const query = `
  query orgs($user: String!) {
    user(login: $user) {
      organizations(first: 100) {
        nodes { login }
        pageInfo { hasNextPage, endCursor }
      }
    }
  }`;

  const { result: orgs } = await queryWithPaging({
    client,
    query,
    org: '',
    connection: r => r.user?.organizations,
    transformer: async o => o.login,
    variables: { user },
  });

  return { orgs };
}

export async function getOrganizationTeam(
  client: typeof graphql,
  org: string,
  teamSlug: string,
  teamTransformer: TeamTransformer = defaultOrganizationTeamTransformer,
  pageSizes: GithubPageSizes = DEFAULT_PAGE_SIZES,
): Promise<{
  team: Entity;
}> {
  const query = `
  query teams($org: String!, $teamSlug: String!, $membersPageSize: Int!) {
      organization(login: $org) {
        team(slug:$teamSlug) {
            slug
            combinedSlug
            name
            description
            avatarUrl
            editTeamUrl
            parentTeam { slug }
            members(first: $membersPageSize, membership: IMMEDIATE) {
              pageInfo { hasNextPage }
              nodes { login }
            }
        }
      }
    }`;

  const materialisedTeam = async (
    item: GithubTeamResponse,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> => {
    const memberNames: GithubUser[] = [];

    if (!item.members.pageInfo.hasNextPage) {
      // We got all the members in one go, run the fast path
      for (const user of item.members.nodes) {
        memberNames.push(user);
      }
    } else {
      // There were more immediate members than page size - run the slow
      // path of fetching them explicitly
      const { members } = await getTeamMembers(
        ctx.client,
        ctx.org,
        item.slug,
        pageSizes,
      );
      for (const userLogin of members) {
        memberNames.push(userLogin);
      }
    }

    const team: GithubTeam = {
      ...item,
      members: memberNames,
    };

    return await teamTransformer(team, ctx);
  };

  const response: QueryResponse = await client(query, {
    org,
    teamSlug,
    membersPageSize: pageSizes.teamMembers,
  });

  if (!response.organization?.team)
    throw new Error(`Found no match for team ${teamSlug}`);

  const team = await materialisedTeam(response.organization?.team, {
    query,
    client,
    org,
  });

  if (!team) throw new Error(`Can't transform for team ${teamSlug}`);

  return { team };
}

export async function getOrganizationRepositories(
  client: typeof graphql,
  org: string,
  catalogPath: string,
  pageSizes: GithubPageSizes = DEFAULT_PAGE_SIZES,
  branch?: string,
  options?: {
    allowArchived?: boolean;
    startCursor?: string;
    chunkSize?: number;
  },
): Promise<{ repositories: RepositoryResponse[]; nextCursor?: string }> {
  let relativeCatalogPathRef: string;
  // We must strip the leading slash or the query for objects does not work
  if (catalogPath.startsWith('/')) {
    relativeCatalogPathRef = catalogPath.substring(1);
  } else {
    relativeCatalogPathRef = catalogPath;
  }
  const branchRef = branch ?? 'HEAD';
  const catalogPathRef = `${branchRef}:${relativeCatalogPathRef}`;
  const allowArchived = options?.allowArchived ?? true;
  const archivedFilter = allowArchived ? '' : ', isArchived: false';
  const chunkSize = options?.chunkSize;
  const query = `
    query repositories($org: String!, $catalogPathRef: String!, $cursor: String, $repositoriesPageSize: Int!) {
      rateLimit {
        cost
        remaining
        resetAt
      }
      repositoryOwner(login: $org) {
        login
        repositories(first: $repositoriesPageSize, after: $cursor${archivedFilter}) {
          nodes {
            name
            catalogInfoFile: object(expression: $catalogPathRef) {
              __typename
              ... on Blob {
                id
                text
              }
            }
            url
            isArchived
            isFork
            visibility
            repositoryTopics(first: 100) {
              nodes {
                ... on RepositoryTopic {
                  topic {
                    name
                  }
                }
              }
            }
            defaultBranchRef {
              name
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`;

  const { result: repositories, nextCursor } = await queryWithPaging({
    client,
    query,
    org,
    connection: r => r?.repositoryOwner?.repositories,
    transformer: async x => x,
    variables: {
      org,
      catalogPathRef,
      repositoriesPageSize: chunkSize
        ? Math.min(pageSizes.repositories, chunkSize)
        : pageSizes.repositories,
    },
    startCursor: options?.startCursor,
    chunkSize,
  });

  return { repositories, nextCursor };
}

export async function getOrganizationRepository(
  client: typeof graphql,
  org: string,
  repoName: string,
  catalogPath: string,
  branch?: string,
): Promise<RepositoryResponse | null> {
  let relativeCatalogPathRef: string;
  // We must strip the leading slash or the query for objects does not work
  if (catalogPath.startsWith('/')) {
    relativeCatalogPathRef = catalogPath.substring(1);
  } else {
    relativeCatalogPathRef = catalogPath;
  }
  const branchRef = branch ?? 'HEAD';
  const catalogPathRef = `${branchRef}:${relativeCatalogPathRef}`;
  const query = `
    query repository($org: String!, $repoName: String!, $catalogPathRef: String!) {
      repositoryOwner(login: $org) {
        repository(name: $repoName) {
          name
          catalogInfoFile: object(expression: $catalogPathRef) {
            __typename
            ... on Blob {
              id
              text
            }
          }
          url
          isArchived
          isFork
          visibility
          repositoryTopics(first: 100) {
            nodes {
              ... on RepositoryTopic {
                topic {
                  name
                }
              }
            }
          }
          defaultBranchRef {
            name
          }
        }
      }
    }`;

  const response: QueryResponse = await client(query, {
    org,
    repoName,
    catalogPathRef,
  });

  return response.repositoryOwner?.repository || null;
}

/**
 * Gets all the users out of a Github organization team.
 *
 * Note that the users will not have their memberships filled in.
 *
 * @param client - An octokit graphql client
 * @param org - The slug of the org to read
 * @param teamSlug - The slug of the team to read
 * @param pageSizes - Optional page sizes configuration
 */
export async function getTeamMembers(
  client: typeof graphql,
  org: string,
  teamSlug: string,
  pageSizes: GithubPageSizes = DEFAULT_PAGE_SIZES,
): Promise<{ members: GithubUser[] }> {
  const query = `
    query members($org: String!, $teamSlug: String!, $cursor: String, $membersPageSize: Int!) {
      organization(login: $org) {
        team(slug: $teamSlug) {
          members(first: $membersPageSize, after: $cursor, membership: IMMEDIATE) {
            pageInfo { hasNextPage, endCursor }
            nodes { login }
          }
        }
      }
    }`;

  const { result: members } = await queryWithPaging({
    client,
    query,
    org,
    connection: r => r.organization?.team?.members,
    transformer: async user => user,
    variables: { org, teamSlug, membersPageSize: pageSizes.teamMembers },
  });

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
 * @param params - Object containing all parameters
 * @param params.client - The octokit client
 * @param params.query - The query to execute
 * @param params.org - The slug of the org to read
 * @param params.connection - A function that, given the response, picks out the actual
 *                   Connection object that's being iterated
 * @param params.transformer - A function that, given one of the nodes in the Connection,
 *               returns the model mapped form of it
 * @param params.variables - The variable values that the query needs, minus the cursor
 * @param params.filter - An optional filter function to filter the nodes before transforming them
 */
export async function queryWithPaging<
  GraphqlType,
  OutputType,
  Variables extends {},
  Response = QueryResponse,
>(params: {
  client: typeof graphql;
  query: string;
  org: string;
  connection: (response: Response) => Connection<GraphqlType> | undefined;
  transformer: (
    item: GraphqlType,
    ctx: TransformerContext,
  ) => Promise<OutputType | undefined>;
  variables: Variables;
  filter?: (item: GraphqlType) => Promise<boolean> | boolean;
  startCursor?: string;
  chunkSize?: number;
}): Promise<{ result: OutputType[]; nextCursor?: string }> {
  const {
    client,
    query,
    org,
    connection,
    transformer,
    variables,
    startCursor,
    chunkSize,
    filter,
  } = params;
  const result: OutputType[] = [];
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  let cursor: string | undefined = startCursor;
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
      if (filter && !(await filter(node))) {
        continue;
      }
      const transformedNode = await transformer(node, {
        client,
        query,
        org,
      });
      if (transformedNode) {
        result.push(transformedNode);
      }
    }

    if (!conn.pageInfo.hasNextPage) {
      break;
    }

    // check if we reached the chunk size limit,
    // then we return next cursor to know where to start in next chunk
    if (chunkSize && result.length >= chunkSize) {
      return { result, nextCursor: conn.pageInfo.endCursor };
    }

    await sleep(1000);
    cursor = conn.pageInfo.endCursor;
  }

  return { result, nextCursor: undefined };
}

export type DeferredEntitiesBuilder = (
  org: string,
  entities: Entity[],
) => { added: DeferredEntity[]; removed: DeferredEntity[] };

export const createAddEntitiesOperation =
  (id: string, host: string) => (org: string, entities: Entity[]) => ({
    removed: [],
    added: entities.map(entity => ({
      locationKey: `github-org-provider:${id}`,
      entity: withLocations(`https://${host}`, org, entity),
    })),
  });

export const createRemoveEntitiesOperation =
  (id: string, host: string) => (org: string, entities: Entity[]) => ({
    added: [],
    removed: entities.map(entity => ({
      locationKey: `github-org-provider:${id}`,
      entity: withLocations(`https://${host}`, org, entity),
    })),
  });

export const createReplaceEntitiesOperation =
  (id: string, host: string) => (org: string, entities: Entity[]) => {
    const entitiesToReplace = entities.map(entity => ({
      locationKey: `github-org-provider:${id}`,
      entity: withLocations(`https://${host}`, org, entity),
    }));

    return {
      removed: entitiesToReplace,
      added: entitiesToReplace,
    };
  };

/**
 * Creates a GraphQL Client with Throttling and Retries
 */
export const createGraphqlClient = (args: {
  headers:
    | {
        [name: string]: string;
      }
    | undefined;
  baseUrl: string;
  logger: LoggerService;
}): typeof graphql => {
  const { headers, baseUrl, logger } = args;
  const ThrottledOctokit = Octokit.plugin(throttling, retry);
  const octokit = new ThrottledOctokit({
    throttle: {
      onRateLimit: (retryAfter, rateLimitData, _, retryCount) => {
        logger.warn(
          `Request quota exhausted for request ${rateLimitData?.method} ${rateLimitData?.url}`,
        );

        if (retryCount < 2) {
          logger.warn(
            `Retrying after ${retryAfter} seconds for the ${retryCount} time due to Rate Limit!`,
          );
          return true;
        }

        return false;
      },
      onSecondaryRateLimit: (retryAfter, rateLimitData, _, retryCount) => {
        logger.warn(
          `Secondary Rate Limit Exhausted for request ${rateLimitData?.method} ${rateLimitData?.url}`,
        );

        if (retryCount < 2) {
          logger.warn(
            `Retrying after ${retryAfter} seconds for the ${retryCount} time due to Secondary Rate Limit!`,
          );
          return true;
        }

        return false;
      },
    },
  });

  const client = octokit.graphql.defaults({
    headers,
    baseUrl,
  });

  return client;
};

function octokitThrottlingOptions(logger: LoggerService): ThrottlingOptions {
  return {
    onRateLimit: (retryAfter, rateLimitData, _, retryCount) => {
      logger.warn(
        `Request quota exhausted for request ${rateLimitData?.method} ${rateLimitData?.url}`,
      );

      if (retryCount < 2) {
        logger.warn(
          `Retrying after ${retryAfter} seconds for the ${retryCount} time due to Rate Limit!`,
        );
        return true;
      }

      return false;
    },
    onSecondaryRateLimit: (retryAfter, rateLimitData, _, retryCount) => {
      logger.warn(
        `Secondary Rate Limit Exhausted for request ${rateLimitData?.method} ${rateLimitData?.url}`,
      );

      if (retryCount < 2) {
        logger.warn(
          `Retrying after ${retryAfter} seconds for the ${retryCount} time due to Secondary Rate Limit!`,
        );
        return true;
      }

      return false;
    },
  };
}

/**
 * Creates an Octokit REST client with throttling, retry, and optional
 * conditional request caching.
 *
 * @public
 */
export function createRestClient(options: {
  baseUrl: string | undefined;
  orgUrl: string;
  credentialsProvider: GithubCredentialsProvider;
  logger: LoggerService;
  cache?: CacheService;
}): Octokit & { auth: () => Promise<GithubCredentials> } {
  const getCredentials = () =>
    options.credentialsProvider.getCredentials({
      url: options.orgUrl,
    });

  const authStrategy = () => {
    const auth = () => getCredentials();
    auth.hook = async (
      request: (
        requestOptions: RequestParameters,
      ) => Promise<OctokitResponse<unknown>>,
      hookOptions: RequestParameters,
    ) => {
      const { headers } = await getCredentials();
      return request({
        ...hookOptions,
        headers: { ...hookOptions.headers, ...headers },
      });
    };
    return auth;
  };

  const ThrottledOctokit = Octokit.plugin(throttling, retry);

  const octokit = new ThrottledOctokit({
    baseUrl: options.baseUrl,
    authStrategy,
    throttle: octokitThrottlingOptions(options.logger),
  });

  if (options.cache) {
    installConditionalRequestCache(octokit, options.cache);
  }

  return octokit as Octokit & { auth: () => Promise<GithubCredentials> };
}

type CachedGitHubResponse = {
  lastModified?: string;
  etag?: string;
  headers: JsonValue;
  data: JsonValue;
};

function installConditionalRequestCache(
  octokit: Octokit,
  cache: CacheService,
): void {
  octokit.hook.wrap('request', async (request, wrappedOptions) => {
    const resolvedUrl = (wrappedOptions.url || '').replace(
      /\{([^}]+)\}/g,
      (_, key) => encodeURIComponent((wrappedOptions as any)[key]),
    );
    const cacheKey = `catalog-backend-module-github:${wrappedOptions.method}:${wrappedOptions.baseUrl}${resolvedUrl}`;
    const cached = await cache
      .get<CachedGitHubResponse>(cacheKey)
      .catch(() => undefined);

    if (cached?.lastModified) {
      wrappedOptions.headers['if-modified-since'] = cached.lastModified;
    } else if (cached?.etag) {
      wrappedOptions.headers['if-none-match'] = cached.etag;
    }

    try {
      const response = await request(wrappedOptions);

      const lastModified = response.headers['last-modified'];
      const etag = response.headers.etag;

      if (lastModified || etag) {
        cache
          .set(
            cacheKey,
            {
              lastModified,
              etag,
              headers: JSON.parse(JSON.stringify(response.headers)),
              data: JSON.parse(JSON.stringify(response.data)),
            },
            // The TTL can be long here, since we only use the cache for
            // conditional GitHub requests - it's never returned unless we get a
            // 304 back from GitHub indicating that it's still correct.
            { ttl: { years: 1 } },
          )
          .catch(() => {});
      }
      return response;
    } catch (error: any) {
      if (error?.status === 304 && cached) {
        return {
          ...error.response,
          headers: cached.headers,
          data: cached.data,
        };
      }
      throw error;
    }
  });
}

/**
 * Checks whether a user is suspended via the REST API.
 */
export async function isSuspended(
  username: string,
  octokit: Octokit,
  options: { org: string },
): Promise<boolean> {
  const [userResponse, membershipResponse] = await Promise.all([
    octokit.request('GET /users/{username}', { username }),
    octokit.request('GET /orgs/{org}/memberships/{username}', {
      org: options.org,
      username,
    }),
  ]);

  // Octokit types are based on the public GitHub API, and since public GitHub
  // doesn't include the ability to suspend users, there's no "suspended_at"
  // field on the type, nor a "suspended" role on org memberships. However these
  // fields are present for GitHub Enterprise, so we augment the types to
  // include them.
  const userSuspendedAt = (
    userResponse.data as typeof userResponse.data & { suspended_at?: string }
  ).suspended_at;
  const membershipRole = (
    membershipResponse.data as
      | typeof membershipResponse.data
      | {
          role?: 'suspended';
        }
  ).role;

  const userSuspended = !!userSuspendedAt;
  const orgMembershipSuspended = membershipRole === 'suspended';

  return userSuspended || orgMembershipSuspended;
}

/**
 * Checks whether the GitHub instance is a GitHub Enterprise server.
 */
export async function isGitHubEnterprise(octokit: Octokit): Promise<boolean> {
  try {
    const response = await octokit.request('GET /versions');
    return !!response.headers['x-github-enterprise-version'];
  } catch {
    return false;
  }
}
