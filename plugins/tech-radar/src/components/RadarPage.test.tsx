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

import {
  MockErrorApi,
  renderInTestApp,
  wrapInTestApp,
} from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { render, waitForElement } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import GetBBoxPolyfill from '../utils/polyfills/getBBox';
import { RadarPage } from './RadarPage';
import { TechRadarLoaderResponse, techRadarApiRef, TechRadarApi } from '../api';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { errorApiRef } from '@backstage/core-plugin-api';

describe('RadarPage', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });
  class MockClient implements TechRadarApi {
    async load(): Promise<TechRadarLoaderResponse> {
      return {
        entries: [],
        quadrants: [],
        rings: [],
      };
    }
  }

  const mockClient = new MockClient();

  it('should render a progress bar', async () => {
    jest.useFakeTimers();

    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };

    const { getByTestId, queryByTestId } = render(
      wrapInTestApp(
        <ThemeProvider theme={lightTheme}>
          <ApiProvider apis={ApiRegistry.from([[techRadarApiRef, mockClient]])}>
            <RadarPage {...techRadarProps} />
          </ApiProvider>
        </ThemeProvider>,
      ),
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(getByTestId('progress')).toBeInTheDocument();

    await waitForElement(() => queryByTestId('tech-radar-svg'));
    jest.useRealTimers();
  });

  it('should render a header with a svg', async () => {
    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };
    jest.spyOn(mockClient, 'load');

    const { getByText, getByTestId } = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider apis={ApiRegistry.from([[techRadarApiRef, mockClient]])}>
          <RadarPage {...techRadarProps} />
        </ApiProvider>
      </ThemeProvider>,
    );

    await waitForElement(() => getByTestId('tech-radar-svg'));

    expect(
      getByText('Pick the recommended technologies for your projects'),
    ).toBeInTheDocument();
    expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
    expect(mockClient.load).toBeCalledWith(undefined);
  });

  it('should call load with id', async () => {
    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
      id: 'myId',
    };
    jest.spyOn(mockClient, 'load');

    const { getByTestId } = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider apis={ApiRegistry.from([[techRadarApiRef, mockClient]])}>
          <RadarPage {...techRadarProps} />
        </ApiProvider>
      </ThemeProvider>,
    );

    await waitForElement(() => getByTestId('tech-radar-svg'));

    expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
    expect(mockClient.load).toBeCalledWith('myId');
  });

  it('should call the errorApi if load fails', async () => {
    const errorApi = new MockErrorApi({ collect: true });

    jest
      .spyOn(mockClient, 'load')
      .mockRejectedValue(new Error('404 Page Not Found'));

    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };

    const { queryByTestId } = await renderInTestApp(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [techRadarApiRef, mockClient],
          ])}
        >
          <RadarPage {...techRadarProps} />
        </ApiProvider>
      </ThemeProvider>,
    );

    await waitForElement(() => !queryByTestId('progress'));

    expect(errorApi.getErrors()).toEqual([
      { error: new Error('404 Page Not Found'), context: undefined },
    ]);
    expect(queryByTestId('tech-radar-svg')).not.toBeInTheDocument();
  });
});
