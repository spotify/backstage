/*
 * Copyright 2024 The Backstage Authors
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

import { ModuleFederationRemoteOptions } from './types';
import { BackstagePackageJson } from '@backstage/cli-node';
import { readEntryPoints } from '../entryPoints';
import {
  createTypeDistProject,
  getEntryPointDefaultFeatureType,
} from '../typeDistProject';
import {
  BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL,
  defaultRemoteSharedDependencies,
  defaultHostSharedDependencies,
  HostSharedDependencies,
  RuntimeSharedDependenciesGlobal,
} from '@backstage/module-federation-common';
import {
  basename,
  dirname,
  join as joinPath,
  resolve as resolvePath,
} from 'node:path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import PQueue from 'p-queue';

// Remote modules management utilities

export async function getModuleFederationRemoteOptions(
  packageJson: BackstagePackageJson,
  packageDir: string,
): Promise<ModuleFederationRemoteOptions | undefined> {
  let exposes: ModuleFederationRemoteOptions['exposes'];
  const packageRole = packageJson.backstage?.role;
  if (packageJson.exports && packageRole) {
    const project = await createTypeDistProject();
    exposes = Object.fromEntries(
      readEntryPoints(packageJson)
        .filter(ep => {
          if (ep.mount === './package.json') {
            return false;
          }
          if (ep.mount === '.') {
            return true;
          }
          // Include this additional entry point in the exposed modules
          // if it exports a feature as default export.
          return (
            getEntryPointDefaultFeatureType(
              packageRole,
              packageDir,
              project,
              ep.path,
            ) !== null
          );
        })
        .map(ep => [ep.mount, ep.path]),
    );
  }

  return {
    // The default output mode requires the name to be a usable as a code
    // symbol, there might be better options here but for now we need to
    // sanitize the name.
    name: packageJson.name
      .replaceAll('@', '')
      .replaceAll('/', '__')
      .replaceAll('-', '_'),
    exposes,
    sharedDependencies: defaultRemoteSharedDependencies(),
  };
}

// Module federation host management utilities

/**
 * Prepares the runtime shared dependencies script for the module federation host,
 * which will be written by the CLI into a Javascript file added as an additional entry point for the frontend bundler.
 * This script is used in the browser to build the list of shared dependencies provided to the module federation runtime.
 *
 * @internal
 */
export function prepareRuntimeSharedDependenciesScript(
  hostSharedDependencies: HostSharedDependencies,
) {
  const items = Object.entries(hostSharedDependencies).map(
    ([name, sharedDep]) => {
      if (!sharedDep.version) {
        throw new Error(`Version is required for shared dependency '${name}'`);
      }
      return {
        name,
        version: sharedDep.version,
        lib: name as unknown as () => Promise<unknown>, // Converted into import below
        shareConfig: {
          singleton: sharedDep.singleton,
          requiredVersion: sharedDep.requiredVersion,
          eager: sharedDep.eager,
        },
      };
    },
  );

  return `window['${BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL}'] = ${JSON.stringify(
    { items, version: 'v1' } satisfies RuntimeSharedDependenciesGlobal,
    null,
    2,
  ).replace(
    /"lib": ("[^"]+")/gm,
    (_, name) => `"lib": () => import(${name})`,
  )};`;
}

const RUNTIME_SHARED_DEPENDENCIES_MODULE_NAME =
  '__backstage-module-federation-runtime-shared-dependencies__';

// Make sure we're not issuing multiple writes at the same time, which can cause partial overwrites
const writeQueue = new PQueue({ concurrency: 1 });

async function writeRuntimeSharedDependenciesModule(
  targetPath: string,
  runtimeSharedDependencies: HostSharedDependencies,
) {
  const script = prepareRuntimeSharedDependenciesScript(
    runtimeSharedDependencies,
  );

  await writeQueue.add(async () => {
    const path = joinPath(
      targetPath,
      'node_modules',
      `${RUNTIME_SHARED_DEPENDENCIES_MODULE_NAME}.js`,
    );

    await fs.ensureDir(dirname(path));
    await fs.writeFile(path, script);
  });
}

/**
 * Whether a package is installed in the node_modules lookup chain of a
 * directory. This is where the bundler resolves the imports of the app from,
 * unlike `require.resolve`, which also searches NODE_PATH and the global
 * folders.
 */
function isInstalledFrom(dir: string, packageName: string): boolean {
  for (let current = resolvePath(dir); ; current = dirname(current)) {
    if (
      basename(current) !== 'node_modules' &&
      fs.pathExistsSync(
        joinPath(current, 'node_modules', packageName, 'package.json'),
      )
    ) {
      return true;
    }
    if (dirname(current) === current) {
      return false;
    }
  }
}

/** @internal */
export function resolveSharedDependencyVersions(
  targetPath: string,
  hostSharedDependencies: HostSharedDependencies,
): HostSharedDependencies {
  return Object.fromEntries(
    Object.entries(hostSharedDependencies)
      .filter(([_, sharedDep]) => sharedDep !== undefined)
      .flatMap(([importPath, sharedDep]) => {
        // Remove any sub-path exports from the import path
        const moduleName = importPath.startsWith('@')
          ? importPath.split('/').slice(0, 2).join('/')
          : importPath.split('/')[0];

        // pnpm bin shims put the packages that pnpm hoists on NODE_PATH, so
        // a package that the app can't import could otherwise be found here
        if (!isInstalledFrom(targetPath, moduleName)) {
          console.log(
            `Skipping module federation shared dependency '${importPath}' because the app does not depend on it.`,
          );
          return [];
        }

        let version: string;
        try {
          const packagePath = require.resolve(`${moduleName}/package.json`, {
            paths: [targetPath],
          });
          version = require(packagePath).version;
        } catch (e) {
          console.log(
            `Skipping module federation shared dependency '${importPath}' because it could not be resolved.`,
          );
          return [];
        }

        return [[importPath, { ...sharedDep, version }]];
      }),
  );
}

export async function createRuntimeSharedDependenciesEntryPoint(options: {
  targetPath: string;
  watch?: () => void;
}): Promise<string[]> {
  const { targetPath, watch } = options;

  const doWriteSharedDependenciesModule = async () => {
    const sharedDependencies = defaultHostSharedDependencies();
    await writeRuntimeSharedDependenciesModule(
      targetPath,
      resolveSharedDependencyVersions(targetPath, sharedDependencies),
    );
  };

  if (watch) {
    const watcher = chokidar.watch(resolvePath(targetPath, 'package.json'));
    watcher.on('change', async () => {
      await doWriteSharedDependenciesModule();
      watch();
    });
  }
  await doWriteSharedDependenciesModule();

  return [RUNTIME_SHARED_DEPENDENCIES_MODULE_NAME];
}
