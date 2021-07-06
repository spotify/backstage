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

import { createGithubProvider } from './github';
import { createGitlabProvider } from './gitlab';
import { createGoogleProvider } from './google';
import { createOAuth2Provider } from './oauth2';
import { createOidcProvider } from './oidc';
import { createOktaProvider } from './okta';
import { createSamlProvider } from './saml';
import { createAuth0Provider } from './auth0';
import { createMicrosoftProvider } from './microsoft';
import { createOneLoginProvider } from './onelogin';
import { AuthProviderFactory } from './types';
import { createAwsAlbProvider } from './aws-alb';

export const factories: { [providerId: string]: AuthProviderFactory } = {
  google: createGoogleProvider(),
  github: createGithubProvider(),
  gitlab: createGitlabProvider(),
  saml: createSamlProvider(),
  okta: createOktaProvider(),
  auth0: createAuth0Provider(),
  microsoft: createMicrosoftProvider(),
  oauth2: createOAuth2Provider(),
  oidc: createOidcProvider(),
  onelogin: createOneLoginProvider(),
  awsalb: createAwsAlbProvider(),
};
