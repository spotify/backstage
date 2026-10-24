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
  mockEnv?: boolean;
  withDeprecatedKeys?: boolean;
  fullVisibility?: boolean;
  strict?: boolean;
};

export async function loadCliConfig(options: Options) {
  const targetDir = options.targetDir ?? targetPaths.dir;

  // Consider all packages in the monorepo when loading in config
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
      // No packages: it means that it's not a monorepo (e.g. standalone plugin)
      localPackageNames = [options.fromPackage];
    }
  } else {
    localPackageNames = packages.map(p => p.packageJson.name);
  }

  const schema = await loadConfigSchema({
    dependencies: localPackageNames,
    // Include the package.json in the project root if it exists
    packagePaths: [targetPaths.resolveInstallationRoot('package.json')],
    noUndeclaredProperties: options.strict,
    onSchemaError: options.strict
      ? undefined
      : error => console.warn(error.message),
  });

  const source = ConfigSources.default({
    allowMissingDefaultConfig: true,
    substitutionFunc: options.mockEnv
      ? async name => process.env[name] || 'x'
      : undefined,
    rootDir: targetPaths.installationRootDir,
    argv: options.args.flatMap(t => ['--config', resolvePath(targetDir, t)]),
  });

  const appConfigs = await new Promise<AppConfig[]>((resolve, reject) => {
    async function readConfig() {
      let loaded = false;
      try {
        const abortController = new AbortController();
        for await (const { configs } of source.readConfigData({
          signal: abortController.signal,
        })) {
          resolve(configs);
          loaded = true;
          abortController.abort();
        }
      } catch (error) {
        if (!loaded) {
          reject(error);
        }
      }
    }
    readConfig();
  });

  const configurationLoadedMessage = appConfigs.length
    ? `Loaded config from ${appConfigs.map(c => c.context).join(', ')}`
    : `No configuration files found, running without config`;

  // printing to stderr to not clobber stdout in case the cli command
  // outputs structured data (e.g. as config:schema does)
  process.stderr.write(`${configurationLoadedMessage}\n`);

  try {
    const frontendAppConfigs = schema.process(appConfigs, {
      visibility: options.fullVisibility
        ? ['frontend', 'backend', 'secret']
        : ['frontend'],
      withDeprecatedKeys: options.withDeprecatedKeys,
      ignoreSchemaErrors: !options.strict,
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
  } catch (error) {
    const maybeSchemaError = error as Error & { messages?: string[] };
    if (maybeSchemaError.messages) {
      const messages = maybeSchemaError.messages.join('\n  ');
      throw new Error(`Configuration does not match schema\n\n  ${messages}`);
    }
    throw error;
  }
}
