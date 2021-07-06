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

import { loadConfig, loadConfigSchema } from '@backstage/config-loader';
import { ConfigReader } from '@backstage/config';
import { paths } from './paths';

type Options = {
  args: string[];
  fromPackage?: string;
  mockEnv?: boolean;
};

export async function loadCliConfig(options: Options) {
  const configPaths = options.args.map(arg => paths.resolveTarget(arg));

  // Consider all packages in the monorepo when loading in config
  const { Project } = require('@lerna/project');
  const project = new Project(paths.targetDir);
  const packages = await project.getPackages();

  const localPackageNames = options.fromPackage
    ? findPackages(packages, options.fromPackage)
    : packages.map((p: any) => p.name);

  const schema = await loadConfigSchema({
    dependencies: localPackageNames,
  });

  const appConfigs = await loadConfig({
    experimentalEnvFunc: options.mockEnv
      ? async name => process.env[name] || 'x'
      : undefined,
    configRoot: paths.targetRoot,
    configPaths,
  });

  // printing to stderr to not clobber stdout in case the cli command
  // outputs structured data (e.g. as config:schema does)
  process.stderr.write(
    `Loaded config from ${appConfigs.map(c => c.context).join(', ')}\n`,
  );

  try {
    const frontendAppConfigs = schema.process(appConfigs, {
      visibility: ['frontend'],
    });
    const frontendConfig = ConfigReader.fromConfigs(frontendAppConfigs);

    return {
      schema,
      appConfigs,
      frontendConfig,
      frontendAppConfigs,
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

function findPackages(packages: any[], fromPackage: string): string[] {
  const { PackageGraph } = require('@lerna/package-graph');

  const graph = new PackageGraph(packages);

  const targets = new Set<string>();
  const searchNames = [fromPackage];

  while (searchNames.length) {
    const name = searchNames.pop()!;

    if (targets.has(name)) {
      continue;
    }

    const node = graph.get(name);
    if (!node) {
      throw new Error(`Package '${name}' not found`);
    }

    targets.add(name);

    // Workaround for Backstage main repo only, since the CLI has some artificial devDependencies
    if (name !== '@backstage/cli') {
      searchNames.push(...node.localDependencies.keys());
    }
  }

  return Array.from(targets);
}
