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

import { BackstagePackageJson, PackageGraph } from '@backstage/cli-node';
import { run, runOutput } from '@backstage/cli-common';
import chalk from 'chalk';
import { cli } from 'cleye';
import fs from 'fs-extra';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import {
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
} from 'node:path';

import { loadConfigSchema } from '@backstage/config-loader';
import { targetPaths } from '@backstage/cli-common';
import { buildFrontend } from '../../../lib/buildFrontend';
import {
  createDistWorkspace,
  packToDirectory,
  resolveLocalDependencies,
} from '../../../lib/packager';
import type { CliCommandContext } from '@backstage/cli-node';

interface BundleOptions {
  build: boolean;
  install: boolean;
  clean: boolean;
  verbose: boolean;
  outputDestination?: string;
  outputName?: string;
  prePackedDir?: string;
}

/**
 * Bundle a plugin for dynamic loading.
 *
 * This creates a self-contained plugin bundle that can be deployed independently
 * and loaded dynamically by a Backstage application. Supports both backend and
 * frontend plugins.
 *
 * For backend plugins, `createDistWorkspace` handles building (CJS) and packing
 * all local dependencies. The output is restructured so that the main plugin
 * sits at the bundle root and its local dependencies live under `embedded/`.
 * A lockfile is seeded, pruned, and used to install a private `node_modules`.
 *
 * For frontend plugins, a module federation remote build produces the final
 * assets. Only the main plugin is packed into the bundle root (no `embedded/`,
 * no lockfile, no `node_modules`).
 *
 * When `--pre-packed-dir` is provided, local dependencies are copied from a
 * pre-built dist workspace instead of calling `createDistWorkspace`:
 * - For backend plugins this is a performance optimization when many plugins from the same monorepo are being bundled.
 * - For frontend plugins it additionally enables lockfile generation (seed + prune) for dependency tracking purposes such as SBOM generation.
 * - The pre-built dist workspace is produced by
 *   `backstage-cli build-workspace <output-dir> [packages...] --alwaysPack`
 *   and `<output-dir>` is then passed as `--pre-packed-dir`.
 * - The `--alwaysPack` flag is required so that `workspace:^` and `backstage:^`
 *   dependency specs are resolved to concrete versions in the packed output.
 */
export async function bundleCommand(opts: BundleOptions): Promise<void> {
  const pkgJsonPath = targetPaths.resolve('package.json');
  const pkg = (await fs.readJson(pkgJsonPath)) as BackstagePackageJson;

  const outputDestination = opts.outputDestination
    ? resolvePath(opts.outputDestination)
    : targetPaths.dir;
  const mangledName = pkg.name.replace(/^@/, '').replace(/\//, '-');
  let bundleName = 'bundle';
  if (opts.outputName) {
    bundleName = opts.outputName;
  } else if (opts.outputDestination) {
    bundleName = mangledName;
  }
  const target = joinPath(outputDestination, bundleName);

  const role = pkg.backstage?.role;
  if (!role) {
    throw new Error(
      `Package ${chalk.cyan(
        pkg.name,
      )} does not have a backstage.role defined in package.json`,
    );
  }

  const validRoles = [
    'backend-plugin',
    'backend-plugin-module',
    'frontend-plugin',
    'frontend-plugin-module',
  ];
  if (!validRoles.includes(role)) {
    throw new Error(
      `Package ${chalk.cyan(pkg.name)} has role ${chalk.cyan(
        role,
      )}, but bundle command ` +
        `only supports: ${validRoles.map(r => chalk.cyan(r)).join(', ')}`,
    );
  }

  const pluginType: 'frontend' | 'backend' =
    role === 'frontend-plugin' || role === 'frontend-plugin-module'
      ? 'frontend'
      : 'backend';

  if (pkg.bundled) {
    throw new Error(
      `Package ${chalk.cyan(pkg.name)} has ${chalk.cyan(
        'bundled: true',
      )} which is not ` + `compatible with dynamic plugin bundling.`,
    );
  }

  console.log(
    chalk.blue(`Bundling ${chalk.cyan(pkg.name)} for dynamic loading...`),
  );
  console.log(`${chalk.dim('Output:')} ${chalk.cyan(target)}`);

  if (opts.clean) {
    console.log(chalk.blue(`Cleaning ${chalk.cyan(target)}`));
    await fs.remove(target);
  }

  await fs.mkdirs(target);

  await fs.writeFile(joinPath(target, '.gitignore'), '*\n');
  await fs.writeFile(joinPath(target, '.bundle-output'), '');

  const rootPkg = await fs.readJson(
    resolvePath(targetPaths.workspaceRootDir, 'package.json'),
  );

  // Backend plugins always need embedded packages, lockfile, and node_modules.
  // Frontend plugins need them only when --pre-packed-dir is provided.
  const needsDependencies = pluginType === 'backend' || !!opts.prePackedDir;

  // Establish the bundle directory as its own Yarn project root so that
  // the seeded yarn.lock is the one Yarn reads/writes, even when the
  // output directory is inside another monorepo.
  // Only needed when lockfile/install operations will run.
  if (needsDependencies) {
    const yarnrcLines = ['nodeLinker: node-modules'];
    try {
      // Include yarnPath so the same Yarn version that created the lockfile
      // is used for pruning/installing -- lockfile formats differ across
      // major Yarn versions (e.g. ~builtin vs optional!builtin patches).
      const resolved = await runOutput(['yarn', 'config', 'get', 'yarnPath'], {
        cwd: targetPaths.workspaceRootDir,
      });
      const yarnPathSentinels = new Set(['undefined', 'null']);
      if (resolved && !yarnPathSentinels.has(resolved)) {
        yarnrcLines.push(`yarnPath: ${resolved}`);
      }
    } catch {
      // yarnPath not configured — check if corepack manages the version instead
      if (!rootPkg.packageManager) {
        console.warn(
          chalk.yellow(
            'No yarnPath configured and no packageManager field found. ' +
              'The Yarn version in PATH will be used for lockfile operations.',
          ),
        );
      }
    }

    await fs.writeFile(
      joinPath(target, '.yarnrc.yml'),
      `${yarnrcLines.join('\n')}\n`,
    );
  }

  // ── Step 0 (frontend only): Module federation build ─────────────────
  if (pluginType === 'frontend' && opts.build) {
    console.log(chalk.blue('Building module federation remote...'));
    await buildFrontend({
      targetDir: targetPaths.dir,
      configPaths: [],
      writeStats: false,
      isModuleFederationRemote: true,
    });
  }

  const embeddedResolutions: Record<string, string> = {};

  // Detect previous bundle output directories inside the source package so
  // they can be stripped from the yarn-pack result later.  npm-packlist's
  // basename matching on the `files` field picks up identically-named entries
  // from prior bundle outputs, creating nested copies.
  const bundleOutputDirs: string[] = [];
  try {
    const entries = await fs.readdir(targetPaths.dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (
          await fs.pathExists(
            joinPath(targetPaths.dir, entry.name, '.bundle-output'),
          )
        ) {
          bundleOutputDirs.push(entry.name);
        }
      }
    }
  } catch {
    /* directory may not exist yet on first run */
  }

  if (needsDependencies) {
    // ── Step 1: Populate embedded packages ──────────────────────────────
    const embeddedDir = joinPath(target, 'embedded');
    let targets: { name: string; dir: string }[];

    if (opts.prePackedDir) {
      // ── Strategy A: Copy from pre-built dist workspace ───────────────
      // Reuses output from `backstage-cli build-workspace --alwaysPack`.
      // Works for both backend (performance optimization) and frontend
      // (enables lockfile generation for SBOM).
      const prePackedDir = resolvePath(opts.prePackedDir);
      console.log(
        chalk.blue(
          `Using pre-packed workspace at ${chalk.cyan(prePackedDir)}...`,
        ),
      );

      const packages = await PackageGraph.listTargetPackages();
      targets = await resolveLocalDependencies([pkg.name], packages);
      await fs.ensureDir(embeddedDir);

      for (const dep of targets) {
        const relDir = relativePath(targetPaths.workspaceRootDir, dep.dir);
        const srcDir = resolvePath(prePackedDir, relDir);
        const destDir = resolvePath(embeddedDir, relDir);
        if (await fs.pathExists(srcDir)) {
          await fs.copy(srcDir, destDir);
        } else {
          console.warn(
            chalk.yellow(
              `  Package ${chalk.cyan(dep.name)} not found in pre-packed ` +
                `dir (expected at ${chalk.cyan(relDir)})`,
            ),
          );
        }
      }
    } else {
      // ── Strategy B: createDistWorkspace ──────────────────────────────
      // Pack all local dependencies into a temp directory first, then
      // move the result into target/embedded/. We must NOT pack directly
      // into the target tree because yarn pack's basename-matching on the
      // `files` field would pick up identically-named files from
      // already-extracted embedded packages.
      const tempWorkspaceDir = await fs.mkdtemp(
        joinPath(tmpdir(), 'bundle-workspace-'),
      );
      console.log(chalk.blue('Packing local dependencies...'));

      const distLog = createStepLogger(
        joinPath(target, 'dist-workspace.log'),
        opts.verbose,
      );

      const packingPattern = /^(?:Moving|Repacking) (.+) into dist workspace$/;
      const distLogger = {
        log(msg: string) {
          const match = msg.match(packingPattern);
          if (match) {
            console.log(`  ${chalk.dim('Packing')} ${chalk.cyan(match[1])}`);
          }
          distLog.logger.log(msg);
        },
        warn(msg: string) {
          console.warn(`  ${chalk.yellow(msg)}`);
          distLog.logger.warn(msg);
        },
      };

      try {
        ({ targets } = await createDistWorkspace([pkg.name], {
          targetDir: tempWorkspaceDir,
          files: [],
          alwaysPack: true,
          buildDependencies: opts.build,
          buildExcludes: opts.build ? [] : undefined,
          logger: distLogger,
        }));
        await fs.remove(embeddedDir);
        await fs.move(tempWorkspaceDir, embeddedDir);
      } catch (err) {
        await distLog.close();
        await showLogOnError(distLog.path, opts.verbose);
        throw err;
      } finally {
        if (await fs.pathExists(tempWorkspaceDir)) {
          await fs.remove(tempWorkspaceDir);
        }
      }
      await distLog.close();
      await fs.remove(distLog.path);
    }

    // ── Step 2: Assemble embedded packages ──────────────────────────────
    const mainPluginRelDir = relativePath(
      targetPaths.workspaceRootDir,
      targetPaths.dir,
    );
    const mainPluginEmbeddedDir = resolvePath(embeddedDir, mainPluginRelDir);

    console.log(
      chalk.blue(
        `Moving main plugin ${chalk.cyan(pkg.name)} to bundle root...`,
      ),
    );

    if (!(await fs.pathExists(mainPluginEmbeddedDir))) {
      throw new Error(
        `Main plugin ${chalk.cyan(pkg.name)} was not found in the ` +
          `embedded workspace at ${chalk.cyan(mainPluginRelDir)}. ` +
          `Ensure the pre-packed workspace includes this plugin.`,
      );
    }

    const mainPluginEntries = await fs.readdir(mainPluginEmbeddedDir);
    for (const entry of mainPluginEntries) {
      await fs.move(
        joinPath(mainPluginEmbeddedDir, entry),
        joinPath(target, entry),
        { overwrite: true },
      );
    }

    await fs.remove(mainPluginEmbeddedDir);

    // For frontend plugins, the pre-packed dist/ contains standard CJS
    // output, not Module Federation artifacts.  Overlay the MF build
    // output from the source directory (produced by Step 0).
    if (pluginType === 'frontend') {
      const sourceDist = resolvePath(targetPaths.dir, 'dist');
      if (await fs.pathExists(sourceDist)) {
        await fs.copy(sourceDist, joinPath(target, 'dist'), {
          overwrite: true,
        });
      }
    }

    const localDeps = targets.filter(t => t.name !== pkg.name);

    for (const dep of localDeps) {
      const depRelDir = relativePath(targetPaths.workspaceRootDir, dep.dir);
      const depEmbeddedDir = resolvePath(embeddedDir, depRelDir);

      if (!(await fs.pathExists(depEmbeddedDir))) {
        continue;
      }

      embeddedResolutions[dep.name] = `file:./embedded/${depRelDir}`;
    }

    if (Object.keys(embeddedResolutions).length === 0) {
      await fs.remove(embeddedDir);
    }
  } else {
    // ── Step 1b: Pack main plugin only ──────────────────────────────────
    // Frontend plugins without --pre-packed-dir don't need transitive
    // local deps -- just pack the main plugin directly into the bundle root.
    console.log(chalk.blue(`Packing main plugin ${chalk.cyan(pkg.name)}...`));

    const distLog = createStepLogger(
      joinPath(target, 'dist-workspace.log'),
      opts.verbose,
    );

    try {
      await packToDirectory({
        packageDir: targetPaths.dir,
        packageName: pkg.name,
        targetDir: target,
        logger: distLog.logger,
      });
    } catch (err) {
      await distLog.close();
      await showLogOnError(distLog.path, opts.verbose);
      throw err;
    }
    await distLog.close();
    await fs.remove(distLog.path);
  }

  // Remove any previous bundle output directories that were erroneously
  // included by yarn pack (npm-packlist's basename matching on the `files`
  // field picks up identically-named entries from prior bundle outputs).
  for (const dir of bundleOutputDirs) {
    const nestedPath = joinPath(target, dir);
    if (await fs.pathExists(nestedPath)) {
      await fs.remove(nestedPath);
    }
  }

  // Remove src/ directory included by yarn pack because prepack's
  // rewriteEntryPoints cannot rewrite main/types away from src/ paths
  // when the standard dist output files are absent (MF builds).
  // Skip if the package explicitly ships src/ via the "files" field.
  if (pluginType === 'frontend') {
    const srcExplicitlyIncluded = (pkg.files ?? []).some(
      f => f === 'src' || f.startsWith('src/'),
    );
    if (!srcExplicitlyIncluded) {
      const srcPath = joinPath(target, 'src');
      if (await fs.pathExists(srcPath)) {
        await fs.remove(srcPath);
      }
    }
  }

  // ── Step 3: Config schema ────────────────────────────────────────────
  console.log(chalk.blue('Filtering config schema...'));

  const schemaPath = resolvePath(target, 'dist', '.config-schema.json');
  let schemas: Array<{ packageName: string }> = [];

  if (pluginType === 'frontend' && (await fs.pathExists(schemaPath))) {
    const existing = await fs.readJson(schemaPath);
    schemas = existing.schemas ?? [];
  } else {
    const configSchema = await loadConfigSchema({
      dependencies: [],
      packagePaths: ['package.json'],
      onSchemaError: error => console.warn(error.message),
    });
    const serialized = configSchema.serialize() as {
      schemas: typeof schemas;
    };
    schemas = serialized.schemas ?? [];
  }

  let schemaWritten = false;
  if (schemas.length > 0) {
    const filtered = filterBundleConfigSchemas(schemas, targetPaths.dir);
    if (filtered.length > 0) {
      await fs.ensureDir(resolvePath(target, 'dist'));
      await fs.writeJson(
        schemaPath,
        { backstageConfigSchemaVersion: 1, schemas: filtered },
        { spaces: 2 },
      );
      schemaWritten = true;
    } else {
      console.log(
        chalk.dim('  No config schemas found for this plugin bundle'),
      );
    }
  } else {
    console.log(chalk.dim('  No config schemas found for this plugin bundle'));
  }

  // ── Step 4: Post-process package.json ────────────────────────────────
  console.log(
    chalk.blue(
      `Customizing ${chalk.cyan('package.json')} for dynamic loading...`,
    ),
  );

  const targetPkgPath = resolvePath(target, 'package.json');
  const targetPkg = await fs.readJson(targetPkgPath);

  postProcessBundlePackageJson(
    targetPkg,
    target,
    pluginType,
    needsDependencies ? rootPkg?.resolutions : undefined,
    embeddedResolutions,
    needsDependencies,
  );

  if (schemaWritten) {
    targetPkg.configSchema = 'dist/.config-schema.json';
  }

  await fs.writeJson(targetPkgPath, targetPkg, { spaces: 2 });

  // ── Step 5: Seed lockfile, prune, & install ──────────────────────────
  // Runs for backend plugins (always) and frontend plugins with
  // --pre-packed-dir (for SBOM lockfile generation).
  if (needsDependencies) {
    await seedBundleLockfile(
      target,
      targetPaths.dir,
      targetPaths.workspaceRootDir,
    );

    const sourceCacheFolder = await runOutput(
      ['yarn', 'config', 'get', 'cacheFolder'],
      { cwd: targetPaths.workspaceRootDir },
    );
    await pruneBundleLockfile(target, opts.verbose, sourceCacheFolder);

    if (pluginType === 'backend') {
      if (opts.install) {
        await installBundleDependencies(target, opts.verbose);

        // Clean up .yarn directory created during install
        const yarnDir = joinPath(target, '.yarn');
        if (await fs.pathExists(yarnDir)) {
          await fs.remove(yarnDir);
        }

        console.log(chalk.blue('Validating plugin entry points...'));

        // Temporarily patch module resolution so the plugin can resolve
        // itself by name (needed by resolvePackagePath at module load
        // time, e.g. for database migration paths). At runtime this is
        // handled by CommonJSModuleLoader in backend-dynamic-feature-service.
        const NodeModule =
          require('node:module') as typeof import('node:module') & {
            _resolveFilename: Function;
          };
        const origResolveFilename = NodeModule._resolveFilename;
        NodeModule._resolveFilename = (request: string, ...args: any[]) => {
          if (request === `${targetPkg.name}/package.json`) {
            return resolvePath(target, 'package.json');
          }
          return origResolveFilename(request, ...args);
        };

        try {
          const pluginRequire = createRequire(`${target}/package.json`);
          const mainModule = pluginRequire(target);
          const alphaPath = resolvePath(target, 'alpha');
          const alphaModule = (await fs.pathExists(alphaPath))
            ? pluginRequire(alphaPath)
            : undefined;

          const isBackendFeature = (v: unknown) =>
            !!v &&
            (typeof v === 'object' || typeof v === 'function') &&
            (v as { $$type?: string }).$$type === '@backstage/BackendFeature';

          const hasValidExport = [mainModule, alphaModule]
            .filter(Boolean)
            .some(m => isBackendFeature(m?.default));

          if (!hasValidExport) {
            throw new Error(
              `Backend plugin is not valid for dynamic loading: ` +
                `it must export a ${chalk.cyan(
                  'BackendFeature',
                )} as default export`,
            );
          }
        } finally {
          NodeModule._resolveFilename = origResolveFilename;
        }
      } else {
        console.log(
          chalk.yellow(
            'Skipping dependency installation and validation. ' +
              'Run without --no-install to validate the bundle.',
          ),
        );
      }
    }
  }

  console.log(chalk.green(`Bundle created at ${chalk.cyan(target)}`));
}

/**
 * Mutates `targetPkg` in place to prepare it for dynamic plugin loading:
 * clears scripts/devDependencies, applies plugin-type-specific adjustments
 * (MF entry points for frontend, bundleDependencies for backend), and merges
 * root + embedded resolutions when a lockfile is involved.
 */
export function postProcessBundlePackageJson(
  targetPkg: Record<string, unknown>,
  targetDir: string,
  pluginType: 'frontend' | 'backend',
  rootResolutions: Record<string, string> | undefined,
  embeddedResolutions: Record<string, string>,
  needsDependencies: boolean,
): void {
  targetPkg.scripts = {};
  targetPkg.devDependencies = {};

  if (pluginType === 'frontend') {
    targetPkg.main = './dist/remoteEntry.js';

    const mfTypesIndex = resolvePath(
      targetDir,
      'dist',
      '@mf-types',
      'index.d.ts',
    );
    if (fs.pathExistsSync(mfTypesIndex)) {
      targetPkg.types = './dist/@mf-types/index.d.ts';
    } else {
      delete targetPkg.types;
    }

    delete targetPkg.exports;
    delete targetPkg.module;
    delete targetPkg.typesVersions;
  } else if (pluginType === 'backend') {
    targetPkg.bundleDependencies = true;
  }

  if (needsDependencies) {
    const patchVersionPattern = /^patch:.+@npm%3A([^#]+)#/;
    const stripped: Record<string, string> = {};
    if (rootResolutions) {
      for (const [key, value] of Object.entries(rootResolutions)) {
        if (typeof value !== 'string') {
          continue;
        }
        const patchMatch = value.match(patchVersionPattern);
        stripped[key] = patchMatch ? patchMatch[1] : value;
      }
    }

    targetPkg.resolutions = {
      ...stripped,
      ...(targetPkg.resolutions as Record<string, string> | undefined),
      ...embeddedResolutions,
    };
  }
}

/**
 * Seeds the bundle's yarn.lock from the source plugin or monorepo lockfile.
 * Looks first for a local yarn.lock in the plugin directory, then falls back
 * to the monorepo root.
 */
async function seedBundleLockfile(
  targetDir: string,
  pluginDir: string,
  monorepoRoot: string,
): Promise<void> {
  let sourceYarnLock: string | undefined;
  if (await fs.pathExists(joinPath(pluginDir, 'yarn.lock'))) {
    sourceYarnLock = joinPath(pluginDir, 'yarn.lock');
  } else if (await fs.pathExists(joinPath(monorepoRoot, 'yarn.lock'))) {
    sourceYarnLock = joinPath(monorepoRoot, 'yarn.lock');
  }

  if (!sourceYarnLock) {
    throw new Error(
      `Could not find a ${chalk.cyan(
        'yarn.lock',
      )} file in either the plugin directory or the monorepo root (${chalk.cyan(
        monorepoRoot,
      )})`,
    );
  }

  const isMonorepoLock = sourceYarnLock === joinPath(monorepoRoot, 'yarn.lock');
  console.log(
    chalk.blue(
      `Seeding bundle ${chalk.cyan('yarn.lock')} from source plugin${
        isMonorepoLock ? ' monorepo' : ''
      } lockfile...`,
    ),
  );

  await fs.copyFile(sourceYarnLock, resolvePath(targetDir, 'yarn.lock'));
}

/**
 * Prunes the bundle's yarn.lock to remove entries not required by the
 * bundle's package.json. Runs offline to avoid network access.
 */
async function pruneBundleLockfile(
  targetDir: string,
  verbose: boolean,
  sourceCacheFolder: string,
): Promise<void> {
  console.log(
    chalk.blue(
      `Pruning bundle ${chalk.cyan(
        'yarn.lock',
      )} to remove unused dependencies...`,
    ),
  );

  const pruneLog = createStepLogger(
    joinPath(targetDir, 'lockfile-prune.log'),
    verbose,
    '[lockfile-prune] ',
  );
  try {
    await run(
      ['yarn', 'install', '--no-immutable', '--mode', 'update-lockfile'],
      {
        cwd: targetDir,
        env: {
          YARN_ENABLE_GLOBAL_CACHE: 'false',
          YARN_ENABLE_NETWORK: '0',
          YARN_ENABLE_MIRROR: 'false',
          YARN_CACHE_FOLDER: sourceCacheFolder,
        },
        onStdout: pruneLog.logRunOutput('out'),
        onStderr: pruneLog.logRunOutput('err'),
      },
    ).waitForExit();
  } catch (err) {
    await pruneLog.close();
    await showLogOnError(pruneLog.path, verbose);
    throw err;
  }
  await pruneLog.close();
  await fs.remove(pruneLog.path);
}

/**
 * Installs the bundle's dependencies using an immutable lockfile.
 * This creates the node_modules directory needed for backend plugin runtime.
 */
async function installBundleDependencies(
  targetDir: string,
  verbose: boolean,
): Promise<void> {
  console.log(chalk.blue('Installing private dependencies...'));

  const installLog = createStepLogger(
    joinPath(targetDir, 'yarn-install.log'),
    verbose,
    '[yarn-install] ',
  );
  try {
    await run(['yarn', 'install', '--immutable'], {
      cwd: targetDir,
      onStdout: installLog.logRunOutput('out'),
      onStderr: installLog.logRunOutput('err'),
    }).waitForExit();
  } catch (err) {
    await installLog.close();
    await showLogOnError(installLog.path, verbose);
    throw err;
  }
  await installLog.close();
  await fs.remove(installLog.path);
}

/**
 * Filters config schemas to keep only those belonging to the plugin's own
 * family: the plugin itself, same-pluginId libraries, third-party packages,
 * and recursively any directly-depended plugin/module (wrapper scenario).
 */
export function filterBundleConfigSchemas(
  schemas: { packageName: string }[],
  pluginDir: string,
): { packageName: string }[] {
  const PLUGIN_OR_MODULE_ROLES = new Set([
    'backend-plugin',
    'backend-plugin-module',
    'frontend-plugin',
    'frontend-plugin-module',
  ]);
  const LIBRARY_ROLES = new Set([
    'node-library',
    'common-library',
    'web-library',
  ]);

  const allowed = new Set<string>();
  const visited = new Set<string>();
  const localRequire = createRequire(resolvePath(pluginDir, 'package.json'));

  function walk(pkg: BackstagePackageJson) {
    if (visited.has(pkg.name)) {
      return;
    }
    visited.add(pkg.name);
    allowed.add(pkg.name);

    const pluginId = pkg.backstage?.pluginId;

    for (const depName of Object.keys(pkg.dependencies ?? {})) {
      let depPkgPath: string;
      try {
        depPkgPath = localRequire.resolve(`${depName}/package.json`);
      } catch {
        continue;
      }

      let depPkg: BackstagePackageJson;
      try {
        depPkg = fs.readJsonSync(depPkgPath);
      } catch {
        continue;
      }

      const depRole = depPkg.backstage?.role;

      if (!depPkg.backstage) {
        allowed.add(depName);
        continue;
      }

      if (depRole && PLUGIN_OR_MODULE_ROLES.has(depRole)) {
        walk(depPkg);
        continue;
      }

      if (
        depRole &&
        LIBRARY_ROLES.has(depRole) &&
        pluginId &&
        depPkg.backstage?.pluginId === pluginId
      ) {
        allowed.add(depName);
        continue;
      }
    }
  }

  let rootPkg: BackstagePackageJson;
  try {
    rootPkg = fs.readJsonSync(resolvePath(pluginDir, 'package.json'));
  } catch {
    return [];
  }
  walk(rootPkg);

  return schemas.filter(s => allowed.has(s.packageName));
}

const ansiPattern =
  // eslint-disable-next-line no-control-regex
  /[\x1b\x9b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><~]|\x1b]8;;[^\x07\x1b]*(?:\x07|\x1b\\)/g;
function stripAnsi(str: string): string {
  return str.replace(ansiPattern, '');
}

function createStepLogger(
  logFilePath: string,
  verbose: boolean,
  prefix?: string,
) {
  const logStream = fs.createWriteStream(logFilePath);

  const writeLine = (line: string, stream: 'out' | 'err') => {
    const prefixed = prefix ? `${prefix}${line}` : line;
    logStream.write(
      `${stream === 'err' ? '[WARN] ' : ''}${stripAnsi(prefixed)}\n`,
    );
    if (verbose) {
      const writer = stream === 'err' ? console.warn : console.log;
      writer(chalk.dim(prefixed));
    }
  };

  const logger = {
    log(msg: string) {
      writeLine(msg, 'out');
    },
    warn(msg: string) {
      writeLine(msg, 'err');
    },
  };

  const logRunOutput = (stream: 'out' | 'err') => (data: Buffer) => {
    if (prefix) {
      for (const line of data.toString('utf8').split(/\r?\n/)) {
        if (line) writeLine(line, stream);
      }
    } else {
      logStream.write(
        `${stream === 'err' ? '[WARN] ' : ''}${stripAnsi(
          data.toString('utf8'),
        )}`,
      );
      if (verbose) {
        const writer = stream === 'err' ? console.warn : console.log;
        writer(chalk.dim(data.toString('utf8')));
      }
    }
  };

  const close = () => new Promise<void>(r => logStream.end(r));

  return { logger, logRunOutput, close, path: logFilePath };
}

async function showLogOnError(
  logFilePath: string,
  verbose: boolean,
): Promise<void> {
  console.error(
    chalk.red(`\nFull log available at: ${chalk.cyan(logFilePath)}`),
  );
  if (!verbose) {
    try {
      const content = await fs.readFile(logFilePath, 'utf8');
      const tail = content.split('\n').slice(-20).join('\n');
      if (tail) {
        console.error(chalk.dim('\n--- last 20 lines ---'));
        console.error(tail);
      }
    } catch {
      /* log file may not exist yet */
    }
  }
}

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: {
      outputDestination,
      outputName,
      clean,
      noBuild,
      noInstall,
      verbose,
      prePackedDir,
    },
  } = cli(
    {
      name: info.usage,
      flags: {
        outputDestination: {
          type: String,
          description:
            'Directory in which the bundle subdirectory is created. ' +
            'Defaults to the current package directory.',
        },
        outputName: {
          type: String,
          description:
            'Name of the bundle subdirectory. ' +
            'Defaults to "bundle" when output stays in the package directory, ' +
            'or to the mangled package name (e.g. myorg-plugin-foo) when ' +
            '--output-destination is specified.',
        },
        clean: {
          type: Boolean,
          description: 'Clean the output directory before bundling',
        },
        noBuild: {
          type: Boolean,
          description:
            'Skip building packages (assumes they are already built)',
        },
        noInstall: {
          type: Boolean,
          description:
            'Skip dependency installation and entrypoint validation.',
        },
        verbose: {
          type: Boolean,
          description:
            'Stream detailed output from internal steps (build, pack, install) to the console. ' +
            'Without this flag, output is captured to per-step log files and only shown on error.',
        },
        prePackedDir: {
          type: String,
          description:
            'Path to a pre-built dist workspace (from build-workspace --alwaysPack). ' +
            'Skips local dependency packing and uses pre-packed packages directly. ' +
            'For frontend plugins, this also enables yarn.lock generation for SBOM.',
        },
      },
    },
    undefined,
    args,
  );

  return bundleCommand({
    build: !noBuild,
    install: !noInstall,
    clean: Boolean(clean),
    verbose: Boolean(verbose),
    outputDestination: outputDestination ?? undefined,
    outputName: outputName ?? undefined,
    prePackedDir: prePackedDir ?? undefined,
  });
};
