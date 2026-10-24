/*
 * Copyright 2026 The Backstage Authors
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

import type {
  AuthService,
  HttpRouterServiceWebSocketContext,
  HttpRouterServiceWebSocketOptions,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import { parse as parseCookie } from 'cookie';
import type { IncomingMessage } from 'node:http';
import { readCorsOptions } from '../../rootHttpRouter/http/readCorsOptions';

export async function authenticateWebSocket(options: {
  auth: AuthService;
  config: RootConfigService;
  request: IncomingMessage;
  authPolicy: NonNullable<HttpRouterServiceWebSocketOptions['authPolicy']>;
}): Promise<
  Pick<HttpRouterServiceWebSocketContext, 'credentials' | 'authProtocol'>
> {
  const { auth, config, request, authPolicy } = options;
  if (authPolicy === 'unauthenticated') {
    return { credentials: await auth.getNoneCredentials() };
  }
  const allowLimitedAccess = authPolicy === 'user-cookie';
  const bearer =
    request.headers.authorization?.match(/^Bearer[ ]+(\S+)$/i)?.[1];
  const protocols =
    request.headers['sec-websocket-protocol']
      ?.split(',')
      .map(value => value.trim())
      .filter(Boolean) ?? [];
  const candidates = [
    ...(bearer ? [{ token: bearer, authProtocol: undefined }] : []),
    ...protocols.map(token => ({ token, authProtocol: token })),
  ];
  for (const candidate of candidates) {
    try {
      const credentials = await auth.authenticate(candidate.token, {
        allowLimitedAccess,
      });
      if (
        auth.isPrincipal(credentials, 'user') ||
        (authPolicy !== 'user' && auth.isPrincipal(credentials, 'service'))
      ) {
        return { credentials, authProtocol: candidate.authProtocol };
      }
    } catch {
      // Offered protocols may be application protocols rather than credentials.
    }
  }
  const cookie =
    allowLimitedAccess && request.headers.cookie
      ? parseCookie(request.headers.cookie)['backstage-auth']
      : undefined;
  if (cookie) {
    const origin = request.headers.origin;
    const appUrl = config.getOptionalString('app.baseUrl');
    let allowedOrigin = Boolean(
      origin && appUrl && origin === new URL(appUrl).origin,
    );
    const corsOrigin = readCorsOptions(
      config.getOptionalConfig('backend'),
    ).origin;
    if (!allowedOrigin && origin && typeof corsOrigin === 'function') {
      allowedOrigin = await new Promise<boolean>((resolve, reject) => {
        corsOrigin(origin, (error, allowed) =>
          error ? reject(error) : resolve(Boolean(allowed)),
        );
      });
    }
    if (!allowedOrigin) {
      throw new NotAllowedError('WebSocket cookie origin is not allowed');
    }
    const credentials = await auth.authenticate(cookie, {
      allowLimitedAccess: true,
    });
    if (auth.isPrincipal(credentials, 'user')) {
      return { credentials };
    }
  }
  if (
    authPolicy === 'authenticated' &&
    config.getOptionalBoolean(
      'backend.auth.dangerouslyDisableDefaultAuthPolicy',
    )
  ) {
    return { credentials: await auth.getNoneCredentials() };
  }
  throw new AuthenticationError('Missing or invalid WebSocket credentials');
}
