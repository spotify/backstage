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

import * as os from 'os';
import * as path from 'path';
import { LinkedPackageResolvePlugin } from './LinkedPackageResolvePlugin';

describe('LinkedPackageResolvePlugin', () => {
  const root = os.platform() === 'win32' ? 'C:\\root' : '/root';

  it('should re-write paths for external packages', () => {
    const plugin = new LinkedPackageResolvePlugin(
      path.resolve(root, 'repo/node_modules'),
      [
        {
          name: 'a',
          location: path.resolve(root, 'external-a'),
        },
        {
          name: '@s/b',
          location: path.resolve(root, 'external-b'),
        },
      ],
    );

    const tapAsync = jest.fn();
    const doResolve = jest.fn();

    const resolver = {
      hooks: { resolve: { tapAsync } },
      doResolve,
    };
    plugin.apply(resolver);

    expect(tapAsync).toHaveBeenCalledTimes(1);
    expect(tapAsync).toHaveBeenCalledWith(
      'LinkedPackageResolvePlugin',
      expect.any(Function),
    );
    expect(doResolve).toHaveBeenCalledTimes(0);

    // Internal module resolution is not affected
    const tap = tapAsync.mock.calls[0][1];
    const callbackX = jest.fn();
    tap(
      {
        request: path.resolve(root, 'repo/package/x/src/module.ts'),
        path: path.resolve(root, 'repo/package/x/src'),
        context: {
          issuer: path.resolve(root, 'repo/package/x/src/index.ts'),
        },
      },
      'some-context',
      callbackX,
    );
    expect(callbackX).toHaveBeenCalledTimes(1);
    expect(callbackX).toHaveBeenCalledWith();
    expect(doResolve).toHaveBeenCalledTimes(0);

    // Path is sometimes false
    const callbackFalse = jest.fn();
    tap(
      {
        request: 'dummy',
        path: false,
      },
      'some-context',
      callbackFalse,
    );
    expect(callbackFalse).toHaveBeenCalledTimes(1);
    expect(callbackFalse).toHaveBeenCalledWith();
    expect(doResolve).toHaveBeenCalledTimes(0);

    // Internal modules with a path prefix of an external module
    const callbackY = jest.fn();
    tap(
      {
        request: path.resolve(root, 'external-aa/src/module.ts'),
        path: path.resolve(root, 'external-aa/src'),
        context: {
          issuer: path.resolve(root, 'external-aa/src/index.ts'),
        },
      },
      'some-context',
      callbackY,
    );
    expect(callbackY).toHaveBeenCalledTimes(1);
    expect(callbackY).toHaveBeenCalledWith();
    expect(doResolve).toHaveBeenCalledTimes(0);

    // External modules have their path and issuer context rewritten, but not the request
    const callbackA = jest.fn();
    tap(
      {
        request: path.resolve(root, 'external-a/src/module.ts'),
        path: path.resolve(root, 'external-a/src'),
        context: {
          issuer: path.resolve(root, 'external-a/src/index.ts'),
        },
      },
      'some-context',
      callbackA,
    );
    expect(callbackA).toHaveBeenCalledTimes(0);
    expect(doResolve).toHaveBeenCalledTimes(1);
    expect(doResolve).toHaveBeenCalledWith(
      resolver.hooks.resolve,
      {
        request: path.resolve(root, 'external-a/src/module.ts'),
        path: path.resolve(root, 'repo/node_modules/a/src'),
        context: {
          issuer: path.resolve(root, 'repo/node_modules/a/src/index.ts'),
        },
      },
      `resolve ${path.resolve(
        root,
        'external-a/src/module.ts',
      )} in ${path.resolve(root, 'repo/node_modules/a')}`,
      'some-context',
      callbackA,
    );

    // Also handles scoped packages correctly, and issuer is not required
    const callbackB = jest.fn();
    tap(
      {
        request: path.resolve(root, 'external-b/src/module.ts'),
        path: path.resolve(root, 'external-b/src'),
        context: {
          issuer: false,
        },
      },
      'some-context',
      callbackB,
    );
    expect(callbackB).toHaveBeenCalledTimes(0);
    expect(doResolve).toHaveBeenCalledTimes(2);
    expect(doResolve).toHaveBeenLastCalledWith(
      resolver.hooks.resolve,
      {
        request: path.resolve(root, 'external-b/src/module.ts'),
        path: path.resolve(root, 'repo/node_modules/@s/b/src'),
        context: {
          issuer: false,
        },
      },
      `resolve ${path.resolve(
        root,
        'external-b/src/module.ts',
      )} in ${path.resolve(root, 'repo/node_modules/@s/b')}`,
      'some-context',
      callbackB,
    );

    expect(tapAsync).toHaveBeenCalledTimes(1);
  });
});
