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

/* eslint-disable no-restricted-syntax */
import { resolve as resolvePath } from 'path';
import { findPaths, findRootPath, findOwnDir, findOwnRootDir } from './paths';

describe('paths', () => {
  it('findOwnDir and findOwnRootDir should find owns paths', () => {
    const dir = findOwnDir(__dirname);
    const root = findOwnRootDir(dir);

    expect(dir).toBe(resolvePath(__dirname, '..'));
    expect(root).toBe(resolvePath(__dirname, '../../..'));
  });

  it('findRootPath should find a root path', () => {
    expect(findRootPath(__dirname, () => true)).toBe(
      resolvePath(__dirname, '..'),
    );

    expect(findRootPath(__dirname, () => false)).toBeUndefined();

    expect(
      findRootPath(
        __dirname,
        path => path !== resolvePath(__dirname, '../package.json'),
      ),
    ).toBe(resolvePath(__dirname, '../../..'));
  });

  it('findPaths should find package paths', () => {
    const dir = resolvePath(__dirname, '..');
    const root = resolvePath(__dirname, '../../..');

    const paths = findPaths(__dirname);

    expect(paths.ownDir).toBe(dir);
    expect(paths.ownRoot).toBe(root);
    expect(paths.resolveOwn('./derp.txt')).toBe(resolvePath(dir, 'derp.txt'));
    expect(paths.resolveOwnRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
    expect(paths.targetDir).toBe(dir);
    expect(paths.targetRoot).toBe(root);
    expect(paths.resolveTarget('./derp.txt')).toBe(
      resolvePath(dir, 'derp.txt'),
    );
    expect(paths.resolveTargetRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
  });

  it('findPaths should find mocked package paths', () => {
    const mockCwd = resolvePath(__dirname, '../../config');
    const mockDir = resolvePath(__dirname, '../../cli');
    const root = resolvePath(__dirname, '../../..');

    jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

    const paths = findPaths(resolvePath(mockDir, 'src/lib'));

    expect(paths.ownDir).toBe(mockDir);
    expect(paths.ownRoot).toBe(root);
    expect(paths.resolveOwn('./derp.txt')).toBe(
      resolvePath(mockDir, 'derp.txt'),
    );
    expect(paths.resolveOwnRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
    expect(paths.targetDir).toBe(mockCwd);
    expect(paths.targetRoot).toBe(root);
    expect(paths.resolveTarget('./derp.txt')).toBe(
      resolvePath(mockCwd, 'derp.txt'),
    );
    expect(paths.resolveTargetRoot('./derp.txt')).toBe(
      resolvePath(root, 'derp.txt'),
    );
  });
});
