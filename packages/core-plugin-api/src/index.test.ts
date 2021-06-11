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
import { createApiRef } from '.';

describe('index', () => {
  const ApiRef = Object.getPrototypeOf(createApiRef({ id: 'x' })).constructor;

  it('exports the plugin api', () => {
    expect(index).toEqual({
      FeatureFlagState: {
        0: 'None',
        1: 'Active',
        Active: 1,
        None: 0,
      },
      SessionState: expect.any(Object),
      attachComponentData: expect.any(Function),
      createApiFactory: expect.any(Function),
      createComponentExtension: expect.any(Function),
      createPlugin: expect.any(Function),
      createReactExtension: expect.any(Function),
      createRoutableExtension: expect.any(Function),

      getComponentData: expect.any(Function),
      useApi: expect.any(Function),
      useApiHolder: expect.any(Function),
      useApp: expect.any(Function),
      useRouteRef: expect.any(Function),
      useRouteRefParams: expect.any(Function),
      withApis: expect.any(Function),

      createApiRef: expect.any(Function),
      createExternalRouteRef: expect.any(Function),
      createRouteRef: expect.any(Function),
      createSubRouteRef: expect.any(Function),

      alertApiRef: expect.any(ApiRef),
      appThemeApiRef: expect.any(ApiRef),
      auth0AuthApiRef: expect.any(ApiRef),
      configApiRef: expect.any(ApiRef),
      discoveryApiRef: expect.any(ApiRef),
      errorApiRef: expect.any(ApiRef),
      featureFlagsApiRef: expect.any(ApiRef),
      githubAuthApiRef: expect.any(ApiRef),
      gitlabAuthApiRef: expect.any(ApiRef),
      googleAuthApiRef: expect.any(ApiRef),
      identityApiRef: expect.any(ApiRef),
      microsoftAuthApiRef: expect.any(ApiRef),
      oauth2ApiRef: expect.any(ApiRef),
      oauthRequestApiRef: expect.any(ApiRef),
      oidcAuthApiRef: expect.any(ApiRef),
      oktaAuthApiRef: expect.any(ApiRef),
      oneloginAuthApiRef: expect.any(ApiRef),
      samlAuthApiRef: expect.any(ApiRef),
      storageApiRef: expect.any(ApiRef),
    });
  });
});
