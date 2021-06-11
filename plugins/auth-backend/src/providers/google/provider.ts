/*
 * Copyright 2020 Spotify AB
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
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Logger } from 'winston';
import { CatalogIdentityClient } from '../../lib/catalog';
import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthRefreshRequest,
  OAuthResponse,
  OAuthStartRequest,
  OAuthResult,
} from '../../lib/oauth';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import { AuthProviderFactory, RedirectInfo } from '../types';
import { TokenIssuer } from '../../identity/types';

type PrivateInfo = {
  refreshToken: string;
};

type Options = OAuthProviderOptions & {
  logger: Logger;
  identityClient: CatalogIdentityClient;
  tokenIssuer: TokenIssuer;
};

export class GoogleAuthProvider implements OAuthHandlers {
  private readonly _strategy: GoogleStrategy;
  private readonly logger: Logger;
  private readonly identityClient: CatalogIdentityClient;
  private readonly tokenIssuer: TokenIssuer;

  constructor(options: Options) {
    this.logger = options.logger;
    this.identityClient = options.identityClient;
    this.tokenIssuer = options.tokenIssuer;
    // TODO: throw error if env variables not set?
    this._strategy = new GoogleStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        // We need passReqToCallback set to false to get params, but there's
        // no matching type signature for that, so instead behold this beauty
        passReqToCallback: false as true,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResult, PrivateInfo>,
      ) => {
        done(
          undefined,
          {
            fullProfile,
            params,
            accessToken,
            refreshToken,
          },
          {
            refreshToken,
          },
        );
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: 'offline',
      prompt: 'consent',
      scope: req.scope,
      state: encodeState(req.state),
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResult,
      PrivateInfo
    >(req, this._strategy);

    const profile = makeProfileInfo(result.fullProfile, result.params.id_token);

    return {
      response: await this.populateIdentity({
        providerInfo: {
          idToken: result.params.id_token,
          accessToken: result.accessToken,
          scope: result.params.scope,
          expiresInSeconds: result.params.expires_in,
        },
        profile,
      }),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      req.refreshToken,
      req.scope,
    );

    const fullProfile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
    );
    const profile = makeProfileInfo(fullProfile, params.id_token);

    return this.populateIdentity({
      providerInfo: {
        accessToken,
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      profile,
    });
  }

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Google profile contained no email');
    }

    try {
      const token = await this.tokenIssuer.issueToken({
        claims: { sub: 'backstage.io/auth-backend' },
      });
      const user = await this.identityClient.findUser(
        {
          annotations: {
            'google.com/email': profile.email,
          },
        },
        { token },
      );

      return {
        ...response,
        backstageIdentity: {
          id: user.metadata.name,
        },
      };
    } catch (error) {
      this.logger.warn(
        `Failed to look up user, ${error}, falling back to allowing login based on email pattern, this will probably break in the future`,
      );
      return {
        ...response,
        backstageIdentity: { id: profile.email.split('@')[0] },
      };
    }
  }
}

export type GoogleProviderOptions = {};

export const createGoogleProvider = (
  _options?: GoogleProviderOptions,
): AuthProviderFactory => {
  return ({
    providerId,
    globalConfig,
    config,
    logger,
    tokenIssuer,
    catalogApi,
  }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const provider = new GoogleAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        logger,
        tokenIssuer,
        identityClient: new CatalogIdentityClient({ catalogApi }),
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
