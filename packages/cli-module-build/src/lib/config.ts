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

import { ConfigSources, loadConfigSchema } from '@backstage/config-loader';
import { AppConfig, ConfigReader } from '@backstage/config';
import { targetPaths } from '@backstage/cli-common';

import { getPackages } from '@manypkg/get-packages';
import { PackageGraph } from '@backstage/cli-node';
import { resolve as resolvePath } from 'node:path';

type Options = {
  args: string[];
  targetDir?: string;
  fromPackage?: string;
  withFilteredKeys?: boolean;
  watch?: (newFrontendAppConfigs: AppConfig[]) => void;
};

export async function loadCliConfig(options: Options) {
  const targetDir = options.targetDir ?? targetPaths.dir;

  const { packages } = await getPackages(targetDir);

  let localPackageNames;
  if (options.fromPackage) {
    if (packages.length) {
      const graph = PackageGraph.fromPackages(packages);
      localPackageNames = Array.from(
        graph.collectPackageNames([options.fromPackage], node => {
          // Workaround for Backstage main repo only, since the CLI has some artificial devDependencies
          if (node.name === '@backstage/cli') {
            return undefined;
          }
          return node.localDependencies.keys();
        }),
      );
    } else {
      localPackageNames = [options.fromPackage];
    }
  } else {
    localPackageNames = packages.map(p => p.packageJson.name);
  }

  const schema = await loadConfigSchema({
    dependencies: localPackageNames,
    packagePaths: [targetPaths.resolveInstallationRoot('package.json')],
    onSchemaError: error => console.warn(error.message),
  });

  const source = ConfigSources.default({
    allowMissingDefaultConfig: true,
    watch: Boolean(options.watch),
    rootDir: targetPaths.installationRootDir,
    argv: options.args.flatMap(t => ['--config', resolvePath(targetDir, t)]),
  });

  const appConfigs = await new Promise<AppConfig[]>((resolve, reject) => {
    async function loadConfigReaderLoop() {
      let loaded = false;

      try {
        const abortController = new AbortController();
        for await (const { configs } of source.readConfigData({
          signal: abortController.signal,
        })) {
          if (loaded) {
            const newFrontendAppConfigs = schema.process(configs, {
              visibility: ['frontend'],
              withFilteredKeys: options.withFilteredKeys,
              ignoreSchemaErrors: true,
            });
            options.watch?.(newFrontendAppConfigs);
          } else {
            resolve(configs);
            loaded = true;

            if (!options.watch) {
              abortController.abort();
            }
          }
        }
      } catch (error) {
        if (loaded) {
          console.error(`Failed to reload configuration, ${error}`);
        } else {
          reject(error);
        }
      }
    }
    loadConfigReaderLoop();
  });

  const configurationLoadedMessage = appConfigs.length
    ? `Loaded config from ${appConfigs.map(c => c.context).join(', ')}`
    : `No configuration files found, running without config`;

  process.stderr.write(`${configurationLoadedMessage}\n`);

  const frontendAppConfigs = schema.process(appConfigs, {
    visibility: ['frontend'],
    withFilteredKeys: options.withFilteredKeys,
    ignoreSchemaErrors: true,
  });
  const frontendConfig = ConfigReader.fromConfigs(frontendAppConfigs);

  const fullConfig = ConfigReader.fromConfigs(appConfigs);

  return {
    schema,
    appConfigs,
    frontendConfig,
    frontendAppConfigs,
    fullConfig,
  };
}
