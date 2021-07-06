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

import Auth0Icon from '@material-ui/icons/AcUnit';
import { auth0AuthApiRef } from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';
import { OAuthApiCreateOptions } from '../types';

const DEFAULT_PROVIDER = {
  id: 'auth0',
  title: 'Auth0',
  icon: Auth0Icon,
};

class Auth0Auth {
  static create({
    discoveryApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
    defaultScopes = ['openid', `email`, `profile`],
  }: OAuthApiCreateOptions): typeof auth0AuthApiRef.T {
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
    });
  }
}

export default Auth0Auth;
