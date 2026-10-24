/*
 * Copyright 2026 The Backstage Authors
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

import { AppErrorTypes } from '@backstage/frontend-app-api';

/**
 * App error codes that only produce a console warning instead of the app
 * error page. Also used by `@backstage/frontend-test-utils`, which throws for
 * every other code.
 *
 * @internal
 */
export const DEFAULT_WARNING_CODES: Array<keyof AppErrorTypes> = [
  'EXTENSION_IGNORED',
  'INVALID_EXTENSION_CONFIG_KEY',
  'EXTENSION_INPUT_DATA_IGNORED',
  'EXTENSION_INPUT_INTERNAL_IGNORED',
  'EXTENSION_OUTPUT_IGNORED',
  'EXTENSION_BOOTSTRAP_PREDICATE_IGNORED',
  'EXTENSION_BOOTSTRAP_API_UNAVAILABLE',
  'FEATURE_FLAG_INVALID',
];
