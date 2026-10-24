/*
 * Copyright 2026 The Backstage Authors
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

export type PackageManagerName = 'yarn' | 'pnpm';

/**
 * The commands that the e2e test runs in the created app, as argument lists
 * for the selected package manager.
 */
export interface PackageManager {
  name: PackageManagerName;
  /** Arguments that select the package manager in the create-app CLI */
  createAppArgs(): string[];
  /** Installs the dependencies of the app */
  install(): string[];
  /** Runs a script in the root of the app */
  run(script: string, ...args: string[]): string[];
  /** Runs a script in one of the workspace packages of the app */
  workspaceRun(workspace: string, script: string, ...args: string[]): string[];
  /** Runs `backstage-cli new` through the `new` script of the app */
  newPackage(...args: string[]): string[];
  /**
   * Lines that the package manager itself writes to stderr when it runs a
   * script. They are not output from the script and should be ignored when
   * checking that a script kept stderr clean.
   */
  stderrNoisePatterns: RegExp[];
}

const yarn: PackageManager = {
  name: 'yarn',
  createAppArgs: () => ['--package-manager', 'yarn'],
  install: () => ['yarn', 'install'],
  run: (script, ...args) => ['yarn', script, ...args],
  workspaceRun: (workspace, script, ...args) => [
    'yarn',
    'workspace',
    workspace,
    script,
    ...args,
  ],
  newPackage: (...args) => ['yarn', 'new', ...args],
  stderrNoisePatterns: [],
};

const pnpm: PackageManager = {
  name: 'pnpm',
  createAppArgs: () => ['--package-manager', 'pnpm'],
  install: () => ['pnpm', 'install'],
  run: (script, ...args) => ['pnpm', 'run', script, ...args],
  workspaceRun: (workspace, script, ...args) => [
    'pnpm',
    '--filter',
    workspace,
    'run',
    script,
    ...args,
  ],
  newPackage: (...args) => ['pnpm', 'run', 'new', ...args],
  // pnpm echoes the command that a script expands to, for example
  // `$ backstage-cli package start`, on stderr before it runs the script.
  // pnpm 11 dims it with color codes.
  // eslint-disable-next-line no-control-regex
  stderrNoisePatterns: [/^(?:\x1b\[[\d;]*m)*\$ /],
};

export function getPackageManager(name: string): PackageManager {
  switch (name) {
    case 'yarn':
      return yarn;
    case 'pnpm':
      return pnpm;
    default:
      throw new Error(
        `Unsupported package manager '${name}', expected 'yarn' or 'pnpm'`,
      );
  }
}
