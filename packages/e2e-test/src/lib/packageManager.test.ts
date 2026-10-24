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

import { getPackageManager } from './packageManager';

describe('getPackageManager', () => {
  it('should build yarn commands', () => {
    const pm = getPackageManager('yarn');
    expect(pm.name).toBe('yarn');
    expect(pm.createAppArgs()).toEqual(['--package-manager', 'yarn']);
    expect(pm.install()).toEqual(['yarn', 'install']);
    expect(pm.run('tsc:full')).toEqual(['yarn', 'tsc:full']);
    expect(pm.run('test', '--no-watch')).toEqual([
      'yarn',
      'test',
      '--no-watch',
    ]);
    expect(pm.workspaceRun('backend', 'start', '--config', 'a.yaml')).toEqual([
      'yarn',
      'workspace',
      'backend',
      'start',
      '--config',
      'a.yaml',
    ]);
    expect(pm.newPackage('--select', 'frontend-plugin')).toEqual([
      'yarn',
      'new',
      '--select',
      'frontend-plugin',
    ]);
    expect(pm.stderrNoisePatterns).toEqual([]);
  });

  it('should build pnpm commands', () => {
    const pm = getPackageManager('pnpm');
    expect(pm.name).toBe('pnpm');
    expect(pm.createAppArgs()).toEqual(['--package-manager', 'pnpm']);
    expect(pm.install()).toEqual(['pnpm', 'install']);
    expect(pm.run('tsc:full')).toEqual(['pnpm', 'run', 'tsc:full']);
    expect(pm.run('test', '--no-watch')).toEqual([
      'pnpm',
      'run',
      'test',
      '--no-watch',
    ]);
    expect(pm.workspaceRun('backend', 'start', '--config', 'a.yaml')).toEqual([
      'pnpm',
      '--filter',
      'backend',
      'run',
      'start',
      '--config',
      'a.yaml',
    ]);
    expect(pm.newPackage('--select', 'frontend-plugin')).toEqual([
      'pnpm',
      'run',
      'new',
      '--select',
      'frontend-plugin',
    ]);
    const isNoise = (line: string) =>
      pm.stderrNoisePatterns.some(pattern => pattern.test(line));
    expect(
      isNoise('$ backstage-cli package start --config app-config.yaml'),
    ).toBe(true);
    expect(isNoise('2026-01-01T00:00:00.000Z backstage error $ oops')).toBe(
      false,
    );
  });

  it('should reject unknown package managers', () => {
    expect(() => getPackageManager('npm')).toThrow(
      "Unsupported package manager 'npm', expected 'yarn' or 'pnpm'",
    );
  });
});
