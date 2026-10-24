/*
 * Copyright 2024 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { getClient } from '../util';

export function createHandleAutocompleteRequest(options: {
  integrations: ScmIntegrationRegistry;
}) {
  return async function handleAutocompleteRequest({
    resource,
    token,
    context,
  }: {
    resource: string;
    token: string;
    context: Record<string, string>;
  }): Promise<{
    results: {
      title?: string;
      id: string;
    }[];
  }> {
    const { integrations } = options;
    const client = getClient({
      host: context.host ?? 'gitlab.com',
      integrations,
      token,
    });

    switch (resource) {
      case 'groups': {
        let groups: any[] = [];
        let page = 1;
        const perPage = 100;
        let response = [];
        let continueFetch = true;
        while (continueFetch) {
          response = await client.Groups.all({
            pagination: 'offset',
            page,
            perPage,
          });

          groups = groups.concat(response);
          if (response.length < perPage) continueFetch = false;
          page++;
        }

        const result: {
          results: {
            title: string;
            id: string;
          }[];
        } = {
          results: groups.map(group => ({
            title: group.full_path,
            id: group.id.toString(),
          })),
        };
        // append also user context
        const user = await client.Users.showCurrentUser();
        result.results.push({
          title: user.username,
          id: user.id.toString(),
        });

        return result;
      }
      case 'branches': {
        if (!context.owner || !context.repository) {
          throw new InputError('Missing owner or repository context parameter');
        }
        if (!token) {
          throw new InputError(
            'Missing user credentials for branch autocomplete',
          );
        }

        const branches = await client.Branches.all(
          `${context.owner}/${context.repository}`,
        );

        return {
          results: branches.map(branch => ({
            title: branch.name,
            id: branch.name,
          })),
        };
      }
      case 'repositories': {
        if (!context.id)
          throw new InputError('Missing groupId and userId context parameter');

        let response;
        if (
          context.id === (await client.Users.showCurrentUser())?.id.toString()
        ) {
          response = await client.Users.allProjects(context.id);
        } else {
          response = await client.Groups.allProjects(context.id);
        }

        return {
          results: response.map(project => ({
            title: project.name.trim(),
            id: project.path,
          })),
        };
      }
      default:
        throw new InputError(`Invalid resource: ${resource}`);
    }
  };
}
