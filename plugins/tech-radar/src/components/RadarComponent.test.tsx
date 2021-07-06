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

import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { act } from 'react-dom/test-utils';
import { withLogCollector } from '@backstage/test-utils';

import GetBBoxPolyfill from '../utils/polyfills/getBBox';
import RadarComponent from './RadarComponent';
import { TechRadarLoaderResponse, techRadarApiRef, TechRadarApi } from '../api';

import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';
import { errorApiRef } from '@backstage/core-plugin-api';

describe('RadarComponent', () => {
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

    const errorApi = { post: () => {} };
    const { getByTestId, queryByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [techRadarApiRef, mockClient],
          ])}
        >
          <RadarComponent
            width={1200}
            height={800}
            svgProps={{ 'data-testid': 'tech-radar-svg' }}
          />
        </ApiProvider>
      </ThemeProvider>,
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(getByTestId('progress')).toBeInTheDocument();

    await waitForElement(() => queryByTestId('tech-radar-svg'));
    jest.useRealTimers();
  });

  it('should call the errorApi if load fails', async () => {
    const errorApi = { post: jest.fn() };
    jest
      .spyOn(mockClient, 'load')
      .mockRejectedValue(new Error('404 Page Not Found'));

    const { queryByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [techRadarApiRef, mockClient],
          ])}
        >
          <RadarComponent
            width={1200}
            height={800}
            svgProps={{ 'data-testid': 'tech-radar-svg' }}
          />
        </ApiProvider>
      </ThemeProvider>,
    );

    await waitForElement(() => !queryByTestId('progress'));

    expect(errorApi.post).toHaveBeenCalledTimes(1);
    expect(errorApi.post).toHaveBeenCalledWith(new Error('404 Page Not Found'));
    expect(queryByTestId('tech-radar-svg')).not.toBeInTheDocument();
  });

  it('should not render without errorApiRef', () => {
    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(
            <ThemeProvider theme={lightTheme}>
              <ApiProvider apis={ApiRegistry.from([])}>
                <RadarComponent
                  width={1200}
                  height={800}
                  svgProps={{ 'data-testid': 'tech-radar-svg' }}
                />
              </ApiProvider>
            </ThemeProvider>,
          );
        }).toThrow();
      }).error[0],
    ).toMatch(
      /^Error: Uncaught \[Error: No implementation available for apiRef{core.error}\]/,
    );
  });
});
