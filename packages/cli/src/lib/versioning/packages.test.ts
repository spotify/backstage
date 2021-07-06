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

import mockFs from 'mock-fs';
import path from 'path';
import * as runObj from '../run';
import { paths } from '../paths';
import { fetchPackageInfo, mapDependencies } from './packages';
import { NotFoundError } from '../errors';

describe('fetchPackageInfo', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should forward info', async () => {
    jest
      .spyOn(runObj, 'runPlain')
      .mockResolvedValue(`{"type":"inspect","data":{"the":"data"}}`);

    await expect(fetchPackageInfo('my-package')).resolves.toEqual({
      the: 'data',
    });
    expect(runObj.runPlain).toHaveBeenCalledWith(
      'yarn',
      'info',
      '--json',
      'my-package',
    );
  });

  it('should throw if no info', async () => {
    jest.spyOn(runObj, 'runPlain').mockResolvedValue('');

    await expect(fetchPackageInfo('my-package')).rejects.toThrow(
      new NotFoundError(`No package information found for package my-package`),
    );
  });
});

describe('mapDependencies', () => {
  afterEach(() => {
    mockFs.restore();
    jest.resetAllMocks();
  });

  it('should read dependencies', async () => {
    // Make sure all modules involved in package discovery are in the module cache before we mock fs
    const { Project } = require('@lerna/project');
    const project = new Project(paths.targetDir);
    await project.getPackages();

    mockFs({
      'lerna.json': JSON.stringify({
        packages: ['pkgs/*'],
      }),
      'pkgs/a/package.json': JSON.stringify({
        name: 'a',
        dependencies: {
          '@backstage/core': '1 || 2',
        },
      }),
      'pkgs/b/package.json': JSON.stringify({
        name: 'b',
        dependencies: {
          '@backstage/core': '3',
          '@backstage/cli': '^0',
        },
      }),
    });

    const dependencyMap = await mapDependencies(paths.targetDir);
    expect(Array.from(dependencyMap)).toEqual([
      [
        '@backstage/core',
        [
          {
            name: 'a',
            range: '1 || 2',
            location: path.resolve('pkgs', 'a'),
          },
          {
            name: 'b',
            range: '3',
            location: path.resolve('pkgs', 'b'),
          },
        ],
      ],
      [
        '@backstage/cli',
        [
          {
            name: 'b',
            range: '^0',
            location: path.resolve('pkgs', 'b'),
          },
        ],
      ],
    ]);
  });
});
