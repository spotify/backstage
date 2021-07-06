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
import React, { ReactNode } from 'react';
import { useElementFilter } from './useElementFilter';
import { renderHook } from '@testing-library/react-hooks';
import { attachComponentData } from './componentData';
import { featureFlagsApiRef } from '../apis';
import {
  ApiProvider,
  ApiRegistry,
  LocalStorageFeatureFlags,
} from '@backstage/core-app-api';

const WRAPPING_COMPONENT_KEY = 'core.blob.testing';
const INNER_COMPONENT_KEY = 'core.blob2.testing';

const WrappingComponent = (_props: { children: ReactNode }) => null;
attachComponentData(WrappingComponent, WRAPPING_COMPONENT_KEY, {
  message: 'hey! im wrapping component data',
});
const InnerComponent = () => null;
attachComponentData(InnerComponent, INNER_COMPONENT_KEY, {
  message: 'hey! im the inner component',
});
const MockComponent = (_props: { children: ReactNode }) => null;

const FeatureFlagComponent = (_props: {
  children: ReactNode;
  with?: string;
  without?: string;
}) => null;
attachComponentData(FeatureFlagComponent, 'core.featureFlagged', true);
const mockFeatureFlagsApi = new LocalStorageFeatureFlags();
const Wrapper = ({ children }: { children?: React.ReactNode }) => (
  <ApiProvider apis={ApiRegistry.with(featureFlagsApiRef, mockFeatureFlagsApi)}>
    {children}
  </ApiProvider>
);

describe('useElementFilter', () => {
  it('should select elements based on a component data key', () => {
    const tree = (
      <MockComponent>
        <WrappingComponent key="first">
          <InnerComponent />
        </WrappingComponent>
        <MockComponent>
          <WrappingComponent key="second">
            <WrappingComponent key="third">
              <InnerComponent />
            </WrappingComponent>
          </WrappingComponent>
        </MockComponent>
      </MockComponent>
    );

    const { result } = renderHook(
      props =>
        useElementFilter(props.tree, elements =>
          elements
            .selectByComponentData({ key: WRAPPING_COMPONENT_KEY })
            .getElements(),
        ),
      {
        initialProps: { tree },
        wrapper: Wrapper,
      },
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0].key).toBe('.$.$first');
    expect(result.current[1].key).toBe('.$.$second');
  });

  it('should find componentData', () => {
    const tree = (
      <MockComponent>
        <WrappingComponent key="first">
          <InnerComponent />
        </WrappingComponent>
        <MockComponent>
          <WrappingComponent key="second">
            <InnerComponent />
          </WrappingComponent>
        </MockComponent>
      </MockComponent>
    );

    const { result } = renderHook(
      props =>
        useElementFilter(props.tree, elements =>
          elements.findComponentData({ key: WRAPPING_COMPONENT_KEY }),
        ),
      {
        initialProps: { tree },
        wrapper: Wrapper,
      },
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0]).toEqual({
      message: 'hey! im wrapping component data',
    });
    expect(result.current[1]).toEqual({
      message: 'hey! im wrapping component data',
    });
  });

  it('can be combined to together to filter the selection', () => {
    const tree = (
      <MockComponent>
        <WrappingComponent key="first">
          <InnerComponent />
        </WrappingComponent>
        <MockComponent>
          <WrappingComponent key="second">
            <InnerComponent />
          </WrappingComponent>
        </MockComponent>
        <InnerComponent />
      </MockComponent>
    );

    const { result } = renderHook(
      props =>
        useElementFilter(props.tree, elements =>
          elements
            .selectByComponentData({ key: WRAPPING_COMPONENT_KEY })
            .findComponentData({ key: INNER_COMPONENT_KEY }),
        ),
      {
        initialProps: { tree },
        wrapper: Wrapper,
      },
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0]).toEqual({
      message: 'hey! im the inner component',
    });
    expect(result.current[1]).toEqual({
      message: 'hey! im the inner component',
    });
  });

  describe('FeatureFlags', () => {
    describe('with', () => {
      it('should not discover deeper than the feature gate if the feature flag is disabled', () => {
        jest
          .spyOn(mockFeatureFlagsApi, 'isActive')
          .mockImplementation(() => false);
        const tree = (
          <MockComponent>
            <FeatureFlagComponent with="testing-flag">
              <WrappingComponent key="first">
                <InnerComponent />
              </WrappingComponent>
            </FeatureFlagComponent>
            <MockComponent>
              <WrappingComponent key="second">
                <InnerComponent />
              </WrappingComponent>
            </MockComponent>
            <InnerComponent />
          </MockComponent>
        );

        const { result } = renderHook(
          props =>
            useElementFilter(props.tree, elements =>
              elements
                .selectByComponentData({ key: WRAPPING_COMPONENT_KEY })
                .getElements(),
            ),
          {
            initialProps: { tree },
            wrapper: Wrapper,
          },
        );

        expect(result.current.length).toBe(1);
        expect(result.current[0].key).toContain('second');
      });

      it('should discover components behind a feature flag if the flag is enabled', () => {
        jest
          .spyOn(mockFeatureFlagsApi, 'isActive')
          .mockImplementation(() => true);
        const tree = (
          <MockComponent>
            <FeatureFlagComponent with="testing-flag">
              <WrappingComponent key="first">
                <InnerComponent />
              </WrappingComponent>
            </FeatureFlagComponent>
            <MockComponent>
              <WrappingComponent key="second">
                <InnerComponent />
              </WrappingComponent>
            </MockComponent>
            <InnerComponent />
          </MockComponent>
        );

        const { result } = renderHook(
          props =>
            useElementFilter(props.tree, elements =>
              elements
                .selectByComponentData({ key: WRAPPING_COMPONENT_KEY })
                .getElements(),
            ),
          {
            initialProps: { tree },
            wrapper: Wrapper,
          },
        );

        expect(result.current.length).toBe(2);
      });
    });

    describe('without', () => {
      it('should discover deeper than the feature gate if the feature flag is disabled', () => {
        jest
          .spyOn(mockFeatureFlagsApi, 'isActive')
          .mockImplementation(() => false);
        const tree = (
          <MockComponent>
            <FeatureFlagComponent without="testing-flag">
              <WrappingComponent key="first">
                <InnerComponent />
              </WrappingComponent>
            </FeatureFlagComponent>
            <MockComponent>
              <WrappingComponent key="second">
                <InnerComponent />
              </WrappingComponent>
            </MockComponent>
            <InnerComponent />
          </MockComponent>
        );

        const { result } = renderHook(
          props =>
            useElementFilter(props.tree, elements =>
              elements
                .selectByComponentData({ key: WRAPPING_COMPONENT_KEY })
                .getElements(),
            ),
          {
            initialProps: { tree },
            wrapper: Wrapper,
          },
        );

        expect(result.current.length).toBe(2);
      });

      it('should not discover components behind a feature flag if the flag is enabled', () => {
        jest
          .spyOn(mockFeatureFlagsApi, 'isActive')
          .mockImplementation(() => true);
        const tree = (
          <MockComponent>
            <FeatureFlagComponent without="testing-flag">
              <WrappingComponent key="first">
                <InnerComponent />
              </WrappingComponent>
            </FeatureFlagComponent>
            <MockComponent>
              <WrappingComponent key="second">
                <InnerComponent />
              </WrappingComponent>
            </MockComponent>
            <InnerComponent />
          </MockComponent>
        );

        const { result } = renderHook(
          props =>
            useElementFilter(props.tree, elements =>
              elements
                .selectByComponentData({ key: WRAPPING_COMPONENT_KEY })
                .getElements(),
            ),
          {
            initialProps: { tree },
            wrapper: Wrapper,
          },
        );

        expect(result.current.length).toBe(1);
      });
    });
  });

  it('should reject when strict mode is enabled with the correct string', () => {
    const tree = (
      <MockComponent>
        <h1>Hello</h1>
      </MockComponent>
    );

    const { result } = renderHook(
      props =>
        useElementFilter(props.tree, elements =>
          elements
            .selectByComponentData({
              key: WRAPPING_COMPONENT_KEY,
              withStrictError: 'Could not find component',
            })
            .findComponentData({ key: INNER_COMPONENT_KEY }),
        ),
      {
        initialProps: { tree },
        wrapper: Wrapper,
      },
    );

    expect(result.error.message).toEqual('Could not find component');
  });

  it('should support fragments and text node iteration', () => {
    jest.spyOn(mockFeatureFlagsApi, 'isActive').mockImplementation(() => true);
    const tree = (
      <>
        <MockComponent>
          <>
            <FeatureFlagComponent with="testing-flag">
              <WrappingComponent key="first">
                <InnerComponent />
              </WrappingComponent>
            </FeatureFlagComponent>
          </>
          <MockComponent>
            hello my name
            <>
              <WrappingComponent key="second">
                <InnerComponent />
              </WrappingComponent>
            </>
          </MockComponent>
          is text
          <InnerComponent />
        </MockComponent>
      </>
    );

    const { result } = renderHook(
      props =>
        useElementFilter(props.tree, elements =>
          elements
            .selectByComponentData({ key: WRAPPING_COMPONENT_KEY })
            .getElements(),
        ),
      {
        initialProps: { tree },
        wrapper: Wrapper,
      },
    );

    expect(result.current.length).toBe(2);
  });
});
