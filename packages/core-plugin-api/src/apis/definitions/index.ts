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

// This folder contains definitions for all core APIs.
//
// Plugins should rely on these APIs for functionality as much as possible.
//
// If you think some API definition is missing, please open an Issue or send a PR!

export * from './auth';

export * from './AlertApi';
export * from './AnalyticsApi';
export * from './AppThemeApi';
export * from './ConfigApi';
export * from './DiscoveryApi';
export * from './ErrorApi';
export * from './FeatureFlagsApi';
export * from './IdentityApi';
export * from './OAuthRequestApi';
export * from './StorageApi';
