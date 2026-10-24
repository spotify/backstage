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
import { OptionValues } from 'commander';
import inquirer, { Answers } from 'inquirer';
import { resolve as resolvePath } from 'node:path';
import { targetPaths, findOwnPaths } from '@backstage/cli-common';
import os from 'node:os';
import fs from 'fs-extra';
import {
  Task,
  buildAppTask,
  checkAppExistsTask,
  checkPathExistsTask,
  moveAppTask,
  templatingTask,
  tryInitGitRepository,
  readGitConfig,
  fetchYarnLockSeedTask,
  tryCommandForVersion,
  PackageManagerName,
} from './lib/tasks';

const DEFAULT_BRANCH = 'master';
// Uses the same 'N.x' format as GitHub Actions node-version matrices for easy find-and-replace.
// Keep in sync with the engines.node field in the root package.json.
const SUPPORTED_NODE_VERSIONS = ['22.x', '24.x'];
// The pnpm versions that the created app and the Backstage CLI support
const SUPPORTED_PNPM_VERSIONS =
  'pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later';
// The pnpm version that created apps pin in the packageManager field
const PNPM_VERSION = '12.14.0';

// Template files that are only used by one of the package managers, without
// the '.hbs' suffix. Files under '.yarn/' are also only used by Yarn.
const YARN_ONLY_FILES = ['.yarnrc.yml', 'yarn.lock'];
const PNPM_ONLY_FILES = ['pnpm-workspace.yaml'];

/**
 * Picks the package manager for the created app from the `--package-manager`
 * option, falling back to pnpm when the command runs through pnpm, for
 * example with `pnpm create @backstage/app`, and to Yarn otherwise.
 */
export function resolvePackageManager(opts: OptionValues): PackageManagerName {
  if (opts.packageManager !== undefined) {
    if (opts.packageManager !== 'yarn' && opts.packageManager !== 'pnpm') {
      throw new Error(
        `Unsupported package manager '${opts.packageManager}', expected 'yarn' or 'pnpm'`,
      );
    }
    return opts.packageManager;
  }
  return process.env.npm_config_user_agent?.startsWith('pnpm/')
    ? 'pnpm'
    : 'yarn';
}

/**
 * Returns whether the template file is only used by a different package
 * manager than the one that was selected.
 */
export function isTemplateFileExcluded(
  packageManager: PackageManagerName,
  templateFilePath: string,
): boolean {
  const file = templateFilePath.replace(/\.hbs$/, '');
  if (packageManager === 'pnpm') {
    return YARN_ONLY_FILES.includes(file) || file.startsWith('.yarn/');
  }
  return PNPM_ONLY_FILES.includes(file);
}

function isSupportedPnpmVersion(version: string): boolean {
  const [major, minor] = version.split('.').map(Number);
  if (!Number.isInteger(major) || !Number.isInteger(minor)) {
    return false;
  }
  if (major === 11) {
    return minor >= 28;
  }
  return major > 12 || (major === 12 && minor >= 7);
}

export default async (opts: OptionValues): Promise<void> => {
  const packageManager = resolvePackageManager(opts);

  // Prerequisite check — runs before the interactive prompt to fail fast
  let hasPrerequisiteError = false;
  const supportedMajors = SUPPORTED_NODE_VERSIONS.map(v =>
    parseInt(v.split('.')[0], 10),
  );
  const [major, minor, patch] = process.versions.node.split('.').map(Number);
  // pnpm refuses to run in directories where a package.json pins another
  // package manager, so its version is read from the temp directory instead
  const pkgManager = await tryCommandForVersion(
    `${packageManager} -v`,
    packageManager === 'pnpm' ? { cwd: os.tmpdir() } : undefined,
  );
  let python = await tryCommandForVersion('python3 --version');
  if (python.error) {
    python = await tryCommandForVersion('python --version');
  }

  Task.log();
  Task.log('Prerequisites check...');
  Task.log();
  Task.log(`  Node version is: ${major}.${minor}.${patch}`);
  Task.log(
    `  ${packageManager === 'pnpm' ? 'pnpm' : 'Yarn'} version is: ${
      pkgManager.version
    }`,
  );
  Task.log(`  Python version is: ${python.version.replace(/^Python\s+/, '')}`);

  if (pkgManager.error) {
    Task.error(
      packageManager === 'pnpm'
        ? `pnpm is not available. Please install ${SUPPORTED_PNPM_VERSIONS} before creating a Backstage app.`
        : 'Yarn is not available. Please install Yarn before creating a Backstage app.',
    );
    hasPrerequisiteError = true;
  } else if (
    packageManager === 'pnpm' &&
    !isSupportedPnpmVersion(pkgManager.version)
  ) {
    Task.error(
      `${SUPPORTED_PNPM_VERSIONS} is required, found ${pkgManager.version}. Please upgrade pnpm before creating a Backstage app.`,
    );
    hasPrerequisiteError = true;
  }

  if (python.error) {
    Task.log(
      chalk.yellow(
        'Warning: Python is not available. Python is required by node-gyp for some native dependencies.',
      ),
    );
  }

  if (major % 2 !== 0) {
    Task.error(
      `Node version ${major} is an odd-numbered release and is not a supported LTS version. Please use an even-numbered LTS version (${SUPPORTED_NODE_VERSIONS.join(
        ' or ',
      )}).`,
    );
    hasPrerequisiteError = true;
  } else if (!supportedMajors.includes(major)) {
    Task.error(
      `Node version ${major} is not a supported LTS version. Please use a supported version (${SUPPORTED_NODE_VERSIONS.join(
        ' or ',
      )}).`,
    );
    hasPrerequisiteError = true;
  }

  if (hasPrerequisiteError) {
    Task.log(
      'It seems that something went wrong when validating the prerequisites 🤔',
    );
    Task.log(
      'For help with setting up prerequisites, see https://backstage.io/docs/getting-started/#prerequisites',
    );

    Task.error('🔥  Failed to validate needed prerequisites!');
    Task.exit(1);
    return;
  }

  const answers: Answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      default: 'backstage',
      message: chalk.blue('Enter a name for the app [required]'),
      validate: (value: any) => {
        if (!value) {
          return chalk.red('Please enter a name for the app');
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk.red(
            'App name must be lowercase and contain only letters, digits, and dashes.',
          );
        }
        return true;
      },
      when: (a: Answers) => {
        const envName = process.env.BACKSTAGE_APP_NAME;
        if (envName) {
          a.name = envName;
          return false;
        }
        return true;
      },
    },
  ]);

  // Pick the built-in template based on the --legacy flag
  /* eslint-disable-next-line no-restricted-syntax */
  const ownPaths = findOwnPaths(__dirname);
  const builtInTemplate = opts.legacy
    ? ownPaths.resolve('templates/legacy-app')
    : ownPaths.resolve('templates/default-app');

  // Use `--template-path` argument as template when specified. Otherwise, use the default template.
  const templateDir = opts.templatePath
    ? targetPaths.resolve(opts.templatePath)
    : builtInTemplate;

  // Use `--path` argument as application directory when specified, otherwise
  // create a directory using `answers.name`
  const appDir = opts.path
    ? resolvePath(targetPaths.dir, opts.path)
    : resolvePath(targetPaths.dir, answers.name);

  Task.log();
  Task.log('Creating the app...');

  try {
    const gitConfig = await readGitConfig();

    const templateContext = {
      ...answers,
      defaultBranch: gitConfig?.defaultBranch ?? DEFAULT_BRANCH,
      packageManager,
      pnpm: packageManager === 'pnpm',
      pnpmVersion: PNPM_VERSION,
    };
    const templatingOptions = {
      exclude: (file: string) => isTemplateFileExcluded(packageManager, file),
    };

    if (opts.path) {
      // Template directly to specified path

      Task.section('Checking that supplied path exists');
      await checkPathExistsTask(appDir);

      Task.section('Preparing files');
      await templatingTask(
        templateDir,
        opts.path,
        templateContext,
        templatingOptions,
      );
    } else {
      // Template to temporary location, and then move files

      Task.section('Checking if the directory is available');
      await checkAppExistsTask(targetPaths.dir, answers.name);

      Task.section('Creating a temporary app directory');
      const tempDir = await fs.mkdtemp(resolvePath(os.tmpdir(), answers.name));

      Task.section('Preparing files');
      await templatingTask(
        templateDir,
        tempDir,
        templateContext,
        templatingOptions,
      );

      Task.section('Moving to final location');
      await moveAppTask(tempDir, appDir, answers.name);
    }

    // pnpm apps do not get a seed lockfile, any pins for them go into the template
    const fetchedYarnLockSeed =
      packageManager === 'yarn' ? await fetchYarnLockSeedTask(appDir) : true;

    if (gitConfig) {
      if (await tryInitGitRepository(appDir)) {
        // Since we don't know whether we were able to init git before we
        // try, we can't track the actual task execution
        Task.forItem('init', 'git repository', async () => {});
      }
    }

    if (!opts.skipInstall) {
      Task.section('Installing dependencies');
      await buildAppTask(appDir, packageManager);
    }

    Task.log();
    Task.log(
      chalk.green(`🥇  Successfully created ${chalk.cyan(answers.name)}`),
    );
    Task.log();

    if (!fetchedYarnLockSeed) {
      Task.log(
        chalk.yellow(
          [
            'Warning: Failed to fetch the yarn.lock seed file.',
            '         You may end up with incompatible dependencies that break the app.',
            '         If you run into any errors, please search the issues at',
            '         https://github.com/backstage/backstage/issues for potential solutions',
          ].join('\n'),
        ),
      );
    }

    Task.section('All set! Now you might want to');
    if (opts.skipInstall) {
      Task.log(
        `  Install the dependencies: ${chalk.cyan(
          `cd ${opts.path ?? answers.name} && ${packageManager} install`,
        )}`,
      );
    }
    Task.log(
      `  Run the app: ${chalk.cyan(
        `cd ${opts.path ?? answers.name} && ${packageManager} start`,
      )}`,
    );
    Task.log(
      '  Set up the software catalog: https://backstage.io/docs/features/software-catalog/configuration',
    );
    Task.log('  Add authentication: https://backstage.io/docs/auth/');
    Task.log();
    Task.exit();
  } catch (error) {
    Task.error(String(error));

    Task.log('It seems that something went wrong when creating the app 🤔');

    Task.error('🔥  Failed to create app!');
    Task.exit(1);
  }
};
