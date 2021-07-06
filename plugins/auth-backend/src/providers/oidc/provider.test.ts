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

import { Config, ConfigReader } from '@backstage/config';
import { msw } from '@backstage/test-utils';
import express from 'express';
import { Session } from 'express-session';
import { JWK, JWT } from 'jose';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ClientMetadata, IssuerMetadata } from 'openid-client';
import { OAuthAdapter } from '../../lib/oauth';
import { AuthProviderFactoryOptions } from '../types';
import { createOidcProvider, OidcAuthProvider } from './provider';

const issuerMetadata = {
  issuer: 'https://oidc.test',
  authorization_endpoint: 'https://oidc.test/as/authorization.oauth2',
  token_endpoint: 'https://oidc.test/as/token.oauth2',
  revocation_endpoint: 'https://oidc.test/as/revoke_token.oauth2',
  userinfo_endpoint: 'https://oidc.test/idp/userinfo.openid',
  introspection_endpoint: 'https://oidc.test/as/introspect.oauth2',
  jwks_uri: 'https://oidc.test/pf/JWKS',
  scopes_supported: ['openid'],
  claims_supported: ['email'],
  response_types_supported: ['code'],
  id_token_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  token_endpoint_auth_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  request_object_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
};

const clientMetadata = {
  callbackUrl: 'https://oidc.test/callback',
  clientId: 'testclientid',
  clientSecret: 'testclientsecret',
  metadataUrl: 'https://oidc.test/.well-known/openid-configuration',
  tokenSignedResponseAlg: 'none',
};

describe('OidcAuthProvider', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hit the metadata url', async () => {
    const handler = jest.fn((_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json(issuerMetadata),
      );
    });
    worker.use(
      rest.get('https://oidc.test/.well-known/openid-configuration', handler),
    );
    const provider = new OidcAuthProvider(clientMetadata);
    const { strategy } = ((await (provider as any).implementation) as any) as {
      strategy: {
        _client: ClientMetadata;
        _issuer: IssuerMetadata;
      };
    };
    // Assert that the expected request to the metadaurl was made.
    expect(handler).toBeCalledTimes(1);
    const { _client, _issuer } = strategy;
    expect(_client.client_id).toBe(clientMetadata.clientId);
    expect(_issuer.token_endpoint).toBe(issuerMetadata.token_endpoint);
  });

  it('OidcAuthProvider#handler successfully invokes the oidc endpoints', async () => {
    const jwt = {
      sub: 'alice',
      iss: 'https://oidc.test',
      iat: Date.now(),
      aud: clientMetadata.clientId,
      exp: Date.now() + 10000,
    };
    const requestSequence: Array<string> = [];

    // The array of expected requests executed by the provider handler
    const requests: Array<{
      method: 'get' | 'post';
      url: string;
      payload: object;
    }> = [
      {
        method: 'get',
        url: 'https://oidc.test/.well-known/openid-configuration',
        payload: issuerMetadata,
      },
      {
        method: 'post',
        url: 'https://oidc.test/as/token.oauth2',
        payload: {
          id_token: JWT.sign(jwt, JWK.None),
          access_token: 'test',
          authorization_signed_response_alg: 'HS256',
        },
      },
      {
        method: 'get',
        url: 'https://oidc.test/idp/userinfo.openid',
        payload: {
          sub: 'alice',
          email: 'alice@oidc.test',
        },
      },
    ];
    worker.use(
      ...requests.map(r => {
        return rest[r.method](r.url, (_req, res, ctx) => {
          requestSequence.push(r.url);
          return res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(r.payload),
          );
        });
      }),
    );
    const provider = new OidcAuthProvider(clientMetadata);
    const req = {
      method: 'GET',
      url: 'https://oidc.test/?code=test2',
      session: ({ 'oidc:oidc.test': 'test' } as any) as Session,
    } as express.Request;
    await provider.handler(req);
    expect(requestSequence).toEqual([0, 1, 2].map(i => requests[i].url));
  });

  it('createOidcProvider', async () => {
    const handler = jest.fn((_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json(issuerMetadata),
      );
    });
    worker.use(
      rest.get('https://oidc.test/.well-known/openid-configuration', handler),
    );
    const config: Config = new ConfigReader({
      testEnv: {
        ...clientMetadata,
        metadataUrl: 'https://oidc.test/.well-known/openid-configuration',
      },
    });
    const options = {
      globalConfig: {
        appUrl: 'https://oidc.test',
        baseUrl: 'https://oidc.test',
      },
      config,
    } as AuthProviderFactoryOptions;
    const provider = createOidcProvider()(options) as OAuthAdapter;
    expect(provider.start).toBeDefined();
    // Cast provider as any here to be able to inspect private members
    await (provider as any).handlers.get('testEnv').handlers.implementation;
    // Assert that the expected request to the metadaurl was made.
    expect(handler).toBeCalledTimes(1);
  });
});
