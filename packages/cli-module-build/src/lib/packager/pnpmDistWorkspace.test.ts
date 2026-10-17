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

import { createMockDirectory } from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import {
  preparePnpmDistWorkspace,
  restorePnpmDependencyRanges,
} from './pnpmDistWorkspace';

const lockfile = `---
lockfileVersion: '9.0'

importers:

  .:
    packageManagerDependencies:
      pnpm:
        specifier: 12.14.0
        version: 12.14.0

packages:

  pnpm@12.14.0:
    resolution: {integrity: sha512-abc}

---
lockfileVersion: '9.0'

importers:

  .: {}

  packages/app:
    dependencies:
      lodash:
        specifier: ^4.17.21
        version: 4.17.21

  packages/backend:
    dependencies:
      app:
        specifier: link:../app
        version: link:../app

packages:

  lodash@4.17.21:
    resolution: {integrity: sha512-def}
`;

describe('preparePnpmDistWorkspace', () => {
  const mockDir = createMockDirectory();

  it('empties the lockfile entries of bundled packages and copies the files that the install reads', async () => {
    mockDir.setContent({
      'outside/b.patch': 'b',
      'outside/hooks.cjs': 'hooks',
      'project/patches/a.patch': 'a',
      'project/.pnpmfile.cjs': 'default hooks',
      dist: {
        'pnpm-lock.yaml': lockfile,
        'pnpm-workspace.yaml': `packages:
  - packages/*

patchedDependencies:
  a@1.0.0: patches/a.patch
  b@1.0.0: ../outside/b.patch
`,
      },
    });

    const files = await preparePnpmDistWorkspace({
      workspaceRootDir: mockDir.resolve('project'),
      targetDir: mockDir.resolve('dist'),
      bundledPackageDirs: ['packages/app'],
    });

    expect(files).toEqual([
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      'patches/a.patch',
      'patches/b.patch',
      '.pnpmfile.cjs',
    ]);
    expect(mockDir.content({ path: 'dist', shouldReadAsText: true })).toEqual({
      // Only the entry of the bundled package changes
      'pnpm-lock.yaml': lockfile.replace(
        / {2}packages\/app:\n( {4}.*\n)+/,
        '  packages/app: {}\n',
      ),
      'pnpm-workspace.yaml': `packages:
  - packages/*

patchedDependencies:
  a@1.0.0: patches/a.patch
  b@1.0.0: patches/b.patch
`,
      patches: { 'a.patch': 'a', 'b.patch': 'b' },
      '.pnpmfile.cjs': 'default hooks',
    });

    // A pnpmfile from the settings replaces the default ones
    mockDir.setContent({
      'outside/hooks.cjs': 'hooks',
      'project/.pnpmfile.cjs': 'default hooks',
      dist: { 'pnpm-workspace.yaml': 'pnpmfile: ../outside/hooks.cjs\n' },
    });
    await expect(
      preparePnpmDistWorkspace({
        workspaceRootDir: mockDir.resolve('project'),
        targetDir: mockDir.resolve('dist'),
        bundledPackageDirs: [],
      }),
    ).resolves.toEqual(['pnpm-workspace.yaml', 'hooks.cjs']);
    expect(mockDir.content({ path: 'dist', shouldReadAsText: true })).toEqual({
      'pnpm-workspace.yaml': 'pnpmfile: hooks.cjs\n',
      'hooks.cjs': 'hooks',
    });
  });
  it('fails when the pnpmfile loads other local files', async () => {
    const prepare = () =>
      preparePnpmDistWorkspace({
        workspaceRootDir: mockDir.resolve('project'),
        targetDir: mockDir.resolve('dist'),
        bundledPackageDirs: [],
      });

    mockDir.setContent({
      'project/.pnpmfile.cjs': `// require('./commented-out.cjs')
const path = require('node:path');
const { readPackage } = require('./hooks/read-package.cjs');
module.exports = { hooks: { readPackage } };
`,
      dist: { 'pnpm-workspace.yaml': 'packages: []\n' },
    });
    await expect(prepare()).rejects.toThrow(
      'The pnpmfile .pnpmfile.cjs loads ./hooks/read-package.cjs, but only the pnpmfile itself is copied into the dist workspace. Move that code into the pnpmfile.',
    );

    mockDir.setContent({
      'project/hooks.mjs': `import lodash from 'lodash';
import { a } from "../shared/a.mjs";
export const hooks = { readPackage: pkg => import('./b.mjs').then(() => pkg) };
`,
      dist: { 'pnpm-workspace.yaml': 'pnpmfile: hooks.mjs\n' },
    });
    await expect(prepare()).rejects.toThrow(
      'The pnpmfile hooks.mjs loads ../shared/a.mjs, ./b.mjs, but only the pnpmfile itself is copied',
    );

    // Packages and imports in comments are fine
    mockDir.setContent({
      'project/hooks.cjs': `/* const local = require('./local.cjs'); */
const lodash = require('lodash'); // require('./local.cjs')
module.exports = { hooks: {} };
`,
      dist: { 'pnpm-workspace.yaml': 'pnpmfile: hooks.cjs\n' },
    });
    await expect(prepare()).resolves.toEqual([
      'pnpm-workspace.yaml',
      'hooks.cjs',
    ]);
  });
});

describe('restorePnpmDependencyRanges', () => {
  const mockDir = createMockDirectory();

  it('puts back the ranges that pnpm pack replaced', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'lib',
        main: 'dist/index.cjs.js',
        dependencies: { util: '^0.1.0', ms: '^2.1.3' },
        devDependencies: { cli: '^1.0.0' },
      }),
    });

    await restorePnpmDependencyRanges(mockDir.resolve('package.json'), {
      name: 'lib',
      main: 'src/index.ts',
      dependencies: { util: 'workspace:^', ms: 'catalog:' },
    });

    await expect(fs.readJson(mockDir.resolve('package.json'))).resolves.toEqual(
      {
        name: 'lib',
        main: 'dist/index.cjs.js',
        dependencies: { util: 'workspace:^', ms: 'catalog:' },
      },
    );
  });
});
