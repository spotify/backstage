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
import { Strategy as GitlabStrategy } from 'passport-gitlab2';
import {
  executeRedirectStrategy,
  executeFrameHandlerStrategy,
  executeRefreshTokenStrategy,
  executeFetchUserProfileStrategy,
  makeProfileInfo,
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
  OAuthRefreshRequest,
  encodeState,
  OAuthResult,
} from '../../lib/oauth';

type FullProfile = OAuthResult['fullProfile'] & {
  avatarUrl?: string;
};

type PrivateInfo = {
  refreshToken: string;
};

export type GitlabAuthProviderOptions = OAuthProviderOptions & {
  baseUrl: string;
};

function transformProfile(fullProfile: FullProfile) {
  const profile = makeProfileInfo({
    ...fullProfile,
    photos: [
      ...(fullProfile.photos ?? []),
      ...(fullProfile.avatarUrl ? [{ value: fullProfile.avatarUrl }] : []),
    ],
  });

  let id = fullProfile.id;
  if (profile.email) {
    id = profile.email.split('@')[0];
  }

  return { id, profile };
}

export class GitlabAuthProvider implements OAuthHandlers {
  private readonly _strategy: GitlabStrategy;

  constructor(options: GitlabAuthProviderOptions) {
    this._strategy = new GitlabStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        baseURL: options.baseUrl,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: any,
        done: PassportDoneCallback<OAuthResult, PrivateInfo>,
      ) => {
        done(
          undefined,
          { fullProfile, params, accessToken },
          {
            refreshToken,
          },
        );
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
    const { accessToken, params } = result;

    const { id, profile } = transformProfile(result.fullProfile);

    return {
      response: {
        profile,
        providerInfo: {
          accessToken,
          scope: params.scope,
          expiresInSeconds: params.expires_in,
          idToken: params.id_token,
        },
        backstageIdentity: {
          id,
        },
      },
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const {
      accessToken,
      refreshToken: newRefreshToken,
      params,
    } = await executeRefreshTokenStrategy(
      this._strategy,
      req.refreshToken,
      req.scope,
    );

    const fullProfile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
    );
    const { id, profile } = transformProfile(fullProfile);

    return {
      profile,
      providerInfo: {
        accessToken,
        refreshToken: newRefreshToken, // GitLab expires the old refresh token when used
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      backstageIdentity: {
        id,
      },
    };
  }
}

export type GitlabProviderOptions = {};

export const createGitlabProvider = (
  _options?: GitlabProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const audience = envConfig.getOptionalString('audience');
      const baseUrl = audience || 'https://gitlab.com';
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const provider = new GitlabAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        baseUrl,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
