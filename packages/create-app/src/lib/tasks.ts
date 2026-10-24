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
import handlebars from 'handlebars';
import ora from 'ora';
import recursive from 'recursive-readdir';
import {
  basename,
  dirname,
  resolve as resolvePath,
  relative as relativePath,
  sep,
} from 'node:path';
import { exec as execCb } from 'node:child_process';
import { packageVersions } from './versions';
import { promisify } from 'node:util';
import os from 'node:os';

const TASK_NAME_MAX_LENGTH = 14;
const TEN_MINUTES_MS = 1000 * 60 * 10;
const exec = promisify(execCb);

export type GitConfig = {
  defaultBranch?: string;
};

/**
 * The package managers that a created app can use.
 */
export type PackageManagerName = 'yarn' | 'pnpm';

/**
 * Options for the templating task.
 */
export type TemplatingOptions = {
  /**
   * Called with the path of each template file, relative to the template
   * directory and with forward slashes. Files for which it returns `true` are
   * left out of the created app.
   */
  exclude?: (templateFilePath: string) => boolean;
};

export class Task {
  static log(name: string = '') {
    process.stdout.write(`${chalk.green(name)}\n`);
  }

  static error(message: string = '') {
    process.stdout.write(`\n${chalk.red(message)}\n\n`);
  }

  static section(name: string) {
    const title = chalk.green(`${name}:`);
    process.stdout.write(`\n ${title}\n`);
  }

  static exit(code: number = 0) {
    process.exit(code);
  }

  static async forItem(
    task: string,
    item: string,
    taskFunc: () => Promise<void>,
  ): Promise<void> {
    const paddedTask = chalk.green(task.padEnd(TASK_NAME_MAX_LENGTH));

    const spinner = ora({
      prefixText: chalk.green(`  ${paddedTask}${chalk.cyan(item)}`),
      spinner: 'arc',
      color: 'green',
    }).start();

    try {
      await taskFunc();
      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }
}

/**
 * Generate a templated backstage project
 *
 * @param templateDir - location containing template files
 * @param destinationDir - location to save templated project
 * @param context - template parameters
 * @param options - templating options, such as which template files to exclude
 */
export async function templatingTask(
  templateDir: string,
  destinationDir: string,
  context: any,
  options: TemplatingOptions = {},
) {
  const files = await recursive(templateDir).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });

  for (const file of files) {
    const filePath = relativePath(templateDir, file);

    if (options.exclude?.(filePath.split(sep).join('/'))) {
      continue;
    }

    const destinationFile = resolvePath(destinationDir, filePath);
    await fs.ensureDir(dirname(destinationFile));

    if (file.endsWith('.hbs')) {
      await Task.forItem('templating', basename(file), async () => {
        const destination = destinationFile.replace(/\.hbs$/, '');

        const template = await fs.readFile(file);
        const compiled = handlebars.compile(template.toString());
        const contents = compiled(
          { name: basename(destination), ...context },
          {
            helpers: {
              version(name: keyof typeof packageVersions) {
                if (name in packageVersions) {
                  return packageVersions[name];
                }
                throw new Error(`No version available for package ${name}`);
              },
            },
          },
        );

        await fs.writeFile(destination, contents).catch(error => {
          throw new Error(
            `Failed to create file: ${destination}: ${error.message}`,
          );
        });
      });
    } else {
      await Task.forItem('copying', basename(file), async () => {
        await fs.copyFile(file, destinationFile).catch(error => {
          const destination = destinationFile;
          throw new Error(
            `Failed to copy file to ${destination} : ${error.message}`,
          );
        });
      });
    }
  }
}

/**
 * Verify that application target does not already exist
 *
 * @param rootDir - The directory to create application folder `name`
 * @param name - The specified name of the application
 * @Throws Error - If directory with name of `destination` already exists
 */
export async function checkAppExistsTask(rootDir: string, name: string) {
  await Task.forItem('checking', name, async () => {
    const destination = resolvePath(rootDir, name);

    if (await fs.pathExists(destination)) {
      const existing = chalk.cyan(destination.replace(`${rootDir}/`, ''));
      throw new Error(
        `A directory with the same name already exists: ${existing}\nPlease try again with a different app name`,
      );
    }
  });
}

/**
 * Verify that application `path` exists, otherwise create the directory
 *
 * @param path - target to create directory
 * @throws if `path` is a file, or `fs.mkdir` fails
 */
export async function checkPathExistsTask(path: string) {
  await Task.forItem('checking', path, async () => {
    try {
      await fs.mkdirs(path);
    } catch (error) {
      // will fail if a file already exists at given `path`
      throw new Error(`Failed to create app directory: ${error.message}`);
    }
  });
}

/**
 * Run `install` and `tsc` with the package manager in application directory
 *
 * @param appDir - location of application to build
 * @param packageManager - the package manager of the application, `yarn` by default
 */
export async function buildAppTask(
  appDir: string,
  packageManager: PackageManagerName = 'yarn',
) {
  process.chdir(appDir);

  const runCmd = async (cmd: string) => {
    await Task.forItem('executing', cmd, async () => {
      await exec(cmd).catch(error => {
        process.stdout.write(error.stderr);
        process.stdout.write(error.stdout);
        throw new Error(`Could not execute command ${chalk.cyan(cmd)}`);
      });
    });
  };

  const installTimeout = setTimeout(() => {
    Task.error(
      `\n⏱️  It's taking a long time to install dependencies, you may want to exit (Ctrl-C) and run '${packageManager} install' and '${packageManager} tsc' manually`,
    );
  }, TEN_MINUTES_MS);

  await runCmd(`${packageManager} install`).finally(() =>
    clearTimeout(installTimeout),
  );
  await runCmd(`${packageManager} tsc`);
}

/**
 * Move temporary directory to destination application folder
 *
 * @param tempDir - source path to copy files from
 * @param destination - target path to copy files
 * @param id - item ID
 * @throws if `fs.move` fails
 */
export async function moveAppTask(
  tempDir: string,
  destination: string,
  id: string,
) {
  await Task.forItem('moving', id, async () => {
    await fs
      .move(tempDir, destination)
      .catch(error => {
        throw new Error(
          `Failed to move app from ${tempDir} to ${destination}: ${error.message}`,
        );
      })
      .finally(() => {
        // remove temporary files on both success and failure
        fs.removeSync(tempDir);
      });
  });
}

/**
 * Read git configs by creating a temp folder and initializing a repo
 *
 * @throws if `exec` fails
 */
export async function readGitConfig(): Promise<GitConfig | undefined> {
  const tempDir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'git-temp-dir-'));

  try {
    await exec('git init', { cwd: tempDir });
    await exec('git commit --allow-empty -m "Initial commit"', {
      cwd: tempDir,
    });

    const getDefaultBranch = await exec(
      'git branch --format="%(refname:short)"',
      { cwd: tempDir },
    );

    return {
      defaultBranch: getDefaultBranch.stdout?.trim() || undefined,
    };
  } catch (error) {
    return undefined;
  } finally {
    await fs.rm(tempDir, { recursive: true });
  }
}

/**
 * Initializes a git repository in the destination folder if possible
 *
 * @param dir - source path to initialize git repository in
 * @returns true if git repository was initialized
 */
export async function tryInitGitRepository(dir: string) {
  try {
    // Check if we're already in a git repo
    await exec('git rev-parse --is-inside-work-tree', { cwd: dir });
    return false;
  } catch {
    /* ignored */
  }

  try {
    await exec('git init', { cwd: dir });
    await exec('git add .', { cwd: dir });
    await exec('git commit -m "Initial commit"', { cwd: dir });
    return true;
  } catch (error) {
    try {
      await fs.rm(resolvePath(dir, '.git'), { recursive: true, force: true });
    } catch {
      throw new Error('Failed to remove .git folder');
    }

    return false;
  }
}

/**
 * This fetches the yarn.lock seed file at https://github.com/backstage/backstage/blob/master/packages/create-app/seed-yarn.lock
 * Its purpose is to lock individual dependencies with broken releases to known working versions.
 * This flow is decoupled from the release of the create-app package in order to avoid
 * the need to re-publish the create-app package whenever we want to update the seed file.
 *
 * @returns true if the yarn.lock seed file was fetched successfully
 */
export async function fetchYarnLockSeedTask(dir: string) {
  try {
    await Task.forItem('fetching', 'yarn.lock seed', async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(
        'https://raw.githubusercontent.com/backstage/backstage/master/packages/create-app/seed-yarn.lock',
        {
          signal: controller.signal,
        },
      );
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(
          `Request failed with status ${res.status} ${res.statusText}`,
        );
      }

      const initialYarnLockContent = await res.text();

      await fs.writeFile(
        resolvePath(dir, 'yarn.lock'),
        initialYarnLockContent
          .split('\n')
          .filter(l => !l.startsWith('//'))
          .join('\n'),
        'utf8',
      );
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Tries to get the version from a given command if possible
 *
 * @param command - command to run
 * @param options - the directory to run the command in, the current directory by default
 * @returns object - version with the version found and N/A if not found, error contains any error and undefined otherwise
 */
export async function tryCommandForVersion(
  command: string,
  options?: { cwd?: string },
) {
  try {
    const result = await exec(command, { cwd: options?.cwd });

    const version = (result.stdout || result.stderr).trim();
    return { version: version || 'N/A', error: undefined };
  } catch (error) {
    return { version: 'N/A', error: String(error) };
  }
}
