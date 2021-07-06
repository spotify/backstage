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
import jwtDecoder from 'jwt-decode';
import { ProfileInfo, RedirectInfo } from '../../providers/types';
import { InternalOAuthError } from 'passport-oauth2';

export type PassportDoneCallback<Res, Private = never> = (
  err?: Error,
  response?: Res,
  privateInfo?: Private,
) => void;

export const makeProfileInfo = (
  profile: passport.Profile,
  idToken?: string,
): ProfileInfo => {
  let { displayName } = profile;

  let email: string | undefined = undefined;
  if (profile.emails && profile.emails.length > 0) {
    const [firstEmail] = profile.emails;
    email = firstEmail.value;
  }

  let picture: string | undefined = undefined;
  if (profile.photos && profile.photos.length > 0) {
    const [firstPhoto] = profile.photos;
    picture = firstPhoto.value;
  }

  if ((!email || !picture || !displayName) && idToken) {
    try {
      const decoded: Record<string, string> = jwtDecoder(idToken);
      if (!email && decoded.email) {
        email = decoded.email;
      }
      if (!picture && decoded.picture) {
        picture = decoded.picture;
      }
      if (!displayName && decoded.name) {
        displayName = decoded.name;
      }
    } catch (e) {
      throw new Error(`Failed to parse id token and get profile info, ${e}`);
    }
  }

  return {
    email,
    picture,
    displayName,
  };
};

export const executeRedirectStrategy = async (
  req: express.Request,
  providerStrategy: passport.Strategy,
  options: Record<string, string>,
): Promise<RedirectInfo> => {
  return new Promise(resolve => {
    const strategy = Object.create(providerStrategy);
    strategy.redirect = (url: string, status?: number) => {
      resolve({ url, status: status ?? undefined });
    };

    strategy.authenticate(req, { ...options });
  });
};

export const executeFrameHandlerStrategy = async <Result, PrivateInfo = never>(
  req: express.Request,
  providerStrategy: passport.Strategy,
) => {
  return new Promise<{ result: Result; privateInfo: PrivateInfo }>(
    (resolve, reject) => {
      const strategy = Object.create(providerStrategy);
      strategy.success = (result: any, privateInfo: any) => {
        resolve({ result, privateInfo });
      };
      strategy.fail = (
        info: { type: 'success' | 'error'; message?: string },
        // _status: number,
      ) => {
        reject(new Error(`Authentication rejected, ${info.message ?? ''}`));
      };
      strategy.error = (error: InternalOAuthError) => {
        let message = `Authentication failed, ${error.message}`;

        if (error.oauthError?.data) {
          try {
            const errorData = JSON.parse(error.oauthError.data);

            if (errorData.message) {
              message += ` - ${errorData.message}`;
            }
          } catch (parseError) {
            message += ` - ${error.oauthError}`;
          }
        }

        reject(new Error(message));
      };
      strategy.redirect = () => {
        reject(new Error('Unexpected redirect'));
      };
      strategy.authenticate(req, {});
    },
  );
};

type RefreshTokenResponse = {
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  /**
   * Optionally, the server can issue a new Refresh Token for the user
   */
  refreshToken?: string;
  params: any;
};

export const executeRefreshTokenStrategy = async (
  providerStrategy: passport.Strategy,
  refreshToken: string,
  scope: string,
): Promise<RefreshTokenResponse> => {
  return new Promise((resolve, reject) => {
    const anyStrategy = providerStrategy as any;
    const OAuth2 = anyStrategy._oauth2.constructor;
    const oauth2 = new OAuth2(
      anyStrategy._oauth2._clientId,
      anyStrategy._oauth2._clientSecret,
      anyStrategy._oauth2._baseSite,
      anyStrategy._oauth2._authorizeUrl,
      anyStrategy._refreshURL || anyStrategy._oauth2._accessTokenUrl,
      anyStrategy._oauth2._customHeaders,
    );

    oauth2.getOAuthAccessToken(
      refreshToken,
      {
        scope,
        grant_type: 'refresh_token',
      },
      (
        err: Error | null,
        accessToken: string,
        newRefreshToken: string,
        params: any,
      ) => {
        if (err) {
          reject(new Error(`Failed to refresh access token ${err.toString()}`));
        }
        if (!accessToken) {
          reject(
            new Error(
              `Failed to refresh access token, no access token received`,
            ),
          );
        }

        resolve({
          accessToken,
          refreshToken: newRefreshToken,
          params,
        });
      },
    );
  });
};

type ProviderStrategy = {
  userProfile(accessToken: string, callback: Function): void;
};

export const executeFetchUserProfileStrategy = async (
  providerStrategy: passport.Strategy,
  accessToken: string,
): Promise<passport.Profile> => {
  return new Promise((resolve, reject) => {
    const anyStrategy = (providerStrategy as unknown) as ProviderStrategy;
    anyStrategy.userProfile(
      accessToken,
      (error: Error, rawProfile: passport.Profile) => {
        if (error) {
          reject(error);
        } else {
          resolve(rawProfile);
        }
      },
    );
  });
};
