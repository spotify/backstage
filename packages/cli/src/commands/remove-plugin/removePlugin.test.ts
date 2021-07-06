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

import fse from 'fs-extra';
import path from 'path';
import mockFs from 'mock-fs';
import { paths } from '../../lib/paths';
import { addExportStatement, capitalize } from '../create-plugin/createPlugin';
import { addCodeownersEntry } from '../../lib/codeowners';
import {
  removeReferencesFromAppPackage,
  removeReferencesFromPluginsFile,
  removePluginDirectory,
  removeSymLink,
  removePluginFromCodeOwners,
} from './removePlugin';
import {
  codeownersFileContent,
  packageFileContent,
  pluginsFileContent,
} from './file-mocks';

const BACKSTAGE = `@backstage`;
const testPluginName = 'yarn-test-package';
const testPluginPackage = `${BACKSTAGE}/plugin-${testPluginName}`;
const tempDir = '/remove-plugin-test';

const removeEmptyLines = (file: string): string =>
  file.split(/\r?\n/).filter(Boolean).join('\n');

const createTestPackageFile = async (testFilePath: string) => {
  const testFileContent = {
    ...packageFileContent,
    dependencies: {
      ...packageFileContent.dependencies,
      [testPluginPackage]: '0.1.0',
    },
  };

  mockFs({
    packages: {
      app: {
        'package.json': `${JSON.stringify(packageFileContent, null, 2)}\n`,
      },
    },
    [tempDir]: {
      [testFilePath]: `${JSON.stringify(testFileContent, null, 2)}\n`,
    },
  });
  return;
};

const createTestPluginFile = async (
  testFileName: string,
  pluginsFileName: string,
) => {
  mockFs({
    [tempDir]: {
      [testFileName]: `${pluginsFileContent}\n`,
      [pluginsFileName]: `${pluginsFileContent}\n`,
    },
    packages: {
      app: {
        src: {
          'plugin.ts': `${pluginsFileContent}\n`,
        },
      },
    },
  });

  const pluginNameCapitalized = testPluginName
    .split('-')
    .map(name => capitalize(name))
    .join('');
  const exportStatement = `export { plugin as ${pluginNameCapitalized}} from ${testPluginPackage}`;
  await addExportStatement(path.join(tempDir, testFileName), exportStatement);
};

const mkTestPluginDir = (testDirPath: string) => {
  const pluginFiles: { [index: string]: string } = {};
  for (let i = 0; i < 50; i++) {
    pluginFiles[`testFile${i}.ts`] = '';
  }

  mockFs({
    [testDirPath]: pluginFiles,
  });
};

describe('removePlugin', () => {
  beforeAll(() => {
    // Create temporary directory for all tests
    mockFs({
      [tempDir]: {
        'package.json': packageFileContent,
        src: {
          'plugin.ts': pluginsFileContent,
        },
      },
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  describe('Remove Plugin Dependencies', () => {
    it('removes plugin references from /packages/app/package.json', async () => {
      // Set up test
      const testFilePath = 'test.json';
      createTestPackageFile(testFilePath);
      await removeReferencesFromAppPackage(
        path.join(tempDir, testFilePath),
        testPluginName,
      );
      const testFileContent = removeEmptyLines(
        fse.readFileSync(path.join(tempDir, testFilePath), 'utf8'),
      );

      const mockedPackageFileContent = removeEmptyLines(
        fse.readFileSync(path.join('packages', 'app', 'package.json'), 'utf8'),
      );
      expect(testFileContent).toBe(mockedPackageFileContent);
    });
    it('removes plugin exports from /packages/app/src/package.json', async () => {
      const testFileName = 'test.ts';
      const pluginsFileName = 'plugin.ts';
      createTestPluginFile(testFileName, pluginsFileName);
      await removeReferencesFromPluginsFile(
        path.join(tempDir, testFileName),
        testPluginName,
      );
      const testFileContent = removeEmptyLines(
        fse.readFileSync(path.join(tempDir, testFileName), 'utf8'),
      );
      const mockedPluginsFileContent = removeEmptyLines(
        fse.readFileSync(
          path.join('packages', 'app', 'src', pluginsFileName),
          'utf8',
        ),
      );
      expect(testFileContent).toBe(mockedPluginsFileContent);
    });

    it('removes codeOwners references', async () => {
      const testFileName = 'test';
      const testFilePath = path.join(tempDir, testFileName);

      const mockedCodeownersPath = path.join('.github', 'CODEOWNERS');

      mockFs({
        [tempDir]: {
          [testFileName]: '',
        },
        '.github': {
          CODEOWNERS: codeownersFileContent,
        },
      });
      fse.copySync(mockedCodeownersPath, testFilePath);
      const testFileContent = removeEmptyLines(
        fse.readFileSync(testFilePath, 'utf8'),
      );
      const codeOwnersFileContent = removeEmptyLines(
        fse.readFileSync(mockedCodeownersPath, 'utf8'),
      );
      await addCodeownersEntry(
        testFilePath!,
        path.join('plugins', testPluginName),
        ['@thisIsAtestTeam', 'test@gmail.com'],
      );
      await removePluginFromCodeOwners(testFilePath, testPluginName);
      expect(testFileContent).toBe(codeOwnersFileContent);
    });
  });

  describe('Remove files', () => {
    const testDirPath = path.join(
      paths.resolveTargetRoot(),
      'plugins',
      testPluginName,
    );

    describe('Removes Plugin Directory', () => {
      it('removes plugin directory from /plugins', async () => {
        mkTestPluginDir(testDirPath);
        expect(fse.existsSync(testDirPath)).toBeTruthy();
        await removePluginDirectory(testDirPath);
        expect(fse.existsSync(testDirPath)).toBeFalsy();
      });
    });

    describe('Removes System Link', () => {
      it('removes system link from @backstage', async () => {
        const symLink = `plugin-${testPluginName}`;
        const testSymLinkPath = path.join(
          '/',
          'node_modules',
          '@backstage',
          symLink,
        );
        const mockedTestDirPath = path.join('/', 'plugins', testPluginName);

        mockFs({
          '/plugins': {
            [testPluginName]: {},
          },
          '/node_modules': {
            '@backstage': {
              [symLink]: mockFs.symlink({
                path: mockedTestDirPath,
              }),
            },
          },
        });

        expect(fse.existsSync(testSymLinkPath)).toBeTruthy();
        await removeSymLink(testSymLinkPath);
        expect(fse.existsSync(testSymLinkPath)).toBeFalsy();
      });
    });
  });
});
