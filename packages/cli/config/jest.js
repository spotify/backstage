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
const path = require('path');

async function getConfig() {
  // If the package has it's own jest config, we use that instead.
  if (await fs.pathExists('jest.config.js')) {
    return require(path.resolve('jest.config.js'));
  } else if (await fs.pathExists('jest.config.ts')) {
    return require(path.resolve('jest.config.ts'));
  }

  // We read all "jest" config fields in package.json files all the way to the filesystem root.
  // All configs are merged together to create the final config, with longer paths taking precedence.
  // The merging of the configs is shallow, meaning e.g. all transforms are replaced if new ones are defined.
  const pkgJsonConfigs = [];
  let currentPath = process.cwd();

  // Some sanity check to avoid infinite loop
  for (let i = 0; i < 100; i++) {
    const packagePath = path.resolve(currentPath, 'package.json');
    const exists = fs.pathExistsSync(packagePath);
    if (exists) {
      try {
        const data = fs.readJsonSync(packagePath);
        if (data.jest) {
          pkgJsonConfigs.unshift(data.jest);
        }
      } catch (error) {
        throw new Error(
          `Failed to parse package.json file reading jest configs, ${error}`,
        );
      }
    }

    const newPath = path.dirname(currentPath);
    if (newPath === currentPath) {
      break;
    }
    currentPath = newPath;
  }

  // We add an additional Jest config parameter only known by the Backstage CLI
  // called `transformModules`. It's a list of modules that we want to apply
  // our configured jest transformations for.
  // This is useful when packages are published in untranspiled ESM or TS form.
  const transformModules = pkgJsonConfigs
    .flatMap(conf => {
      const modules = conf.transformModules || [];
      delete conf.transformModules;
      return modules;
    })
    .map(name => `${name}/`)
    .join('|');
  const transformModulePattern = transformModules && `(?!${transformModules})`;

  const options = {
    rootDir: path.resolve('src'),
    coverageDirectory: path.resolve('coverage'),
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
    moduleNameMapper: {
      '\\.(css|less|scss|sss|styl)$': require.resolve('jest-css-modules'),
    },

    transform: {
      '\\.esm\\.js$': require.resolve('./jestEsmTransform.js'), // See jestEsmTransform.js
      '\\.(js|jsx|ts|tsx)$': require.resolve('@sucrase/jest-plugin'),
      '\\.(bmp|gif|jpg|jpeg|png|frag|xml|svg)$': require.resolve(
        './jestFileTransform.js',
      ),
      '\\.(yaml)$': require.resolve('yaml-jest'),
    },

    // A bit more opinionated
    testMatch: ['**/?(*.)test.{js,jsx,mjs,ts,tsx}'],

    // Default behaviour is to not apply transforms for node_modules, but we still want
    // to apply the esm-transformer to .esm.js files, since that's what we use in backstage packages.
    transformIgnorePatterns: [
      `/node_modules/${transformModulePattern}.*\\.(?:(?<!esm\\.)js|json)$`,
    ],
  };

  // Use src/setupTests.ts as the default location for configuring test env
  if (fs.existsSync('src/setupTests.ts')) {
    options.setupFilesAfterEnv = ['<rootDir>/setupTests.ts'];
  }

  return Object.assign(options, ...pkgJsonConfigs);
}

module.exports = getConfig();
