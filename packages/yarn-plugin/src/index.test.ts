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

import { join as joinPath } from 'node:path';
import { spawn, SpawnOptionsWithoutStdio } from 'node:child_process';
import fs from 'fs-extra';
import yaml from 'yaml';
import { buildDepTreeFromFiles } from 'snyk-nodejs-lockfile-parser';
import { targetPaths } from '@backstage/cli-common';
import { createMockDirectory } from '@backstage/backend-test-utils';

jest.setTimeout(30_000);

const mockDir = createMockDirectory();

const executeCommand = (
  command: string,
  args: string[],
  options?: SpawnOptionsWithoutStdio,
): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> => {
  return new Promise((resolve, reject) => {
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    const shell = process.platform === 'win32';
    const proc = spawn(command, args, { ...options, shell });

    proc.stdout?.on('data', data => {
      stdout.push(Buffer.from(data));
    });

    proc.stderr?.on('data', data => {
      stderr.push(Buffer.from(data));
    });

    proc.on('error', reject);
    proc.on('exit', exitCode => {
      resolve({
        exitCode: exitCode ?? 0,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
      });
    });
  });
};

const runYarnInstall = () =>
  executeCommand('yarn', ['--mode=update-lockfile'], { cwd: mockDir.path });

const nonWorkspaceEntries = (lockFileString: string = '') => {
  const lockFile = yaml.parse(lockFileString);

  const result = [];
  for (const key of Object.keys(lockFile)) {
    if (lockFile[key].version !== '0.0.0-use.local') {
      result.push(lockFile[key]);
    }
  }

  return result;
};

describe('Backstage yarn plugin', () => {
  describe.each`
    yarnVersion
    ${'4.1.1'}
    ${'stable'}
  `('yarn $yarnVersion', ({ yarnVersion }) => {
    let initialLockFileContent: string | undefined;

    beforeAll(async () => {
      const targetRoot = targetPaths.workspaceRootDir;
      await executeCommand('yarn', ['build'], {
        cwd: joinPath(targetRoot, 'packages/yarn-plugin'),
      });

      mockDir.setContent({
        'yarn.lock': '',
        'package.json': JSON.stringify({
          workspaces: {
            packages: ['packages/*'],
          },
        }),
        'backstage.json': JSON.stringify({ version: '0.9.0' }),
        packages: {
          a: {
            'package.json': JSON.stringify({
              name: 'a',
              dependencies: {
                '@backstage/config': '^0.1.2',
              },
            }),
          },
          b: {
            'package.json': JSON.stringify({
              name: 'b',
              dependencies: {
                '@backstage/cli-common': '^0.1.1',
                '@backstage/config': '^0.1.2',
              },
            }),
          },
        },
      });

      await executeCommand('yarn', ['set', 'version', yarnVersion], {
        cwd: mockDir.path,
      });

      await executeCommand(
        'yarn',
        ['config', 'set', 'enableGlobalCache', 'true'],
        { cwd: mockDir.path },
      );

      await runYarnInstall();

      initialLockFileContent = await fs.readFile(
        joinPath(mockDir.path, 'yarn.lock'),
        'utf-8',
      );

      await executeCommand(
        'yarn',
        [
          'plugin',
          'import',
          joinPath(
            targetRoot,
            'packages/yarn-plugin/bundles/@yarnpkg/plugin-backstage.js',
          ),
        ],
        {
          cwd: mockDir.path,
        },
      );
    });

    beforeEach(() => {
      mockDir.addContent({
        'backstage.json': JSON.stringify({ version: '0.9.0' }),
        packages: {
          a: {
            'package.json': JSON.stringify({
              name: 'a',
              dependencies: {
                '@backstage/config': '^0.1.2',
              },
            }),
          },
          b: {
            'package.json': JSON.stringify({
              name: 'b',
              dependencies: {
                '@backstage/cli-common': '^0.1.1',
                '@backstage/config': '^0.1.2',
              },
            }),
          },
        },
      });
    });

    it('does not change yarn.lock when no backstage:^ versions are present', async () => {
      await runYarnInstall();

      await expect(
        fs.readFile(joinPath(mockDir.path, 'yarn.lock'), 'utf-8'),
      ).resolves.toEqual(initialLockFileContent);
    });

    describe('with backstage:^ dependencies', () => {
      beforeEach(async () => {
        mockDir.addContent({
          'packages/a/package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              '@backstage/config': 'backstage:^',
            },
          }),
          'packages/b/package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              '@backstage/config': 'backstage:^',
              '@backstage/cli-common': 'backstage:^',
            },
          }),
        });

        await runYarnInstall();
      });

      it('retains existing lockfile entries', async () => {
        const lockFileContent = await fs.readFile(
          joinPath(mockDir.path, 'yarn.lock'),
          'utf-8',
        );

        expect(nonWorkspaceEntries(lockFileContent)).toEqual(
          nonWorkspaceEntries(initialLockFileContent),
        );
      });

      it('bumps packages when backstage.json changes', async () => {
        mockDir.addContent({
          'backstage.json': JSON.stringify({
            version: '1.0.0',
          }),
        });

        await runYarnInstall();

        const lockFileContent = await fs.readFile(
          joinPath(mockDir.path, 'yarn.lock'),
          'utf-8',
        );

        const descriptors = Object.keys(yaml.parse(lockFileContent)).flatMap(
          entry => entry.split(', '),
        );

        // Versions from old manifest no longer appear in lockfile
        expect(descriptors).not.toContain('@backstage/cli-common@npm:^0.1.1');
        expect(descriptors).not.toContain('@backstage/config@npm:^0.1.2');

        // Versions from new manifest have been added to lockfile
        expect(descriptors).toContain('@backstage/cli-common@npm:^0.1.8');
        expect(descriptors).toContain('@backstage/config@npm:^1.0.0');
      });

      describe('after removing backstage:^ dependencies', () => {
        beforeEach(async () => {
          mockDir.addContent({
            'packages/a/package.json': JSON.stringify({
              name: 'a',
              dependencies: {
                '@backstage/config': '^0.1.2',
              },
            }),
            'packages/b/package.json': JSON.stringify({
              name: 'b',
              dependencies: {
                '@backstage/config': '^0.1.2',
                '@backstage/cli-common': '^0.1.1',
              },
            }),
          });

          await runYarnInstall();
        });

        it('restores the original yarn.lock content', async () => {
          const lockFileContent = await fs.readFile(
            joinPath(mockDir.path, 'yarn.lock'),
            'utf-8',
          );

          expect(lockFileContent).toEqual(initialLockFileContent);
        });
      });

      describe.each`
        packageName         | description
        ${'node-fetch'}     | ${'non-Backstage package'}
        ${'@backstage/foo'} | ${'invalid Backstage package'}
      `(
        'when backstage:^ range is used with $description "$packageName"',
        ({ packageName }) => {
          beforeEach(async () => {
            mockDir.addContent({
              'packages/c/package.json': JSON.stringify({
                name: 'c',
                dependencies: {
                  [packageName]: 'backstage:^',
                },
              }),
            });
          });

          it('fails to install', async () => {
            const { exitCode, stdout } = await runYarnInstall();

            expect(exitCode).toEqual(1);
            expect(stdout).toContain(
              `Package ${packageName} not found in manifest for Backstage v0.9.0`,
            );
          });
        },
      );

      it('successfully parses the lockfile with snyk-nodejs-lockfile-parser', async () => {
        await expect(
          buildDepTreeFromFiles(
            mockDir.path,
            'packages/b/package.json',
            'yarn.lock',
          ),
        ).resolves.toEqual(
          expect.objectContaining({
            dependencies: expect.objectContaining({
              '@backstage/cli-common': expect.anything(),
              '@backstage/config': expect.anything(),
            }),
          }),
        );
      });
    });
  });
});
