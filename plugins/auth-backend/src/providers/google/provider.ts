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
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { TokenIssuer } from '../../identity/types';
import { CatalogIdentityClient, getEntityClaims } from '../../lib/catalog';
import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthRefreshRequest,
  OAuthResponse,
  OAuthResult,
  OAuthStartRequest,
} from '../../lib/oauth';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  AuthProviderFactory,
  AuthHandler,
  RedirectInfo,
  SignInResolver,
} from '../types';
import { Logger } from 'winston';

type PrivateInfo = {
  refreshToken: string;
};

type Options = OAuthProviderOptions & {
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  tokenIssuer: TokenIssuer;
  catalogIdentityClient: CatalogIdentityClient;
  logger: Logger;
};

export class GoogleAuthProvider implements OAuthHandlers {
  private readonly _strategy: GoogleStrategy;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;
  private readonly tokenIssuer: TokenIssuer;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly logger: Logger;

  constructor(options: Options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.tokenIssuer = options.tokenIssuer;
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.logger = options.logger;
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

    return {
      response: await this.handleResult(result),
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
    return this.handleResult({
      fullProfile,
      params,
      accessToken,
      refreshToken: req.refreshToken,
    });
  }

  private async handleResult(result: OAuthResult) {
    const { profile } = await this.authHandler(result);

    const response: OAuthResponse = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in,
      },
      profile,
    };

    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver(
        {
          result,
          profile,
        },
        {
          tokenIssuer: this.tokenIssuer,
          catalogIdentityClient: this.catalogIdentityClient,
          logger: this.logger,
        },
      );
    }

    return response;
  }
}

export const googleEmailSignInResolver: SignInResolver<OAuthResult> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Google profile contained no email');
  }

  const entity = await ctx.catalogIdentityClient.findUser({
    annotations: {
      'google.com/email': profile.email,
    },
  });

  const claims = getEntityClaims(entity);
  const token = await ctx.tokenIssuer.issueToken({ claims });

  return { id: entity.metadata.name, entity, token };
};

const googleDefaultSignInResolver: SignInResolver<OAuthResult> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Google profile contained no email');
  }

  let userId: string;
  try {
    const entity = await ctx.catalogIdentityClient.findUser({
      annotations: {
        'google.com/email': profile.email,
      },
    });
    userId = entity.metadata.name;
  } catch (error) {
    ctx.logger.warn(
      `Failed to look up user, ${error}, falling back to allowing login based on email pattern, this will probably break in the future`,
    );
    userId = profile.email.split('@')[0];
  }

  const token = await ctx.tokenIssuer.issueToken({
    claims: { sub: userId, ent: [`user:default/${userId}`] },
  });

  return { id: userId, token };
};

export type GoogleProviderOptions = {
  /**
   * The profile transformation function used to verify and convert the auth response
   * into the profile that will be presented to the user.
   */
  authHandler?: AuthHandler<OAuthResult>;

  /**
   * Configure sign-in for this provider, without it the provider can not be used to sign users in.
   */
  /**
   * Maps an auth result to a Backstage identity for the user.
   *
   * Set to `'email'` to use the default email-based sign in resolver, which will search
   * the catalog for a single user entity that has a matching `google.com/email` annotation.
   */
  signIn?: {
    resolver?: SignInResolver<OAuthResult>;
  };
};

export const createGoogleProvider = (
  options?: GoogleProviderOptions,
): AuthProviderFactory => {
  return ({
    providerId,
    globalConfig,
    config,
    tokenIssuer,
    catalogApi,
    logger,
  }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

      const catalogIdentityClient = new CatalogIdentityClient({
        catalogApi,
        tokenIssuer,
      });

      const authHandler: AuthHandler<OAuthResult> = options?.authHandler
        ? options.authHandler
        : async ({ fullProfile, params }) => ({
            profile: makeProfileInfo(fullProfile, params.id_token),
          });

      const signInResolverFn =
        options?.signIn?.resolver ?? googleDefaultSignInResolver;

      const signInResolver: SignInResolver<OAuthResult> = info =>
        signInResolverFn(info, {
          catalogIdentityClient,
          tokenIssuer,
          logger,
        });

      const provider = new GoogleAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        signInResolver,
        authHandler,
        tokenIssuer,
        catalogIdentityClient,
        logger,
      });

      return OAuthAdapter.fromConfig(globalConfig, provider, {
        disableRefresh: false,
        providerId,
        tokenIssuer,
      });
    });
};
