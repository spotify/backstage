/*
 * Copyright 2023 The Backstage Authors
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
  DynamicPluginManager,
  dynamicPluginsServiceFactoryWithOptions,
} from './plugin-manager';
import {
  BackendFeature,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import * as path from 'node:path';
import * as url from 'node:url';
import fs from 'node:fs';
import {
  BackendDynamicPlugin,
  BaseDynamicPlugin,
  DynamicPlugin,
  NewBackendPluginInstaller,
} from './types';
import { ScannedPluginManifest, ScannedPluginPackage } from '../scanner/types';
import { randomUUID } from 'node:crypto';
import { createSpecializedBackend } from '@backstage/backend-app-api';
import { ConfigSources } from '@backstage/config-loader';
import { Logs, MockedLogger, LogContent } from '../__testUtils__/testUtils';
import { PluginScanner } from '../scanner/plugin-scanner';
import { targetPaths } from '@backstage/cli-common';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { rootLifecycleServiceFactory } from '@backstage/backend-defaults/rootLifecycle';
import { BackstagePackageJson, PackageRole } from '@backstage/cli-node';

describe('backend-dynamic-feature-service', () => {
  const mockDir = createMockDirectory();

  describe('loadPlugins', () => {
    afterEach(() => {
      jest.resetModules();
    });

    type TestCase = {
      name: string;
      packageManifest: ScannedPluginManifest;
      indexFile?: {
        relativePath: string[];
        content: string;
      };
      alpha?: {
        packageManifest: BackstagePackageJson;
        indexFile: {
          relativePath: string[];
          content: string;
        };
      };
      expectedLogs?(location: URL): {
        errors?: LogContent[];
        warns?: LogContent[];
        infos?: LogContent[];
        debugs?: LogContent[];
      };
      checkLoadedPlugins: (loadedPlugins: BaseDynamicPlugin[]) => void;
    };

    it.each<TestCase>([
      {
        name: 'should successfully load a new backend plugin',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content:
            'exports.dynamicPluginInstaller={ kind: "new", install: () => [] }',
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect(installer.install()).toEqual<
            BackendFeature | BackendFeature[]
          >([]);
        },
      },
      {
        name: 'should successfully load a new backend plugin by the default BackendFeature',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: `const feature = { $$type: '@backstage/BackendFeature' }; exports["default"] = feature;`,
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect((installer.install() as BackendFeature).$$type).toEqual(
            '@backstage/BackendFeature',
          );
        },
      },
      {
        name: 'should load the alpha variant of a backend plugin in priority',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: `throw 'should not take this one';`,
        },
        alpha: {
          packageManifest: {
            name: 'backend-dynamic-plugin-test',
            version: '0.0.0',
            main: '../dist/alpha.cjs.js',
          },
          indexFile: {
            relativePath: ['dist', 'alpha.cjs.js'],
            content: `const alpha = { $$type: '@backstage/BackendFeature' }; exports["default"] = alpha;`,
          },
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}/alpha'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect((installer.install() as BackendFeature).$$type).toEqual(
            '@backstage/BackendFeature',
          );
        },
      },
      {
        name: 'should fall back to main export when alpha does not provide a plugin entrypoint',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: `const plugin = { $$type: '@backstage/BackendFeature' }; exports["default"] = plugin;`,
        },
        alpha: {
          packageManifest: {
            name: 'backend-dynamic-plugin-test',
            version: '0.0.0',
            main: '../dist/alpha.cjs.js',
          },
          indexFile: {
            relativePath: ['dist', 'alpha.cjs.js'],
            content: `exports.supplementaryExport = {};`,
          },
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect((installer.install() as BackendFeature).$$type).toEqual(
            '@backstage/BackendFeature',
          );
        },
      },
      {
        name: 'should successfully load a new backend plugin by the default BackendFeatureFactory',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: `const alpha = () => { return { $$type: '@backstage/BackendFeature' } };
             alpha.$$type = '@backstage/BackendFeatureFactory';
             exports["default"] = alpha;`,
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect((installer.install() as BackendFeature).$$type).toEqual(
            '@backstage/BackendFeature',
          );
        },
      },
      {
        name: 'should successfully load a new backend plugin module',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin-module',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content:
            'exports.dynamicPluginInstaller={ kind: "new", install: () => [] }',
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin-module',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect(installer.install()).toEqual<
            BackendFeature | BackendFeature[]
          >([]);
        },
      },
      {
        name: 'should successfully load a backend plugin wrapped in a BackendFeatureCompatWrapper function',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: `
          function backendFeatureCompatWrapper() {
            return backendFeatureCompatWrapper;
          }
          Object.assign(backendFeatureCompatWrapper, {
            $$type: "@backstage/BackendFeature",
            version: "v1",
          });
          const alpha = backendFeatureCompatWrapper;
          exports.default = alpha;
          `,
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect((installer.install() as BackendFeature).$$type).toEqual(
            '@backstage/BackendFeature',
          );
        },
      },
      {
        name: 'should ignore plugin package with incompatible role',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'node-library',
          },
          main: 'dist/index.cjs.js',
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `skipping dynamic plugin package 'backend-dynamic-plugin-test' from '${location}': incompatible role 'node-library'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([]);
        },
      },
      {
        name: 'should fail when no index file',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `an error occurred while loading dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
                meta: {
                  name: 'Error',
                  message: expect.stringContaining(
                    `Cannot find module '${path.resolve(
                      url.fileURLToPath(location),
                      'dist/index.cjs.js',
                    )}' from `,
                  ),
                  _originalMessage: expect.stringContaining(
                    `Cannot find module '${path.resolve(
                      url.fileURLToPath(location),
                      'dist/index.cjs.js',
                    )}' from `,
                  ),
                  code: 'MODULE_NOT_FOUND',
                  hint: '',
                  moduleName: `${path.resolve(
                    url.fileURLToPath(location),
                    'dist/index.cjs.js',
                  )}`,
                  siblingWithSimilarExtensionFound: false,
                  requireStack: undefined,
                },
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              failure: expect.stringMatching(
                `^Error: Cannot find module '[^']*' from .*`,
              ),
            },
          ]);
        },
      },
      {
        name: 'should fail when the expected entry point is not in the index file',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: '',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `dynamic backend plugin 'backend-dynamic-plugin-test' could not be loaded from '${location}': the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              failure: `the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`,
            },
          ]);
        },
      },
      {
        name: 'should fail when the expected entry point is not of the expected type',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content:
            'exports.dynamicPluginInstaller={ something: "else", unexpectedMethod() {} }',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `dynamic backend plugin 'backend-dynamic-plugin-test' could not be loaded from '${location}': the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              failure: `the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`,
            },
          ]);
        },
      },
      {
        name: 'should fail when the index file has a syntax error',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: 'strange text with syntax error',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `an error occurred while loading dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
                meta: {
                  message: expect.stringContaining('Unexpected identifier'),
                  name: 'SyntaxError',
                },
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              failure: expect.stringMatching(
                `^SyntaxError: Unexpected identifier.*`,
              ),
            },
          ]);
        },
      },
      {
        name: 'should successfully load a frontend plugin',
        packageManifest: {
          name: 'frontend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'frontend-plugin',
          },
          main: 'dist/index.esm.js',
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'frontend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'frontend-plugin',
              platform: 'web',
            },
          ]);
        },
      },
      {
        name: 'should successfully load a frontend plugin (experimental dynamic container)',
        packageManifest: {
          name: 'frontend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'frontend-dynamic-container' as PackageRole,
          },
          main: 'dist/index.esm.js',
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'frontend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'frontend-dynamic-container',
              platform: 'web',
            },
          ]);
        },
      },
    ])('$name', async (tc: TestCase): Promise<void> => {
      const plugin: ScannedPluginPackage = {
        location: url.pathToFileURL(mockDir.resolve(randomUUID())),
        manifest: tc.packageManifest,
        alphaManifest: tc.alpha?.packageManifest,
      };

      const mockedFiles = {
        [path.join(url.fileURLToPath(plugin.location), 'package.json')]:
          JSON.stringify(tc.packageManifest),
      };
      if (tc.indexFile) {
        mockedFiles[
          path.join(
            url.fileURLToPath(plugin.location),
            ...tc.indexFile.relativePath,
          )
        ] = tc.indexFile.content;
      }
      if (tc.alpha) {
        mockedFiles[
          path.join(url.fileURLToPath(plugin.location), 'alpha', 'package.json')
        ] = JSON.stringify(tc.alpha.packageManifest);
        mockedFiles[
          path.join(
            url.fileURLToPath(plugin.location),
            ...tc.alpha.indexFile.relativePath,
          )
        ] = tc.alpha.indexFile.content;
      }

      mockDir.setContent(mockedFiles);

      const logger = new MockedLogger();
      const pluginManager = new (DynamicPluginManager as any)(
        logger,
        [plugin],
        {
          logger,
          async bootstrap(_: string, __: string[]): Promise<void> {},
          load: async (packagePath: string) =>
            await require(/* webpackIgnore: true */ packagePath),
        },
      );

      const loadedPlugins: DynamicPlugin[] = await pluginManager.loadPlugins();

      const expectedLogs = tc.expectedLogs
        ? tc.expectedLogs(plugin.location)
        : {};
      expect(logger.logs).toEqual<Logs>(expectedLogs);

      tc.checkLoadedPlugins(loadedPlugins);
    });
  });

  describe('plugin getters', () => {
    const plugins: BaseDynamicPlugin[] = [
      {
        name: 'a-frontend-plugin',
        platform: 'web',
        role: 'frontend-plugin',
        version: '0.0.0',
      },
      {
        name: 'a-frontend-module',
        platform: 'web',
        role: 'frontend-plugin-module',
        version: '0.0.0',
      },
      {
        name: 'a-failing-frontend-plugin',
        platform: 'web',
        role: 'frontend-plugin',
        version: '0.0.0',
        failure: 'Some frontend failure',
      },
      {
        name: 'a-backend-plugin',
        platform: 'node',
        role: 'backend-plugin',
        version: '0.0.0',
      },
      {
        name: 'a-backend-module',
        platform: 'node',
        role: 'backend-plugin-module',
        version: '0.0.0',
      },
      {
        name: 'a-failing-backend-plugin',
        platform: 'node',
        role: 'backend-plugin',
        version: '0.0.0',
        failure: 'Some backend failure',
      },
    ];

    it('should return only backend plugins and modules', async () => {
      const logger = new MockedLogger();
      const pluginManager = new (DynamicPluginManager as any)(
        logger,
        [],
      ) as DynamicPluginManager;
      (pluginManager as any)._plugins = plugins;
      expect(pluginManager.backendPlugins()).toEqual([
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
      ]);
      expect(pluginManager.backendPlugins({ includeFailed: false })).toEqual([
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
      ]);
      expect(pluginManager.backendPlugins({ includeFailed: true })).toEqual([
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
        {
          name: 'a-failing-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
          failure: 'Some backend failure',
        },
      ]);
    });

    it('should return only frontend plugins', async () => {
      const logger = new MockedLogger();
      const pluginManager = new (DynamicPluginManager as any)(
        logger,
        [],
      ) as DynamicPluginManager;
      (pluginManager as any)._plugins = plugins;
      expect(pluginManager.frontendPlugins()).toEqual([
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
      ]);
      expect(pluginManager.frontendPlugins({ includeFailed: false })).toEqual([
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
      ]);
      expect(pluginManager.frontendPlugins({ includeFailed: true })).toEqual([
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
        {
          name: 'a-failing-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
          failure: 'Some frontend failure',
        },
      ]);
    });

    it('should return all plugins', async () => {
      const logger = new MockedLogger();
      const pluginManager = new (DynamicPluginManager as any)(
        logger,
        [],
      ) as DynamicPluginManager;
      (pluginManager as any)._plugins = plugins;
      expect(pluginManager.plugins()).toEqual([
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
      ]);
      expect(pluginManager.plugins({ includeFailed: false })).toEqual([
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
      ]);
      expect(pluginManager.plugins({ includeFailed: true })).toEqual([
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
        {
          name: 'a-failing-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
          failure: 'Some frontend failure',
        },
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
        {
          name: 'a-failing-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
          failure: 'Some backend failure',
        },
      ]);
    });
  });

  describe('get scanned package', () => {
    it('should return the scanned package of the plugin', async () => {
      const logger = new MockedLogger();
      const packageFolder = mockDir.resolve(randomUUID());
      const scannedPackage = {
        manifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        location: url.pathToFileURL(packageFolder),
      };
      const plugin = {
        name: 'backend-dynamic-plugin-test',
        version: '0.0.0',
        role: 'backend-plugin',
        platform: 'node',
        installer: {
          kind: 'new',
        },
      } as BackendDynamicPlugin;

      const pluginManager = new (DynamicPluginManager as any)(logger, [
        scannedPackage,
      ]) as DynamicPluginManager;
      (pluginManager as any)._plugins = [plugin];

      expect(pluginManager.getScannedPackage(plugin)).toEqual(scannedPackage);
    });
  });

  describe('dynamicPluginsServiceFactory', () => {
    const otherMockDir = createMockDirectory();

    afterEach(() => {
      mockDir.clear();
      otherMockDir.clear();
      jest.resetModules();
    });

    it('should call PluginManager.fromConfig', async () => {
      const logger = new MockedLogger();
      const rootLogger = new MockedLogger();

      mockDir.setContent({
        'package.json': fs.readFileSync(
          targetPaths.resolveWorkspaceRoot('package.json'),
        ),
        'dynamic-plugins-root': {},
        'dynamic-plugins-root/a-dynamic-plugin': ctx =>
          ctx.symlink(otherMockDir.resolve('a-dynamic-plugin')),
      });
      otherMockDir.setContent({
        'a-dynamic-plugin': {},
      });

      const fromConfigSpier = jest.spyOn(DynamicPluginManager, 'create');
      const applyConfigSpier = jest
        .spyOn(PluginScanner.prototype as any, 'applyConfig')
        .mockImplementation(() => {});
      const scanRootSpier = jest
        .spyOn(PluginScanner.prototype, 'scanRoot')
        .mockImplementation(async () => ({
          packages: [
            {
              location: url.pathToFileURL(
                mockDir.resolve('dynamic-plugins-root/a-dynamic-plugin'),
              ),
              manifest: {
                name: 'test',
                version: '0.0.0',
                main: 'dist/index.cjs.js',
                backstage: {
                  role: 'backend-plugin',
                },
              },
            },
          ],
        }));
      const mockedModuleLoader = {
        logger,
        bootstrap: jest.fn(),
        load: jest.fn(),
      };

      const backend = createSpecializedBackend({
        defaultServiceFactories: [
          rootLifecycleServiceFactory,
          createServiceFactory({
            service: coreServices.rootConfig,
            deps: {},
            async factory({}) {
              return await ConfigSources.toConfig({
                async *readConfigData() {
                  yield {
                    configs: [
                      {
                        context: 'test',
                        data: {},
                      },
                    ],
                  };
                },
              });
            },
          }),
          createServiceFactory({
            service: coreServices.logger,
            deps: {},
            async factory({}) {
              return logger;
            },
          }),
          createServiceFactory({
            service: coreServices.rootLogger,
            deps: {},
            async factory({}) {
              return rootLogger;
            },
          }),
          dynamicPluginsServiceFactoryWithOptions({
            moduleLoader: _ => mockedModuleLoader,
          }),
        ],
      });

      await backend.start();
      expect(fromConfigSpier).toHaveBeenCalled();
      expect(applyConfigSpier).toHaveBeenCalled();
      expect(scanRootSpier).toHaveBeenCalled();
      const realPath = fs.realpathSync(
        otherMockDir.resolve('a-dynamic-plugin'),
      );
      expect(mockedModuleLoader.bootstrap).toHaveBeenCalledWith(
        targetPaths.workspaceRootDir,
        [realPath],
        new Map<string, ScannedPluginManifest>([
          [
            realPath,
            {
              name: 'test',
              main: 'dist/index.cjs.js',
              version: '0.0.0',
              backstage: {
                role: 'backend-plugin',
              },
            },
          ],
        ]),
      );
      expect(mockedModuleLoader.load).toHaveBeenCalledWith(
        mockDir.resolve(
          'dynamic-plugins-root/a-dynamic-plugin/dist/index.cjs.js',
        ),
      );
    });
  });
});
