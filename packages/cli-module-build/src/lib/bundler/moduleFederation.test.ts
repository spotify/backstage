/*
 * Copyright 2025 The Backstage Authors
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
import {
  prepareRuntimeSharedDependenciesScript,
  resolveSharedDependencyVersions,
} from './moduleFederation';
import { BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL } from '@backstage/module-federation-common';

const GLOBAL = BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL;

describe('prepareRuntimeSharedDependenciesScript', () => {
  it('should generate script with a single dependency', () => {
    const result = prepareRuntimeSharedDependenciesScript({
      react: {
        version: '18.2.0',
        requiredVersion: '*',
        singleton: true,
        eager: false,
      },
    });

    expect(result).toBe(`window['${GLOBAL}'] = {
  "items": [
    {
      "name": "react",
      "version": "18.2.0",
      "lib": () => import("react"),
      "shareConfig": {
        "singleton": true,
        "requiredVersion": "*",
        "eager": false
      }
    }
  ],
  "version": "v1"
};`);
  });

  it('should generate script with multiple dependencies', () => {
    const result = prepareRuntimeSharedDependenciesScript({
      react: {
        version: '18.2.0',
        requiredVersion: '*',
        singleton: true,
        eager: true,
      },
      'react-dom': {
        version: '18.2.0',
        requiredVersion: '*',
        singleton: true,
        eager: true,
      },
      lodash: {
        version: '4.17.21',
        requiredVersion: '*',
        singleton: true,
        eager: false,
      },
    });

    expect(result).toBe(`window['${GLOBAL}'] = {
  "items": [
    {
      "name": "react",
      "version": "18.2.0",
      "lib": () => import("react"),
      "shareConfig": {
        "singleton": true,
        "requiredVersion": "*",
        "eager": true
      }
    },
    {
      "name": "react-dom",
      "version": "18.2.0",
      "lib": () => import("react-dom"),
      "shareConfig": {
        "singleton": true,
        "requiredVersion": "*",
        "eager": true
      }
    },
    {
      "name": "lodash",
      "version": "4.17.21",
      "lib": () => import("lodash"),
      "shareConfig": {
        "singleton": true,
        "requiredVersion": "*",
        "eager": false
      }
    }
  ],
  "version": "v1"
};`);
  });

  it('should handle custom requiredVersion', () => {
    const result = prepareRuntimeSharedDependenciesScript({
      react: {
        version: '18.2.0',
        requiredVersion: '^18.0.0',
        singleton: true,
        eager: false,
      },
    });

    expect(result).toContain('"requiredVersion": "^18.0.0"');
  });

  it('should handle scoped package names', () => {
    const result = prepareRuntimeSharedDependenciesScript({
      '@backstage/core-plugin-api': {
        version: '1.0.0',
        requiredVersion: '*',
        singleton: true,
        eager: false,
      },
    });

    expect(result).toContain('"name": "@backstage/core-plugin-api"');
    expect(result).toContain(
      '"lib": () => import("@backstage/core-plugin-api")',
    );
  });

  it('should handle empty dependencies', () => {
    const result = prepareRuntimeSharedDependenciesScript({});

    expect(result).toBe(`window['${GLOBAL}'] = {
  "items": [],
  "version": "v1"
};`);
  });

  it('should throw if version is missing', () => {
    expect(() =>
      prepareRuntimeSharedDependenciesScript({
        react: {
          requiredVersion: '*',
          singleton: true,
          eager: false,
        },
      }),
    ).toThrow("Version is required for shared dependency 'react'");
  });
});

describe('resolveSharedDependencyVersions', () => {
  const mockDir = createMockDirectory();

  it('only shares packages that are installed where the app can import them', () => {
    mockDir.setContent({
      'node_modules/react/package.json': JSON.stringify({ version: '18.3.1' }),
      'packages/app/package.json': '{}',
      // Not in the lookup chain of the app, like packages that only pnpm's
      // hidden hoisting directory holds
      'other/node_modules/@emotion/react/package.json': JSON.stringify({
        version: '11.0.0',
      }),
    });
    const sharedDep = { singleton: true, requiredVersion: '*', eager: false };

    const log = jest.spyOn(console, 'log').mockImplementation();
    expect(
      resolveSharedDependencyVersions(mockDir.resolve('packages/app'), {
        react: sharedDep,
        '@emotion/react': sharedDep,
      }),
    ).toEqual({ react: { ...sharedDep, version: '18.3.1' } });
    expect(log).toHaveBeenCalledWith(
      "Skipping module federation shared dependency '@emotion/react' because the app does not depend on it.",
    );
    log.mockRestore();
  });
});
