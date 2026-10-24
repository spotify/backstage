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

import { ForwardedError, NotFoundError } from '@backstage/errors';
import {
  PackageInfo,
  PackageManager,
  PackageManagerInstallOptions,
} from '../PackageManager';
import { Lockfile } from '../Lockfile';
import { YarnLockfile } from './YarnLockfile';
import { YarnVersion } from './types';
import { run, runOutput, RunOptions, targetPaths } from '@backstage/cli-common';
import { hasBackstageYarnPlugin } from '../../yarn/yarnPlugin';
import { resolve as resolvePath } from 'node:path';

// Possible `yarn info` output from yarn classic
type YarnClassicInfo = {
  type: 'inspect';
  data: PackageInfo | { type: string; data: unknown };
};

/**
 * Options for {@link Yarn.create}.
 *
 * @alpha
 */
export type YarnCreateOptions = {
  /**
   * The root of the workspace that the instance is bound to. Defaults to the
   * workspace root of the current working directory.
   */
  workspaceRootDir?: string;
};

/**
 * The {@link PackageManager} implementation for Yarn, supporting both Yarn
 * classic and modern Yarn.
 *
 * @alpha
 */
export class Yarn implements PackageManager {
  /**
   * Creates an instance bound to a workspace root, using the version of Yarn
   * that runs in that directory.
   */
  static async create(options?: YarnCreateOptions): Promise<Yarn> {
    const workspaceRootDir =
      options?.workspaceRootDir ?? targetPaths.workspaceRootDir;
    const yarnVersion = await detectYarnVersion(workspaceRootDir);
    return new Yarn(workspaceRootDir, yarnVersion);
  }

  private constructor(
    private readonly workspaceRootDir: string,
    private readonly yarnVersion: YarnVersion,
  ) {}

  /** {@inheritDoc PackageManager.name} */
  name() {
    return 'yarn';
  }

  /** {@inheritDoc PackageManager.version} */
  async version() {
    return this.yarnVersion.version;
  }

  /** {@inheritDoc PackageManager.lockfileName} */
  lockfileName(): string {
    return 'yarn.lock';
  }

  /**
   * Runs `yarn install` in the workspace root. An immutable install uses
   * `--immutable`, or `--frozen-lockfile` with Yarn classic.
   */
  async install(options?: PackageManagerInstallOptions) {
    const { immutable, offline, env, onStdout, onStderr } = options ?? {};
    const classic = this.yarnVersion.codename === 'classic';

    const args = ['install'];
    if (immutable) {
      args.push(classic ? '--frozen-lockfile' : '--immutable');
    }
    if (offline && classic) {
      args.push('--offline');
    }

    await this.run(args, {
      env: {
        // We filter out all of the npm_* environment variables that are added when
        // executing through yarn. This works around an issue where these variables
        // incorrectly override local yarn or npm config in the project directory.
        ...Object.fromEntries(
          Object.entries(process.env).map(([name, value]) =>
            name.startsWith('npm_') ? [name, undefined] : [name, value],
          ),
        ),
        // Yarn enables immutable installs by default in CI, so we explicitly
        // disable them when a mutable install has been requested.
        ...(immutable === false
          ? { YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' }
          : {}),
        ...(offline && !classic ? { YARN_ENABLE_NETWORK: '0' } : {}),
        ...env,
      },
      onStdout,
      onStderr,
    });
  }

  /** {@inheritDoc PackageManager.run} */
  async run(args: string[], options?: RunOptions) {
    await run(['yarn', ...args], {
      ...options,
      cwd: options?.cwd ?? this.workspaceRootDir,
    }).waitForExit();
  }

  /** Runs `yarn run <script> [args]`. */
  async runScript(script: string, args: string[] = [], options?: RunOptions) {
    await this.run(['run', script, ...args], options);
  }

  /** Runs `yarn workspace <workspace> <script> [args]`. */
  async runWorkspaceScript(
    workspace: string,
    script: string,
    args: string[] = [],
    options?: RunOptions,
  ) {
    await this.run(['workspace', workspace, script, ...args], options);
  }

  /**
   * Runs `yarn pack` in the package directory, using `--filename` with Yarn
   * classic and `--out` with modern Yarn.
   */
  async pack(output: string, packageDir: string, options?: RunOptions) {
    const outArg =
      this.yarnVersion.codename === 'classic' ? '--filename' : '--out';
    await this.run(['pack', outArg, output], {
      ...options,
      cwd: packageDir,
    });
  }

  /**
   * Fetches package information using `yarn info` with Yarn classic and
   * `yarn npm info` with modern Yarn.
   */
  async fetchPackageInfo(name: string): Promise<PackageInfo> {
    const { codename } = this.yarnVersion;

    const cmd = codename === 'classic' ? ['info'] : ['npm', 'info'];
    try {
      const output = await runOutput(['yarn', ...cmd, '--json', name], {
        cwd: this.workspaceRootDir,
      });

      if (!output) {
        throw new NotFoundError(
          `No package information found for package ${name}`,
        );
      }

      if (codename === 'berry') {
        return JSON.parse(output) as PackageInfo;
      }

      const info = JSON.parse(output) as YarnClassicInfo;
      if (info.type !== 'inspect') {
        throw new Error(`Received unknown yarn info for ${name}, ${output}`);
      }

      return info.data as PackageInfo;
    } catch (error) {
      if (codename === 'classic') {
        throw error;
      }

      if (
        error instanceof Error &&
        'stdout' in error &&
        typeof error.stdout === 'string' &&
        error.stdout.includes('Response Code: 404')
      ) {
        throw new NotFoundError(
          `No package information found for package ${name}`,
        );
      }

      throw error;
    }
  }

  /** Loads the `yarn.lock` file in the workspace root. */
  async loadLockfile(): Promise<Lockfile> {
    return YarnLockfile.load(
      resolvePath(this.workspaceRootDir, this.lockfileName()),
    );
  }

  /** Parses the given `yarn.lock` contents. */
  async parseLockfile(contents: string): Promise<Lockfile> {
    return YarnLockfile.parse(contents);
  }

  /**
   * Whether the Backstage Yarn plugin is installed in the workspace, which
   * provides the 'backstage:^' version protocol.
   */
  async supportsBackstageVersionProtocol(): Promise<boolean> {
    return hasBackstageYarnPlugin(this.workspaceRootDir);
  }

  /** {@inheritDoc PackageManager.getCommandHint} */
  getCommandHint(args: string[]): string {
    return ['yarn', ...args].join(' ');
  }

  /** {@inheritDoc PackageManager.toString} */
  toString(): string {
    return `${this.name()}@${this.yarnVersion.version}`;
  }
}

const versions = new Map<string, Promise<YarnVersion>>();

function detectYarnVersion(dir: string): Promise<YarnVersion> {
  if (versions.has(dir)) {
    return versions.get(dir)!;
  }

  const promise = Promise.resolve().then(async () => {
    try {
      const stdout = await runOutput(['yarn', '--version'], {
        cwd: dir,
      });
      const versionString = stdout.trim();
      const codename: 'classic' | 'berry' = versionString.startsWith('1.')
        ? 'classic'
        : 'berry';
      return { version: versionString, codename };
    } catch (error) {
      throw new ForwardedError('Failed to determine yarn version', error);
    }
  });

  versions.set(dir, promise);
  // A failed version check is not cached, so that the next attempt runs again
  promise.catch(() => {
    versions.delete(dir);
  });
  return promise;
}
