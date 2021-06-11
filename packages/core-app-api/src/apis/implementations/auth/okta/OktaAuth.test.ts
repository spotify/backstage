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

import OktaAuth from './OktaAuth';
import MockOAuthApi from '../../OAuthRequestApi/MockOAuthApi';
import { UrlPatternDiscovery } from '../../DiscoveryApi';

const PREFIX = 'okta.';

const getSession = jest.fn();

jest.mock('../../../../lib/AuthSessionManager', () => ({
  ...(jest.requireActual('../../../../lib/AuthSessionManager') as any),
  RefreshingAuthSessionManager: class {
    getSession = getSession;
  },
}));

describe('OktaAuth', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    ['openid', ['openid']],
    ['profile email', ['profile', 'email']],
    [`${PREFIX}groups.manage`, [`${PREFIX}groups.manage`]],
    ['groups.read', [`${PREFIX}groups.read`]],
    [
      `${PREFIX}groups.manage groups.read, openid`,
      [`${PREFIX}groups.manage`, `${PREFIX}groups.read`, 'openid'],
    ],
    [`email\t ${PREFIX}groups.read`, ['email', `${PREFIX}groups.read`]],

    // Some incorrect scopes that we don't try to fix
    [`${PREFIX}email`, [`${PREFIX}email`]],
    [`${PREFIX}profile`, [`${PREFIX}profile`]],
    [`${PREFIX}openid`, [`${PREFIX}openid`]],
  ])(`should normalize scopes correctly - %p`, (scope, scopes) => {
    const auth = OktaAuth.create({
      oauthRequestApi: new MockOAuthApi(),
      discoveryApi: UrlPatternDiscovery.compile('http://example.com'),
    });

    auth.getAccessToken(scope);
    expect(getSession).toHaveBeenCalledWith({ scopes: new Set(scopes) });
  });
});
