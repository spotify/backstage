/*
 * Copyright 2024 The Backstage Authors
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

import { FrontendPluginInfo } from '@backstage/frontend-plugin-api';
import { JSX, useEffect, useState } from 'react';
import { AppError, AppErrorTypes } from '@backstage/frontend-app-api';
import { DEFAULT_WARNING_CODES } from './defaultWarningCodes';

function AppErrorItem(props: { error: AppError }): JSX.Element {
  const { context } = props.error;

  const node = 'node' in context ? context.node : undefined;
  const extensionId =
    'extensionId' in context ? context.extensionId : node?.spec.id;
  const routeId = 'routeId' in context ? context.routeId : undefined;
  const plugin = 'plugin' in context ? context.plugin : node?.spec.plugin;
  const pluginId = plugin?.pluginId ?? 'N/A';

  const [info, setInfo] = useState<FrontendPluginInfo | undefined>(undefined);
  useEffect(() => {
    plugin?.info().then(setInfo, error => {
      // eslint-disable-next-line no-console
      console.error(
        `Failed to load info for plugin ${plugin.pluginId}: ${error}`,
      );
    });
  }, [plugin]);

  return (
    <div>
      <b>{props.error.code}</b>: {props.error.message}
      <pre style={{ marginLeft: '1rem' }}>
        {extensionId && <div>extensionId: {extensionId}</div>}
        {routeId && <div>routeId: {routeId}</div>}
        {pluginId && <div>pluginId: {pluginId}</div>}
        {info && (
          <div>
            package: {info.packageName}@{info.version}
          </div>
        )}
      </pre>
    </div>
  );
}

function AppErrorPage(props: { errors: AppError[] }): JSX.Element {
  return (
    <div style={{ margin: '1rem' }}>
      <h2>App startup failed</h2>
      {props.errors.map((error, index) => (
        <AppErrorItem error={error} key={index} />
      ))}
    </div>
  );
}

/**
 * If there are any unrecoverable errors in the app, this will return an error page in the form of a JSX element.
 *
 * If there are any recoverable errors, they will always be logged as warnings in the console.
 * @public
 */
export function maybeCreateErrorPage(
  app: { errors?: AppError[] },
  options?: {
    warningCodes?: Array<keyof AppErrorTypes>;
  },
): JSX.Element | undefined {
  if (!app.errors) {
    return undefined;
  }

  const errors = new Array<AppError>();
  const warnings = new Array<AppError>();

  const warningCodes = new Set(options?.warningCodes ?? DEFAULT_WARNING_CODES);
  for (const error of app.errors) {
    if (warningCodes.has(error.code)) {
      warnings.push(error);
    } else {
      errors.push(error);
    }
  }

  if (warnings.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('App startup encountered warnings:');
    for (const warning of warnings) {
      // eslint-disable-next-line no-console
      console.warn(`${warning.code}: ${warning.message}`);
    }
  }

  if (errors.length === 0) {
    return undefined;
  }

  return <AppErrorPage errors={errors} />;
}
