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

import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import fs from 'node:fs';
import path from 'node:path';
import { CommonJSModuleLoader } from './CommonJSModuleLoader';

// This is the copy of the module that Jest gives to tests, so changes to it
// do not affect how Node.js resolves modules
const nodeModule = require('node:module');

describe('CommonJSModuleLoader', () => {
  const originalNodeModulePaths = nodeModule._nodeModulePaths;
  const originalResolveFilename = nodeModule._resolveFilename;
  const originalGlobalPaths = nodeModule.globalPaths;
  const main = require.main!;
  const mainFilename = main.filename;
  const argv = process.argv;

  afterEach(() => {
    nodeModule._nodeModulePaths = originalNodeModulePaths;
    nodeModule._resolveFilename = originalResolveFilename;
    nodeModule.globalPaths = originalGlobalPaths;
    main.filename = mainFilename;
    process.argv = argv;
    jest.restoreAllMocks();
  });

  it('searches the root node_modules and the global folders before the host for dynamic plugins', async () => {
    const backstageRoot = path.resolve(__dirname, '../../../..');
    // The host is found through the main module, the script path, the
    // working directory, and the location of the loader itself
    main.filename = path.join(backstageRoot, 'packages/backend/src/index.ts');
    process.argv = [argv[0], path.join(backstageRoot, 'packages/app')];
    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(path.join(backstageRoot, 'plugins/app-node/src'));
    const hostNodeModules = [
      path.join(backstageRoot, 'packages/backend/src/node_modules'),
      path.join(backstageRoot, 'packages/app/node_modules'),
      path.join(backstageRoot, 'plugins/app-node/src/node_modules'),
      path.join(__dirname, 'node_modules'),
    ];
    const rootNodeModules = path.join(backstageRoot, 'node_modules');
    const customNodeModules = path.resolve(
      backstageRoot,
      '../custom/node_modules',
    );
    const pluginDir = path.resolve(
      backstageRoot,
      'dynamic-plugins-root/my-plugin',
    );
    // Dynamic plugins outside of the root reach the root through NODE_PATH
    const outsidePluginDir = path.resolve(
      backstageRoot,
      '../outside-dynamic-plugins/my-plugin',
    );
    const hostDir = path.resolve(backstageRoot, 'packages/other/src');
    // The global folders start with the NODE_PATH entries
    nodeModule.globalPaths = [customNodeModules, rootNodeModules];

    const loader = new CommonJSModuleLoader({
      logger: mockServices.logger.mock(),
    });
    await loader.bootstrap(
      backstageRoot,
      [pluginDir, outsidePluginDir],
      new Map(),
    );

    const pluginPaths: string[] = nodeModule._nodeModulePaths(
      path.resolve(pluginDir, 'dist'),
    );
    expect(pluginPaths.slice(0, 3)).toEqual([
      path.resolve(pluginDir, 'node_modules'),
      rootNodeModules,
      customNodeModules,
    ]);
    const outsidePluginPaths: string[] = nodeModule._nodeModulePaths(
      path.resolve(outsidePluginDir, 'dist'),
    );
    expect(outsidePluginPaths.slice(0, 3)).toEqual([
      path.resolve(outsidePluginDir, 'node_modules'),
      customNodeModules,
      rootNodeModules,
    ]);
    for (const paths of [pluginPaths, outsidePluginPaths]) {
      expect(paths).toEqual(expect.arrayContaining(hostNodeModules));
      expect(paths.filter(p => p === rootNodeModules)).toHaveLength(1);
      expect(paths.slice(3).every(p => p.startsWith(backstageRoot))).toBe(true);
    }

    // Modules outside of the dynamic plugins keep the regular search paths
    expect(nodeModule._nodeModulePaths(hostDir)).toEqual(
      originalNodeModulePaths(hostDir),
    );
  });

  it('resolves the modules of dynamic plugins through Node.js', async () => {
    const pluginSource =
      'exports.resolve = request => require.resolve(request);';
    const mockDir = createMockDirectory({
      content: {
        'project/node_modules/test-root-only/index.js': '',
        'project/node_modules/test-shared/index.js': '',
        'project/packages/backend/node_modules/test-shared/index.js': '',
        'project/packages/backend/node_modules/test-backend-only/index.js': '',
        'project/dynamic-plugins-root/plugin/index.js': pluginSource,
        'outside/plugin/index.js': pluginSource,
        'custom/node_modules/test-shared/index.js': '',
      },
    });
    const baseDir = fs.realpathSync(mockDir.path);
    const backstageRoot = path.join(baseDir, 'project');
    const rootNodeModules = path.join(backstageRoot, 'node_modules');
    const backendNodeModules = path.join(
      backstageRoot,
      'packages/backend/node_modules',
    );
    const customNodeModules = path.join(baseDir, 'custom/node_modules');
    const pluginDir = path.join(backstageRoot, 'dynamic-plugins-root/plugin');
    const outsidePluginDir = path.join(baseDir, 'outside/plugin');

    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(path.join(backstageRoot, 'packages/backend'));

    const loader = new CommonJSModuleLoader({
      logger: mockServices.logger.mock(),
    });
    // Use the module that Node.js resolves with, and restore it afterwards
    const realNodeModule = await loader.load('node:module');
    const realNodeModulePaths = realNodeModule._nodeModulePaths;
    const realResolveFilename = realNodeModule._resolveFilename;
    const realGlobalPaths = realNodeModule.globalPaths;
    (loader as any).module = realNodeModule;
    try {
      realNodeModule.globalPaths = [customNodeModules, rootNodeModules];
      await loader.bootstrap(
        backstageRoot,
        [pluginDir, outsidePluginDir],
        new Map(),
      );
      const plugin = await loader.load(pluginDir);
      const outsidePlugin = await loader.load(outsidePluginDir);

      // The root comes first, then the global folders, and the backend
      // package last
      expect(plugin.resolve('test-shared')).toBe(
        path.join(rootNodeModules, 'test-shared/index.js'),
      );
      expect(outsidePlugin.resolve('test-shared')).toBe(
        path.join(customNodeModules, 'test-shared/index.js'),
      );
      for (const p of [plugin, outsidePlugin]) {
        expect(p.resolve('test-root-only')).toBe(
          path.join(rootNodeModules, 'test-root-only/index.js'),
        );
        expect(p.resolve('test-backend-only')).toBe(
          path.join(backendNodeModules, 'test-backend-only/index.js'),
        );
        expect(() => p.resolve('test-missing')).toThrow(
          expect.objectContaining({ code: 'MODULE_NOT_FOUND' }),
        );
      }
    } finally {
      realNodeModule._nodeModulePaths = realNodeModulePaths;
      realNodeModule._resolveFilename = realResolveFilename;
      realNodeModule.globalPaths = realGlobalPaths;
    }
  });
});
