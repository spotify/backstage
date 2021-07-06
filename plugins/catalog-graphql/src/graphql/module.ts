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

import { Logger } from 'winston';
import { makeExecutableSchema } from 'apollo-server';
import { GraphQLModule } from '@graphql-modules/core';
import { Resolvers, CatalogQuery } from './types';
import { Config } from '@backstage/config';
import { CatalogClient } from '../service/client';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { Entity } from '@backstage/catalog-model';
import typeDefs from '../schema';

export interface ModuleOptions {
  logger: Logger;
  config: Config;
}

export async function createModule(
  options: ModuleOptions,
): Promise<GraphQLModule> {
  const catalogClient = new CatalogClient(
    options.config.getString('backend.baseUrl'),
  );

  const resolvers: Resolvers = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    DefaultEntitySpec: {
      raw: rootValue => {
        const { entity } = rootValue as { entity: Entity };
        return entity.spec ?? null;
      },
    },
    Query: {
      catalog: () => ({} as CatalogQuery),
    },
    CatalogQuery: {
      list: async () => {
        return await catalogClient.list();
      },
    },
    CatalogEntity: {
      metadata: entity => ({ ...entity.metadata!, entity }),
      spec: entity => ({ ...entity.spec!, entity }),
    },
    EntityMetadata: {
      __resolveType: rootValue => {
        const {
          entity: { kind },
        } = rootValue as { entity: Entity };
        switch (kind) {
          case 'Component':
            return 'ComponentMetadata';
          case 'Template':
            return 'TemplateMetadata';
          default:
            return 'DefaultEntityMetadata';
        }
      },
      annotation: (e, { name }) => e.annotations?.[name] ?? null,
      labels: e => e.labels ?? {},
      annotations: e => e.annotations ?? {},
      label: (e, { name }) => e.labels?.[name] ?? null,
    },
    EntitySpec: {
      __resolveType: rootValue => {
        const {
          entity: { kind },
        } = rootValue as { entity: Entity };

        switch (kind) {
          case 'Component':
            return 'ComponentEntitySpec';
          case 'Template':
            return 'TemplateEntitySpec';
          default:
            return 'DefaultEntitySpec';
        }
      },
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    inheritResolversFromInterfaces: true,
  });

  const module = new GraphQLModule({
    extraSchemas: [schema],
    logger: options.logger as any,
  });

  return module;
}
