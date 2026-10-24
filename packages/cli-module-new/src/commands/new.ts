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

import { cli } from 'cleye';
import { createNewPackage } from '../lib/createNewPackage';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  for (const flag of ['skipInstall', 'npmRegistry', 'baseVersion']) {
    if (args.some(a => a === `--${flag}` || a.startsWith(`--${flag}=`))) {
      process.stderr.write(
        `DEPRECATION WARNING: --${flag} is deprecated, use the kebab-case form instead\n`,
      );
    }
  }

  const {
    flags: {
      select,
      option: rawArgOptions,
      skipInstall,
      scope,
      npmRegistry,
      baseVersion,
      license,
      private: isPrivate,
    },
  } = cli(
    {
      name: info.usage,
      booleanFlagNegation: true,
      flags: {
        select: {
          type: String,
          description: 'Select the thing you want to be creating upfront',
        },
        option: {
          type: [String] as const,
          description: 'Pre-fill options for the creation process',
          default: [] as string[],
        },
        skipInstall: {
          type: Boolean,
          description: `Skips installing dependencies and running 'lint --fix'`,
        },
        scope: {
          type: String,
          description: 'The scope to use for new packages',
        },
        npmRegistry: {
          type: String,
          description: 'The package registry to use for new packages',
        },
        baseVersion: {
          type: String,
          description:
            'The version to use for any new packages (default: 0.1.0)',
        },
        license: {
          type: String,
          description:
            'The license to use for any new packages (default: Apache-2.0)',
        },
        private: {
          type: Boolean,
          description: 'Mark new packages as private',
          default: true,
        },
      },
    },
    undefined,
    args,
  );

  const prefilledParams = parseParams(rawArgOptions);

  let pluginInfix: string | undefined = undefined;
  let packagePrefix: string | undefined = undefined;
  if (scope) {
    const normalizedScope = scope.startsWith('@') ? scope : `@${scope}`;
    packagePrefix = normalizedScope.includes('/')
      ? normalizedScope
      : `${normalizedScope}/`;
    pluginInfix = scope.includes('backstage') ? 'plugin-' : 'backstage-plugin-';
  }

  if (
    isPrivate === false ||
    [npmRegistry, baseVersion, license].filter(Boolean).length !== 0
  ) {
    console.warn(
      `Global template configuration via CLI flags is deprecated, see https://backstage.io/docs/cli/new for information on how to configure package templating`,
    );
  }

  await createNewPackage({
    prefilledParams,
    preselectedTemplateId: select,
    configOverrides: {
      license,
      version: baseVersion,
      private: isPrivate,
      publishRegistry: npmRegistry,
      packageNamePrefix: packagePrefix,
      packageNamePluginInfix: pluginInfix,
    },
    skipInstall: Boolean(skipInstall),
  });
};

function parseParams(optionStrings: string[]): Record<string, string> {
  const options: Record<string, string> = {};

  for (const str of optionStrings) {
    const [key] = str.split('=', 1);
    const value = str.slice(key.length + 1);
    if (!key || str[key.length] !== '=') {
      throw new Error(
        `Invalid option '${str}', must be of the format <key>=<value>`,
      );
    }
    options[key] = value;
  }

  return options;
}
