/*
 * Copyright 2023 The Backstage Authors
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

import {
  AppRootElementBlueprint,
  createFrontendModule,
  createSwappableComponent,
} from '@backstage/frontend-plugin-api';
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import { DefaultSwappableComponentsApi } from './DefaultSwappableComponentsApi';
import { render, screen } from '@testing-library/react';
import { renderInTestApp, renderTestApp } from '@backstage/frontend-test-utils';

const { ref: testRefA } = createSwappableComponent({ id: 'test.a' });
const { ref: testRefB1 } = createSwappableComponent({ id: 'test.b' });
const { ref: testRefB2 } = createSwappableComponent({ id: 'test.b' });

describe('DefaultSwappableComponentsApi', () => {
  it('should provide components', async () => {
    const api = DefaultSwappableComponentsApi.fromComponents([
      {
        ref: testRefA,
        loader: () => () => <div>test.a</div>,
      },
    ]);

    const ComponentA = api.getComponent(testRefA);

    render(<ComponentA />);

    await expect(screen.findByText('test.a')).resolves.toBeInTheDocument();
  });

  it('should key extension refs by ID', async () => {
    const mockLoader = jest.fn(() => <div>test.b</div>);
    const api = DefaultSwappableComponentsApi.fromComponents([
      {
        ref: testRefB1,
        loader: () => mockLoader,
      },
    ]);

    const ComponentB2 = api.getComponent(testRefB2);

    render(<ComponentB2 />);

    await expect(screen.findByText('test.b')).resolves.toBeInTheDocument();
  });

  describe('integration tests', () => {
    describe('no api provided', () => {
      it('should render the fallback if no other component is provided', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
        });

        renderInTestApp(<MockComponent />, {});

        await expect(
          screen.findByTestId('test.mock'),
        ).resolves.toBeInTheDocument();
      });

      it('should render the default compnoent if no other component is provided', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: () => () => <div>test.mock</div>,
        });

        renderInTestApp(<MockComponent />, {});

        await expect(
          screen.findByText('test.mock'),
        ).resolves.toBeInTheDocument();
      });

      it('should render async loader component if no other component is provided', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: async () => () => <div>test.mock</div>,
        });

        renderInTestApp(<MockComponent />, {});

        await expect(
          screen.findByText('test.mock'),
        ).resolves.toBeInTheDocument();
      });

      it('should transform props correctly', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: () => (props: { inner: string }) =>
            <div>inner: {props.inner}</div>,
          transformProps: (props: { external: string }) => ({
            inner: props.external,
          }),
        });

        renderInTestApp(<MockComponent external="test" />, {});

        await expect(
          screen.findByText('inner: test'),
        ).resolves.toBeInTheDocument();
      });
    });

    describe('with overrides', () => {
      it('should render the fallback if no other component is provided', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
        });

        renderTestApp({
          extensions: [
            AppRootElementBlueprint.make({
              name: 'derp',
              params: define =>
                define({
                  element: <MockComponent />,
                }),
            }),
          ],
        });

        await expect(
          screen.findByTestId('test.mock'),
        ).resolves.toBeInTheDocument();
      });

      it('should render the default compnoent if no other component is provided', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: () => () => <div>test.mock</div>,
        });

        renderTestApp({
          extensions: [
            AppRootElementBlueprint.make({
              name: 'derp',
              params: define =>
                define({
                  element: <MockComponent />,
                }),
            }),
          ],
        });

        await expect(
          screen.findByText('test.mock'),
        ).resolves.toBeInTheDocument();
      });

      it('should render async loader component if no other component is provided', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: async () => () => <div>test.mock</div>,
        });

        renderTestApp({
          extensions: [
            AppRootElementBlueprint.make({
              name: 'derp',
              params: define =>
                define({
                  element: <MockComponent />,
                }),
            }),
          ],
        });

        await expect(
          screen.findByText('test.mock'),
        ).resolves.toBeInTheDocument();
      });

      it('should render the component provided by the blueprint', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: () => () => <div>test.mock</div>,
        });

        const override = SwappableComponentBlueprint.make({
          params: define =>
            define({
              component: MockComponent,
              loader: () => () => <div>Overridden!</div>,
            }),
        });

        renderTestApp({
          extensions: [
            AppRootElementBlueprint.make({
              name: 'derp',
              params: define =>
                define({
                  element: <MockComponent />,
                }),
            }),
          ],
          features: [
            createFrontendModule({
              pluginId: 'app',
              extensions: [override],
            }),
          ],
        });

        await expect(
          screen.findByText('Overridden!'),
        ).resolves.toBeInTheDocument();
      });

      it('should render the async component provided by the blueprint', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: () => () => <div>test.mock</div>,
        });

        const override = SwappableComponentBlueprint.make({
          params: define =>
            define({
              component: MockComponent,
              loader: async () => () => <div>Overridden!</div>,
            }),
        });

        renderTestApp({
          extensions: [
            AppRootElementBlueprint.make({
              name: 'derp',
              params: define =>
                define({
                  element: <MockComponent />,
                }),
            }),
          ],
          features: [
            createFrontendModule({
              pluginId: 'app',
              extensions: [override],
            }),
          ],
        });

        await expect(
          screen.findByText('Overridden!'),
        ).resolves.toBeInTheDocument();
      });

      it('should transform props correctly', async () => {
        const MockComponent = createSwappableComponent({
          id: 'test.mock',
          loader: () => (props: { inner: string }) =>
            <div>inner: {props.inner}</div>,
          transformProps: (props: { external: string }) => ({
            inner: props.external,
          }),
        });

        const override = SwappableComponentBlueprint.make({
          params: define =>
            define({
              component: MockComponent,
              loader: () => props => <div>overridden: {props.inner}</div>,
            }),
        });

        renderTestApp({
          extensions: [
            AppRootElementBlueprint.make({
              name: 'derp',
              params: define =>
                define({
                  element: <MockComponent external="test" />,
                }),
            }),
          ],
          features: [
            createFrontendModule({
              pluginId: 'app',
              extensions: [override],
            }),
          ],
        });

        await expect(
          screen.findByText('overridden: test'),
        ).resolves.toBeInTheDocument();
      });
    });
  });
});
