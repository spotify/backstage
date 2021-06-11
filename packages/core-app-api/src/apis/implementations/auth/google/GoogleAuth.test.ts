/*
 * Copyright 2020 Spotify AB
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

import GoogleAuth from './GoogleAuth';
import MockOAuthApi from '../../OAuthRequestApi/MockOAuthApi';
import { UrlPatternDiscovery } from '../../DiscoveryApi';

const PREFIX = 'https://www.googleapis.com/auth/';

const getSession = jest.fn();

jest.mock('../../../../lib/AuthSessionManager', () => ({
  ...(jest.requireActual('../../../../lib/AuthSessionManager') as any),
  RefreshingAuthSessionManager: class {
    getSession = getSession;
  },
}));

describe('GoogleAuth', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    ['email', [`${PREFIX}userinfo.email`]],
    ['profile', [`${PREFIX}userinfo.profile`]],
    ['openid', ['openid']],
    ['userinfo.email', [`${PREFIX}userinfo.email`]],
    [
      'userinfo.profile email',
      [`${PREFIX}userinfo.profile`, `${PREFIX}userinfo.email`],
    ],
    [
      `profile        ${PREFIX}userinfo.email`,
      [`${PREFIX}userinfo.profile`, `${PREFIX}userinfo.email`],
    ],
    [`${PREFIX}userinfo.profile`, [`${PREFIX}userinfo.profile`]],
    ['a', [`${PREFIX}a`]],
    ['a b\tc', [`${PREFIX}a`, `${PREFIX}b`, `${PREFIX}c`]],
    [`${PREFIX}a b`, [`${PREFIX}a`, `${PREFIX}b`]],
    [`${PREFIX}a`, [`${PREFIX}a`]],

    // Some incorrect scopes that we don't try to fix
    [`${PREFIX}email`, [`${PREFIX}email`]],
    [`${PREFIX}profile`, [`${PREFIX}profile`]],
    [`${PREFIX}openid`, [`${PREFIX}openid`]],
  ])(`should normalize scopes correctly - %p`, (scope, scopes) => {
    const googleAuth = GoogleAuth.create({
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    googleAuth.getAccessToken(scope);
    expect(getSession).toHaveBeenCalledWith({ scopes: new Set(scopes) });
  });
});
