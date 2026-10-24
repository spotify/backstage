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
import { discoverActionUiBrowserAssets } from './actionUi';
import { buildBackendBrowserAssets } from '.';

describe('backendBrowserAssets', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  it('discovers components declared directly on backend actions', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify({
          name: 'example-backend',
          backstage: { role: 'backend-plugin' },
        }),
        src: {
          'action.ts': `
            export const action = {
              name: 'show-example',
              action: async () => ({ output: {} }),
              ui: {
                component: () => import('./Example').then(m => m.Example),
              },
            };
          `,
          'Example.tsx': 'export const Example = () => null;',
        },
      },
    });

    await expect(
      discoverActionUiBrowserAssets(mockDir.resolve('package')),
    ).resolves.toEqual([
      {
        id: 'show-example',
        entry: mockDir.resolve('package/src/Example.tsx'),
        exportName: 'Example',
      },
    ]);
  });

  it('ignores action UI metadata without a component', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify({
          name: 'example-backend',
          backstage: { role: 'backend-plugin' },
        }),
        src: {
          'action.ts': `
            export const action = {
              name: 'refresh-example',
              action: async () => ({ output: {} }),
              ui: { visibility: ['app'] },
            };
          `,
        },
      },
    });

    await expect(
      discoverActionUiBrowserAssets(mockDir.resolve('package')),
    ).resolves.toEqual([]);
  });

  it('rejects component loaders that cannot be statically bundled', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify({
          name: 'example-backend',
          backstage: { role: 'backend-plugin' },
        }),
        src: {
          'action.ts': `
            const modulePath = './Example';
            export const action = {
              name: 'show-example',
              action: async () => ({ output: {} }),
              ui: { component: () => import(modulePath) },
            };
          `,
        },
      },
    });

    await expect(
      discoverActionUiBrowserAssets(mockDir.resolve('package')),
    ).rejects.toThrow(
      "action UI component must use () => import('./module').then(module => module.Component)",
    );
  });

  it('rejects extracted UI declarations instead of silently skipping them', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify({
          name: 'example-backend',
          backstage: { role: 'backend-plugin' },
        }),
        src: {
          'action.ts': `
            const actionUi = {
              component: () => import('./Example').then(m => m.Example),
            };
            export const action = {
              name: 'show-example',
              action: async () => ({ output: {} }),
              ui: actionUi,
            };
          `,
          'Example.tsx': 'export const Example = () => null;',
        },
      },
    });

    await expect(
      discoverActionUiBrowserAssets(mockDir.resolve('package')),
    ).rejects.toThrow('action UI must be declared as an inline object literal');
  });

  it('removes stale output when an action UI build fails', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify({
          name: 'example-backend',
          backstage: { role: 'backend-plugin' },
        }),
        src: {
          'action.ts': `
            export const action = {
              name: 'show-example',
              action: async () => ({ output: {} }),
              ui: { component: () => import(modulePath) },
            };
          `,
        },
        dist: { 'action-ui': { 'manifest.json': '{}' } },
      },
    });

    await expect(
      buildBackendBrowserAssets({ targetDir: mockDir.resolve('package') }),
    ).rejects.toThrow('action UI component must use');
    await expect(
      fs.pathExists(mockDir.resolve('package/dist/action-ui')),
    ).resolves.toBe(false);
  });

  it('removes stale action UI output when a package has no action UIs', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify({
          name: 'example-backend',
          backstage: { role: 'backend-plugin' },
        }),
        dist: {
          'action-ui': {
            'manifest.json': '{}',
          },
        },
      },
    });

    await expect(
      buildBackendBrowserAssets({ targetDir: mockDir.resolve('package') }),
    ).resolves.toEqual({ count: 0 });
    await expect(
      fs.pathExists(mockDir.resolve('package/dist/action-ui')),
    ).resolves.toBe(false);
  });
});
