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

import { createApiRef } from '@backstage/core-plugin-api';

export type GraphQLEndpoint = {
  // Will be used as unique key for storing history and query data
  id: string;

  // Displayed to the user to identify the source.
  title: string;

  // Method used send a GraphQL query.
  // The body parameter is equivalent to the POST body to be JSON-serialized, and the
  // return value should be the equivalent of a parsed JSON response from that POST.
  fetcher: (body: any) => Promise<any>;
};

export type GraphQLBrowseApi = {
  getEndpoints(): Promise<GraphQLEndpoint[]>;
};

export const graphQlBrowseApiRef = createApiRef<GraphQLBrowseApi>({
  id: 'plugin.graphiql.browse',
});
