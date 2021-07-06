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

import { ComponentType } from 'react';
import { ProfileInfo } from '../apis/definitions';
import { IconComponent } from '../icons';
import { BackstagePlugin } from '../plugin/types';

export type BootErrorPageProps = {
  step: 'load-config' | 'load-chunk';
  error: Error;
};

export type SignInResult = {
  /**
   * User ID that will be returned by the IdentityApi
   */
  userId: string;

  profile: ProfileInfo;

  /**
   * Function used to retrieve an ID token for the signed in user.
   */
  getIdToken?: () => Promise<string>;

  /**
   * Sign out handler that will be called if the user requests to sign out.
   */
  signOut?: () => Promise<void>;
};

export type SignInPageProps = {
  /**
   * Set the sign-in result for the app. This should only be called once.
   */
  onResult(result: SignInResult): void;
};

export type ErrorBoundaryFallbackProps = {
  plugin?: BackstagePlugin;
  error: Error;
  resetError: () => void;
};

export type AppComponents = {
  NotFoundErrorPage: ComponentType<{}>;
  BootErrorPage: ComponentType<BootErrorPageProps>;
  Progress: ComponentType<{}>;
  Router: ComponentType<{}>;
  ErrorBoundaryFallback: ComponentType<ErrorBoundaryFallbackProps>;

  /**
   * An optional sign-in page that will be rendered instead of the AppRouter at startup.
   *
   * If a sign-in page is set, it will always be shown before the app, and it is up
   * to the sign-in page to handle e.g. saving of login methods for subsequent visits.
   *
   * The sign-in page will be displayed until it has passed up a result to the parent,
   * and which point the AppRouter and all of its children will be rendered instead.
   */
  SignInPage?: ComponentType<SignInPageProps>;
};

export type AppContext = {
  /**
   * Get a list of all plugins that are installed in the app.
   */
  getPlugins(): BackstagePlugin<any, any>[];

  /**
   * Get a common or custom icon for this app.
   */
  getSystemIcon(key: string): IconComponent | undefined;

  /**
   * Get the components registered for various purposes in the app.
   */
  getComponents(): AppComponents;
};
