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

import { RouteRef, SubRouteRef, ExternalRouteRef } from '../routing';
import { AnyApiFactory } from '../apis/system';

export type RouteOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type RoutePath = string;

// Replace with using RouteRefs
export type FeatureFlagOutput = {
  type: 'feature-flag';
  name: string;
};

export type PluginOutput = FeatureFlagOutput;

export type Extension<T> = {
  expose(plugin: BackstagePlugin<any, any>): T;
};

export type AnyRoutes = { [name: string]: RouteRef | SubRouteRef };

export type AnyExternalRoutes = { [name: string]: ExternalRouteRef };

export type BackstagePlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {}
> = {
  getId(): string;
  output(): PluginOutput[];
  getApis(): Iterable<AnyApiFactory>;
  provide<T>(extension: Extension<T>): T;
  routes: Routes;
  externalRoutes: ExternalRoutes;
};

export type PluginConfig<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes
> = {
  id: string;
  apis?: Iterable<AnyApiFactory>;
  register?(hooks: PluginHooks): void;
  routes?: Routes;
  externalRoutes?: ExternalRoutes;
};

export type PluginHooks = {
  featureFlags: FeatureFlagsHooks;
};

export type FeatureFlagsHooks = {
  register(name: string): void;
};
