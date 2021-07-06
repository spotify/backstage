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

import GoogleIcon from '@material-ui/icons/AcUnit';
import { googleAuthApiRef } from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';
import { OAuthApiCreateOptions } from '../types';

const DEFAULT_PROVIDER = {
  id: 'google',
  title: 'Google',
  icon: GoogleIcon,
};

const SCOPE_PREFIX = 'https://www.googleapis.com/auth/';

class GoogleAuth {
  static create({
    discoveryApi,
    oauthRequestApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    defaultScopes = [
      'openid',
      `${SCOPE_PREFIX}userinfo.email`,
      `${SCOPE_PREFIX}userinfo.profile`,
    ],
  }: OAuthApiCreateOptions): typeof googleAuthApiRef.T {
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
      scopeTransform(scopes: string[]) {
        return scopes.map(scope => {
          if (scope === 'openid') {
            return scope;
          }

          if (scope === 'profile' || scope === 'email') {
            return `${SCOPE_PREFIX}userinfo.${scope}`;
          }

          if (scope.startsWith(SCOPE_PREFIX)) {
            return scope;
          }

          return `${SCOPE_PREFIX}${scope}`;
        });
      },
    });
  }
}
export default GoogleAuth;
