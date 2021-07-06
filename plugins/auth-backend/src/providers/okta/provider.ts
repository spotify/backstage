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
import { Strategy as OktaStrategy } from 'passport-okta-oauth';
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
import { StateStore } from 'passport-oauth2';

type PrivateInfo = {
  refreshToken: string;
};

export type OktaAuthProviderOptions = OAuthProviderOptions & {
  audience: string;
};

export class OktaAuthProvider implements OAuthHandlers {
  private readonly _strategy: any;

  /**
   * Due to passport-okta-oauth forcing options.state = true,
   * passport-oauth2 requires express-session to be installed
   * so that the 'state' parameter of the oauth2 flow can be stored.
   * This implementation of StateStore matches the NullStore found within
   * passport-oauth2, which is the StateStore implementation used when options.state = false,
   * allowing us to avoid using express-session in order to integrate with Okta.
   */
  private _store: StateStore = {
    store(_req: express.Request, cb: any) {
      cb(null, null);
    },
    verify(_req: express.Request, _state: string, cb: any) {
      cb(null, true);
    },
  };

  constructor(options: OktaAuthProviderOptions) {
    this._strategy = new OktaStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        audience: options.audience,
        passReqToCallback: false as true,
        store: this._store,
        response_type: 'code',
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
      throw new Error('Okta profile contained no email');
    }

    // TODO(Rugvip): Hardcoded to the local part of the email for now
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export type OktaProviderOptions = {};

export const createOktaProvider = (
  _options?: OktaProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const audience = envConfig.getString('audience');
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const provider = new OktaAuthProvider({
        audience,
        clientId,
        clientSecret,
        callbackUrl,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
