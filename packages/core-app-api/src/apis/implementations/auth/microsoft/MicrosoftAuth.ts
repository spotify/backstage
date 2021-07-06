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

import MicrosoftIcon from '@material-ui/icons/AcUnit';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';
import { OAuthApiCreateOptions } from '../types';

const DEFAULT_PROVIDER = {
  id: 'microsoft',
  title: 'Microsoft',
  icon: MicrosoftIcon,
};

class MicrosoftAuth {
  static create({
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
    discoveryApi,
    defaultScopes = [
      'openid',
      'offline_access',
      'profile',
      'email',
      'User.Read',
    ],
  }: OAuthApiCreateOptions): typeof microsoftAuthApiRef.T {
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
    });
  }
}

export default MicrosoftAuth;
