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
import {
  Issuer,
  Client,
  Strategy as OidcStrategy,
  TokenSet,
  UserinfoResponse,
} from 'openid-client';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthRefreshRequest,
} from '../../lib/oauth';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import { RedirectInfo, AuthProviderFactory } from '../types';

type PrivateInfo = {
  refreshToken?: string;
};

type OidcImpl = {
  strategy: OidcStrategy<UserinfoResponse, Client>;
  client: Client;
};

type AuthResult = {
  tokenset: TokenSet;
  userinfo: UserinfoResponse;
};

export type Options = OAuthProviderOptions & {
  metadataUrl: string;
  scope?: string;
  tokenSignedResponseAlg?: string;
};

export class OidcAuthProvider implements OAuthHandlers {
  private readonly implementation: Promise<OidcImpl>;
  private readonly scope?: string;

  constructor(options: Options) {
    this.implementation = this.setupStrategy(options);
    this.scope = options.scope;
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    const { strategy } = await this.implementation;
    return await executeRedirectStrategy(req, strategy, {
      accessType: 'offline',
      prompt: 'none',
      scope: req.scope || this.scope || '',
      state: encodeState(req.state),
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken?: string }> {
    const { strategy } = await this.implementation;
    const strategyResponse = await executeFrameHandlerStrategy<
      AuthResult,
      PrivateInfo
    >(req, strategy);
    const {
      result: { userinfo, tokenset },
      privateInfo,
    } = strategyResponse;
    const identityResponse = await this.populateIdentity({
      profile: {
        displayName: userinfo.name,
        email: userinfo.email,
        picture: userinfo.picture,
      },
      providerInfo: {
        idToken: tokenset.id_token,
        accessToken: tokenset.access_token || '',
        scope: tokenset.scope || '',
        expiresInSeconds: tokenset.expires_in,
      },
    });
    return {
      response: identityResponse,
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const { client } = await this.implementation;
    const tokenset = await client.refresh(req.refreshToken);
    if (!tokenset.access_token) {
      throw new Error('Refresh failed');
    }
    const profile = await client.userinfo(tokenset.access_token);

    return this.populateIdentity({
      providerInfo: {
        accessToken: tokenset.access_token,
        refreshToken: tokenset.refresh_token,
        expiresInSeconds: tokenset.expires_in,
        idToken: tokenset.id_token,
        scope: tokenset.scope || '',
      },
      profile,
    });
  }

  private async setupStrategy(options: Options): Promise<OidcImpl> {
    const issuer = await Issuer.discover(options.metadataUrl);
    const client = new issuer.Client({
      client_id: options.clientId,
      client_secret: options.clientSecret,
      redirect_uris: [options.callbackUrl],
      response_types: ['code'],
      id_token_signed_response_alg: options.tokenSignedResponseAlg || 'RS256',
      scope: options.scope || '',
    });

    const strategy = new OidcStrategy(
      {
        client,
        passReqToCallback: false as true,
      },
      (
        tokenset: TokenSet,
        userinfo: UserinfoResponse,
        done: PassportDoneCallback<AuthResult, PrivateInfo>,
      ) => {
        done(
          undefined,
          { tokenset, userinfo },
          {
            refreshToken: tokenset.refresh_token,
          },
        );
      },
    );
    strategy.error = console.error;
    return { strategy, client };
  }

  // Use this function to grab the user profile info from the token
  // Then populate the profile with it
  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Profile does not contain an email');
    }
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export type OidcProviderOptions = {};

export const createOidcProvider = (
  _options?: OidcProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const metadataUrl = envConfig.getString('metadataUrl');
      const tokenSignedResponseAlg = envConfig.getString(
        'tokenSignedResponseAlg',
      );
      const scope = envConfig.getOptionalString('scope');

      const provider = new OidcAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        tokenSignedResponseAlg,
        metadataUrl,
        scope,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
