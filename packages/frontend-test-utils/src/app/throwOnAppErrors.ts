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

import { AppError } from '@backstage/frontend-app-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { DEFAULT_WARNING_CODES } from '../../../frontend-defaults/src/defaultWarningCodes';

// Uses the same list as `createApp`, so a test fails exactly when the app
// would show its error page.
const WARNING_CODES = new Set(DEFAULT_WARNING_CODES);

/**
 * Throws for app errors that would replace a real app with its error page,
 * so that tests fail instead of rendering an app that could never start.
 */
export function throwOnAppErrors(app: { errors?: AppError[] }): void {
  const errors = app.errors?.filter(e => !WARNING_CODES.has(e.code));
  if (errors?.length) {
    throw new Error(
      `Failed to create the test app: ${errors
        .map(e => `${e.code}: ${e.message}`)
        .join(', ')}`,
    );
  }
}
