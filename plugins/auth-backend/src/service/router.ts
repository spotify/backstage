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

import express from 'express';
import Router from 'express-promise-router';
import cookieParser from 'cookie-parser';
import { Logger } from 'winston';
import {
  defaultAuthProviderFactories,
  AuthProviderFactory,
} from '../providers';
import {
  PluginDatabaseManager,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { NotFoundError } from '@backstage/errors';
import { CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { createOidcRouter, DatabaseKeyStore, TokenFactory } from '../identity';
import session from 'express-session';
import passport from 'passport';

type ProviderFactories = { [s: string]: AuthProviderFactory };

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  discovery: PluginEndpointDiscovery;
  providerFactories?: ProviderFactories;
}

export async function createRouter({
  logger,
  config,
  discovery,
  database,
  providerFactories,
}: RouterOptions): Promise<express.Router> {
  const router = Router();

  const appUrl = config.getString('app.baseUrl');
  const authUrl = await discovery.getExternalBaseUrl('auth');

  const keyDurationSeconds = 3600;

  const keyStore = await DatabaseKeyStore.create({
    database: await database.getClient(),
  });
  const tokenIssuer = new TokenFactory({
    issuer: authUrl,
    keyStore,
    keyDurationSeconds,
    logger: logger.child({ component: 'token-factory' }),
  });
  const catalogApi = new CatalogClient({ discoveryApi: discovery });

  const secret = config.getOptionalString('auth.session.secret');
  if (secret) {
    router.use(cookieParser(secret));
    // TODO: Configure the server-side session storage.  The default MemoryStore is not designed for production
    router.use(session({ secret, saveUninitialized: false, resave: false }));
    router.use(passport.initialize());
    router.use(passport.session());
  } else {
    router.use(cookieParser());
  }
  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());

  const allProviderFactories = {
    ...defaultAuthProviderFactories,
    ...providerFactories,
  };
  const providersConfig = config.getConfig('auth.providers');
  const configuredProviders = providersConfig.keys();

  for (const [providerId, providerFactory] of Object.entries(
    allProviderFactories,
  )) {
    if (configuredProviders.includes(providerId)) {
      logger.info(`Configuring provider, ${providerId}`);
      try {
        const provider = providerFactory({
          providerId,
          globalConfig: { baseUrl: authUrl, appUrl },
          config: providersConfig.getConfig(providerId),
          logger,
          tokenIssuer,
          discovery,
          catalogApi,
        });

        const r = Router();

        r.get('/start', provider.start.bind(provider));
        r.get('/handler/frame', provider.frameHandler.bind(provider));
        r.post('/handler/frame', provider.frameHandler.bind(provider));
        if (provider.logout) {
          r.post('/logout', provider.logout.bind(provider));
        }
        if (provider.refresh) {
          r.get('/refresh', provider.refresh.bind(provider));
        }

        router.use(`/${providerId}`, r);
      } catch (e) {
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            `Failed to initialize ${providerId} auth provider, ${e.message}`,
          );
        }

        logger.warn(`Skipping ${providerId} auth provider, ${e.message}`);

        router.use(`/${providerId}`, () => {
          // If the user added the provider under auth.providers but the clientId and clientSecret etc. were not found.
          throw new NotFoundError(
            `Auth provider registered for '${providerId}' is misconfigured. This could mean the configs under ` +
              `auth.providers.${providerId} are missing or the environment variables used are not defined. ` +
              `Check the auth backend plugin logs when the backend starts to see more details.`,
          );
        });
      }
    } else {
      router.use(`/${providerId}`, () => {
        throw new NotFoundError(
          `No auth provider registered for '${providerId}'`,
        );
      });
    }
  }

  router.use(
    createOidcRouter({
      tokenIssuer,
      baseUrl: authUrl,
    }),
  );

  router.use('/:provider/', req => {
    const { provider } = req.params;
    throw new NotFoundError(`Unknown auth provider '${provider}'`);
  });

  return router;
}
