/*
 * Copyright 2025 The Backstage Authors
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

import { cli } from 'cleye';
import { version as infoModuleVersion } from '../../package.json';
import os from 'node:os';
import { targetPaths, findOwnPaths } from '@backstage/cli-common';
import { BackstagePackageJson, PackageGraph } from '@backstage/cli-node';
import { detectPackageManager, Lockfile } from '@backstage/cli-node/alpha';
import { minimatch } from 'minimatch';
import fs from 'fs-extra';
import type { CliCommandContext } from '@backstage/cli-node';

/**
 * Attempts to read package.json from node_modules for a given package name.
 * Returns undefined if the package.json cannot be read.
 */
function tryReadPackageJson(
  packageName: string,
  targetPath: string,
): BackstagePackageJson | undefined {
  try {
    return require(require.resolve(`${packageName}/package.json`, {
      paths: [targetPath],
    }));
  } catch {
    return undefined;
  }
}

/**
 * Checks if a package has a backstage field in its package.json
 */
function hasBackstageField(packageName: string, targetPath: string): boolean {
  const pkg = tryReadPackageJson(packageName, targetPath);
  return pkg?.backstage !== undefined;
}

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { include, format },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        include: {
          type: [String],
          description:
            'Glob patterns for additional packages to include (e.g., @spotify/backstage*)',
        },
        format: {
          type: String,
          description: 'Output format (text or json)',
          default: 'text',
        },
      },
    },
    undefined,
    args,
  );

  const options = { include, format: format as 'text' | 'json' };

  await new Promise(async () => {
    const packageManager = await detectPackageManager();
    /* eslint-disable-next-line no-restricted-syntax */
    const isLocal = fs.existsSync(findOwnPaths(__dirname).resolve('./src'));

    const backstageFile = targetPaths.backstageJsonPath;
    let backstageVersion = 'N/A';
    if (fs.existsSync(backstageFile)) {
      try {
        const backstageJson = await fs.readJSON(backstageFile);
        backstageVersion = backstageJson.version ?? 'N/A';
      } catch (error) {
        if (options.format !== 'json') {
          console.warn(
            'The "backstage.json" file is not in the expected format',
          );
          console.log();
        }
      }
    }

    // Try to resolve the CLI package version — it may not be installed
    // when this module is executed standalone.
    let cliVersion: string | undefined;
    try {
      cliVersion = (
        require(require.resolve('@backstage/cli/package.json', {
          paths: [process.cwd()],
        })) as { version: string }
      ).version;
    } catch {
      /* not available */
    }

    const packageManagerVersion = await packageManager.version();
    const systemInfo = {
      os: `${os.type} ${os.release} - ${os.platform}/${os.arch}`,
      node: process.version,
      // The yarn field is kept for existing consumers of the JSON output
      ...(packageManager.name() === 'yarn'
        ? { yarn: packageManagerVersion }
        : undefined),
      packageManager: {
        name: packageManager.name(),
        version: packageManagerVersion,
      },
      ...(cliVersion
        ? { cli: { version: cliVersion, local: isLocal } }
        : undefined),
      infoModuleVersion,
      backstage: backstageVersion,
    };

    // A missing or unreadable lockfile only means that the versions of
    // installed packages are unknown, for example when a build system owns
    // the installs.
    let lockfile: Lockfile | undefined;
    try {
      lockfile = await packageManager.loadLockfile();
    } catch (error) {
      console.warn(
        `Failed to read ${packageManager.lockfileName()}, installed package versions are not listed, ${error}`,
      );
    }
    const targetPath = targetPaths.installationRootDir;

    // Get workspace package names and their versions
    const workspacePackages = new Map<string, string>();
    try {
      const packages = await PackageGraph.listTargetPackages();
      for (const pkg of packages) {
        workspacePackages.set(pkg.packageJson.name, pkg.packageJson.version);
      }
    } catch {
      // If we can't list workspace packages, continue without them
    }

    // Collect all package names from lockfile
    const allPackages = lockfile ? [...lockfile.keys()] : [];
    const includePatterns = options.include || [];

    // Collect installed (non-local) packages
    const installedDeps = new Set<string>();
    // Collect local workspace packages
    const localDeps = new Set<string>();

    // Process @backstage/* packages
    for (const pkg of allPackages) {
      if (pkg.startsWith('@backstage/')) {
        if (workspacePackages.has(pkg)) {
          localDeps.add(pkg);
        } else {
          installedDeps.add(pkg);
        }
      }
    }

    // Process packages matching --include patterns
    for (const pattern of includePatterns) {
      for (const pkg of allPackages) {
        if (minimatch(pkg, pattern)) {
          if (workspacePackages.has(pkg)) {
            localDeps.add(pkg);
          } else {
            installedDeps.add(pkg);
          }
        }
      }
    }

    // Process packages with backstage field in their package.json
    for (const pkg of allPackages) {
      // Skip @backstage/* packages (already processed above)
      if (pkg.startsWith('@backstage/')) {
        continue;
      }
      if (workspacePackages.has(pkg)) {
        // Check if local package has backstage field
        if (hasBackstageField(pkg, targetPath)) {
          localDeps.add(pkg);
        }
      } else if (hasBackstageField(pkg, targetPath)) {
        installedDeps.add(pkg);
      }
    }

    // Helper to get versions for a package as an array of objects
    const getVersions = (dep: string): Array<{ version: string }> => {
      const entries = lockfile?.get(dep);
      if (!entries) {
        return [{ version: 'unknown' }];
      }
      const versions = [...new Set(entries.map(i => i.version))];
      return versions.map(v => ({ version: v }));
    };

    const sortedInstalled = [...installedDeps].sort();
    const sortedLocal = [...localDeps].sort();

    // If format is json, output JSON to stdout
    if (options.format === 'json') {
      const output = {
        system: systemInfo,
        dependencies: Object.fromEntries(
          sortedInstalled.map(dep => [dep, getVersions(dep)]),
        ),
        local: Object.fromEntries(
          sortedLocal.map(dep => [
            dep,
            [{ version: workspacePackages.get(dep) ?? 'unknown' }],
          ]),
        ),
      };

      process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
      return;
    }

    // Print to console
    console.log(`OS:   ${systemInfo.os}`);
    console.log(`node: ${systemInfo.node}`);
    console.log(`${packageManager.name()}: ${packageManagerVersion}`);
    if (cliVersion) {
      console.log(`cli:  ${cliVersion} (${isLocal ? 'local' : 'installed'})`);
    }
    console.log(`info module: ${infoModuleVersion}`);
    console.log(`backstage:   ${backstageVersion}`);
    console.log();

    // Print installed dependencies
    console.log('Dependencies:');
    if (sortedInstalled.length > 0) {
      const maxLength = Math.max(...sortedInstalled.map(d => d.length));
      for (const dep of sortedInstalled) {
        const versions = getVersions(dep)
          .map(v => v.version)
          .join(', ');
        console.log(`  ${dep.padEnd(maxLength)} ${versions}`);
      }
    } else {
      console.log('  (no installed Backstage packages found)');
    }

    // Print local workspace packages
    if (localDeps.size > 0) {
      console.log();
      console.log('Local:');
      const maxLength = Math.max(...sortedLocal.map(d => d.length));
      for (const dep of sortedLocal) {
        const version = workspacePackages.get(dep) ?? 'unknown';
        console.log(`  ${dep.padEnd(maxLength)} ${version}`);
      }
    }
  });
};
