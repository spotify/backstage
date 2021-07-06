/*
 * Copyright 2021 Spotify AB
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
import {
  AuthProviderFactoryOptions,
  AuthProviderRouteHandlers,
  AuthResponse
} from '@backstage/plugin-auth-backend';

import {
  ExperimentalIdentityResolver,
} from '../types';
import express from 'express';
import { Logger } from 'winston';
import { CatalogApi } from '@backstage/catalog-client';

import { OAuth2Client } from 'google-auth-library';

const IAP_JWT_HEADER = 'x-goog-iap-jwt-assertion';

export type GcpIAPProviderOptions = {
  audience: string;
  identityResolutionCallback: ExperimentalIdentityResolver;
};
export class GcpIAPProvider implements AuthProviderRouteHandlers {
  private logger: Logger;
  private options: GcpIAPProviderOptions;
  private readonly catalogClient: CatalogApi;

  constructor(
    logger: Logger,
    catalogClient: CatalogApi,
    options: GcpIAPProviderOptions,
  ) {
    this.logger = logger;
    this.catalogClient = catalogClient;
    this.options = options;
  }
  frameHandler(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    const expectedAudience = this.options.audience;

    const jwtToken = req.header(IAP_JWT_HEADER);

    const oAuth2Client = new OAuth2Client();
    const verify = async () => {
      const response = await oAuth2Client.getIapPublicKeys();
      const ticket = await oAuth2Client.verifySignedJwtWithCertsAsync(
        jwtToken,
        response.pubkeys,
        expectedAudience,
        ['https://cloud.google.com/iap']
      );
      return ticket.payload;
    }

    try {
      const user = await verify();
      const resolvedEntity = await this.options.identityResolutionCallback(
        {
          email: user.email
        },
        this.catalogClient,
      );
      res.json(resolvedEntity);
    } catch (e) {
      const resolvedEntity = await this.options.identityResolutionCallback(
        {},
        this.catalogClient,
      );
      res.json(resolvedEntity);
      this.logger.error('Verification failed with', e);

      res.status(401);
      res.end();
    }
    res.status(200);
    res.end();
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }
}


export const createGcpIAPProvider = (_options?: GcpIAPProviderOptions) => {
  return ({
    logger,
    catalogApi,
    config,
    identityResolver,
  }: AuthProviderFactoryOptions) => {
    const audience = config.getString('audience');
    if (identityResolver !== undefined) {
      return new GcpIAPProvider(logger, catalogApi, {
        audience,
        identityResolutionCallback: identityResolver,
      });
    }
    throw new Error(
      'Identity resolver is required to use this authentication provider',
    );
  };
};
