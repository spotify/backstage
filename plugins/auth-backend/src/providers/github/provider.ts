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
import { Strategy as GithubStrategy } from 'passport-github2';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import { RedirectInfo, AuthProviderFactory } from '../types';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthResult,
} from '../../lib/oauth';

export type GithubAuthProviderOptions = OAuthProviderOptions & {
  tokenUrl?: string;
  userProfileUrl?: string;
  authorizationUrl?: string;
};

export class GithubAuthProvider implements OAuthHandlers {
  private readonly _strategy: GithubStrategy;

  constructor(options: GithubAuthProviderOptions) {
    this._strategy = new GithubStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        tokenURL: options.tokenUrl,
        userProfileURL: options.userProfileUrl,
        authorizationURL: options.authorizationUrl,
      },
      (
        accessToken: any,
        _refreshToken: any,
        params: any,
        fullProfile: any,
        done: PassportDoneCallback<OAuthResult>,
      ) => {
        done(undefined, { fullProfile, params, accessToken });
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      scope: req.scope,
      state: encodeState(req.state),
    });
  }

  async handler(req: express.Request) {
    const {
      result: { fullProfile, accessToken, params },
    } = await executeFrameHandlerStrategy<OAuthResult>(req, this._strategy);

    const profile = makeProfileInfo(
      {
        ...fullProfile,
        id: fullProfile.username || fullProfile.id,
        displayName:
          fullProfile.displayName || fullProfile.username || fullProfile.id,
      },
      params.id_token,
    );

    return {
      response: {
        profile,
        providerInfo: {
          accessToken,
          scope: params.scope,
          expiresInSeconds: params.expires_in,
        },
        backstageIdentity: {
          id: fullProfile.username || fullProfile.id,
        },
      },
    };
  }
}

export type GithubProviderOptions = {};

export const createGithubProvider = (
  _options?: GithubProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const enterpriseInstanceUrl = envConfig.getOptionalString(
        'enterpriseInstanceUrl',
      );
      const authorizationUrl = enterpriseInstanceUrl
        ? `${enterpriseInstanceUrl}/login/oauth/authorize`
        : undefined;
      const tokenUrl = enterpriseInstanceUrl
        ? `${enterpriseInstanceUrl}/login/oauth/access_token`
        : undefined;
      const userProfileUrl = enterpriseInstanceUrl
        ? `${enterpriseInstanceUrl}/api/v3/user`
        : undefined;
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const provider = new GithubAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        tokenUrl,
        userProfileUrl,
        authorizationUrl,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: true,
        persistScopes: true,
        providerId,
        tokenIssuer,
      });
    });
};
