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

import { Config } from '@backstage/config';
import { MockProductTypes } from './products';
import { ConfigApi } from '@backstage/core-plugin-api';

export const MockProductsConfig: Partial<ConfigApi> = {
  keys: () => Object.keys(MockProductTypes),
};

export const MockMetricsConfig: Partial<ConfigApi> = {
  getOptionalString: () => 'daily-cost',
  keys: () => ['daily-cost'],
};

export const MockCostInsightsConfig: Partial<Config> = {
  getConfig: () => MockProductsConfig as Config,
  getOptionalConfig: () => MockMetricsConfig as Config,
};
