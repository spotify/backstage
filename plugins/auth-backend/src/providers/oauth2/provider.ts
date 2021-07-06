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
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthRefreshRequest,
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
import { RedirectInfo, AuthProviderFactory } from '../types';

type PrivateInfo = {
  refreshToken: string;
};

export type OAuth2AuthProviderOptions = OAuthProviderOptions & {
  authorizationUrl: string;
  tokenUrl: string;
  scope?: string;
};

export class OAuth2AuthProvider implements OAuthHandlers {
  private readonly _strategy: OAuth2Strategy;

  constructor(options: OAuth2AuthProviderOptions) {
    this._strategy = new OAuth2Strategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        authorizationURL: options.authorizationUrl,
        tokenURL: options.tokenUrl,
        passReqToCallback: false as true,
        scope: options.scope,
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
            accessToken,
            refreshToken,
            params,
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
        profile,
        providerInfo: {
          idToken: result.params.id_token,
          accessToken: result.accessToken,
          scope: result.params.scope,
          expiresInSeconds: result.params.expires_in,
        },
      }),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const refreshTokenResponse = await executeRefreshTokenStrategy(
      this._strategy,
      req.refreshToken,
      req.scope,
    );
    const {
      accessToken,
      params,
      refreshToken: updatedRefreshToken,
    } = refreshTokenResponse;

    const rawProfile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
    );
    const profile = makeProfileInfo(rawProfile, params.id_token);

    return this.populateIdentity({
      providerInfo: {
        accessToken,
        refreshToken: updatedRefreshToken,
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      profile,
    });
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

export type OAuth2ProviderOptions = {};

export const createOAuth2Provider = (
  _options?: OAuth2ProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authorizationUrl = envConfig.getString('authorizationUrl');
      const tokenUrl = envConfig.getString('tokenUrl');
      const scope = envConfig.getOptionalString('scope');

      const provider = new OAuth2AuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        authorizationUrl,
        tokenUrl,
        scope,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
