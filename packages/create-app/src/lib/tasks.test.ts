/*
 * Copyright 2021 The Backstage Authors
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

import fs from 'fs-extra';
import child_process from 'node:child_process';
import { resolve as resolvePath, relative as relativePath } from 'node:path';
import os from 'node:os';
import recursive from 'recursive-readdir';
import { isTemplateFileExcluded } from '../createApp';
import {
  Task,
  buildAppTask,
  checkAppExistsTask,
  checkPathExistsTask,
  moveAppTask,
  templatingTask,
  tryInitGitRepository,
  readGitConfig,
  fetchYarnLockSeedTask,
} from './tasks';
import {
  createMockDirectory,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';

jest.spyOn(Task, 'log').mockReturnValue(undefined);
jest.spyOn(Task, 'error').mockReturnValue(undefined);
jest.spyOn(Task, 'section').mockReturnValue(undefined);
jest
  .spyOn(Task, 'forItem')
  .mockImplementation((_a, _b, taskFunc) => taskFunc());

jest.mock('child_process');

// By mocking this the filesystem mocks won't mess with reading all of the package.jsons
jest.mock('./versions', () => ({
  packageVersions: {
    root: '1.2.3',
    '@backstage/app-defaults': '1.0.0',
    '@backstage/backend-defaults': '1.0.0',
    '@backstage/backend-tasks': '1.0.0',
    '@backstage/catalog-client': '1.0.0',
    '@backstage/catalog-model': '1.0.0',
    '@backstage/cli': '1.0.0',
    '@backstage/cli-defaults': '1.0.0',
    '@backstage/config': '1.0.0',
    '@backstage/core-app-api': '1.0.0',
    '@backstage/core-compat-api': '1.0.0',
    '@backstage/core-components': '1.0.0',
    '@backstage/core-plugin-api': '1.0.0',
    '@backstage/e2e-test-utils': '1.0.0',
    '@backstage/frontend-defaults': '1.0.0',
    '@backstage/frontend-plugin-api': '1.0.0',
    '@backstage/frontend-test-utils': '1.0.0',
    '@backstage/integration-react': '1.0.0',
    '@backstage/plugin-api-docs': '1.0.0',
    '@backstage/plugin-app-backend': '1.0.0',
    '@backstage/plugin-app-module-user-settings': '1.0.0',
    '@backstage/plugin-app-react': '1.0.0',
    '@backstage/plugin-app-visualizer': '1.0.0',
    '@backstage/plugin-auth': '1.0.0',
    '@backstage/plugin-auth-backend': '1.0.0',
    '@backstage/plugin-auth-backend-module-github-provider': '1.0.0',
    '@backstage/plugin-auth-backend-module-guest-provider': '1.0.0',
    '@backstage/plugin-auth-node': '1.0.0',
    '@backstage/plugin-home': '1.0.0',
    '@backstage/plugin-home-react': '1.0.0',
    '@backstage/plugin-catalog': '1.0.0',
    '@backstage/plugin-catalog-backend': '1.0.0',
    '@backstage/plugin-catalog-backend-module-logs': '1.0.0',
    '@backstage/plugin-catalog-backend-module-scaffolder-entity-model': '1.0.0',
    '@backstage/plugin-catalog-common': '1.0.0',
    '@backstage/plugin-catalog-graph': '1.0.0',
    '@backstage/plugin-catalog-import': '1.0.0',
    '@backstage/plugin-catalog-react': '1.0.0',
    '@backstage/plugin-kubernetes': '1.0.0',
    '@backstage/plugin-kubernetes-backend': '1.0.0',
    '@backstage/plugin-mcp-actions-backend': '1.0.0',
    '@backstage/plugin-notifications': '1.0.0',
    '@backstage/plugin-notifications-backend': '1.0.0',
    '@backstage/plugin-org': '1.0.0',
    '@backstage/plugin-permission-backend': '1.0.0',
    '@backstage/plugin-permission-backend-module-allow-all-policy': '1.0.0',
    '@backstage/plugin-permission-common': '1.0.0',
    '@backstage/plugin-permission-node': '1.0.0',
    '@backstage/plugin-permission-react': '1.0.0',
    '@backstage/plugin-proxy-backend': '1.0.0',
    '@backstage/plugin-scaffolder': '1.0.0',
    '@backstage/plugin-scaffolder-backend': '1.0.0',
    '@backstage/plugin-scaffolder-backend-module-github': '1.0.0',
    '@backstage/plugin-scaffolder-backend-module-notifications': '1.0.0',
    '@backstage/plugin-search': '1.0.0',
    '@backstage/plugin-search-backend': '1.0.0',
    '@backstage/plugin-search-backend-module-catalog': '1.0.0',
    '@backstage/plugin-search-backend-module-pg': '1.0.0',
    '@backstage/plugin-search-backend-module-techdocs': '1.0.0',
    '@backstage/plugin-search-backend-node': '1.0.0',
    '@backstage/plugin-search-react': '1.0.0',
    '@backstage/plugin-signals': '1.0.0',
    '@backstage/plugin-signals-backend': '1.0.0',
    '@backstage/plugin-signals-react': '1.0.0',
    '@backstage/plugin-techdocs': '1.0.0',
    '@backstage/plugin-techdocs-backend': '1.0.0',
    '@backstage/plugin-techdocs-module-addons-contrib': '1.0.0',
    '@backstage/plugin-techdocs-react': '1.0.0',
    '@backstage/plugin-user-settings': '1.0.0',
    '@backstage/plugin-user-settings-backend': '1.0.0',
    '@backstage/test-utils': '1.0.0',
    '@backstage/theme': '1.0.0',
    '@backstage/ui': '1.0.0',
  },
}));

describe('tasks', () => {
  const mockExec = child_process.exec as unknown as jest.MockedFunction<
    (
      command: string,
      options: any,
      callback: (
        error: Error | null,
        result: { stdout: string; stderr: string },
      ) => void,
    ) => void
  >;

  const mockDir = createMockDirectory();

  const origCwd = process.cwd();
  const realChdir = process.chdir;
  // If anyone calls chdir then make it resolve within the tmpdir
  const mockChdir = jest.spyOn(process, 'chdir');

  beforeEach(() => {
    mockDir.setContent({
      projects: {
        'my-module.ts': '',
        'dir/my-file.txt': '',
      },
      'tmp/mockApp': {
        '.gitignore': '',
        'package.json': '',
        'packages/app/package.json': '',
      },
    });
    realChdir(mockDir.path);
    mockChdir.mockImplementation((dir: string) =>
      realChdir(mockDir.resolve(dir)),
    );
  });

  afterEach(() => {
    mockExec.mockRestore();
    mockChdir.mockReset();
  });

  afterAll(() => {
    realChdir(origCwd);
  });

  describe('checkAppExistsTask', () => {
    it('should do nothing if the directory does not exist', async () => {
      const dir = 'projects/';
      const name = 'MyNewApp';
      await expect(checkAppExistsTask(dir, name)).resolves.not.toThrow();
    });

    it('should throw an error when a file of the same name exists', async () => {
      const dir = 'projects/';
      const name = 'my-module.ts';
      await expect(checkAppExistsTask(dir, name)).rejects.toThrow(
        'already exists',
      );
    });

    it('should throw an error when a directory of the same name exists', async () => {
      const dir = 'projects/';
      const name = 'dir';
      await expect(checkAppExistsTask(dir, name)).rejects.toThrow(
        'already exists',
      );
    });
  });

  describe('checkPathExistsTask', () => {
    it('should create a directory at the given path', async () => {
      const appDir = 'projects/newProject';
      await expect(checkPathExistsTask(appDir)).resolves.not.toThrow();
      expect(fs.existsSync(appDir)).toBe(true);
    });

    it('should do nothing if a directory of the same name exists', async () => {
      const appDir = 'projects/dir';
      await expect(checkPathExistsTask(appDir)).resolves.not.toThrow();
      expect(fs.existsSync(appDir)).toBe(true);
    });

    it('should fail if a file of the same name exists', async () => {
      await expect(
        checkPathExistsTask('projects/my-module.ts'),
      ).rejects.toThrow('already exists');
    });
  });

  describe('buildAppTask', () => {
    it('should change to `appDir` and run `yarn install` and `yarn tsc`', async () => {
      // requires callback implementation to support `promisify` wrapper
      // https://stackoverflow.com/a/60579617/10044859
      mockExec.mockImplementation((_command, callback) => {
        if (_command === 'yarn --version') {
          callback(null, { stdout: '1.22.5', stderr: 'standard error' });
        } else {
          callback(null, { stdout: 'standard out', stderr: 'standard error' });
        }
      });

      const appDir = 'projects/dir';
      await expect(buildAppTask(appDir)).resolves.not.toThrow();
      expect(mockChdir).toHaveBeenCalledTimes(1);
      expect(mockChdir).toHaveBeenNthCalledWith(1, appDir);
      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenNthCalledWith(
        1,
        'yarn install',
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        2,
        'yarn tsc',
        expect.any(Function),
      );
    });

    it('should run `pnpm install` and `pnpm tsc` for pnpm apps', async () => {
      mockExec.mockImplementation((_command, callback) => {
        callback(null, { stdout: 'standard out', stderr: 'standard error' });
      });

      const appDir = 'projects/dir';
      await expect(buildAppTask(appDir, 'pnpm')).resolves.not.toThrow();
      expect(mockExec).toHaveBeenCalledTimes(2);
      expect(mockExec).toHaveBeenNthCalledWith(
        1,
        'pnpm install',
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        2,
        'pnpm tsc',
        expect.any(Function),
      );
    });

    it('should fail if project directory does not exist', async () => {
      const appDir = 'projects/missingProject';
      await expect(buildAppTask(appDir)).rejects.toThrow(
        'no such file or directory',
      );
    });
  });

  describe('moveAppTask', () => {
    const tempDir = 'tmp/mockApp/';
    const id = 'myApp';

    it('should move all files in the temp dir to the target dir', async () => {
      const destination = 'projects/mockApp';
      await moveAppTask(tempDir, destination, id);
      expect(fs.existsSync('projects/mockApp/.gitignore')).toBe(true);
      expect(fs.existsSync('projects/mockApp/package.json')).toBe(true);
      expect(fs.existsSync('projects/mockApp/packages/app/package.json')).toBe(
        true,
      );
    });

    it('should fail to move files if destination already exists', async () => {
      const destination = 'projects';
      await expect(moveAppTask(tempDir, destination, id)).rejects.toThrow(
        'dest already exists',
      );
    });

    it('should remove temporary files if move succeeded', async () => {
      const destination = 'projects/mockApp';
      await moveAppTask(tempDir, destination, id);
      expect(fs.existsSync('tmp/mockApp')).toBe(false);
    });

    it('should remove temporary files if move failed', async () => {
      const destination = 'projects';
      await expect(moveAppTask(tempDir, destination, id)).rejects.toThrow();
      expect(fs.existsSync('tmp/mockApp')).toBe(false);
    });
  });

  describe('templatingTask', () => {
    it('should generate a project populating context parameters', async () => {
      const templateDir = resolvePath(__dirname, '../../templates/default-app');
      const destinationDir = 'templatedApp';
      const context = {
        name: 'SuperCoolBackstageInstance',
        dbTypeSqlite: true,
      };
      await templatingTask(templateDir, destinationDir, context);
      expect(fs.existsSync('templatedApp/package.json')).toBe(true);
      expect(fs.existsSync('templatedApp/.dockerignore')).toBe(true);
      await expect(fs.readJson('templatedApp/backstage.json')).resolves.toEqual(
        {
          version: '1.2.3',
        },
      );
      // catalog was populated with `context.name`
      await expect(
        fs.readFile('templatedApp/catalog-info.yaml', 'utf-8'),
      ).resolves.toContain('name: SuperCoolBackstageInstance');
      // backend dependencies include `sqlite3` from `context.SQLite`
      await expect(
        fs.readFile('templatedApp/packages/backend/package.json', 'utf-8'),
      ).resolves.toContain('sqlite3"');
    });

    it.each(['default-app', 'legacy-app'])(
      'should include required Yarn resolutions in the %s template',
      async templateName => {
        const templateDir = resolvePath(
          __dirname,
          `../../templates/${templateName}`,
        );
        const destinationDir = `templated-${templateName}`;

        await templatingTask(templateDir, destinationDir, {
          name: 'SuperCoolBackstageInstance',
          dbTypeSqlite: true,
        });

        await expect(
          fs.readJson(`${destinationDir}/package.json`),
        ).resolves.toMatchObject({
          resolutions: {
            '@yarnpkg/core': '4.9.1',
          },
        });
      },
    );

    it('should generate a project for the selected package manager', async () => {
      const templateDir = resolvePath(__dirname, '../../templates/default-app');

      // Reads every text file of the generated app, keyed by relative path
      const readTextFiles = async (dir: string, ignore: string[]) => {
        const files = await recursive(dir, ignore);
        const entries = await Promise.all(
          files
            .filter(file => !/\.(png|ico)$/.test(file))
            .map(async file => [
              relativePath(dir, file),
              await fs.readFile(file, 'utf-8'),
            ]),
        );
        return Object.fromEntries(entries) as Record<string, string>;
      };

      await templatingTask(
        templateDir,
        'yarnApp',
        { name: 'my-app', packageManager: 'yarn', pnpm: false },
        { exclude: file => isTemplateFileExcluded('yarn', file) },
      );

      expect(fs.existsSync('yarnApp/pnpm-workspace.yaml')).toBe(false);
      expect(fs.existsSync('yarnApp/.yarnrc.yml')).toBe(true);
      expect(fs.existsSync('yarnApp/.yarn/releases/yarn-4.13.0.cjs')).toBe(
        true,
      );
      expect(fs.existsSync('yarnApp/yarn.lock')).toBe(true);
      await expect(fs.readJson('yarnApp/package.json')).resolves.toEqual(
        expect.objectContaining({
          workspaces: ['packages/*', 'plugins/*'],
          resolutions: {
            '@yarnpkg/core': '4.9.1',
            '@types/react': '^18',
            '@types/react-dom': '^18',
          },
          packageManager: 'yarn@4.13.0',
          scripts: expect.objectContaining({
            'build:backend': 'yarn workspace backend build',
            'build-image': 'yarn workspace backend build-image',
          }),
        }),
      );
      // The bundled Yarn release mentions pnpm, all other files must not
      const yarnFiles = await readTextFiles('yarnApp', ['.yarn']);
      expect(Object.keys(yarnFiles).filter(f => /pnpm/i.test(f))).toEqual([]);
      expect(
        Object.entries(yarnFiles)
          .filter(([, content]) => /pnpm/i.test(content))
          .map(([file]) => file),
      ).toEqual([]);
      expect(yarnFiles['packages/backend/Dockerfile']).toContain(
        'COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./',
      );
      expect(yarnFiles['packages/backend/Dockerfile']).toContain(
        'yarn workspaces focus --all --production',
      );
      expect(yarnFiles['.github/workflows/ci.yml']).toContain(
        'group: ${{ github.workflow }}-${{ github.ref }}',
      );
      expect(yarnFiles['.github/workflows/ci.yml']).toContain(
        "key: ${{ runner.os }}-node_modules-${{ hashFiles('yarn.lock', '**/package.json') }}",
      );
      expect(yarnFiles['.github/workflows/ci.yml']).toContain(
        'run: yarn install --immutable',
      );
      expect(yarnFiles['README.md']).toContain('yarn install\nyarn start');
      expect(yarnFiles['.gitignore']).toContain(
        '# Yarn files\n.pnp.*\n.yarn/*',
      );
      expect(yarnFiles['.dockerignore']).toContain('.yarn/cache');
      expect(yarnFiles['playwright.config.ts']).toContain("'yarn start app'");

      await templatingTask(
        templateDir,
        'pnpmApp',
        {
          name: 'my-app',
          packageManager: 'pnpm',
          pnpm: true,
          pnpmVersion: '12.14.0',
        },
        { exclude: file => isTemplateFileExcluded('pnpm', file) },
      );

      expect(fs.existsSync('pnpmApp/.yarnrc.yml')).toBe(false);
      expect(fs.existsSync('pnpmApp/.yarn')).toBe(false);
      expect(fs.existsSync('pnpmApp/yarn.lock')).toBe(false);
      const pnpmPkg = await fs.readJson('pnpmApp/package.json');
      expect(pnpmPkg).not.toHaveProperty('workspaces');
      expect(pnpmPkg).not.toHaveProperty('resolutions');
      expect(pnpmPkg).toEqual(
        expect.objectContaining({
          packageManager: 'pnpm@12.14.0',
          // TypeScript only finds the types of the root tsconfig.json from the
          // root, which the isolated linker does not hoist them into
          devDependencies: expect.objectContaining({
            '@types/node': expect.any(String),
            '@types/react': expect.any(String),
            '@types/webpack-env': expect.any(String),
          }),
          scripts: expect.objectContaining({
            'build:backend': 'pnpm --filter backend build',
            'build-image': 'pnpm --filter backend build-image',
          }),
        }),
      );
      const pnpmFiles = await readTextFiles('pnpmApp', []);
      expect(Object.keys(pnpmFiles).filter(f => /yarn/i.test(f))).toEqual([]);
      // Only the names of Yarn packages that are pinned for both may remain
      expect(
        Object.entries(pnpmFiles)
          .filter(([, content]) =>
            /yarn/i.test(content.replace(/@yarnpkg\//g, '')),
          )
          .map(([file]) => file),
      ).toEqual([]);
      const workspace = pnpmFiles['pnpm-workspace.yaml'];
      expect(workspace).toContain('packages:\n  - packages/*\n  - plugins/*');
      expect(workspace).toContain('nodeLinker: hoisted');
      expect(workspace).toContain('minimumReleaseAge: 4320');
      expect(workspace).toContain(
        "minimumReleaseAgeExclude:\n  - '@backstage/*'",
      );
      expect(workspace).toContain(
        "  '@yarnpkg/core': 4.9.1\n  '@types/react': ^18\n  '@types/react-dom': ^18",
      );
      expect(workspace).toMatch(
        /allowBuilds:\n( {2}.*\n)* {2}better-sqlite3: true/,
      );
      // The lockfile and the workspace file come from the skeleton
      expect(pnpmFiles['packages/backend/Dockerfile']).toContain(
        'COPY --chown=node:node package.json packages/backend/dist/skeleton.tar.gz ./',
      );
      expect(pnpmFiles['packages/backend/Dockerfile']).not.toContain(
        'pnpm-lock.yaml ',
      );
      expect(pnpmFiles['packages/backend/Dockerfile']).toContain(
        'pnpm install --frozen-lockfile --prod',
      );
      expect(pnpmFiles['.github/workflows/ci.yml']).toContain(
        'uses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413 # v6',
      );
      expect(pnpmFiles['.github/workflows/ci.yml']).toContain(
        'run: pnpm install --frozen-lockfile',
      );
      expect(pnpmFiles['.github/workflows/ci.yml']).toContain(
        'run: pnpm tsc:full',
      );
      expect(pnpmFiles['README.md']).toContain('pnpm install\npnpm start');
      expect(pnpmFiles['playwright.config.ts']).toContain("'pnpm start app'");
    });
  });

  describe('readGitConfig', () => {
    const tmpDirPrefix = resolvePath(os.tmpdir(), 'git-temp-dir-');

    it('should return git config if git package is installed and git credentials are set', async () => {
      mockExec.mockImplementation((_command, _options, callback) => {
        callback(null, { stdout: 'main', stderr: '' });
      });

      const gitConfig = await readGitConfig();

      expect(gitConfig).toEqual({
        defaultBranch: 'main',
      });
      expect(mockExec).toHaveBeenCalledTimes(3);
      expect(mockExec).toHaveBeenCalledWith(
        'git init',
        { cwd: expect.stringContaining(tmpDirPrefix) },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenCalledWith(
        'git commit --allow-empty -m "Initial commit"',
        { cwd: expect.stringContaining(tmpDirPrefix) },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenCalledWith(
        'git branch --format="%(refname:short)"',
        { cwd: expect.stringContaining(tmpDirPrefix) },
        expect.any(Function),
      );
    });

    it('should return false if git config is invalid', async () => {
      mockExec.mockImplementation((_command, _options, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      const gitConfig = await readGitConfig();

      expect(gitConfig).toEqual({
        defaultBranch: undefined,
      });
      expect(mockExec).toHaveBeenCalledTimes(3);
    });
  });

  describe('tryInitGitRepository', () => {
    it('should initialize a git repository at the given path', async () => {
      const destinationDir = 'tmp/mockApp';

      mockExec.mockImplementation((command, _opts, callback) => {
        if (command.startsWith('git rev-parse')) {
          callback(new Error('not a git repo'), { stdout: '', stderr: '' });
        } else {
          callback(null, { stdout: '', stderr: '' });
        }
      });

      await expect(tryInitGitRepository(destinationDir)).resolves.toBe(true);

      expect(mockExec).toHaveBeenCalledTimes(4);
      expect(mockExec).toHaveBeenNthCalledWith(
        1,
        'git rev-parse --is-inside-work-tree',
        { cwd: destinationDir },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        2,
        'git init',
        { cwd: destinationDir },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        3,
        'git add .',
        { cwd: destinationDir },
        expect.any(Function),
      );
      expect(mockExec).toHaveBeenNthCalledWith(
        4,
        'git commit -m "Initial commit"',
        { cwd: destinationDir },
        expect.any(Function),
      );
    });

    it('should not initialize a git repository if in one already', async () => {
      const destinationDir = 'tmp/mockApp';

      mockExec.mockImplementation((_command, _opts, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      await expect(tryInitGitRepository(destinationDir)).resolves.toBe(false);

      expect(mockExec).toHaveBeenCalledTimes(1);
      expect(mockExec).toHaveBeenNthCalledWith(
        1,
        'git rev-parse --is-inside-work-tree',
        { cwd: destinationDir },
        expect.any(Function),
      );
    });
  });

  describe('fetchYarnLockSeedTask', () => {
    const worker = setupServer();
    registerMswTestHooks(worker);

    it('should fetch the yarn.lock seed file', async () => {
      worker.use(
        http.get(
          'https://raw.githubusercontent.com/backstage/backstage/master/packages/create-app/seed-yarn.lock',
          () =>
            HttpResponse.text(`# the-lockfile-header

// some comments
// in the file
// that should
// be removed

// a comment about the entry
"@backstage/cli@1.0.0":
  some info
`),
        ),
      );

      mockDir.clear();

      await expect(fetchYarnLockSeedTask(mockDir.path)).resolves.toBe(true);

      expect(mockDir.content({ shouldReadAsText: true })).toEqual({
        'yarn.lock': `# the-lockfile-header


"@backstage/cli@1.0.0":
  some info
`,
      });
    });

    it('should fail gracefully', async () => {
      worker.use(
        http.get(
          'https://raw.githubusercontent.com/backstage/backstage/master/packages/create-app/seed-yarn.lock',
          () => new HttpResponse(null, { status: 404 }),
        ),
      );

      mockDir.clear();

      await expect(fetchYarnLockSeedTask(mockDir.path)).resolves.toBe(false);

      expect(mockDir.content()).toEqual({});
    });

    it('should time out if it takes too long to fetch', async () => {
      worker.use(
        http.get(
          'https://raw.githubusercontent.com/backstage/backstage/master/packages/create-app/seed-yarn.lock',
          () => delay(5000),
        ),
      );

      mockDir.clear();

      await expect(fetchYarnLockSeedTask(mockDir.path)).resolves.toBe(false);

      expect(mockDir.content()).toEqual({});
    });
  });
});
