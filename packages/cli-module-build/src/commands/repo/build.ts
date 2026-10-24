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
import { cli } from 'cleye';
import { relative as relativePath } from 'node:path';
import { buildPackages, getOutputsForRole } from '../../lib/builder';
import { targetPaths } from '@backstage/cli-common';

import {
  BackstagePackage,
  PackageGraph,
  PackageRoles,
  runConcurrentTasks,
} from '@backstage/cli-node';
import { buildFrontend } from '../../lib/buildFrontend';
import { buildBackend } from '../../lib/buildBackend';
import { createScriptOptionsParser } from '../../lib/optionsParser';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { all, since, minify },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        all: {
          type: Boolean,
          description:
            'Build all packages, including bundled app and backend packages.',
        },
        since: {
          type: String,
          description:
            'Only build packages and their dev dependents that changed since the specified ref',
        },
        minify: {
          type: Boolean,
          description:
            'Minify the generated code. Does not apply to app package (app is minified by default).',
        },
      },
    },
    undefined,
    args,
  );

  let packages = await PackageGraph.listTargetPackages();

  const webpack = process.env.LEGACY_WEBPACK_BUILD
    ? (require('webpack') as typeof import('webpack'))
    : undefined;

  if (since) {
    const graph = PackageGraph.fromPackages(packages);
    const changedPackages = await graph.listChangedPackages({
      ref: since,
      analyzeLockfile: true,
    });
    const withDevDependents = graph.collectPackageNames(
      changedPackages.map(pkg => pkg.name),
      pkg => pkg.localDevDependents.keys(),
    );
    packages = Array.from(withDevDependents).map(name => graph.get(name)!);
  }

  const apps = new Array<BackstagePackage>();
  const backends = new Array<BackstagePackage>();

  const parseBuildScript = createScriptOptionsParser(['package', 'build'], {
    role: { type: 'string' },
    minify: { type: 'boolean' },
    'skip-build-dependencies': { type: 'boolean' },
    stats: { type: 'boolean' },
    config: { type: 'string', multiple: true },
    'module-federation': { type: 'boolean' },
  });

  const options = packages.flatMap(pkg => {
    const role =
      pkg.packageJson.backstage?.role ??
      PackageRoles.detectRoleFromPackage(pkg.packageJson);
    if (!role) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no role`);
      return [];
    }

    if (role === 'frontend') {
      apps.push(pkg);
      return [];
    } else if (role === 'backend') {
      backends.push(pkg);
      return [];
    }

    const outputs = getOutputsForRole(role);
    if (outputs.size === 0) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no output`);
      return [];
    }

    const buildOptions = parseBuildScript(pkg.packageJson.scripts?.build);
    if (!buildOptions) {
      console.warn(
        `Ignored ${pkg.packageJson.name} because it does not have a matching build script`,
      );
      return [];
    }

    return {
      targetDir: pkg.dir,
      packageJson: pkg.packageJson,
      outputs,
      logPrefix: `${chalk.cyan(
        relativePath(targetPaths.installationRootDir, pkg.dir),
      )}: `,
      workspacePackages: packages,
      minify: minify ?? Boolean(buildOptions.minify),
    };
  });

  console.log('Building packages');
  await buildPackages(options);

  if (all) {
    console.log('Building apps');
    await runConcurrentTasks({
      items: apps,
      concurrencyFactor: 1 / 2,
      worker: async pkg => {
        const buildOptions = parseBuildScript(pkg.packageJson.scripts?.build);
        if (!buildOptions) {
          console.warn(
            `Ignored ${pkg.packageJson.name} because it does not have a matching build script`,
          );
          return;
        }
        const configPaths = buildOptions.config;
        await buildFrontend({
          targetDir: pkg.dir,
          configPaths: Array.isArray(configPaths)
            ? (configPaths as string[])
            : [],
          writeStats: Boolean(buildOptions.stats),
          webpack,
        });
      },
    });

    console.log('Building backends');
    await runConcurrentTasks({
      items: backends,
      concurrencyFactor: 1 / 2,
      worker: async pkg => {
        const buildOptions = parseBuildScript(pkg.packageJson.scripts?.build);
        if (!buildOptions) {
          console.warn(
            `Ignored ${pkg.packageJson.name} because it does not have a matching build script`,
          );
          return;
        }
        await buildBackend({
          targetDir: pkg.dir,
          skipBuildDependencies: true,
          minify: minify ?? Boolean(buildOptions.minify),
        });
      },
    });
  }
};
