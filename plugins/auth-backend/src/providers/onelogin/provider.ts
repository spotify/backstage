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

import { Strategy as OneLoginStrategy } from 'passport-onelogin-oauth';
import express from 'express';
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
import passport from 'passport';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  executeFetchUserProfileStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import { RedirectInfo, AuthProviderFactory } from '../types';

type PrivateInfo = {
  refreshToken: string;
};

export type Options = OAuthProviderOptions & {
  issuer: string;
};

export class OneLoginProvider implements OAuthHandlers {
  private readonly _strategy: any;

  constructor(options: Options) {
    this._strategy = new OneLoginStrategy(
      {
        issuer: options.issuer,
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
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
            accessToken,
            refreshToken,
            params,
            fullProfile,
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
      scope: 'openid',
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
      throw new Error('OIDC profile contained no email');
    }

    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export type OneLoginProviderOptions = {};

export const createOneLoginProvider = (
  _options?: OneLoginProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const issuer = envConfig.getString('issuer');
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const provider = new OneLoginProvider({
        clientId,
        clientSecret,
        callbackUrl,
        issuer,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
