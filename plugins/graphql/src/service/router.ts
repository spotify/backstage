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

import { errorHandler, resolvePackagePath } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import fs from 'fs';
import { GraphQLModule } from '@graphql-modules/core';
import { ApolloServer } from 'apollo-server-express';
import { createModule as createCatalogModule } from '@backstage/plugin-catalog-graphql';
import { Config } from '@backstage/config';
import helmet from 'helmet';

const schemaPath = resolvePackagePath(
  '@backstage/plugin-graphql-backend',
  'schema.gql',
);

export interface RouterOptions {
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const typeDefs = await fs.promises.readFile(schemaPath, 'utf-8');

  const catalogModule = await createCatalogModule(options);

  const { schema } = new GraphQLModule({
    imports: [catalogModule],
    typeDefs,
  });

  const server = new ApolloServer({
    schema,
    logger: options.logger,
    introspection: true,
    playground: process.env.NODE_ENV === 'development',
  });

  const router = Router();

  router.get('/health', (_, response) => {
    response.send({ status: 'ok' });
  });

  const apolloMiddleware = server.getMiddleware({ path: '/' });

  if (process.env.NODE_ENV === 'development')
    router.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'", "'unsafe-inline'", 'http://*'],
        },
      }),
    );

  router.use(apolloMiddleware);

  router.use(errorHandler());

  return router;
}
