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

export * from './google';
export { factories as defaultAuthProviderFactories } from './factories';

// Export the minimal interface required for implementing a
// custom Authorization Handler
export type {
  AuthProviderRouteHandlers,
  AuthProviderFactoryOptions,
  AuthProviderFactory,
} from './types';

// These types are needed for a postMessage from the login pop-up
// to the frontend
export type { AuthResponse, BackstageIdentity, ProfileInfo } from './types';
