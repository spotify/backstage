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
import crypto from 'crypto';
import { URL } from 'url';
import {
  AuthProviderRouteHandlers,
  BackstageIdentity,
  AuthProviderConfig,
} from '../../providers/types';
import { InputError } from '@backstage/errors';
import { TokenIssuer } from '../../identity/types';
import { verifyNonce } from './helpers';
import { postMessageResponse, ensuresXRequestedWith } from '../flow';
import { OAuthHandlers, OAuthStartRequest, OAuthRefreshRequest } from './types';

export const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export const TEN_MINUTES_MS = 600 * 1000;

export type Options = {
  providerId: string;
  secure: boolean;
  disableRefresh?: boolean;
  persistScopes?: boolean;
  cookieDomain: string;
  cookiePath: string;
  appOrigin: string;
  tokenIssuer: TokenIssuer;
};

export class OAuthAdapter implements AuthProviderRouteHandlers {
  static fromConfig(
    config: AuthProviderConfig,
    handlers: OAuthHandlers,
    options: Pick<
      Options,
      'providerId' | 'persistScopes' | 'disableRefresh' | 'tokenIssuer'
    >,
  ): OAuthAdapter {
    const { origin: appOrigin } = new URL(config.appUrl);
    const secure = config.baseUrl.startsWith('https://');
    const url = new URL(config.baseUrl);
    const cookiePath = `${url.pathname}/${options.providerId}`;
    return new OAuthAdapter(handlers, {
      ...options,
      appOrigin,
      cookieDomain: url.hostname,
      cookiePath,
      secure,
    });
  }

  constructor(
    private readonly handlers: OAuthHandlers,
    private readonly options: Options,
  ) {}

  async start(req: express.Request, res: express.Response): Promise<void> {
    // retrieve scopes from request
    const scope = req.query.scope?.toString() ?? '';
    const env = req.query.env?.toString();

    if (!env) {
      throw new InputError('No env provided in request query parameters');
    }

    if (this.options.persistScopes) {
      this.setScopesCookie(res, scope);
    }

    const nonce = crypto.randomBytes(16).toString('base64');
    // set a nonce cookie before redirecting to oauth provider
    this.setNonceCookie(res, nonce);

    const state = { nonce: nonce, env: env };
    const forwardReq = Object.assign(req, { scope, state });

    const { url, status } = await this.handlers.start(
      forwardReq as OAuthStartRequest,
    );

    res.statusCode = status || 302;
    res.setHeader('Location', url);
    res.setHeader('Content-Length', '0');
    res.end();
  }

  async frameHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    try {
      // verify nonce cookie and state cookie on callback
      verifyNonce(req, this.options.providerId);

      const { response, refreshToken } = await this.handlers.handler(req);

      if (this.options.persistScopes) {
        const grantedScopes = this.getScopesFromCookie(
          req,
          this.options.providerId,
        );
        response.providerInfo.scope = grantedScopes;
      }

      if (!this.options.disableRefresh) {
        if (!refreshToken) {
          throw new InputError('Missing refresh token');
        }

        // set new refresh token
        this.setRefreshTokenCookie(res, refreshToken);
      }

      await this.populateIdentity(response.backstageIdentity);

      // post message back to popup if successful
      return postMessageResponse(res, this.options.appOrigin, {
        type: 'authorization_response',
        response,
      });
    } catch (error) {
      // post error message back to popup if failure
      return postMessageResponse(res, this.options.appOrigin, {
        type: 'authorization_response',
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }
  }

  async logout(req: express.Request, res: express.Response): Promise<void> {
    if (!ensuresXRequestedWith(req)) {
      res.status(401).send('Invalid X-Requested-With header');
      return;
    }

    if (!this.options.disableRefresh) {
      // remove refresh token cookie before logout
      this.removeRefreshTokenCookie(res);
    }
    res.status(200).send('logout!');
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    if (!ensuresXRequestedWith(req)) {
      res.status(401).send('Invalid X-Requested-With header');
      return;
    }

    if (!this.handlers.refresh || this.options.disableRefresh) {
      res
        .status(400)
        .send(
          `Refresh token not supported for provider: ${this.options.providerId}`,
        );
      return;
    }

    try {
      const refreshToken =
        req.cookies[`${this.options.providerId}-refresh-token`];

      // throw error if refresh token is missing in the request
      if (!refreshToken) {
        throw new Error('Missing session cookie');
      }

      const scope = req.query.scope?.toString() ?? '';

      const forwardReq = Object.assign(req, { scope, refreshToken });

      // get new access_token
      const response = await this.handlers.refresh(
        forwardReq as OAuthRefreshRequest,
      );

      await this.populateIdentity(response.backstageIdentity);

      if (
        response.providerInfo.refreshToken &&
        response.providerInfo.refreshToken !== refreshToken
      ) {
        this.setRefreshTokenCookie(res, response.providerInfo.refreshToken);
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(401).send(`${error.message}`);
    }
  }

  /**
   * If the response from the OAuth provider includes a Backstage identity, we
   * make sure it's populated with all the information we can derive from the user ID.
   */
  private async populateIdentity(identity?: BackstageIdentity) {
    if (!identity) {
      return;
    }

    if (!identity.idToken) {
      identity.idToken = await this.options.tokenIssuer.issueToken({
        claims: { sub: identity.id },
      });
    }
  }

  private setNonceCookie = (res: express.Response, nonce: string) => {
    res.cookie(`${this.options.providerId}-nonce`, nonce, {
      maxAge: TEN_MINUTES_MS,
      secure: this.options.secure,
      sameSite: 'lax',
      domain: this.options.cookieDomain,
      path: `${this.options.cookiePath}/handler`,
      httpOnly: true,
    });
  };

  private setScopesCookie = (res: express.Response, scope: string) => {
    res.cookie(`${this.options.providerId}-scope`, scope, {
      maxAge: TEN_MINUTES_MS,
      secure: this.options.secure,
      sameSite: 'lax',
      domain: this.options.cookieDomain,
      path: `${this.options.cookiePath}/handler`,
      httpOnly: true,
    });
  };

  private getScopesFromCookie = (req: express.Request, providerId: string) => {
    return req.cookies[`${providerId}-scope`];
  };

  private setRefreshTokenCookie = (
    res: express.Response,
    refreshToken: string,
  ) => {
    res.cookie(`${this.options.providerId}-refresh-token`, refreshToken, {
      maxAge: THOUSAND_DAYS_MS,
      secure: this.options.secure,
      sameSite: 'lax',
      domain: this.options.cookieDomain,
      path: this.options.cookiePath,
      httpOnly: true,
    });
  };

  private removeRefreshTokenCookie = (res: express.Response) => {
    res.cookie(`${this.options.providerId}-refresh-token`, '', {
      maxAge: 0,
      secure: this.options.secure,
      sameSite: 'lax',
      domain: this.options.cookieDomain,
      path: this.options.cookiePath,
      httpOnly: true,
    });
  };
}
