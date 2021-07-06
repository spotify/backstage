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

import { ApiRef, createApiRef } from '../system';

/**
 * The feature flags API is used to toggle functionality to users across plugins and Backstage.
 *
 * Plugins can use this API to register feature flags that they have available
 * for users to enable/disable, and this API will centralize the current user's
 * state of which feature flags they would like to enable.
 *
 * This is ideal for Backstage plugins, as well as your own App, to trial incomplete
 * or unstable upcoming features. Although there will be a common interface for users
 * to enable and disable feature flags, this API acts as another way to enable/disable.
 */

export type FeatureFlag = {
  name: string;
  pluginId: string;
};

export enum FeatureFlagState {
  None = 0,
  Active = 1,
}

/**
 * Options to use when saving feature flags.
 */
export type FeatureFlagsSaveOptions = {
  /**
   * The new feature flag states to save.
   */
  states: Record<string, FeatureFlagState>;

  /**
   * Whether the saves states should be merged into the existing ones, or replace them.
   *
   * Defaults to false.
   */
  merge?: boolean;
};

export type UserFlags = {};

export interface FeatureFlagsApi {
  /**
   * Registers a new feature flag. Once a feature flag has been registered it
   * can be toggled by users, and read back to enable or disable features.
   */
  registerFlag(flag: FeatureFlag): void;

  /**
   * Get a list of all registered flags.
   */
  getRegisteredFlags(): FeatureFlag[];

  /**
   * Whether the feature flag with the given name is currently activated for the user.
   */
  isActive(name: string): boolean;

  /**
   * Save the user's choice of feature flag states.
   */
  save(options: FeatureFlagsSaveOptions): void;
}

export const featureFlagsApiRef: ApiRef<FeatureFlagsApi> = createApiRef({
  id: 'core.featureflags',
});
