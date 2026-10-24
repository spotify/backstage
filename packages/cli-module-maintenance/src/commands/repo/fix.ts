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

import {
  BackstagePackage,
  BackstagePackageJson,
  PackageGraph,
  PackageRole,
  PackageRoles,
} from '@backstage/cli-node';
import { cli } from 'cleye';
import fs from 'fs-extra';
import {
  resolve as resolvePath,
  posix,
  relative as relativePath,
  extname,
} from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import {
  knownBackendPluginPackageNameByPluginId,
  knownFrontendPluginPackageNameByPluginId,
} from '@internal/cli';

const SCRIPT_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.json'];

/**
 * A mutable object representing a package.json file with potential fixes.
 */
export interface FixablePackage extends BackstagePackage {
  changed: boolean;
}

export async function readFixablePackages(): Promise<FixablePackage[]> {
  const packages = await PackageGraph.listTargetPackages();
  return packages.map(pkg => ({ ...pkg, changed: false }));
}

export function printPackageFixHint(packages: FixablePackage[]) {
  const changed = packages.filter(pkg => pkg.changed);
  if (changed.length > 0) {
    const rootPkg = require(targetPaths.resolveInstallationRoot(
      'package.json',
    ));
    const fixCmd =
      rootPkg.scripts?.fix === 'backstage-cli repo fix'
        ? 'fix'
        : 'backstage-cli repo fix';
    console.log(
      `The following packages are out of sync, run 'yarn ${fixCmd}' to fix them:`,
    );
    for (const pkg of changed) {
      console.log(`  ${pkg.packageJson.name}`);
    }
    return true;
  }
  return false;
}

export async function writeFixedPackages(
  packages: FixablePackage[],
): Promise<void> {
  await Promise.all(
    packages.map(async pkg => {
      if (!pkg.changed) {
        return;
      }

      await fs.writeJson(
        resolvePath(pkg.dir, 'package.json'),
        pkg.packageJson,
        {
          spaces: 2,
        },
      );
    }),
  );
}

function trimRelative(path: string): string {
  if (path.startsWith('./')) {
    return path.slice(2);
  }
  return path;
}

export function fixPackageExports(pkg: FixablePackage) {
  let { exports: exp } = pkg.packageJson;
  if (!exp) {
    return;
  }
  if (Array.isArray(exp)) {
    throw new Error('Unexpected array in package.json exports field');
  }

  // If exports is a string we rewrite it to an object to add package.json
  if (typeof exp === 'string') {
    pkg.changed = true;
    exp = { '.': exp };
    pkg.packageJson.exports = exp;
  } else if (typeof exp !== 'object') {
    return;
  }

  if (!exp['./package.json']) {
    pkg.changed = true;
    exp['./package.json'] = './package.json';
  }

  const existingTypesVersions = JSON.stringify(pkg.packageJson.typesVersions);

  const typeEntries: Record<string, [string]> = {};
  for (const [path, value] of Object.entries(exp)) {
    // Main entry point does not need to be listed
    if (path === '.') {
      continue;
    }
    const newPath = trimRelative(path);

    // Only script files and package.json should be added to typesVersions
    if (typeof value === 'string') {
      if (SCRIPT_EXTS.includes(extname(value))) {
        typeEntries[newPath] = [trimRelative(value)];
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (typeof value.types === 'string') {
        typeEntries[newPath] = [trimRelative(value.types)];
      } else if (
        typeof value.default === 'string' &&
        SCRIPT_EXTS.includes(extname(value.default))
      ) {
        typeEntries[newPath] = [trimRelative(value.default)];
      }
    }
  }

  const hasTypeEntries = Object.keys(typeEntries).length > 0;
  const typesVersions = hasTypeEntries ? { '*': typeEntries } : undefined;

  if (existingTypesVersions !== JSON.stringify(typesVersions)) {
    if (pkg.packageJson.typesVersions) {
      // Update in place to preserve field order
      if (typesVersions) {
        pkg.packageJson.typesVersions = typesVersions;
      } else {
        delete pkg.packageJson.typesVersions;
      }
    } else if (typesVersions) {
      // Insert after exports when adding for the first time
      const newPkgEntries = Object.entries(pkg.packageJson);
      newPkgEntries.splice(
        newPkgEntries.findIndex(([name]) => name === 'exports') + 1,
        0,
        ['typesVersions', typesVersions],
      );
      pkg.packageJson = Object.fromEntries(
        newPkgEntries,
      ) as BackstagePackageJson;
    }
    pkg.changed = true;
  }

  // Remove the legacy fields from publishConfig, which are no longer needed
  const publishConfig = pkg.packageJson.publishConfig as
    | Record<string, string>
    | undefined;
  if (publishConfig) {
    for (const field of ['main', 'module', 'browser', 'types']) {
      if (publishConfig[field]) {
        delete publishConfig[field];
        pkg.changed = true;
      }
    }
  }
}

export function fixSideEffects(pkg: FixablePackage) {
  const role = PackageRoles.getRoleFromPackage(pkg.packageJson);
  if (!role) {
    return;
  }

  const roleInfo = PackageRoles.getRoleInfo(role);

  // Only web and common packages benefit from being marked as side effect free
  if (roleInfo.platform === 'node') {
    return;
  }
  // Bundled packages don't need to mark themselves as having no side effects
  if (roleInfo.output.length === 1 && roleInfo.output[0] === 'bundle') {
    return;
  }

  // Already declared
  if ('sideEffects' in pkg.packageJson) {
    return;
  }

  const pkgEntries = Object.entries(pkg.packageJson);
  pkgEntries.splice(
    // Place it just above the scripts field
    pkgEntries.findIndex(([name]) => name === 'scripts'),
    0,
    ['sideEffects', false],
  );
  pkg.packageJson = Object.fromEntries(pkgEntries) as BackstagePackageJson;
  pkg.changed = true;
}

export function createRepositoryFieldFixer() {
  const rootPkg = require(targetPaths.resolveInstallationRoot('package.json'));
  const rootRepoField = rootPkg.repository;
  if (!rootRepoField) {
    return () => {};
  }

  const rootType = rootRepoField.type || 'git';
  const rootUrl = rootRepoField.url;
  const rootDir = rootRepoField.directory || '';

  return (pkg: FixablePackage) => {
    const expectedPath = posix.join(
      rootDir,
      relativePath(targetPaths.installationRootDir, pkg.dir),
    );
    const repoField = pkg.packageJson.repository;

    if (!repoField || typeof repoField === 'string') {
      const pkgEntries = Object.entries(pkg.packageJson);
      pkgEntries.splice(
        // Place it just above the backstage field
        pkgEntries.findIndex(([name]) => name === 'backstage'),
        0,
        [
          'repository',
          {
            type: rootType,
            url: rootUrl,
            directory: expectedPath,
          },
        ],
      );
      pkg.packageJson = Object.fromEntries(pkgEntries) as BackstagePackageJson;
      pkg.changed = true;
      return;
    }

    // If there's a type or URL mismatch, leave the field as is
    if (repoField.type !== rootType || repoField.url !== rootUrl) {
      return;
    }

    if (repoField.directory !== expectedPath) {
      repoField.directory = expectedPath;
      pkg.changed = true;
    }
  };
}

function guessPluginId(role: PackageRole, pkgName: string): string | undefined {
  switch (role) {
    case 'frontend':
    case 'frontend-plugin':
      return pkgName.match(/plugin-(.*)/)?.[1];
    case 'frontend-plugin-module':
      return pkgName.match(/plugin-(.*)-module-/)?.[1];
    case 'backend-plugin':
      return pkgName.match(/plugin-(.*)-backend$/)?.[1];
    case 'backend-plugin-module':
      return pkgName.match(/plugin-(.*)-backend-module-/)?.[1];
    case 'common-library':
      return pkgName.match(/plugin-(.*)-(?:common)$/)?.[1];
    case 'web-library':
      return pkgName.match(/plugin-(.*)-(?:react|test-utils)/)?.[1];
    case 'node-library':
      return pkgName.match(/plugin-(.*)-(?:node|backend)-?/)?.[1];
    default:
      throw new Error(
        `Invalid 'backstage.role' field in "${pkgName}", got '${role}'`,
      );
  }
}

export function fixPluginId(pkg: FixablePackage) {
  const role = pkg.packageJson.backstage?.role;
  if (!role) {
    return;
  }

  if (
    role === 'backend' ||
    role === 'frontend' ||
    role === 'cli' ||
    role === 'cli-module'
  ) {
    return;
  }

  const currentId = pkg.packageJson.backstage?.pluginId;
  if (currentId !== undefined) {
    if (typeof currentId !== 'string' && currentId !== null) {
      throw new Error(
        `Invalid 'backstage.pluginId' field in "${pkg.packageJson.name}", must be a string`,
      );
    }
    return;
  }

  const guessedPluginId = guessPluginId(role, pkg.packageJson.name);
  if (
    !guessedPluginId &&
    (role === 'frontend-plugin' ||
      role === 'frontend-plugin-module' ||
      role === 'backend-plugin' ||
      role === 'backend-plugin-module')
  ) {
    const path = relativePath(
      targetPaths.installationRootDir,
      resolvePath(pkg.dir, 'package.json'),
    );
    const msg = `Failed to guess plugin ID for "${pkg.packageJson.name}", please set the 'backstage.pluginId' field manually in "${path}"`;
    if (role.endsWith('module')) {
      const suggestedRole = role.startsWith('frontend')
        ? 'web-library'
        : 'node-library';
      throw new Error(
        `${msg}. It is also possible that this package is not a module, and should use the '${suggestedRole}' role instead.`,
      );
    } else {
      throw new Error(msg);
    }
  }

  if (guessedPluginId) {
    pkg.packageJson.backstage = {
      ...pkg.packageJson.backstage,
      pluginId: guessedPluginId,
    };
    pkg.changed = true;
  }
}

const pluginPackageRoles: Array<string | undefined> = [
  'frontend-plugin',
  'backend-plugin',
  'common-library',
  'web-library',
  'node-library',
];

export function fixPluginPackages(
  pkg: FixablePackage,
  repoPackages: FixablePackage[],
) {
  const pkgBackstage = pkg.packageJson.backstage;
  const role = pkgBackstage?.role;
  if (!role) {
    return;
  }

  if (
    role === 'backend' ||
    role === 'frontend' ||
    role === 'cli' ||
    role === 'cli-module'
  ) {
    return;
  }

  const pluginId = pkgBackstage.pluginId;
  if (!pluginId) {
    // Might be a plugin-less library, skip
    if (
      role === 'common-library' ||
      role === 'web-library' ||
      role === 'node-library' ||
      role === 'frontend-plugin-module' // TODO(Rugvip): Remove this once frontend modules are required to have a plugin ID
    ) {
      return;
    }
    throw new Error(
      `Missing 'backstage.pluginId' field in "${pkg.packageJson.name}"`,
    );
  }

  if (role === 'backend-plugin-module' || role === 'frontend-plugin-module') {
    const targetRole = role.replace('-module', '');

    // Try to find a plugin package in the same repo, but otherwise fall back to looking up the package name by ID of @backstage/* plugins
    const pluginPkgName =
      repoPackages.find(
        p =>
          p.packageJson.backstage?.pluginId === pluginId &&
          p.packageJson.backstage?.role === targetRole,
      )?.packageJson.name ??
      (role === 'backend-plugin-module'
        ? knownBackendPluginPackageNameByPluginId[pluginId]
        : knownFrontendPluginPackageNameByPluginId[pluginId]);
    if (!pluginPkgName) {
      // If we can't find a matching package in the repo but one is declared, skip
      if (pkgBackstage.pluginPackage) {
        return;
      }
      const path = relativePath(
        targetPaths.installationRootDir,
        resolvePath(pkg.dir, 'package.json'),
      );
      const suggestedRole =
        role === 'frontend-plugin-module' ? 'web-library' : 'node-library';
      throw new Error(
        `Failed to find plugin package for "${pkg.packageJson.name}", please declare the name of the plugin package that this package is a module for in the 'backstage.pluginPackage' field in "${path}". ` +
          `It is also possible that this package is not a module, and should use the '${suggestedRole}' role instead.`,
      );
    }

    if (pkgBackstage.pluginPackage !== pluginPkgName) {
      pkgBackstage.pluginPackage = pluginPkgName;
      pkg.changed = true;
    }
  } else {
    let pluginPackages: string[] | undefined = repoPackages
      .filter(
        p =>
          p.packageJson.backstage?.pluginId === pluginId &&
          pluginPackageRoles.includes(p.packageJson.backstage?.role),
      )
      .map(p => p.packageJson.name)
      .sort();

    if (pluginPackages.length === 0) {
      pluginPackages = undefined;
    }

    if (pkgBackstage.pluginPackages?.join(',') !== pluginPackages?.join(',')) {
      pkgBackstage.pluginPackages = pluginPackages;
      pkg.changed = true;
    }
  }
}

export function fixPeerModules(pkg: FixablePackage) {
  const pkgBackstage = pkg.packageJson.backstage;
  const role = pkgBackstage?.role;
  if (!role) {
    return;
  }

  const peerModules = pkgBackstage.peerModules;
  if (peerModules === undefined) {
    return;
  }

  const packagePath = relativePath(
    targetPaths.installationRootDir,
    resolvePath(pkg.dir, 'package.json'),
  );

  // Validate that peerModules is only used on plugin packages
  if (role !== 'backend-plugin' && role !== 'frontend-plugin') {
    throw new Error(
      `The 'backstage.peerModules' field in "${pkg.packageJson.name}" can only be used on plugin packages (backend-plugin or frontend-plugin), but package has role '${role}' in "${packagePath}"`,
    );
  }

  // Validate that peerModules is an array
  if (!Array.isArray(peerModules)) {
    throw new Error(
      `Invalid 'backstage.peerModules' field in "${pkg.packageJson.name}", must be an array of package names in "${packagePath}"`,
    );
  }

  // Validate that all entries are non-empty strings
  for (const entry of peerModules) {
    if (typeof entry !== 'string' || entry.length === 0) {
      throw new Error(
        `Invalid entry in 'backstage.peerModules' field in "${pkg.packageJson.name}", all entries must be non-empty package name strings in "${packagePath}"`,
      );
    }
  }
}

type PackageFixer = (pkg: FixablePackage, packages: FixablePackage[]) => void;

export default async ({
  args,
  info,
}: import('@backstage/cli-node').CliCommandContext) => {
  const {
    flags: { publish, check },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        publish: {
          type: Boolean,
          description:
            'Enable additional fixes that only apply when publishing packages',
        },
        check: {
          type: Boolean,
          description:
            'Fail if any packages would have been changed by the command',
        },
      },
    },
    undefined,
    args,
  );

  const packages = await readFixablePackages();
  const fixRepositoryField = createRepositoryFieldFixer();

  const fixers: PackageFixer[] = [fixPackageExports, fixSideEffects];

  if (publish) {
    fixers.push(
      fixRepositoryField,
      fixPluginId,
      fixPluginPackages,
      fixPeerModules,
    );
  }

  for (const fixer of fixers) {
    for (const pkg of packages) {
      fixer(pkg, packages);
    }
  }

  if (check) {
    if (printPackageFixHint(packages)) {
      process.exit(1);
    }
  } else {
    await writeFixedPackages(packages);
  }
};
