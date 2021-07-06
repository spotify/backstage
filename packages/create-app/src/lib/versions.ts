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

/* eslint-disable monorepo/no-relative-import */

/*
This is a list of all packages used by the template. If dependencies are added or removed,
this list should be updated as well.

The list, and the accompanying peerDependencies entries, are here to ensure correct versioning
and bumping of this package. Without this list the version would not be bumped unless we
manually trigger a release.

This does not create an actual dependency on these packages and does not bring in any code.
Relative imports are used rather than package imports to make sure the packages aren't externalized.
Rollup will extract the value of the version field in each package at build time without
leaving any imports in place.
*/

import { version as backendCommon } from '../../../backend-common/package.json';
import { version as catalogClient } from '../../../catalog-client/package.json';
import { version as catalogModel } from '../../../catalog-model/package.json';
import { version as cli } from '../../../cli/package.json';
import { version as config } from '../../../config/package.json';
import { version as coreAppApi } from '../../../core-app-api/package.json';
import { version as coreComponents } from '../../../core-components/package.json';
import { version as corePluginApi } from '../../../core-plugin-api/package.json';
import { version as errors } from '../../../errors/package.json';
import { version as integrationReact } from '../../../integration-react/package.json';
import { version as testUtils } from '../../../test-utils/package.json';
import { version as theme } from '../../../theme/package.json';

import { version as pluginApiDocs } from '../../../../plugins/api-docs/package.json';
import { version as pluginAppBackend } from '../../../../plugins/app-backend/package.json';
import { version as pluginAuthBackend } from '../../../../plugins/auth-backend/package.json';
import { version as pluginCatalog } from '../../../../plugins/catalog/package.json';
import { version as pluginCatalogReact } from '../../../../plugins/catalog-react/package.json';
import { version as pluginCatalogBackend } from '../../../../plugins/catalog-backend/package.json';
import { version as pluginCatalogImport } from '../../../../plugins/catalog-import/package.json';
import { version as pluginCircleci } from '../../../../plugins/circleci/package.json';
import { version as pluginExplore } from '../../../../plugins/explore/package.json';
import { version as pluginGithubActions } from '../../../../plugins/github-actions/package.json';
import { version as pluginLighthouse } from '../../../../plugins/lighthouse/package.json';
import { version as pluginOrg } from '../../../../plugins/org/package.json';
import { version as pluginProxyBackend } from '../../../../plugins/proxy-backend/package.json';
import { version as pluginRollbarBackend } from '../../../../plugins/rollbar-backend/package.json';
import { version as pluginScaffolder } from '../../../../plugins/scaffolder/package.json';
import { version as pluginScaffolderBackend } from '../../../../plugins/scaffolder-backend/package.json';
import { version as pluginSearch } from '../../../../plugins/search/package.json';
import { version as pluginSearchBackend } from '../../../../plugins/search-backend/package.json';
import { version as pluginSearchBackendNode } from '../../../../plugins/search-backend-node/package.json';
import { version as pluginTechRadar } from '../../../../plugins/tech-radar/package.json';
import { version as pluginTechdocs } from '../../../../plugins/techdocs/package.json';
import { version as pluginTechdocsBackend } from '../../../../plugins/techdocs-backend/package.json';
import { version as pluginUserSettings } from '../../../../plugins/user-settings/package.json';

export const packageVersions = {
  '@backstage/backend-common': backendCommon,
  '@backstage/catalog-client': catalogClient,
  '@backstage/catalog-model': catalogModel,
  '@backstage/cli': cli,
  '@backstage/config': config,
  '@backstage/core-app-api': coreAppApi,
  '@backstage/core-components': coreComponents,
  '@backstage/core-plugin-api': corePluginApi,
  '@backstage/errors': errors,
  '@backstage/integration-react': integrationReact,
  '@backstage/plugin-api-docs': pluginApiDocs,
  '@backstage/plugin-app-backend': pluginAppBackend,
  '@backstage/plugin-auth-backend': pluginAuthBackend,
  '@backstage/plugin-catalog': pluginCatalog,
  '@backstage/plugin-catalog-react': pluginCatalogReact,
  '@backstage/plugin-catalog-backend': pluginCatalogBackend,
  '@backstage/plugin-catalog-import': pluginCatalogImport,
  '@backstage/plugin-circleci': pluginCircleci,
  '@backstage/plugin-explore': pluginExplore,
  '@backstage/plugin-github-actions': pluginGithubActions,
  '@backstage/plugin-lighthouse': pluginLighthouse,
  '@backstage/plugin-org': pluginOrg,
  '@backstage/plugin-proxy-backend': pluginProxyBackend,
  '@backstage/plugin-rollbar-backend': pluginRollbarBackend,
  '@backstage/plugin-scaffolder': pluginScaffolder,
  '@backstage/plugin-scaffolder-backend': pluginScaffolderBackend,
  '@backstage/plugin-search': pluginSearch,
  '@backstage/plugin-search-backend': pluginSearchBackend,
  '@backstage/plugin-search-backend-node': pluginSearchBackendNode,
  '@backstage/plugin-tech-radar': pluginTechRadar,
  '@backstage/plugin-techdocs': pluginTechdocs,
  '@backstage/plugin-techdocs-backend': pluginTechdocsBackend,
  '@backstage/plugin-user-settings': pluginUserSettings,
  '@backstage/test-utils': testUtils,
  '@backstage/theme': theme,
};
