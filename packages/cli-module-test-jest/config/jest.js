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

const fs = require('fs-extra');
const path = require('node:path');
const crypto = require('node:crypto');
const { getPackages } = require('@manypkg/get-packages');
const { version } = require('../package.json');
const { targetPaths } = require('@backstage/cli-common');
const {
  getJestEnvironment,
  getJestMajorVersion,
  getJestNodeEnvironment,
} = require('./getJestEnvironment');

const SRC_EXTS = ['ts', 'js', 'tsx', 'jsx', 'mts', 'cts', 'mjs', 'cjs'];

const FRONTEND_ROLES = [
  'frontend',
  'web-library',
  'common-library',
  'frontend-plugin',
  'frontend-plugin-module',
];

const NODE_ROLES = [
  'backend',
  'cli',
  'cli-module',
  'node-library',
  'backend-plugin',
  'backend-plugin-module',
];

const envOptions = {
  oldTests: Boolean(process.env.BACKSTAGE_OLD_TESTS),
};

try {
  require.resolve('react-dom/client', {
    paths: [targetPaths.installationRootDir],
  });
  process.env.HAS_REACT_DOM_CLIENT = true;
} catch {
  /* ignored */
}

/**
 * A list of config keys that are valid for project-level config.
 * Jest will complain if we forward any other root configuration to the projects.
 *
 * @type {Array<keyof import('@jest/types').Config.ProjectConfig>}
 */
const projectConfigKeys = [
  'automock',
  'cache',
  'cacheDirectory',
  'clearMocks',
  'collectCoverageFrom',
  'coverageDirectory',
  'coveragePathIgnorePatterns',
  'cwd',
  'dependencyExtractor',
  'detectLeaks',
  'detectOpenHandles',
  'displayName',
  'errorOnDeprecated',
  'extensionsToTreatAsEsm',
  'fakeTimers',
  'filter',
  'forceCoverageMatch',
  'globalSetup',
  'globalTeardown',
  'globals',
  'haste',
  'id',
  'injectGlobals',
  'moduleDirectories',
  'moduleFileExtensions',
  'moduleNameMapper',
  'modulePathIgnorePatterns',
  'modulePaths',
  'openHandlesTimeout',
  'preset',
  'prettierPath',
  'resetMocks',
  'resetModules',
  'resolver',
  'restoreMocks',
  'rootDir',
  'roots',
  'runner',
  'runtime',
  'sandboxInjectedGlobals',
  'setupFiles',
  'setupFilesAfterEnv',
  'skipFilter',
  'skipNodeResolution',
  'slowTestThreshold',
  'snapshotResolver',
  'snapshotSerializers',
  'snapshotFormat',
  'testEnvironment',
  'testEnvironmentOptions',
  'testMatch',
  'testLocationInResults',
  'testPathIgnorePatterns',
  'testRegex',
  'testRunner',
  'transform',
  'transformIgnorePatterns',
  'watchPathIgnorePatterns',
  'unmockedModulePathPatterns',
  'workerIdleMemoryLimit',
];

const transformIgnorePattern = [
  '@material-ui',
  'ajv',
  'core-js',
  'jest-.*',
  'jsdom',
  'knex',
  'react',
  'react-dom',
  'highlight\\.js',
  'prismjs',
  'json-schema',
  'react-use/lib',
  'typescript',
].join('|');

// Provides additional config that's based on the role of the target package
function getRoleConfig(role, pkgJson) {
  // Only Node.js package roles support native ESM modules, frontend and common
  // packages are always transpiled to CommonJS.
  const moduleOpts = NODE_ROLES.includes(role)
    ? {
        module: {
          ignoreDynamic: true,
          exportInteropAnnotation: true,
        },
      }
    : undefined;

  const transform = {
    '\\.(mjs|cjs|js)$': [
      require.resolve('./jestSwcTransform'),
      {
        ...moduleOpts,
        jsc: {
          parser: {
            syntax: 'ecmascript',
          },
        },
      },
    ],
    '\\.jsx$': [
      require.resolve('./jestSwcTransform'),
      {
        jsc: {
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
    '\\.(mts|cts|ts)$': [
      require.resolve('./jestSwcTransform'),
      {
        ...moduleOpts,
        jsc: {
          parser: {
            syntax: 'typescript',
          },
        },
      },
    ],
    '\\.tsx$': [
      require.resolve('./jestSwcTransform'),
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
    '\\.(bmp|gif|jpg|jpeg|png|ico|webp|frag|xml|svg|eot|woff|woff2|ttf)$':
      require.resolve('./jestFileTransform.js'),
    '\\.(yaml)$': require.resolve('./jestYamlTransform'),
  };
  if (FRONTEND_ROLES.includes(role)) {
    return {
      testEnvironment: getJestEnvironment(),
      // The caching module loader is only used to speed up frontend tests,
      // as it breaks real dynamic imports of ESM modules.
      runtime: envOptions.oldTests
        ? undefined
        : require.resolve('./jestCachingModuleLoader'),
      transform,
    };
  }
  return {
    testEnvironment: getJestNodeEnvironment(),
    moduleFileExtensions: [...SRC_EXTS, 'json', 'node'],
    // Jest doesn't let us dynamically detect type=module per transformed file,
    // so we have to assume that if the entry point is ESM, all TS files are
    // ESM.
    //
    // This means you can't switch a package to type=module until all of its
    // monorepo dependencies are also type=module or does not contain any .ts
    // files.
    extensionsToTreatAsEsm:
      pkgJson.type === 'module' ? ['.ts', '.mts'] : ['.mts'],
    transform,
  };
}

async function getProjectConfig(targetPath, extraConfig, extraOptions) {
  const configJsPath = path.resolve(targetPath, 'jest.config.js');
  const configTsPath = path.resolve(targetPath, 'jest.config.ts');
  // If the package has it's own jest config, we use that instead.
  if (await fs.pathExists(configJsPath)) {
    return require(configJsPath);
  } else if (await fs.pathExists(configTsPath)) {
    return require(configTsPath);
  }

  // Jest config can be defined both in the root package.json and within each package. The root config
  // gets forwarded to us through the `extraConfig` parameter, while the package config is read here.
  // If they happen to be the same the keys will simply override each other.
  // The merging of the configs is shallow, meaning e.g. all transforms are replaced if new ones are defined.
  const pkgJson = await fs.readJson(path.resolve(targetPath, 'package.json'));

  const options = {
    ...extraConfig,
    rootDir: path.resolve(targetPath, 'src'),
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': require.resolve('jest-css-modules'),
    },

    // A bit more opinionated
    testMatch: [`**/*.test.{${SRC_EXTS.join(',')}}`],

    transformIgnorePatterns: [`/node_modules/(?:${transformIgnorePattern})/`],
    ...getRoleConfig(pkgJson.backstage?.role, pkgJson),
  };

  // Copy the array, since it may be shared with other projects through the root config
  options.setupFilesAfterEnv = [...(options.setupFilesAfterEnv ?? [])];

  if (
    extraOptions.rejectFrontendNetworkRequests &&
    FRONTEND_ROLES.includes(pkgJson.backstage?.role)
  ) {
    // By adding this first we ensure that it's possible to for example override
    // fetch with a mock in a custom setup file
    options.setupFilesAfterEnv.unshift(
      require.resolve('./jestRejectNetworkRequests.js'),
    );
  }

  if (
    options.testEnvironment === getJestEnvironment() &&
    getJestMajorVersion() < 30 // Only needed when not running the custom env for Jest 30+
  ) {
    // FIXME https://github.com/jsdom/jsdom/issues/1724
    options.setupFilesAfterEnv.unshift(require.resolve('cross-fetch/polyfill'));
  }

  // Use src/setupTests.* as the default location for configuring test env
  for (const ext of SRC_EXTS) {
    if (fs.existsSync(path.resolve(targetPath, `src/setupTests.${ext}`))) {
      options.setupFilesAfterEnv.push(`<rootDir>/setupTests.${ext}`);
      break;
    }
  }

  const config = Object.assign(options, pkgJson.jest);

  // The config id is a cache key that lets us share the jest cache across projects.
  // If no explicit id was configured, generated one based on the configuration.
  if (!config.id) {
    const configHash = crypto
      .createHash('sha256')
      .update(version)
      .update(Buffer.alloc(1))
      .update(
        JSON.stringify(config.transform).replaceAll(
          targetPaths.workspaceRootDir,
          '',
        ),
      )
      .digest('hex');
    config.id = `backstage_cli_${configHash}`;
  }

  return config;
}

// This loads the root jest config, which in turn will either refer to a single
// configuration for the current package, or a collection of configurations for
// the target workspace packages
async function getRootConfig() {
  const rootPkgJson = await fs.readJson(
    targetPaths.resolveInstallationRoot('package.json'),
  );

  const baseCoverageConfig = {
    coverageDirectory: targetPaths.resolve('coverage'),
    coverageProvider: envOptions.oldTests ? 'v8' : 'babel',
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx,mjs,cjs}', '!**/*.d.ts'],
  };

  const { rejectFrontendNetworkRequests, ...rootOptions } =
    rootPkgJson.jest ?? {};
  const extraRootOptions = {
    rejectFrontendNetworkRequests,
  };

  // pnpm declares its workspace packages in pnpm-workspace.yaml rather than in
  // the workspaces field of the root package.json
  const isWorkspaceRoot =
    Boolean(rootPkgJson.workspaces) ||
    (await fs.pathExists(
      targetPaths.resolveInstallationRoot('pnpm-workspace.yaml'),
    ));

  // Check if we're running within a specific monorepo package. In that case just get the single project config.
  if (!isWorkspaceRoot || targetPaths.installationRootDir !== targetPaths.dir) {
    return getProjectConfig(
      targetPaths.dir,
      {
        ...baseCoverageConfig,
        ...rootOptions,
      },
      extraRootOptions,
    );
  }

  const globalRootConfig = { ...baseCoverageConfig };
  const globalProjectConfig = {};

  for (const [key, value] of Object.entries(rootOptions)) {
    if (projectConfigKeys.includes(key)) {
      globalProjectConfig[key] = value;
    } else {
      globalRootConfig[key] = value;
    }
  }

  // If the target package is a workspace root, we find all packages in the
  // workspace and load those in as separate jest projects instead.
  const { packages: workspacePackages } = await getPackages(
    targetPaths.installationRootDir,
  );

  let projects = await Promise.all(
    workspacePackages.map(async ({ dir: projectPath, packageJson }) => {
      // We check for the presence of "backstage-cli test" in the package test
      // script to determine whether a given package should be tested
      const packageData = packageJson;
      const testScript = packageData.scripts && packageData.scripts.test;
      const isSupportedTestScript =
        testScript?.includes('backstage-cli test') ||
        testScript?.includes('backstage-cli package test');
      if (testScript && isSupportedTestScript) {
        return await getProjectConfig(
          projectPath,
          {
            ...globalProjectConfig,
            displayName: packageData.name,
          },
          extraRootOptions,
        );
      }

      return undefined;
    }),
  ).then(cs => cs.filter(Boolean));

  const cache = global.__backstageCli_jestSuccessCache;
  if (cache) {
    projects = await cache.filterConfigs(projects, globalRootConfig);
  }
  const watchProjectFilter = global.__backstageCli_watchProjectFilter;
  if (watchProjectFilter) {
    projects = await watchProjectFilter.filter(projects);
  }

  return {
    rootDir: targetPaths.installationRootDir,
    projects,
    testResultsProcessor: cache
      ? require.resolve('./jestCacheResultProcessor.cjs')
      : undefined,
    ...globalRootConfig,
  };
}

module.exports = getRootConfig();
