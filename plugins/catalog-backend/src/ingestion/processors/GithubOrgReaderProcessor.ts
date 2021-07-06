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

import { LocationSpec } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  GithubCredentialsProvider,
  GithubCredentialType,
  ScmIntegrations,
} from '@backstage/integration';
import { graphql } from '@octokit/graphql';
import { Logger } from 'winston';
import { getOrganizationTeams, getOrganizationUsers } from './github';
import * as results from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import { buildOrgHierarchy } from './util/org';

type GraphQL = typeof graphql;

/**
 * Extracts teams and users out of a GitHub org.
 */
export class GithubOrgReaderProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
  private readonly logger: Logger;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new GithubOrgReaderProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: { integrations: ScmIntegrations; logger: Logger }) {
    this.integrations = options.integrations;
    this.logger = options.logger;
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'github-org') {
      return false;
    }

    const { client, tokenType } = await this.createClient(location.target);
    const { org } = parseUrl(location.target);

    // Read out all of the raw data
    const startTimestamp = Date.now();
    this.logger.info('Reading GitHub users and groups');

    const { users } = await getOrganizationUsers(client, org, tokenType);
    const { groups, groupMemberUsers } = await getOrganizationTeams(
      client,
      org,
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${users.length} GitHub users and ${groups.length} GitHub groups in ${duration} seconds`,
    );

    // Fill out the hierarchy
    const usersByName = new Map(users.map(u => [u.metadata.name, u]));
    for (const [groupName, userNames] of groupMemberUsers.entries()) {
      for (const userName of userNames) {
        const user = usersByName.get(userName);
        if (user && !user.spec.memberOf.includes(groupName)) {
          user.spec.memberOf.push(groupName);
        }
      }
    }
    buildOrgHierarchy(groups);

    // Done!
    for (const group of groups) {
      emit(results.entity(location, group));
    }
    for (const user of users) {
      emit(results.entity(location, user));
    }

    return true;
  }

  private async createClient(
    orgUrl: string,
  ): Promise<{ client: GraphQL; tokenType: GithubCredentialType }> {
    const gitHubConfig = this.integrations.github.byUrl(orgUrl)?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub Org provider that matches ${orgUrl}. Please add a configuration for an integration.`,
      );
    }

    const credentialsProvider = GithubCredentialsProvider.create(gitHubConfig);
    const {
      headers,
      type: tokenType,
    } = await credentialsProvider.getCredentials({
      url: orgUrl,
    });

    const client = graphql.defaults({
      baseUrl: gitHubConfig.apiBaseUrl,
      headers,
    });

    return { client, tokenType };
  }
}

/*
 * Helpers
 */

export function parseUrl(urlString: string): { org: string } {
  const path = new URL(urlString).pathname.substr(1).split('/');

  // /backstage
  if (path.length === 1 && path[0].length) {
    return { org: decodeURIComponent(path[0]) };
  }

  throw new Error(`Expected a URL pointing to /<org>`);
}
