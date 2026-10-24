/*
 * Copyright 2024 The Backstage Authors
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

import {
  AuthService,
  BackstageCredentials,
  BackstagePrincipalTypes,
  BackstageUserPrincipal,
  DiscoveryService,
  HttpAuthService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import { parse as parseCookie } from 'cookie';
import { Request, Response } from 'express';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const BACKSTAGE_AUTH_COOKIE = 'backstage-auth';

function getTokenFromRequest(req: Request) {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string') {
    const matches = authHeader.match(/^Bearer[ ]+(\S+)$/i);
    token = matches?.[1];
  }

  return { token };
}

function getCookieFromRequest(req: Request) {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = parseCookie(cookieHeader);
    const token = cookies[BACKSTAGE_AUTH_COOKIE];
    if (token) {
      return token;
    }
  }

  return undefined;
}

function willExpireSoon(expiresAt: Date) {
  return Date.now() + FIVE_MINUTES_MS > expiresAt.getTime();
}

/**
 * @public
 * Options for creating a DefaultHttpAuthService.
 */
export interface DefaultHttpAuthServiceOptions {
  auth: AuthService;
  discovery: DiscoveryService;
  pluginId: string;
  /**
   * Optionally override logic for extracting the token from the request.
   */
  getTokenFromRequest?: (req: Request) => { token?: string };
}

/**
 * @public
 * DefaultHttpAuthService is the default implementation of the HttpAuthService
 */
export class DefaultHttpAuthService implements HttpAuthService {
  readonly #credentialsCache = new WeakMap<
    Request,
    Promise<BackstageCredentials>
  >();
  readonly #limitedCredentialsCache = new WeakMap<
    Request,
    Promise<BackstageCredentials>
  >();
  readonly #auth: AuthService;
  readonly #discovery: DiscoveryService;
  readonly #pluginId: string;
  readonly #getToken: (req: Request) => { token?: string };

  private constructor(
    auth: AuthService,
    discovery: DiscoveryService,
    pluginId: string,
    getToken?: (req: Request) => { token?: string },
  ) {
    this.#auth = auth;
    this.#discovery = discovery;
    this.#pluginId = pluginId;
    this.#getToken = getToken ?? getTokenFromRequest;
  }

  static create(
    options: DefaultHttpAuthServiceOptions,
  ): DefaultHttpAuthService {
    return new DefaultHttpAuthService(
      options.auth,
      options.discovery,
      options.pluginId,
      options.getTokenFromRequest,
    );
  }

  async #extractCredentialsFromRequest(req: Request) {
    const { token } = this.#getToken(req);
    if (!token) {
      return await this.#auth.getNoneCredentials();
    }

    return await this.#auth.authenticate(token);
  }

  async #extractLimitedCredentialsFromRequest(req: Request) {
    const { token } = this.#getToken(req);
    if (token) {
      return await this.#auth.authenticate(token, {
        allowLimitedAccess: true,
      });
    }

    const cookie = getCookieFromRequest(req);
    if (cookie) {
      return await this.#auth.authenticate(cookie, {
        allowLimitedAccess: true,
      });
    }

    return await this.#auth.getNoneCredentials();
  }

  async #getCredentials(req: Request) {
    let credentials = this.#credentialsCache.get(req);
    if (!credentials) {
      credentials = this.#extractCredentialsFromRequest(req);
      this.#credentialsCache.set(req, credentials);
    }
    return credentials;
  }

  async #getLimitedCredentials(req: Request) {
    let credentials = this.#limitedCredentialsCache.get(req);
    if (!credentials) {
      credentials = this.#extractLimitedCredentialsFromRequest(req);
      this.#limitedCredentialsCache.set(req, credentials);
    }
    return credentials;
  }

  async credentials<TAllowed extends keyof BackstagePrincipalTypes = 'unknown'>(
    req: Request,
    options?: {
      allow?: Array<TAllowed>;
      allowLimitedAccess?: boolean;
    },
  ): Promise<BackstageCredentials<BackstagePrincipalTypes[TAllowed]>> {
    // Limited and full credentials are treated as two separate cases, this lets
    // us avoid internal dependencies between the AuthService and
    // HttpAuthService implementations
    const credentials = options?.allowLimitedAccess
      ? await this.#getLimitedCredentials(req)
      : await this.#getCredentials(req);

    const allowed = options?.allow;
    if (!allowed) {
      return credentials as any;
    }

    if (this.#auth.isPrincipal(credentials, 'none')) {
      if (allowed.includes('none' as TAllowed)) {
        return credentials as any;
      }

      throw new AuthenticationError('Missing credentials');
    } else if (this.#auth.isPrincipal(credentials, 'user')) {
      if (allowed.includes('user' as TAllowed)) {
        return credentials as any;
      }

      throw new NotAllowedError(
        `This endpoint does not allow 'user' credentials`,
      );
    } else if (this.#auth.isPrincipal(credentials, 'service')) {
      if (allowed.includes('service' as TAllowed)) {
        return credentials as any;
      }

      throw new NotAllowedError(
        `This endpoint does not allow 'service' credentials`,
      );
    }

    throw new NotAllowedError(
      'Unknown principal type, this should never happen',
    );
  }

  async issueUserCookie(
    res: Response,
    options?: { credentials?: BackstageCredentials },
  ): Promise<{ expiresAt: Date }> {
    if (res.headersSent) {
      throw new Error('Failed to issue user cookie, headers were already sent');
    }

    let credentials: BackstageCredentials<BackstageUserPrincipal>;
    if (options?.credentials) {
      if (this.#auth.isPrincipal(options.credentials, 'none')) {
        await this.#clearLegacyDomainCookie(res);
        res.clearCookie(
          BACKSTAGE_AUTH_COOKIE,
          await this.#getCookieOptions(res.req),
        );
        return { expiresAt: new Date() };
      }
      if (!this.#auth.isPrincipal(options.credentials, 'user')) {
        throw new AuthenticationError(
          'Refused to issue cookie for non-user principal',
        );
      }
      credentials = options.credentials;
    } else {
      credentials = await this.credentials(res.req, { allow: ['user'] });
    }

    const existingExpiresAt = await this.#existingCookieExpiration(res.req);
    if (existingExpiresAt && !willExpireSoon(existingExpiresAt)) {
      return { expiresAt: existingExpiresAt };
    }

    const { token, expiresAt } = await this.#auth.getLimitedUserToken(
      credentials,
    );
    if (!token) {
      throw new Error('User credentials is unexpectedly missing token');
    }

    await this.#clearLegacyDomainCookie(res);
    res.cookie(BACKSTAGE_AUTH_COOKIE, token, {
      ...(await this.#getCookieOptions(res.req)),
      expires: expiresAt,
    });

    return { expiresAt };
  }

  // The cookie used to be issued with an explicit domain, which made browsers
  // send it to all subdomains as well. The cookie is now host-only, but any
  // previously issued domain cookie needs to be expired separately.
  async #clearLegacyDomainCookie(res: Response) {
    const externalBaseUrl = new URL(
      await this.#discovery.getExternalBaseUrl(this.#pluginId),
    );
    res.clearCookie(BACKSTAGE_AUTH_COOKIE, {
      ...(await this.#getCookieOptions(res.req)),
      domain: externalBaseUrl.hostname,
    });
  }

  async #getCookieOptions(_req: Request): Promise<{
    httpOnly: true;
    secure: boolean;
    priority: 'high';
    sameSite: 'none' | 'lax';
  }> {
    // TODO: eventually we should read from `${req.protocol}://${req.hostname}`
    // once https://github.com/backstage/backstage/issues/24169 has landed
    const externalBaseUrlStr = await this.#discovery.getExternalBaseUrl(
      this.#pluginId,
    );
    const externalBaseUrl = new URL(externalBaseUrlStr);

    const secure =
      externalBaseUrl.protocol === 'https:' ||
      externalBaseUrl.hostname === 'localhost';

    return {
      httpOnly: true,
      secure,
      priority: 'high',
      sameSite: secure ? 'none' : 'lax',
    };
  }

  async #existingCookieExpiration(req: Request): Promise<Date | undefined> {
    const existingCookie = getCookieFromRequest(req);
    if (!existingCookie) {
      return undefined;
    }

    try {
      const existingCredentials = await this.#auth.authenticate(
        existingCookie,
        {
          allowLimitedAccess: true,
        },
      );
      if (!this.#auth.isPrincipal(existingCredentials, 'user')) {
        return undefined;
      }

      return existingCredentials.expiresAt;
    } catch (error) {
      if (error.name === 'AuthenticationError') {
        return undefined;
      }
      throw error;
    }
  }
}

/**
 * Authentication of HTTP requests.
 *
 * See {@link @backstage/code-plugin-api#HttpAuthService}
 * and {@link https://backstage.io/docs/backend-system/core-services/http-auth | the service docs}
 * for more information.
 *
 * @public
 */
export const httpAuthServiceFactory = createServiceFactory({
  service: coreServices.httpAuth,
  deps: {
    auth: coreServices.auth,
    discovery: coreServices.discovery,
    plugin: coreServices.pluginMetadata,
  },
  async factory({ auth, discovery, plugin }) {
    return DefaultHttpAuthService.create({
      auth,
      discovery,
      pluginId: plugin.getId(),
    });
  },
});
