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

import OneLoginIcon from '@material-ui/icons/AcUnit';
import {
  oneloginAuthApiRef,
  OAuthRequestApi,
  AuthProvider,
  DiscoveryApi,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';

type CreateOptions = {
  discoveryApi: DiscoveryApi;
  oauthRequestApi: OAuthRequestApi;

  environment?: string;
  provider?: AuthProvider & { id: string };
};

const DEFAULT_PROVIDER = {
  id: 'onelogin',
  title: 'onelogin',
  icon: OneLoginIcon,
};

const OIDC_SCOPES: Set<String> = new Set([
  'openid',
  'profile',
  'email',
  'phone',
  'address',
  'groups',
  'offline_access',
]);

const SCOPE_PREFIX: string = 'onelogin.';

class OneLoginAuth {
  static create({
    discoveryApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
  }: CreateOptions): typeof oneloginAuthApiRef.T {
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes: ['openid', 'email', 'profile', 'offline_access'],
      scopeTransform(scopes) {
        return scopes.map(scope => {
          if (OIDC_SCOPES.has(scope)) {
            return scope;
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

export default OneLoginAuth;
