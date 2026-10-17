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

import path from 'node:path';
import { getPackages, Package } from '@manypkg/get-packages';
import { targetPaths } from '@backstage/cli-common';
import { PackageRole } from '../roles';
import { GitUtils } from '../git';
import { detectPackageManager, Lockfile, LockfileDiff } from '../pacman';
import { JsonValue } from '@backstage/types';

// The lockfiles of the package managers that the CLI knows about. The package
// manager is only detected when one of them has changed, since that can spawn
// a process.
const LOCKFILE_NAMES = ['yarn.lock', 'pnpm-lock.yaml'];

/**
 * A list of the feature types we want to extract from the project
 * and include in the metadata
 *
 * @public
 */
export const packageFeatureType = [
  '@backstage/BackendFeature',
  '@backstage/BackstagePlugin',
  '@backstage/FrontendPlugin',
  '@backstage/FrontendModule',
] as const;

/**
 * @public
 */
export type BackstagePackageFeatureType = (typeof packageFeatureType)[number];

/**
 * Known fields in Backstage package.json files.
 *
 * @public
 */
export interface BackstagePackageJson {
  name: string;
  version: string;
  private?: boolean;

  main?: string;
  module?: string;
  types?: string;

  scripts?: {
    [key: string]: string;
  };
  // The `bundled` field is a field known within Backstage, it means
  // that the package bundles all of its dependencies in its build output.
  bundled?: boolean;

  type?: 'module' | 'commonjs';

  backstage?: {
    role?: PackageRole;
    moved?: string;

    /**
     * If set to `true`, the package will be treated as an internal package
     * where any imports will be inlined into the consuming package.
     *
     * When set to `true`, the top-level `private` field must be set to `true`
     * as well.
     */
    inline?: boolean;

    /**
     * The ID of the plugin if this is a plugin package. Must always be set for plugin and module packages, and may be set for library packages. A `null` value means that the package is explicitly not a plugin package.
     */
    pluginId?: string | null;

    /**
     * The parent plugin package of a module. Must always and only be set for module packages.
     */
    pluginPackage?: string;

    /**
     * All packages that are part of the plugin. Must always and only be set for plugin packages and plugin library packages.
     */
    pluginPackages?: string[];

    /**
     * Module packages that should be installed alongside this plugin for cross-plugin integrations.
     * If the peer module's target plugin is present, you should have the peer module installed.
     */
    peerModules?: string[];

    /**
     * The feature types exported from the package, indexed by path.
     */
    features?: Record<string, BackstagePackageFeatureType>;
  };

  exports?: JsonValue;
  typesVersions?: Record<string, Record<string, string[]>>;

  files?: string[];

  publishConfig?: {
    access?: 'public' | 'restricted';
    directory?: string;
    registry?: string;
  };

  repository?:
    | string
    | {
        type: string;
        url: string;
        directory: string;
      };

  dependencies?: {
    [key: string]: string;
  };
  peerDependencies?: {
    [key: string]: string;
  };
  devDependencies?: {
    [key: string]: string;
  };
  optionalDependencies?: {
    [key: string]: string;
  };
}

/**
 * A local Backstage monorepo package
 *
 * @public
 */
export type BackstagePackage = {
  dir: string;
  packageJson: BackstagePackageJson;
};

/**
 * A local package in the monorepo package graph.
 *
 * @public
 */
export type PackageGraphNode = {
  /** The name of the package */
  name: string;
  /** The directory of the package */
  dir: string;
  /** The package data of the package itself */
  packageJson: BackstagePackageJson;

  /** All direct local dependencies of the package */
  allLocalDependencies: Map<string, PackageGraphNode>;
  /** All direct local dependencies that will be present in the published package */
  publishedLocalDependencies: Map<string, PackageGraphNode>;
  /** Local dependencies */
  localDependencies: Map<string, PackageGraphNode>;
  /** Local devDependencies */
  localDevDependencies: Map<string, PackageGraphNode>;
  /** Local optionalDependencies */
  localOptionalDependencies: Map<string, PackageGraphNode>;

  /** All direct incoming local dependencies of the package */
  allLocalDependents: Map<string, PackageGraphNode>;
  /** All direct incoming local dependencies that will be present in the published package */
  publishedLocalDependents: Map<string, PackageGraphNode>;
  /** Incoming local dependencies */
  localDependents: Map<string, PackageGraphNode>;
  /** Incoming local devDependencies */
  localDevDependents: Map<string, PackageGraphNode>;
  /** Incoming local optionalDependencies */
  localOptionalDependents: Map<string, PackageGraphNode>;
};

/**
 * Represents a local Backstage monorepo package graph.
 *
 * @public
 */
export class PackageGraph extends Map<string, PackageGraphNode> {
  /**
   * Lists all local packages in a monorepo.
   *
   * @remarks
   *
   * The packages are those of the Backstage installation, which are listed in
   * the `workspaces` field of its `package.json`. When the installation is the
   * root of a pnpm workspace without that field, they are the packages listed
   * in `pnpm-workspace.yaml`.
   */
  static async listTargetPackages(): Promise<BackstagePackage[]> {
    const { packages } = await getPackages(targetPaths.installationRootDir);

    return packages as BackstagePackage[];
  }

  /**
   * Creates a package graph from a list of local packages.
   */
  static fromPackages(packages: Package[]): PackageGraph {
    const graph = new PackageGraph();

    // Add all local packages to the graph
    for (const pkg of packages) {
      const name = pkg.packageJson.name;
      const existingPkg = graph.get(name);
      if (existingPkg) {
        throw new Error(
          `Duplicate package name '${name}' at ${pkg.dir} and ${existingPkg.dir}`,
        );
      }

      graph.set(name, {
        name,
        dir: pkg.dir,
        packageJson: pkg.packageJson as BackstagePackageJson,

        allLocalDependencies: new Map(),
        publishedLocalDependencies: new Map(),
        localDependencies: new Map(),
        localDevDependencies: new Map(),
        localOptionalDependencies: new Map(),

        allLocalDependents: new Map(),
        publishedLocalDependents: new Map(),
        localDependents: new Map(),
        localDevDependents: new Map(),
        localOptionalDependents: new Map(),
      });
    }

    // Populate the local dependency structure
    for (const node of graph.values()) {
      for (const depName of Object.keys(node.packageJson.dependencies || {})) {
        const depPkg = graph.get(depName);
        if (depPkg) {
          node.allLocalDependencies.set(depName, depPkg);
          node.publishedLocalDependencies.set(depName, depPkg);
          node.localDependencies.set(depName, depPkg);

          depPkg.allLocalDependents.set(node.name, node);
          depPkg.publishedLocalDependents.set(node.name, node);
          depPkg.localDependents.set(node.name, node);
        }
      }
      for (const depName of Object.keys(
        node.packageJson.devDependencies || {},
      )) {
        const depPkg = graph.get(depName);
        if (depPkg) {
          node.allLocalDependencies.set(depName, depPkg);
          node.localDevDependencies.set(depName, depPkg);

          depPkg.allLocalDependents.set(node.name, node);
          depPkg.localDevDependents.set(node.name, node);
        }
      }
      for (const depName of Object.keys(
        node.packageJson.optionalDependencies || {},
      )) {
        const depPkg = graph.get(depName);
        if (depPkg) {
          node.allLocalDependencies.set(depName, depPkg);
          node.publishedLocalDependencies.set(depName, depPkg);
          node.localOptionalDependencies.set(depName, depPkg);

          depPkg.allLocalDependents.set(node.name, node);
          depPkg.publishedLocalDependents.set(node.name, node);
          depPkg.localOptionalDependents.set(node.name, node);
        }
      }
    }

    return graph;
  }

  /**
   * Traverses the package graph and collects a set of package names.
   *
   * The traversal starts at the provided list names, and continues
   * throughout all the names returned by the `collectFn`, which is
   * called once for each seen package.
   */
  collectPackageNames(
    startingPackageNames: string[],
    collectFn: (pkg: PackageGraphNode) => Iterable<string> | undefined,
  ): Set<string> {
    const targets = new Set<string>();
    const searchNames = startingPackageNames.slice();

    while (searchNames.length) {
      const name = searchNames.pop()!;

      if (targets.has(name)) {
        continue;
      }

      const node = this.get(name);
      if (!node) {
        throw new Error(`Package '${name}' not found`);
      }

      targets.add(name);

      const collected = collectFn(node);
      if (collected) {
        searchNames.push(...collected);
      }
    }

    return targets;
  }

  /**
   * Lists all packages that have changed since a given git ref.
   *
   * @remarks
   *
   * If the `analyzeLockfile` option is set to true, the change detection will
   * also consider changes to the dependency management lockfile.
   */
  async listChangedPackages(options: {
    ref: string;
    analyzeLockfile?: boolean;
  }) {
    const changedFiles = await GitUtils.listChangedFiles(options.ref);

    const dirMap = new Map(
      Array.from(this.values()).map(pkg => [
        // relative from root, convert to posix, and add a / at the end
        path
          .relative(targetPaths.workspaceRootDir, pkg.dir)
          .split(path.sep)
          .join(path.posix.sep) + path.posix.sep,
        pkg,
      ]),
    );
    const packageDirs = Array.from(dirMap.keys());

    const result = new Array<PackageGraphNode>();
    let searchIndex = 0;

    changedFiles.sort();
    packageDirs.sort();

    for (const packageDir of packageDirs) {
      // Skip through changes that appear before our package dir
      while (
        searchIndex < changedFiles.length &&
        changedFiles[searchIndex] < packageDir
      ) {
        searchIndex += 1;
      }

      // Check if we arrived at a match, otherwise we move on to the next package dir
      if (changedFiles[searchIndex]?.startsWith(packageDir)) {
        searchIndex += 1;

        result.push(dirMap.get(packageDir)!);

        // Skip through the rest of the changed files for the same package
        while (changedFiles[searchIndex]?.startsWith(packageDir)) {
          searchIndex += 1;
        }
      }
    }

    const changedLockfiles = changedFiles.filter(file =>
      LOCKFILE_NAMES.includes(file),
    );
    if (changedLockfiles.length > 0 && options.analyzeLockfile) {
      // Load the lockfile in the working tree and the one at the ref and diff
      // them. Anything that prevents an accurate diff means that we can't tell
      // which packages are affected, so we assume that all of them are.
      let thisLockfile: Lockfile;
      let otherLockfile: Lockfile;
      let diff: LockfileDiff;
      try {
        const packageManager = await detectPackageManager();
        const lockfileName = packageManager.lockfileName();
        const otherName = changedLockfiles.find(name => name !== lockfileName);
        if (otherName) {
          throw new Error(
            `${otherName} does not belong to ${packageManager.name()}, which uses ${lockfileName}`,
          );
        }
        thisLockfile = await packageManager.loadLockfile();
        otherLockfile = await packageManager.parseLockfile(
          await GitUtils.readFileAtRef(lockfileName, options.ref),
          {
            // Workspace packages must be named from the same ref as the lockfile
            readWorkspacePackageJson: async dir => {
              try {
                return JSON.parse(
                  await GitUtils.readFileAtRef(
                    path.posix.join(dir, 'package.json'),
                    options.ref,
                  ),
                );
              } catch {
                return undefined;
              }
            },
          },
        );
        diff = thisLockfile.diff(otherLockfile);
      } catch (error) {
        console.warn(
          `Failed to diff lockfiles, assuming all packages have changed, ${error}`,
        );
        return Array.from(this.values());
      }

      // Create a simplified dependency graph only keeps track of package names
      const graph = thisLockfile.createSimplifiedDependencyGraph();

      // Merge the dependency graph from the other lockfile into this one in
      // order to be able to detect removals accurately.
      {
        const otherGraph = otherLockfile.createSimplifiedDependencyGraph();
        for (const [name, dependencies] of otherGraph) {
          const node = graph.get(name);
          if (node) {
            dependencies.forEach(d => node.add(d));
          } else {
            graph.set(name, dependencies);
          }
        }
      }

      // The check is simplified by only considering the package names rather
      // than the exact version range queries that were changed.
      // TODO(Rugvip): Use a more exact check
      const changedPackages = new Set(
        [...diff.added, ...diff.changed, ...diff.removed].map(e => e.name),
      );

      // Starting with our set of changed packages from the diff, we loop through
      // the full graph and add any package that has a dependency on a changed package.
      // We keep looping until all transitive dependencies have been detected.
      let changed = false;
      do {
        changed = false;
        for (const [name, dependencies] of graph) {
          if (changedPackages.has(name)) {
            continue;
          }
          for (const dep of dependencies) {
            if (changedPackages.has(dep)) {
              changed = true;
              changedPackages.add(name);
              break;
            }
          }
        }
      } while (changed);

      // Add all local packages that had a transitive dependency change to the result set
      for (const node of this.values()) {
        if (changedPackages.has(node.name) && !result.includes(node)) {
          result.push(node);
        }
      }
    }

    return result;
  }
}
