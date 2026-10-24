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

import { PackageGraph } from '@backstage/cli-node';
import { PackageManager } from '@backstage/cli-node/alpha';
import { findTargetPackages } from './start';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';

jest.mock('@backstage/cli-node/alpha', () => ({
  ...jest.requireActual('@backstage/cli-node/alpha'),
  detectPackageManager: async () =>
    ({
      getCommandHint: (args: string[]) => ['yarn', ...args].join(' '),
    } as Partial<PackageManager> as PackageManager),
}));

overrideTargetPaths('/root');

const mocks = {
  app: {
    packageJson: {
      name: 'app',
      version: '0',
      backstage: { role: 'frontend' },
    },
    dir: '/root/packages/app',
  },
  backend: {
    packageJson: {
      name: 'backend',
      version: '0',
      backstage: { role: 'backend' },
    },
    dir: '/root/packages/backend',
  },
  appNext: {
    packageJson: {
      name: 'app-next',
      version: '0',
      backstage: { role: 'frontend' },
    },
    dir: '/root/packages/app-next',
  },
  backendNext: {
    packageJson: {
      name: 'backend-next',
      version: '0',
      backstage: { role: 'backend' },
    },
    dir: '/root/packages/backend-next',
  },
  otherApp: {
    packageJson: {
      name: 'other-app',
      version: '0',
      backstage: { role: 'frontend' },
    },
    dir: '/root/packages/other-app',
  },
  pluginX: {
    packageJson: {
      name: 'plugin-x',
      version: '0',
      backstage: { role: 'frontend-plugin', pluginId: 'x' },
    },
    dir: '/root/plugins/plugin-x',
  },
  pluginXBackend: {
    packageJson: {
      name: 'plugin-x-backend',
      version: '0',
      backstage: { role: 'backend-plugin', pluginId: 'x' },
    },
    dir: '/root/plugins/plugin-x-backend',
  },
  pluginY: {
    packageJson: {
      name: 'plugin-y',
      version: '0',
      backstage: { role: 'frontend-plugin', pluginId: 'y' },
    },
    dir: '/root/plugins/plugin-y',
  },
  pluginYBackend: {
    packageJson: {
      name: 'plugin-y-backend',
      version: '0',
      backstage: { role: 'backend-plugin', pluginId: 'y' },
    },
    dir: '/root/plugins/plugin-y-backend',
  },
} as const;

describe('findTargetPackages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should select default packages', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(Object.values(mocks));
    const result = await findTargetPackages([], []);
    expect(result).toEqual([mocks.app, mocks.backend]);
  });

  it('should select packages by plugin ID', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(Object.values(mocks));
    const result = await findTargetPackages([], ['x']);
    expect(result).toEqual([mocks.pluginX, mocks.pluginXBackend]);
  });

  it('should throw an error if no packages match the plugin ID', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(Object.values(mocks));
    await expect(
      findTargetPackages([], ['nonexistent-plugin']),
    ).rejects.toThrow(
      "Unable to find any plugin packages with plugin ID 'nonexistent-plugin'. Make sure backstage.pluginId is set in your package.json files by running 'yarn fix --publish'.",
    );
  });

  it('should select packages by explicit names', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(Object.values(mocks));
    const result = await findTargetPackages(['other-app'], []);
    expect(result).toEqual([mocks.otherApp]);
  });

  it('should throw an error if no package matches the explicit name', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(Object.values(mocks));
    await expect(
      findTargetPackages(['nonexistent-package'], []),
    ).rejects.toThrow("Unable to find package by name 'nonexistent-package'");
  });

  it('should select packages by relative path', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(Object.values(mocks));
    const result = await findTargetPackages(
      ['packages/app', 'packages/backend-next'],
      [],
    );
    expect(result).toEqual([mocks.app, mocks.backendNext]);
  });

  it('should throw an error if no package matches the relative path', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue(Object.values(mocks));
    await expect(findTargetPackages(['nonexistent/path'], [])).rejects.toThrow(
      "Unable to find package by name 'nonexistent/path'",
    );
  });

  it('should select a single frontend or backend package if no arguments are provided', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([mocks.app]);
    const result = await findTargetPackages([], []);
    expect(result).toEqual([mocks.app]);
  });

  it('should throw an error if multiple frontend packages other than packages/app are found without explicit selection', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([mocks.otherApp, mocks.appNext]);
    await expect(findTargetPackages([], [])).rejects.toThrow(
      "Found multiple packages with role 'frontend' but none of the use the default path '/root/packages/app',choose which packages you want to run by passing the package names explicitly as arguments, for example 'yarn backstage-cli repo start my-app my-backend'.",
    );
  });

  it('should select a single plugin package if no app or backend packages are found', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([mocks.pluginX]);
    const result = await findTargetPackages([], []);
    expect(result).toEqual([mocks.pluginX]);
  });

  it('should select a pair of plugin packages if no app or backend packages are found', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([mocks.pluginX, mocks.pluginXBackend]);
    const result = await findTargetPackages([], []);
    expect(result).toEqual([mocks.pluginX, mocks.pluginXBackend]);
  });

  // Right now we're not validating this because it requires backstage.pluginId to be set, and it's a strange case anyway
  it('should select a pair of plugin packages even if they are from different plugins', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([mocks.pluginX, mocks.pluginYBackend]);
    const result = await findTargetPackages([], []);
    expect(result).toEqual([mocks.pluginX, mocks.pluginYBackend]);
  });

  it('should throw an error if multiple plugin packages are found without explicit selection', async () => {
    jest
      .spyOn(PackageGraph, 'listTargetPackages')
      .mockResolvedValue([mocks.pluginX, mocks.pluginY]);
    await expect(findTargetPackages([], [])).rejects.toThrow(
      "Found multiple packages with role 'frontend-plugin', please choose which packages you want to run by passing the package names explicitly as arguments, for example 'yarn backstage-cli repo start my-plugin my-plugin-backend'.",
    );
  });
});
