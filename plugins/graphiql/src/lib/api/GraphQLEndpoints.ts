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

import { GraphQLBrowseApi, GraphQLEndpoint } from './types';
import { ErrorApi, OAuthApi } from '@backstage/core-plugin-api';

// Helper for generic http endpoints
export type EndpointConfig = {
  id: string;
  title: string;
  // Endpoint URL
  url: string;
  // only supports POST right now
  method?: 'POST';
  // Defaults to setting Content-Type to application/json
  headers?: { [name in string]: string };
};

export type GithubEndpointConfig = {
  id: string;
  title: string;
  /**
   * GitHub GraphQL API url, defaults to https://api.github.com/graphql
   */
  url?: string;
  /**
   * Errors will be posted to the ErrorApi if it is provided.
   */
  errorApi?: ErrorApi;
  /**
   * GitHub Auth API used to authenticate requests.
   */
  githubAuthApi: OAuthApi;
};

export class GraphQLEndpoints implements GraphQLBrowseApi {
  // Create a support
  static create(config: EndpointConfig): GraphQLEndpoint {
    const { id, title, url, method = 'POST' } = config;
    return {
      id,
      title,
      fetcher: async (params: any) => {
        const body = JSON.stringify(params);
        const headers = {
          'Content-Type': 'application/json',
          ...config.headers,
        };
        const res = await fetch(url, {
          method,
          headers,
          body,
        });
        return res.json();
      },
    };
  }

  /**
   * Creates a GitHub GraphQL endpoint that uses the GithubAuth API to authenticate requests.
   *
   * If a request requires more permissions than is granted by the existing session,
   * the fetcher will automatically ask for the additional scopes that are required.
   */
  static github(config: GithubEndpointConfig): GraphQLEndpoint {
    const {
      id,
      title,
      url = 'https://api.github.com/graphql',
      errorApi,
      githubAuthApi,
    } = config;
    type ResponseBody = {
      errors?: Array<{ type: string; message: string }>;
    };

    return {
      id,
      title,
      fetcher: async (params: any) => {
        let retried = false;

        const doRequest = async (): Promise<any> => {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await githubAuthApi.getAccessToken()}`,
            },
            body: JSON.stringify(params),
          });
          if (!res.ok) {
            throw new Error(
              `Request failed with status ${res.status} ${res.statusText}`,
            );
          }
          const data = (await res.json()) as ResponseBody;

          if (!data.errors || retried) {
            return data;
          }
          retried = true;

          const missingScopes = data.errors
            .filter(({ type }) => type === 'INSUFFICIENT_SCOPES')
            .flatMap(({ message }) => {
              const scopesMatch = message.match(
                /one of the following scopes: (\[.*?\])/,
              );
              if (!scopesMatch) {
                return [];
              }
              try {
                const scopes = JSON.parse(scopesMatch[1].replace(/'/g, '"'));
                return scopes;
              } catch (error) {
                if (errorApi) {
                  errorApi.post(
                    new Error(
                      `Failed to parse scope string "${scopesMatch[1]}", ${error}`,
                    ),
                  );
                }
                return [];
              }
            });

          await githubAuthApi.getAccessToken(missingScopes);
          return doRequest();
        };

        return await doRequest();
      },
    };
  }

  static from(endpoints: GraphQLEndpoint[]) {
    return new GraphQLEndpoints(endpoints);
  }

  private constructor(private readonly endpoints: GraphQLEndpoint[]) {}

  async getEndpoints() {
    return this.endpoints;
  }
}
