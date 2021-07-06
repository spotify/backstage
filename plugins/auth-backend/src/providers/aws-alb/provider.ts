/*
 * Copyright 2021 The Backstage Authors
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
  ExperimentalIdentityResolver,
} from '../types';
import express from 'express';
import fetch from 'cross-fetch';
import * as crypto from 'crypto';
import { KeyObject } from 'crypto';
import { Logger } from 'winston';
import NodeCache from 'node-cache';
import { JWT } from 'jose';
import { CatalogApi } from '@backstage/catalog-client';

const ALB_JWT_HEADER = 'x-amzn-oidc-data';
/**
 * A callback function that receives a verified JWT and returns a UserEntity
 *  @param {payload} The verified JWT payload
 */
type AwsAlbAuthProviderOptions = {
  region: string;
  issuer?: string;
  identityResolutionCallback: ExperimentalIdentityResolver;
};
export const getJWTHeaders = (input: string) => {
  const encoded = input.split('.')[0];
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
};

export class AwsAlbAuthProvider implements AuthProviderRouteHandlers {
  private logger: Logger;
  private readonly catalogClient: CatalogApi;
  private options: AwsAlbAuthProviderOptions;
  private readonly keyCache: NodeCache;

  constructor(
    logger: Logger,
    catalogClient: CatalogApi,
    options: AwsAlbAuthProviderOptions,
  ) {
    this.logger = logger;
    this.catalogClient = catalogClient;
    this.options = options;
    this.keyCache = new NodeCache({ stdTTL: 3600 });
  }
  frameHandler(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    const jwt = req.header(ALB_JWT_HEADER);
    if (jwt !== undefined) {
      try {
        const headers = getJWTHeaders(jwt);
        const key = await this.getKey(headers.kid);
        const payload = JWT.verify(jwt, key);

        if (this.options.issuer && headers.iss !== this.options.issuer) {
          throw new Error('issuer mismatch on JWT');
        }

        const resolvedEntity = await this.options.identityResolutionCallback(
          payload,
          this.catalogClient,
        );
        res.json(resolvedEntity);
      } catch (e) {
        this.logger.error('exception occurred during JWT processing', e);
        res.status(401);
        res.end();
      }
    } else {
      res.status(401);
      res.end();
    }
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getKey(keyId: string): Promise<KeyObject> {
    const optionalCacheKey = this.keyCache.get<KeyObject>(keyId);
    if (optionalCacheKey) {
      return crypto.createPublicKey(optionalCacheKey);
    }
    const keyText: string = await fetch(
      `https://public-keys.auth.elb.${this.options.region}.amazonaws.com/${keyId}`,
    ).then(response => response.text());
    const keyValue = crypto.createPublicKey(keyText);
    this.keyCache.set(keyId, keyValue.export({ format: 'pem', type: 'spki' }));
    return keyValue;
  }
}

export type AwsAlbProviderOptions = {};

export const createAwsAlbProvider = (_options?: AwsAlbProviderOptions) => {
  return ({
    logger,
    catalogApi,
    config,
    identityResolver,
  }: AuthProviderFactoryOptions) => {
    const region = config.getString('region');
    const issuer = config.getOptionalString('iss');
    if (identityResolver !== undefined) {
      return new AwsAlbAuthProvider(logger, catalogApi, {
        region,
        issuer,
        identityResolutionCallback: identityResolver,
      });
    }
    throw new Error(
      'Identity resolver is required to use this authentication provider',
    );
  };
};
