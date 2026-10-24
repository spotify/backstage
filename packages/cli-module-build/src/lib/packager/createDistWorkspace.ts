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

import chalk from 'chalk';
import fs from 'fs-extra';
import {
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
} from 'node:path';
import { tmpdir } from 'node:os';
import * as tar from 'tar';
import partition from 'lodash/partition';

import { targetPaths } from '@backstage/cli-common';
import { computeTopologicalLayers } from './computeTopologicalLayers';
import {
  dependencies as cliDependencies,
  devDependencies as cliDevDependencies,
} from '../../../package.json';
import {
  BuildOptions,
  buildPackages,
  getOutputsForRole,
  Output,
} from '../builder';
import { compilePackageConfigSchemas, productionPack } from './productionPack';
import {
  BackstagePackage,
  PackageRoles,
  PackageGraph,
  PackageGraphNode,
  runConcurrentTasks,
} from '@backstage/cli-node';
import {
  detectPackageManager,
  PackageManager,
} from '@backstage/cli-node/alpha';
import { createTypeDistProject } from '../typeDistProject';
import {
  preparePnpmDistWorkspace,
  restorePnpmDependencyRanges,
} from './pnpmDistWorkspace';

// These packages aren't safe to pack in parallel since the CLI depends on them
const UNSAFE_PACKAGES = [
  ...Object.keys(cliDependencies),
  ...Object.keys(cliDevDependencies),
];

type FileEntry =
  | string
  | {
      src: string;
      dest: string;
    };

type Options = {
  /**
   * Target directory for the dist workspace, defaults to a temporary directory
   */
  targetDir?: string;

  /**
   * Configuration files to load during packaging.
   */
  configPaths?: string[];

  /**
   * Files to copy into the target workspace.
   *
   * Defaults to the lockfile of the package manager and 'package.json', along
   * with 'pnpm-workspace.yaml' for pnpm workspaces.
   */
  files?: FileEntry[];

  /**
   * If set to true, the target packages are built before they are packaged into the workspace.
   */
  buildDependencies?: boolean;

  /**
   * When `buildDependencies` is set, this list of packages will not be built even if they are dependencies.
   */
  buildExcludes?: string[];

  /**
   * If set, creates a skeleton tarball that contains all package.json files
   * with the same structure as the workspace dir. For pnpm workspaces it also
   * contains the lockfile, `pnpm-workspace.yaml`, and the patch files and
   * pnpmfile that the install needs.
   */
  skeleton?: 'skeleton.tar' | 'skeleton.tar.gz';

  /**
   * If set to true, the pack command of the package manager is always
   * preferred when creating the dist workspace. This ensures correct workspace
   * output at significant cost to command performance.
   */
  alwaysPack?: boolean;

  /**
   * If set to true, the TypeScript feature detection will be enabled, which
   * annotates the package exports field with the `backstage` export type.
   */
  enableFeatureDetection?: boolean;

  /**
   * If set to true, the generated code will be minified.
   */
  minify?: boolean;

  /**
   * Optional logger to route console output through. When not provided,
   * output goes to `console.log` / `console.warn` as before.
   */
  logger?: {
    log(msg: string): void;
    warn(msg: string): void;
  };
};

function prefixLogFunc(prefix: string, logFn: (msg: string) => void) {
  return (data: Buffer) => {
    for (const line of data.toString('utf8').split(/\r?\n/)) {
      if (line) logFn(`${prefix}${line}`);
    }
  };
}

/**
 * Uses the pack command of the package manager to package local packages and
 * unpacks them into a dist workspace.
 * The target workspace will end up containing dist version of each package and
 * will be suitable for packaging e.g. into a docker image.
 *
 * This creates a structure that is functionally similar to if the packages were
 * installed from npm, but uses the package manager workspaces to link to them
 * at runtime.
 */
export async function createDistWorkspace(
  packageNames: string[],
  options: Options = {},
) {
  const logger = options.logger ?? { log: console.log, warn: console.warn };
  const packageManager = await detectPackageManager();

  const targetDir =
    options.targetDir ??
    (await fs.mkdtemp(resolvePath(tmpdir(), 'dist-workspace')));

  const packages = await PackageGraph.listTargetPackages();
  const targets = await resolveLocalDependencies(packageNames, packages);

  if (options.buildDependencies) {
    const exclude = options.buildExcludes ?? [];
    const configPaths = options.configPaths ?? [];

    const toBuild = new Set(
      targets.map(_ => _.name).filter(name => !exclude.includes(name)),
    );

    const standardBuilds = new Array<BuildOptions>();
    const customBuild = new Array<{
      dir: string;
      name: string;
      args?: string[];
    }>();

    for (const pkg of packages) {
      if (!toBuild.has(pkg.packageJson.name)) {
        continue;
      }
      const role = pkg.packageJson.backstage?.role;
      if (!role) {
        logger.warn(
          `Building ${pkg.packageJson.name} separately because it has no role`,
        );
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name });
        continue;
      }

      const buildScript = pkg.packageJson.scripts?.build;
      if (!buildScript) {
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name });
        continue;
      }

      if (!buildScript.startsWith('backstage-cli package build')) {
        logger.warn(
          `Building ${pkg.packageJson.name} separately because it has a custom build script, '${buildScript}'`,
        );
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name });
        continue;
      }

      if (PackageRoles.getRoleInfo(role).output.includes('bundle')) {
        logger.warn(
          `Building ${pkg.packageJson.name} separately because it is a bundled package`,
        );
        const args = buildScript.includes('--config')
          ? []
          : configPaths.map(p => ['--config', p]).flat();
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name, args });
        continue;
      }

      const outputs = getOutputsForRole(role);

      // No need to build and include types in the production runtime
      outputs.delete(Output.types);

      if (outputs.size > 0) {
        standardBuilds.push({
          targetDir: pkg.dir,
          packageJson: pkg.packageJson,
          outputs: outputs,
          logPrefix: `${chalk.cyan(
            relativePath(targetPaths.workspaceRootDir, pkg.dir),
          )}: `,
          minify: options.minify,
          workspacePackages: packages,
        });
      }
    }

    await buildPackages(standardBuilds);

    if (customBuild.length > 0) {
      await runConcurrentTasks({
        items: customBuild,
        worker: async ({ name, dir, args }) => {
          await packageManager.runScript('build', args, {
            cwd: dir,
            onStdout: prefixLogFunc(`${name}: `, logger.log),
            onStderr: prefixLogFunc(`${name}: `, logger.warn),
          });
        },
      });
    }
  }

  const isPnpm = packageManager.name() === 'pnpm';
  await moveToDistWorkspace(
    targetDir,
    targets,
    Boolean(options.alwaysPack),
    Boolean(options.enableFeatureDetection),
    isPnpm,
    logger,
  );

  const files: FileEntry[] =
    options.files ?? (await getDefaultWorkspaceFiles(packageManager, logger));

  for (const file of files) {
    const src = typeof file === 'string' ? file : file.src;
    const dest = typeof file === 'string' ? file : file.dest;
    await fs.copy(
      targetPaths.resolveWorkspaceRoot(src),
      resolvePath(targetDir, dest),
    );
  }

  // With pnpm, the skeleton also gets the lockfile and the files that the
  // install reads, since the dist workspace has its own version of them
  const installFiles =
    isPnpm && !options.files
      ? await preparePnpmDistWorkspace({
          workspaceRootDir: targetPaths.workspaceRootDir,
          targetDir,
          bundledPackageDirs: targets
            .filter(target => target.packageJson.bundled)
            .map(target =>
              relativePath(targetPaths.workspaceRootDir, target.dir),
            ),
        })
      : [];

  if (options.skeleton) {
    const skeletonFiles = [
      ...targets.map(target => {
        const dir = relativePath(targetPaths.workspaceRootDir, target.dir);
        return joinPath(dir, 'package.json');
      }),
      ...installFiles,
    ].sort();

    await tar.create(
      {
        file: resolvePath(targetDir, options.skeleton),
        cwd: targetDir,
        portable: true,
        noMtime: true,
        gzip: options.skeleton.endsWith('.gz'),
      },
      skeletonFiles,
    );
  }

  return { targetDir, targets };
}

/**
 * The files that are copied into the dist workspace when none are given. A
 * missing lockfile is skipped with a warning, since the commands that create
 * a dist workspace do not require one.
 */
export async function getDefaultWorkspaceFiles(
  packageManager: Pick<PackageManager, 'name' | 'lockfileName'>,
  logger: { warn(msg: string): void },
): Promise<FileEntry[]> {
  const files: FileEntry[] = ['package.json'];
  const lockfile = packageManager.lockfileName();
  if (await fs.pathExists(targetPaths.resolveWorkspaceRoot(lockfile))) {
    files.unshift(lockfile);
  } else {
    logger.warn(
      `There is no ${lockfile} in the workspace root, so the dist workspace has no lockfile and cannot be installed from one`,
    );
  }
  // pnpm reads the workspace packages and its settings from this file
  if (
    packageManager.name() === 'pnpm' &&
    (await fs.pathExists(
      targetPaths.resolveWorkspaceRoot('pnpm-workspace.yaml'),
    ))
  ) {
    files.push('pnpm-workspace.yaml');
  }
  return files;
}

const FAST_PACK_SCRIPTS = [
  undefined,
  'backstage-cli prepack',
  'backstage-cli package prepack',
];

/**
 * Runs the pack command of the package manager on a single package and
 * extracts the resulting tarball into `targetDir`. This resolves `workspace:^`
 * and `backstage:^` dependency specs to concrete versions, which Yarn does
 * through its `beforeWorkspacePacking` hook.
 */
export async function packToDirectory(options: {
  packageDir: string;
  packageName: string;
  targetDir: string;
  archivePath?: string;
  logger: { log(msg: string): void; warn(msg: string): void };
}): Promise<void> {
  const { packageDir, packageName, targetDir, logger } = options;
  const archivePath =
    options.archivePath ?? resolvePath(targetDir, 'temp-archive.tgz');
  const prefix = `${packageName} [pack]: `;

  await fs.ensureDir(targetDir);
  const packageManager = await detectPackageManager();
  await packageManager.pack(archivePath, packageDir, {
    onStdout: prefixLogFunc(prefix, logger.log),
    onStderr: prefixLogFunc(prefix, logger.warn),
  });

  await tar.extract({ file: archivePath, cwd: targetDir, strip: 1 });
  await fs.remove(archivePath);
}

async function moveToDistWorkspace(
  workspaceDir: string,
  localPackages: PackageGraphNode[],
  alwaysPack: boolean,
  enableFeatureDetection: boolean,
  isPnpm: boolean,
  logger: { log(msg: string): void; warn(msg: string): void },
): Promise<void> {
  const [fastPackPackages, slowPackPackages] = partition(
    localPackages,
    pkg =>
      !alwaysPack &&
      FAST_PACK_SCRIPTS.includes(pkg.packageJson.scripts?.prepack),
  );

  const configSchemas = await compilePackageConfigSchemas(fastPackPackages, {
    onSchemaError: error => logger.warn(error.message),
  });
  const featureDetectionProject =
    fastPackPackages.length > 0 && enableFeatureDetection
      ? await createTypeDistProject(
          fastPackPackages.map(pkg => ({
            dir: pkg.dir,
            role: pkg.packageJson.backstage?.role,
          })),
        )
      : undefined;

  // New an improved flow where we avoid calling the pack command
  await Promise.all(
    fastPackPackages.map(async target => {
      logger.log(`Moving ${target.name} into dist workspace`);

      const outputDir = relativePath(targetPaths.workspaceRootDir, target.dir);
      const absoluteOutputPath = resolvePath(workspaceDir, outputDir);
      await productionPack({
        packageDir: target.dir,
        targetDir: absoluteOutputPath,
        configSchema: configSchemas.get(target.name),
        featureDetectionProject,
      });
    }),
  );

  // Old flow is below, which calls the pack command and extracts the tarball

  let archiveIndex = 0;

  async function pack(
    target: PackageGraphNode,
    archive: string = `temp-package-${archiveIndex++}.tgz`,
  ) {
    logger.log(`Repacking ${target.name} into dist workspace`);

    const absoluteOutputPath = resolvePath(
      workspaceDir,
      relativePath(targetPaths.workspaceRootDir, target.dir),
    );
    await packToDirectory({
      packageDir: target.dir,
      packageName: target.name,
      targetDir: absoluteOutputPath,
      archivePath: resolvePath(workspaceDir, archive),
      logger,
    });

    // We remove the dependencies from package.json of packages that are marked
    // as bundled, so that yarn doesn't try to install them.
    if (target.packageJson.bundled) {
      const pkgJson = await fs.readJson(
        resolvePath(absoluteOutputPath, 'package.json'),
      );
      delete pkgJson.dependencies;
      delete pkgJson.devDependencies;
      delete pkgJson.peerDependencies;
      delete pkgJson.optionalDependencies;

      await fs.writeJson(
        resolvePath(absoluteOutputPath, 'package.json'),
        pkgJson,
        {
          spaces: 2,
        },
      );
    } else if (isPnpm) {
      // pnpm pack replaces workspace and catalog ranges with versions, which
      // no longer match the lockfile. pnpm would also look the versions of
      // workspace packages up in the registry instead of linking them.
      await restorePnpmDependencyRanges(
        resolvePath(absoluteOutputPath, 'package.json'),
        target.packageJson,
      );
    }
  }

  const [unsafePackages, safePackages] = partition(slowPackPackages, p =>
    UNSAFE_PACKAGES.includes(p.name),
  );

  // The unsafe package are packed first one by one in order to avoid race conditions
  // where the CLI is being executed with broken dependencies.
  for (const target of unsafePackages) {
    await pack(target, `temp-package.tgz`);
  }

  // Pack safe packages in topological layers so that a package is never
  // packed concurrently with its own dependencies. `yarn pack` temporarily
  // rewrites each package's package.json to resolve workspace:^ references;
  // packing a package while a dependency's manifest is mid-rewrite causes
  // intermittent "No local workspace found for this range" failures.
  const layers = computeTopologicalLayers(safePackages);
  for (const layer of layers) {
    await runConcurrentTasks({
      items: layer,
      worker: pack,
    });
  }
}

/**
 * Resolves the full set of local (workspace) packages that the given
 * package names transitively depend on via `publishedLocalDependencies`.
 * Packages marked as `bundled` have their own dependencies excluded.
 *
 * This is the same traversal that `createDistWorkspace` performs internally.
 * Callers must supply the monorepo package list obtained from
 * `PackageGraph.listTargetPackages()`.
 */
export async function resolveLocalDependencies(
  packageNames: string[],
  packages: BackstagePackage[],
): Promise<PackageGraphNode[]> {
  const packageGraph = PackageGraph.fromPackages(packages);
  const targetNames = packageGraph.collectPackageNames(packageNames, node => {
    // Don't include dependencies of packages that are marked as bundled
    if (node.packageJson.bundled) {
      return undefined;
    }

    return node.publishedLocalDependencies.keys();
  });
  return Array.from(targetNames).map(name => packageGraph.get(name)!);
}
