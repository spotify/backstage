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
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  executeFetchUserProfileStrategy,
  PassportDoneCallback,
} from '../../lib/passport';

import { RedirectInfo, AuthProviderFactory } from '../types';

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

import got from 'got';

type PrivateInfo = {
  refreshToken: string;
};

export type MicrosoftAuthProviderOptions = OAuthProviderOptions & {
  authorizationUrl?: string;
  tokenUrl?: string;
};

export class MicrosoftAuthProvider implements OAuthHandlers {
  private readonly _strategy: MicrosoftStrategy;

  constructor(options: MicrosoftAuthProviderOptions) {
    this._strategy = new MicrosoftStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        authorizationURL: options.authorizationUrl,
        tokenURL: options.tokenUrl,
        passReqToCallback: false as true,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResult, PrivateInfo>,
      ) => {
        done(undefined, { fullProfile, accessToken, params }, { refreshToken });
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
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

    try {
      const photoUrl = await this.getUserPhoto(result.accessToken);

      const profile = makeProfileInfo(
        {
          ...result.fullProfile,
          photos: photoUrl ? [{ value: photoUrl }] : undefined,
        },
        result.params.id_token,
      );

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
    } catch (error) {
      throw new Error(`Error processing auth response: ${error}`);
    }
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
    const photo = await this.getUserPhoto(accessToken);
    if (photo) {
      profile.picture = photo;
    }

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

  private getUserPhoto(accessToken: string): Promise<string | undefined> {
    return new Promise(resolve => {
      got
        .get('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
          encoding: 'binary',
          responseType: 'buffer',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(photoData => {
          const photoURL = `data:image/jpeg;base64,${Buffer.from(
            photoData.body,
          ).toString('base64')}`;
          resolve(photoURL);
        })
        .catch(error => {
          console.log(
            `Could not retrieve user profile photo from Microsoft Graph API: ${error}`,
          );
          // User profile photo is optional, ignore errors and resolve undefined
          resolve(undefined);
        });
    });
  }

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('Microsoft profile contained no email');
    }

    // Like Google implementation, setting this to local part of email for now
    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export type MicrosoftProviderOptions = {};

export const createMicrosoftProvider = (
  _options?: MicrosoftProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const tenantId = envConfig.getString('tenantId');

      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authorizationUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

      const provider = new MicrosoftAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        authorizationUrl,
        tokenUrl,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
