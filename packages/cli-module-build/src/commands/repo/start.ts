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

import {
  BackstagePackage,
  PackageGraph,
  PackageRole,
} from '@backstage/cli-node';
import { relative as relativePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import { cli } from 'cleye';

import { resolveLinkedWorkspace } from '../package/start/resolveLinkedWorkspace';
import { startPackage } from '../package/start/startPackage';
import { parseArgs } from 'node:util';
import type { CliCommandContext } from '@backstage/cli-node';

const ACCEPTED_PACKAGE_ROLES: Array<PackageRole | undefined> = [
  'frontend',
  'backend',
  'frontend-plugin',
  'backend-plugin',
];

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { plugin, config, require: requirePath, link, inspect, inspectBrk },
    _: namesOrPaths,
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      parameters: ['[packages...]'],
      flags: {
        plugin: {
          type: [String],
          description:
            'Start the dev entry-point for any matching plugin package in the repo',
          default: [],
        },
        config: {
          type: [String],
          description: 'Config files to load instead of app-config.yaml',
          default: [],
        },
        require: {
          type: String,
          description:
            'Add a --require argument to the node process. Applies to backend package only',
        },
        link: {
          type: String,
          description: 'Link an external workspace for module resolution',
        },
        inspect: {
          type: String,
          description:
            'Enable the Node.js inspector, optionally at a specific host:port',
        },
        inspectBrk: {
          type: String,
          description:
            'Enable the Node.js inspector and break before user code starts',
        },
      },
    },
    undefined,
    args,
  );

  const targetPackages = await findTargetPackages(namesOrPaths, plugin);

  const packageOptions = await resolvePackageOptions(targetPackages, {
    plugin,
    config,
    inspect: inspect || (inspect === '' ? true : undefined),
    inspectBrk: inspectBrk || (inspectBrk === '' ? true : undefined),
    require: requirePath,
    link,
  });

  if (packageOptions.length === 0) {
    console.log('No packages found to start');
    return;
  }

  console.log(
    `Starting ${packageOptions
      .map(({ pkg }) => pkg.packageJson.name)
      .join(', ')}`,
  );

  // Each of these block until interrupted by user
  await Promise.all(packageOptions.map(entry => startPackage(entry.options)));
};

export async function findTargetPackages(
  namesOrPaths: string[],
  pluginIds: string[],
) {
  const targetPackages = new Array<BackstagePackage>();

  const packages = await PackageGraph.listTargetPackages();

  // Prioritize plugin options, so that the `start` script can contain a list of packages,
  // but make them easy to override by running for example `yarn start --plugin catalog`
  for (const pluginId of pluginIds) {
    const matchingPackages = packages.filter(pkg => {
      return (
        pluginId === pkg.packageJson.backstage?.pluginId &&
        ACCEPTED_PACKAGE_ROLES.includes(pkg.packageJson.backstage.role)
      );
    });
    if (matchingPackages.length === 0) {
      throw new Error(
        `Unable to find any plugin packages with plugin ID '${pluginId}'. Make sure backstage.pluginId is set in your package.json files by running 'yarn fix --publish'.`,
      );
    }
    targetPackages.push(...matchingPackages);
  }
  if (targetPackages.length > 0) {
    return targetPackages;
  }

  // Next check if explicit package names are provided, use them in that case.
  for (const nameOrPath of namesOrPaths) {
    let matchingPackage = packages.find(
      pkg => nameOrPath === pkg.packageJson.name,
    );
    if (!matchingPackage) {
      const absPath = targetPaths.resolveInstallationRoot(nameOrPath);
      matchingPackage = packages.find(
        pkg => relativePath(pkg.dir, absPath) === '',
      );
    }
    if (!matchingPackage) {
      throw new Error(`Unable to find package by name '${nameOrPath}'`);
    }
    targetPackages.push(matchingPackage);
  }

  if (targetPackages.length > 0) {
    return targetPackages;
  }

  // If no package names are provided, default to expect a single frontend and/or backend package
  for (const role of ['frontend', 'backend']) {
    const matchingPackages = packages.filter(
      pkg => pkg.packageJson.backstage?.role === role,
    );
    if (matchingPackages.length > 1) {
      // Final fallback is to check for the package path within the monorepo, packages/app or packages/backend
      const expectedPath = targetPaths.resolveInstallationRoot(
        role === 'frontend' ? 'packages/app' : 'packages/backend',
      );
      const matchByPath = matchingPackages.find(
        pkg => relativePath(expectedPath, pkg.dir) === '',
      );
      if (matchByPath) {
        targetPackages.push(matchByPath);
        continue;
      }

      throw new Error(
        `Found multiple packages with role '${role}' but none of the use the default path '${expectedPath}',` +
          `choose which packages you want to run by passing the package names explicitly ` +
          `as arguments, for example 'yarn backstage-cli repo start my-app my-backend'.`,
      );
    }

    targetPackages.push(...matchingPackages);
  }
  if (targetPackages.length > 0) {
    return targetPackages;
  }

  // If no app or backend packages are found, fall back to expecting single plugin packages
  for (const role of ['frontend-plugin', 'backend-plugin']) {
    const matchingPackages = packages.filter(
      pkg => pkg.packageJson.backstage?.role === role,
    );
    if (matchingPackages.length > 1) {
      throw new Error(
        `Found multiple packages with role '${role}', please choose which packages you want ` +
          `to run by passing the package names explicitly as arguments, for example ` +
          `'yarn backstage-cli repo start my-plugin my-plugin-backend'.`,
      );
    }
    targetPackages.push(...matchingPackages);
  }
  if (targetPackages.length > 0) {
    return targetPackages;
  }

  throw new Error(
    `Unable to find any packages with role 'frontend', 'backend', 'frontend-plugin', or 'backend-plugin'.`,
  );
}

type CommandOptions = {
  plugin: string[];
  config: string[];
  inspect?: boolean | string;
  inspectBrk?: boolean | string;
  require?: string;
  link?: string;
};

async function resolvePackageOptions(
  targetPackages: BackstagePackage[],
  options: CommandOptions,
) {
  const linkedWorkspace = await resolveLinkedWorkspace(options.link);

  return targetPackages.flatMap(pkg => {
    const startScript = pkg.packageJson.scripts?.start;
    if (!startScript) {
      console.log(
        `No start script found for package ${pkg.packageJson.name}, skipping...`,
      );
      return [];
    }

    // Grab and parse --config and --require options from the start scripts, the rest are ignored
    // TODO(Rugvip): Prolly switch over to completely different arg parsing to avoid this duplication
    const { values: parsedOpts } = parseArgs({
      args: startScript.split(' '),
      strict: false,
      options: {
        config: {
          type: 'string',
          multiple: true,
        },
        require: {
          type: 'string',
        },
      },
    });
    const parsedRequire =
      typeof parsedOpts.require === 'string' ? parsedOpts.require : undefined;
    const parsedConfig =
      parsedOpts.config?.filter(c => typeof c === 'string') ?? [];

    return [
      {
        pkg,
        options: {
          role: pkg.packageJson.backstage?.role!,
          targetDir: pkg.dir,
          configPaths:
            options.config.length > 0 ? options.config : parsedConfig,
          checksEnabled: false,
          linkedWorkspace,
          inspectEnabled: options.inspect,
          inspectBrkEnabled: options.inspectBrk,
          require: options.require ?? parsedRequire,
        },
      },
    ];
  });
}
