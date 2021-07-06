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
import {
  AnyApiFactory,
  AppTheme,
  ProfileInfo,
  IconComponent,
  BackstagePlugin,
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
  PluginOutput,
} from '@backstage/core-plugin-api';
import { AppConfig } from '@backstage/config';
import { AppIcons } from './icons';

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

/**
 * A function that loads in the App config that will be accessible via the ConfigApi.
 *
 * If multiple config objects are returned in the array, values in the earlier configs
 * will override later ones.
 */
export type AppConfigLoader = () => Promise<AppConfig[]>;

/**
 * Extracts a union of the keys in a map whose value extends the given type
 */
type KeysWithType<Obj extends { [key in string]: any }, Type> = {
  [key in keyof Obj]: Obj[key] extends Type ? key : never;
}[keyof Obj];

/**
 * Takes a map Map required values and makes all keys matching Keys optional
 */
type PartialKeys<
  Map extends { [name in string]: any },
  Keys extends keyof Map
> = Partial<Pick<Map, Keys>> & Required<Omit<Map, Keys>>;

/**
 * Creates a map of target routes with matching parameters based on a map of external routes.
 */
type TargetRouteMap<
  ExternalRoutes extends { [name: string]: ExternalRouteRef }
> = {
  [name in keyof ExternalRoutes]: ExternalRoutes[name] extends ExternalRouteRef<
    infer Params,
    any
  >
    ? RouteRef<Params> | SubRouteRef<Params>
    : never;
};

export type AppRouteBinder = <
  ExternalRoutes extends { [name: string]: ExternalRouteRef }
>(
  externalRoutes: ExternalRoutes,
  targetRoutes: PartialKeys<
    TargetRouteMap<ExternalRoutes>,
    KeysWithType<ExternalRoutes, ExternalRouteRef<any, true>>
  >,
) => void;

// Output from newer or older plugin API versions that might not be supported by
// this version of the app API, but we don't want to break at the type checking level.
// We only use this more permissive type for the `createApp` options, as we otherwise
// want to stick to using the type for the outputs that we know about in this version
// of the app api.
type UnknownPluginOutput = {
  type: string;
};
export type BackstagePluginWithAnyOutput = Omit<
  BackstagePlugin<any, any>,
  'output'
> & {
  output(): (PluginOutput | UnknownPluginOutput)[];
};

export type AppOptions = {
  /**
   * A collection of ApiFactories to register in the application to either
   * add add new ones, or override factories provided by default or by plugins.
   */
  apis?: Iterable<AnyApiFactory>;

  /**
   * Supply icons to override the default ones.
   */
  icons?: Partial<AppIcons> & { [key in string]: IconComponent };

  /**
   * A list of all plugins to include in the app.
   */
  plugins?: BackstagePluginWithAnyOutput[];

  /**
   * Supply components to the app to override the default ones.
   */
  components?: Partial<AppComponents>;

  /**
   * Themes provided as a part of the app. By default two themes are included, one
   * light variant of the default backstage theme, and one dark.
   *
   * This is the default config:
   *
   * ```
   * [{
   *   id: 'light',
   *   title: 'Light Theme',
   *   variant: 'light',
   *   theme: lightTheme,
   *   icon: <LightIcon />,
   * }, {
   *   id: 'dark',
   *   title: 'Dark Theme',
   *   variant: 'dark',
   *   theme: darkTheme,
   *   icon: <DarkIcon />,
   * }]
   * ```
   */
  themes?: AppTheme[];

  /**
   * A function that loads in App configuration that will be accessible via
   * the ConfigApi.
   *
   * Defaults to an empty config.
   *
   * TODO(Rugvip): Omitting this should instead default to loading in configuration
   *  that was packaged by the backstage-cli and default docker container boot script.
   */
  configLoader?: AppConfigLoader;

  /**
   * A function that is used to register associations between cross-plugin route
   * references, enabling plugins to navigate between each other.
   *
   * The `bind` function that is passed in should be used to bind all external
   * routes of all used plugins.
   *
   * ```ts
   * bindRoutes({ bind }) {
   *   bind(docsPlugin.externalRoutes, {
   *     homePage: managePlugin.routes.managePage,
   *   })
   *   bind(homePagePlugin.externalRoutes, {
   *     settingsPage: settingsPlugin.routes.settingsPage,
   *   })
   * }
   * ```
   */
  bindRoutes?(context: { bind: AppRouteBinder }): void;
};

export type BackstageApp = {
  /**
   * Returns all plugins registered for the app.
   */
  getPlugins(): BackstagePlugin<any, any>[];

  /**
   * Get a common or custom icon for this app.
   */
  getSystemIcon(key: string): IconComponent | undefined;

  /**
   * Provider component that should wrap the Router created with getRouter()
   * and any other components that need to be within the app context.
   */
  getProvider(): ComponentType<{}>;

  /**
   * Router component that should wrap the App Routes create with getRoutes()
   * and any other components that should only be available while signed in.
   */
  getRouter(): ComponentType<{}>;
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
