/*
 * Copyright 2021 The Backstage Authors
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

export function isDockerDisabledForTests() {
  // If we are not running in continuous integration, the default is to skip
  // the (relatively heavy, long running) docker based tests. If you want to
  // still run local tests for all databases, just pass either the CI=1 env
  // parameter to your test runner, or individual connection strings per
  // database.
  return (
    Boolean(process.env.BACKSTAGE_TEST_DISABLE_DOCKER) ||
    !Boolean(process.env.CI)
  );
}
