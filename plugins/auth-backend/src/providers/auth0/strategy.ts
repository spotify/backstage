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
import OAuth2Strategy from 'passport-oauth2';

export interface Auth0StrategyOptionsWithRequest {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  domain: string;
  passReqToCallback: true;
}

export default class Auth0Strategy extends OAuth2Strategy {
  constructor(
    options: Auth0StrategyOptionsWithRequest,
    verify: OAuth2Strategy.VerifyFunctionWithRequest,
  ) {
    const optionsWithURLs = {
      ...options,
      authorizationURL: `https://${options.domain}/authorize`,
      tokenURL: `https://${options.domain}/oauth/token`,
      userInfoURL: `https://${options.domain}/userinfo`,
      apiUrl: `https://${options.domain}/api`,
    };
    super(optionsWithURLs, verify);
  }
}
