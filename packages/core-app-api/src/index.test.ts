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

import * as index from '.';

describe('index', () => {
  it('exports the app api', () => {
    expect(index).toEqual({
      // Public API
      createApp: expect.any(Function),
      ApiProvider: expect.any(Function),
      // TODO(Rugvip): Figure out if we need these
      ApiFactoryRegistry: expect.any(Function),
      ApiResolver: expect.any(Function),
      ApiRegistry: expect.any(Function),

      // Components
      FlatRoutes: expect.any(Function),

      // Utility API Implementations
      AlertApiForwarder: expect.any(Function),
      AppThemeSelector: expect.any(Function),
      Auth0Auth: expect.any(Function),
      ConfigReader: expect.any(Function),
      ErrorAlerter: expect.any(Function),
      ErrorApiForwarder: expect.any(Function),
      GithubAuth: expect.any(Function),
      GitlabAuth: expect.any(Function),
      GoogleAuth: expect.any(Function),
      LocalStorageFeatureFlags: expect.any(Function),
      MicrosoftAuth: expect.any(Function),
      OAuth2: expect.any(Function),
      OAuthRequestManager: expect.any(Function),
      OktaAuth: expect.any(Function),
      OneLoginAuth: expect.any(Function),
      SamlAuth: expect.any(Function),
      UrlPatternDiscovery: expect.any(Function),
      WebStorage: expect.any(Function),
    });
  });
});
