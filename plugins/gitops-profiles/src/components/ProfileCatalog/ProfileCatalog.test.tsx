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

import { renderInTestApp } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import { gitOpsApiRef, GitOpsRestApi } from '../../api';
import ProfileCatalog from './ProfileCatalog';

import {
  ApiProvider,
  ApiRegistry,
  GithubAuth,
  OAuthRequestManager,
  UrlPatternDiscovery,
} from '@backstage/core-app-api';

import { githubAuthApiRef } from '@backstage/core-plugin-api';

describe('ProfileCatalog', () => {
  it('should render', async () => {
    const oauthRequestApi = new OAuthRequestManager();
    const apis = ApiRegistry.from([
      [gitOpsApiRef, new GitOpsRestApi('http://localhost:3008')],
      [
        githubAuthApiRef,
        GithubAuth.create({
          discoveryApi: UrlPatternDiscovery.compile(
            'http://example.com/{{pluginId}}',
          ),
          oauthRequestApi,
        }),
      ],
    ]);

    const { getByText } = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider apis={apis}>
          <ProfileCatalog />
        </ApiProvider>
      </ThemeProvider>,
    );

    expect(getByText('Create GitOps-managed Cluster')).toBeInTheDocument();
  });
});
