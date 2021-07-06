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

import fs from 'fs-extra';
import { paths } from './paths';

/* eslint-disable import/no-extraneous-dependencies,monorepo/no-internal-import */
/*
This is a list of all packages used by the templates. If dependencies are added or removed,
this list should be updated as well.

The list, and the accompanying devDependencies entries, are here to ensure correct versioning
and bumping of this package. Without this list the version would not be bumped unless we
manually trigger a release.

This does not create an actual dependency on these packages and does not bring in any code.
Rollup will extract the value of the version field in each package at build time without
leaving any imports in place.
*/

import { version as backendCommon } from '@backstage/backend-common/package.json';
import { version as cli } from '@backstage/cli/package.json';
import { version as config } from '@backstage/config/package.json';
import { version as coreAppApi } from '@backstage/core-app-api/package.json';
import { version as coreComponents } from '@backstage/core-components/package.json';
import { version as corePluginApi } from '@backstage/core-plugin-api/package.json';
import { version as devUtils } from '@backstage/dev-utils/package.json';
import { version as testUtils } from '@backstage/test-utils/package.json';
import { version as theme } from '@backstage/theme/package.json';

export const packageVersions = {
  '@backstage/backend-common': backendCommon,
  '@backstage/cli': cli,
  '@backstage/config': config,
  '@backstage/core-app-api': coreAppApi,
  '@backstage/core-components': coreComponents,
  '@backstage/core-plugin-api': corePluginApi,
  '@backstage/dev-utils': devUtils,
  '@backstage/test-utils': testUtils,
  '@backstage/theme': theme,
};

export function findVersion() {
  const pkgContent = fs.readFileSync(paths.resolveOwn('package.json'), 'utf8');
  return JSON.parse(pkgContent).version;
}

export const version = findVersion();
export const isDev = fs.pathExistsSync(paths.resolveOwn('src'));
