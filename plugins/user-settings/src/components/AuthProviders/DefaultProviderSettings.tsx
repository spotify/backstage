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
import Star from '@material-ui/icons/Star';
import React from 'react';
import { ProviderSettingsItem } from './ProviderSettingsItem';
import {
  auth0AuthApiRef,
  githubAuthApiRef,
  gitlabAuthApiRef,
  googleAuthApiRef,
  oauth2ApiRef,
  oktaAuthApiRef,
  microsoftAuthApiRef,
} from '@backstage/core-plugin-api';

type Props = {
  configuredProviders: string[];
};

export const DefaultProviderSettings = ({ configuredProviders }: Props) => (
  <>
    {configuredProviders.includes('google') && (
      <ProviderSettingsItem
        title="Google"
        description="Provides authentication towards Google APIs and identities"
        apiRef={googleAuthApiRef}
        icon={Star}
      />
    )}
    {configuredProviders.includes('microsoft') && (
      <ProviderSettingsItem
        title="Microsoft"
        description="Provides authentication towards Microsoft APIs and identities"
        apiRef={microsoftAuthApiRef}
        icon={Star}
      />
    )}
    {configuredProviders.includes('github') && (
      <ProviderSettingsItem
        title="GitHub"
        description="Provides authentication towards GitHub APIs"
        apiRef={githubAuthApiRef}
        icon={Star}
      />
    )}
    {configuredProviders.includes('gitlab') && (
      <ProviderSettingsItem
        title="GitLab"
        description="Provides authentication towards GitLab APIs"
        apiRef={gitlabAuthApiRef}
        icon={Star}
      />
    )}
    {configuredProviders.includes('auth0') && (
      <ProviderSettingsItem
        title="Auth0"
        description="Provides authentication towards Auth0 APIs"
        apiRef={auth0AuthApiRef}
        icon={Star}
      />
    )}
    {configuredProviders.includes('okta') && (
      <ProviderSettingsItem
        title="Okta"
        description="Provides authentication towards Okta APIs"
        apiRef={oktaAuthApiRef}
        icon={Star}
      />
    )}
    {configuredProviders.includes('oauth2') && (
      <ProviderSettingsItem
        title="YourOrg"
        description="Example of how to use oauth2 custom provider"
        apiRef={oauth2ApiRef}
        icon={Star}
      />
    )}
  </>
);
