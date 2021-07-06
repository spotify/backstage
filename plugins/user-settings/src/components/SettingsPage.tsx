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

import React from 'react';
import { AuthProviders } from './AuthProviders';
import { FeatureFlags } from './FeatureFlags';
import { General } from './General';
import { Header, Page, TabbedLayout } from '@backstage/core-components';

type Props = {
  providerSettings?: JSX.Element;
};

export const SettingsPage = ({ providerSettings }: Props) => {
  return (
    <Page themeId="home">
      <Header title="Settings" />

      <TabbedLayout>
        <TabbedLayout.Route path="general" title="General">
          <General />
        </TabbedLayout.Route>
        <TabbedLayout.Route
          path="auth-providers"
          title="Authentication Providers"
        >
          <AuthProviders providerSettings={providerSettings} />
        </TabbedLayout.Route>
        <TabbedLayout.Route path="feature-flags" title="Feature Flags">
          <FeatureFlags />
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );
};
