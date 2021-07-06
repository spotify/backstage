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

import { AppConfig, JsonObject } from '@backstage/config';
import { Button } from '@material-ui/core';
import { ErrorPage, ErrorPanel, Progress } from '@backstage/core-components';
import { darkTheme, lightTheme } from '@backstage/theme';
import DarkIcon from '@material-ui/icons/Brightness2';
import LightIcon from '@material-ui/icons/WbSunny';
import React, { PropsWithChildren } from 'react';
import {
  BrowserRouter,
  MemoryRouter,
  useInRouterContext,
} from 'react-router-dom';
import { PrivateAppImpl } from './App';
import { defaultApis } from './defaultApis';
import { defaultAppIcons } from './icons';
import {
  AppConfigLoader,
  AppOptions,
  BootErrorPageProps,
  ErrorBoundaryFallbackProps,
} from './types';
import { BackstagePlugin } from '@backstage/core-plugin-api';

/**
 * The default config loader, which expects that config is available at compile-time
 * in `process.env.APP_CONFIG`. APP_CONFIG should be an array of config objects as
 * returned by the config loader.
 *
 * It will also load runtime config from the __APP_INJECTED_RUNTIME_CONFIG__ string,
 * which can be rewritten at runtime to contain an additional JSON config object.
 * If runtime config is present, it will be placed first in the config array, overriding
 * other config values.
 */
export const defaultConfigLoader: AppConfigLoader = async (
  // This string may be replaced at runtime to provide additional config.
  // It should be replaced by a JSON-serialized config object.
  // It's a param so we can test it, but at runtime this will always fall back to default.
  runtimeConfigJson: string = '__APP_INJECTED_RUNTIME_CONFIG__',
) => {
  const appConfig = process.env.APP_CONFIG;
  if (!appConfig) {
    throw new Error('No static configuration provided');
  }
  if (!Array.isArray(appConfig)) {
    throw new Error('Static configuration has invalid format');
  }
  const configs = (appConfig.slice() as unknown) as AppConfig[];

  // Avoiding this string also being replaced at runtime
  if (
    runtimeConfigJson !==
    '__app_injected_runtime_config__'.toLocaleUpperCase('en-US')
  ) {
    try {
      const data = JSON.parse(runtimeConfigJson) as JsonObject;
      if (Array.isArray(data)) {
        configs.push(...data);
      } else {
        configs.push({ data, context: 'env' });
      }
    } catch (error) {
      throw new Error(`Failed to load runtime configuration, ${error}`);
    }
  }

  const windowAppConfig = (window as any).__APP_CONFIG__;
  if (windowAppConfig) {
    configs.push({
      context: 'window',
      data: windowAppConfig,
    });
  }
  return configs;
};

// createApp is defined in core, and not core-api, since we need access
// to the components inside core to provide defaults.
// The actual implementation of the app class still lives in core-api,
// as it needs to be used by dev- and test-utils.

export function OptionallyWrapInRouter({ children }: PropsWithChildren<{}>) {
  if (useInRouterContext()) {
    return <>{children}</>;
  }
  return <MemoryRouter>{children}</MemoryRouter>;
}

/**
 * Creates a new Backstage App.
 */
export function createApp(options?: AppOptions) {
  const DefaultNotFoundPage = () => (
    <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />
  );
  const DefaultBootErrorPage = ({ step, error }: BootErrorPageProps) => {
    let message = '';
    if (step === 'load-config') {
      message = `The configuration failed to load, someone should have a look at this error: ${error.message}`;
    } else if (step === 'load-chunk') {
      message = `Lazy loaded chunk failed to load, try to reload the page: ${error.message}`;
    }
    // TODO: figure out a nicer way to handle routing on the error page, when it can be done.
    return (
      <OptionallyWrapInRouter>
        <ErrorPage status="501" statusMessage={message} />
      </OptionallyWrapInRouter>
    );
  };
  const DefaultErrorBoundaryFallback = ({
    error,
    resetError,
    plugin,
  }: ErrorBoundaryFallbackProps) => {
    return (
      <ErrorPanel
        title={`Error in ${plugin?.getId()}`}
        defaultExpanded
        error={error}
      >
        <Button variant="outlined" onClick={resetError}>
          Retry
        </Button>
      </ErrorPanel>
    );
  };

  const apis = options?.apis ?? [];
  const icons = { ...defaultAppIcons, ...options?.icons };
  const plugins = options?.plugins ?? [];
  const components = {
    NotFoundErrorPage: DefaultNotFoundPage,
    BootErrorPage: DefaultBootErrorPage,
    Progress: Progress,
    Router: BrowserRouter,
    ErrorBoundaryFallback: DefaultErrorBoundaryFallback,
    ...options?.components,
  };
  const themes = options?.themes ?? [
    {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      theme: lightTheme,
      icon: <LightIcon />,
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      variant: 'dark',
      theme: darkTheme,
      icon: <DarkIcon />,
    },
  ];
  const configLoader = options?.configLoader ?? defaultConfigLoader;

  return new PrivateAppImpl({
    apis,
    icons,
    plugins: plugins as BackstagePlugin<any, any>[],
    components,
    themes,
    configLoader,
    defaultApis,
    bindRoutes: options?.bindRoutes,
  });
}
