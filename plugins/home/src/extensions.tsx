/*
 * Copyright 2021 The Backstage Authors
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

import React, { lazy, Suspense } from 'react';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { InfoCard } from '@backstage/core-components';
import { SettingsModal } from './components';
import { createReactExtension, useApp } from '@backstage/core-plugin-api';

const lazyLoadedComponent = (
  component: () => Promise<(props: any) => JSX.Element>,
) => lazy(() => component().then(inner => ({ default: inner })));

export function createHomePageComponentExtension({
  title,
  component,
  actions,
  contextProvider,
  settings,
}: {
  title: string;
  component: () => Promise<(props: any) => JSX.Element>;
  actions?: () => Promise<(props: any) => JSX.Element>;
  contextProvider?: () => Promise<(props: any) => JSX.Element>;
  settings?: () => Promise<(props: any) => JSX.Element>;
}) {
  const Content = lazyLoadedComponent(component);
  const Actions = actions ? lazyLoadedComponent(actions) : () => null;
  const Settings = settings ? lazyLoadedComponent(settings) : () => null;
  const ContextProvider = contextProvider
    ? lazyLoadedComponent(contextProvider)
    : () => null;

  const HomePageExtension = () => {
    const app = useApp();
    const { Progress } = app.getComponents();
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    const cardProps = {
      title,
      ...(settings
        ? {
            action: (
              <IconButton onClick={() => setSettingsOpen(true)}>
                <SettingsIcon>Settings</SettingsIcon>
              </IconButton>
            ),
          }
        : {}),
      ...(actions
        ? {
            actions: <Actions />,
          }
        : {}),
    };

    const content = (
      <InfoCard {...cardProps}>
        {settings && (
          <SettingsModal
            open={settingsOpen}
            componentName={title}
            close={() => setSettingsOpen(false)}
          >
            <Settings />
          </SettingsModal>
        )}
        <Content />
      </InfoCard>
    );

    return (
      <Suspense fallback={<Progress />}>
        {contextProvider ? (
          <ContextProvider>{content}</ContextProvider>
        ) : (
          content
        )}
      </Suspense>
    );
  };

  return createReactExtension({
    component: {
      sync: () => <HomePageExtension />,
    },
  });
}
