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

import semver from 'semver';
import type { Lockfile } from '@backstage/cli-node/alpha';

/* eslint-disable @backstage/no-relative-monorepo-imports */
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

import { version as backendDefaults } from '../../../backend-defaults/package.json';
import { version as backendPluginApi } from '../../../backend-plugin-api/package.json';
import { version as backendTestUtils } from '../../../backend-test-utils/package.json';
import { version as catalogClient } from '../../../catalog-client/package.json';
import { version as catalogModel } from '../../../catalog-model/package.json';
import { version as cli } from '../../../cli/package.json';
import { version as cliCommon } from '../../../cli-common/package.json';
import { version as cliNode } from '../../../cli-node/package.json';
import { version as config } from '../../../config/package.json';
import { version as coreAppApi } from '../../../core-app-api/package.json';
import { version as coreComponents } from '../../../core-components/package.json';
import { version as corePluginApi } from '../../../core-plugin-api/package.json';
import { version as devUtils } from '../../../dev-utils/package.json';
import { version as errors } from '../../../errors/package.json';
import { version as frontendDevUtils } from '../../../frontend-dev-utils/package.json';
import { version as frontendDefaults } from '../../../frontend-defaults/package.json';
import { version as frontendPluginApi } from '../../../frontend-plugin-api/package.json';
import { version as frontendTestUtils } from '../../../frontend-test-utils/package.json';
import { version as testUtils } from '../../../test-utils/package.json';
import { version as theme } from '../../../theme/package.json';
import { version as types } from '../../../types/package.json';
import { version as ui } from '../../../ui/package.json';
import { version as appBackend } from '../../../../plugins/app-backend/package.json';
import { version as authBackend } from '../../../../plugins/auth-backend/package.json';
import { version as authBackendModuleGuestProvider } from '../../../../plugins/auth-backend-module-guest-provider/package.json';
import { version as catalogBackend } from '../../../../plugins/catalog-backend/package.json';
import { version as catalogNode } from '../../../../plugins/catalog-node/package.json';
import { version as eventsBackend } from '../../../../plugins/events-backend/package.json';
import { version as kubernetesBackend } from '../../../../plugins/kubernetes-backend/package.json';
import { version as notificationsBackend } from '../../../../plugins/notifications-backend/package.json';
import { version as permissionBackend } from '../../../../plugins/permission-backend/package.json';
import { version as permissionCommon } from '../../../../plugins/permission-common/package.json';
import { version as permissionNode } from '../../../../plugins/permission-node/package.json';
import { version as proxyBackend } from '../../../../plugins/proxy-backend/package.json';
import { version as scaffolderBackend } from '../../../../plugins/scaffolder-backend/package.json';
import { version as scaffolderNode } from '../../../../plugins/scaffolder-node/package.json';
import { version as scaffolderNodeTestUtils } from '../../../../plugins/scaffolder-node-test-utils/package.json';
import { version as scaffolderReact } from '../../../../plugins/scaffolder-react/package.json';
import { version as searchBackend } from '../../../../plugins/search-backend/package.json';
import { version as searchBackendNode } from '../../../../plugins/search-backend-node/package.json';
import { version as searchCommon } from '../../../../plugins/search-common/package.json';
import { version as techdocsBackend } from '../../../../plugins/techdocs-backend/package.json';

export const packageVersions: Record<string, string> = {
  '@backstage/backend-defaults': backendDefaults,
  '@backstage/backend-plugin-api': backendPluginApi,
  '@backstage/backend-test-utils': backendTestUtils,
  '@backstage/catalog-client': catalogClient,
  '@backstage/catalog-model': catalogModel,
  '@backstage/cli': cli,
  '@backstage/cli-common': cliCommon,
  '@backstage/cli-node': cliNode,
  '@backstage/config': config,
  '@backstage/core-app-api': coreAppApi,
  '@backstage/core-components': coreComponents,
  '@backstage/core-plugin-api': corePluginApi,
  '@backstage/dev-utils': devUtils,
  '@backstage/errors': errors,
  '@backstage/frontend-dev-utils': frontendDevUtils,
  '@backstage/frontend-defaults': frontendDefaults,
  '@backstage/frontend-plugin-api': frontendPluginApi,
  '@backstage/frontend-test-utils': frontendTestUtils,
  '@backstage/test-utils': testUtils,
  '@backstage/theme': theme,
  '@backstage/types': types,
  '@backstage/ui': ui,
  '@backstage/plugin-scaffolder-node': scaffolderNode,
  '@backstage/plugin-scaffolder-node-test-utils': scaffolderNodeTestUtils,
  '@backstage/plugin-scaffolder-react': scaffolderReact,
  '@backstage/plugin-app-backend': appBackend,
  '@backstage/plugin-auth-backend': authBackend,
  '@backstage/plugin-auth-backend-module-guest-provider':
    authBackendModuleGuestProvider,
  '@backstage/plugin-catalog-backend': catalogBackend,
  '@backstage/plugin-catalog-node': catalogNode,
  '@backstage/plugin-events-backend': eventsBackend,
  '@backstage/plugin-kubernetes-backend': kubernetesBackend,
  '@backstage/plugin-notifications-backend': notificationsBackend,
  '@backstage/plugin-permission-backend': permissionBackend,
  '@backstage/plugin-permission-common': permissionCommon,
  '@backstage/plugin-permission-node': permissionNode,
  '@backstage/plugin-proxy-backend': proxyBackend,
  '@backstage/plugin-scaffolder-backend': scaffolderBackend,
  '@backstage/plugin-search-backend': searchBackend,
  '@backstage/plugin-search-backend-node': searchBackendNode,
  '@backstage/plugin-search-common': searchCommon,
  '@backstage/plugin-techdocs-backend': techdocsBackend,
};

export function createPackageVersionProvider(
  lockfile?: Lockfile,
  options?: {
    preferBackstageProtocol?: boolean;
  },
) {
  return (name: string, versionHint?: string): string | undefined => {
    const packageVersion = packageVersions[name];

    // 1) workspace precedence (existing logic) - check this first
    const lockfileEntries = lockfile?.get(name);
    const lockfileEntry = lockfileEntries?.find(entry =>
      entry.range.startsWith('workspace:'),
    );
    if (lockfileEntry) {
      return 'workspace:^';
    }

    // 2) backstage:^ when plugin is present and allowed
    if (options?.preferBackstageProtocol && name.startsWith('@backstage/')) {
      return 'backstage:^';
    }

    // 3) fallback to current npm resolution
    const targetVersion = versionHint || packageVersion;
    if (!targetVersion) {
      return undefined;
    }

    const validRanges = lockfileEntries?.filter(entry =>
      semver.satisfies(targetVersion, entry.range),
    );
    const highestRange = validRanges?.slice(-1)[0];

    if (highestRange?.range) {
      return highestRange?.range;
    }
    if (packageVersion) {
      return `^${packageVersion}`;
    }
    if (semver.parse(versionHint)?.prerelease.length) {
      return versionHint!;
    }
    return versionHint?.match(/^[\d\.]+$/) ? `^${versionHint}` : versionHint!;
  };
}
