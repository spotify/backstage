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

import React, { Context, useContext } from 'react';
import {
  useApi,
  createApiRef,
  withApis,
  ApiHolder,
  ApiRef,
} from '@backstage/core-plugin-api';
import { ApiProvider } from './ApiProvider';
import { ApiRegistry } from './ApiRegistry';
import { render } from '@testing-library/react';
import { withLogCollector } from '@backstage/test-utils-core';
import { getGlobalSingleton } from '../../lib/globalObject';
import { VersionedValue } from '../../lib/versionedValues';

describe('ApiProvider', () => {
  type Api = () => string;
  const apiRef = createApiRef<Api>({ id: 'x' });
  const registry = ApiRegistry.from([[apiRef, () => 'hello']]);

  const MyHookConsumer = () => {
    const api = useApi(apiRef);
    return <p>hook message: {api()}</p>;
  };

  const MyHocConsumer = withApis({ getMessage: apiRef })(({ getMessage }) => {
    return <p>hoc message: {getMessage()}</p>;
  });

  it('should provide apis', () => {
    const renderedHook = render(
      <ApiProvider apis={registry}>
        <MyHookConsumer />
      </ApiProvider>,
    );
    renderedHook.getByText('hook message: hello');

    const renderedHoc = render(
      <ApiProvider apis={registry}>
        <MyHocConsumer />
      </ApiProvider>,
    );
    renderedHoc.getByText('hoc message: hello');
  });

  it('should provide nested access to apis', () => {
    const aRef = createApiRef<string>({ id: 'a' });
    const bRef = createApiRef<string>({ id: 'b' });

    const MyComponent = () => {
      const a = useApi(aRef);
      const b = useApi(bRef);
      return (
        <div>
          a={a} b={b}
        </div>
      );
    };

    const renderedHook = render(
      <ApiProvider
        apis={ApiRegistry.from([
          [aRef, 'x'],
          [bRef, 'y'],
        ])}
      >
        <ApiProvider apis={ApiRegistry.from([[aRef, 'z']])}>
          <MyComponent />
        </ApiProvider>
      </ApiProvider>,
    );
    renderedHook.getByText('a=z b=y');
  });

  it('should ignore deps in prototype', () => {
    // 100% coverage + happy typescript = hasOwnProperty + this atrocity
    const xRef = createApiRef<number>({ id: 'x' });

    const proto = { x: xRef };
    const props = { getMessage: { enumerable: true, value: apiRef } };
    const obj = Object.create(proto, props) as {
      getMessage: typeof apiRef;
      x: typeof xRef;
    };

    const MyWeirdHocConsumer = withApis(obj)(({ getMessage }) => {
      return <p>hoc message: {getMessage()}</p>;
    });

    const renderedHoc = render(
      <ApiProvider apis={registry}>
        <MyWeirdHocConsumer />
      </ApiProvider>,
    );
    renderedHoc.getByText('hoc message: hello');
  });

  it('should error if no provider is available', () => {
    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(<MyHookConsumer />);
        }).toThrow(/^No provider available for api-context context/);
      }).error,
    ).toEqual([
      expect.stringMatching(
        /^Error: Uncaught \[Error: No provider available for api-context context/,
      ),
      expect.stringMatching(
        /^The above error occurred in the <MyHookConsumer> component/,
      ),
    ]);

    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(<MyHocConsumer />);
        }).toThrow(/^No provider available for api-context context/);
      }).error,
    ).toEqual([
      expect.stringMatching(
        /^Error: Uncaught \[Error: No provider available for api-context context/,
      ),
      expect.stringMatching(
        /^The above error occurred in the <withApis\(Component\)> component/,
      ),
    ]);
  });

  it('should error if api is not available', () => {
    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(
            <ApiProvider apis={ApiRegistry.from([])}>
              <MyHookConsumer />
            </ApiProvider>,
          );
        }).toThrow('No implementation available for apiRef{x}');
      }).error,
    ).toEqual([
      expect.stringMatching(
        /^Error: Uncaught \[Error: No implementation available for apiRef{x}\]/,
      ),
      expect.stringMatching(
        /^The above error occurred in the <MyHookConsumer> component/,
      ),
    ]);

    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(
            <ApiProvider apis={ApiRegistry.from([])}>
              <MyHocConsumer />
            </ApiProvider>,
          );
        }).toThrow('No implementation available for apiRef{x}');
      }).error,
    ).toEqual([
      expect.stringMatching(
        /^Error: Uncaught \[Error: No implementation available for apiRef{x}\]/,
      ),
      expect.stringMatching(
        /^The above error occurred in the <withApis\(Component\)> component/,
      ),
    ]);
  });
});

describe('v1 consumer', () => {
  const ApiContext = getGlobalSingleton<
    Context<VersionedValue<{ 1: ApiHolder }>>
  >('api-context');

  function useMockApiV1<T>(apiRef: ApiRef<T>): T {
    const impl = useContext(ApiContext)?.atVersion(1)?.get(apiRef);
    if (!impl) {
      throw new Error('no impl');
    }
    return impl;
  }

  type Api = () => string;
  const apiRef = createApiRef<Api>({ id: 'x' });
  const registry = ApiRegistry.from([[apiRef, () => 'hello']]);

  const MyHookConsumerV1 = () => {
    const api = useMockApiV1(apiRef);
    return <p>hook message: {api()}</p>;
  };

  it('should provide apis', () => {
    const renderedHook = render(
      <ApiProvider apis={registry}>
        <MyHookConsumerV1 />
      </ApiProvider>,
    );
    renderedHook.getByText('hook message: hello');
  });
});
