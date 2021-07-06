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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import GetBBoxPolyfill from '../../utils/polyfills/getBBox';

import RadarEntry, { Props } from './RadarEntry';

const minProps: Props = {
  x: 2,
  y: 2,
  value: 2,
  color: 'red',
};

const optionalProps: Props = {
  ...minProps,
  title: 'example-title',
  description: 'example-description',
};

describe('RadarEntry', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  it('should render link only', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <svg>
          <RadarEntry {...minProps} />
        </svg>
      </ThemeProvider>,
    );

    const radarEntry = screen.getByTestId('radar-entry');
    const { x, y } = minProps;
    expect(radarEntry).toBeInTheDocument();
    expect(radarEntry.getAttribute('transform')).toBe(`translate(${x}, ${y})`);
    expect(screen.getByText(String(minProps.value))).toBeInTheDocument();
  });

  it('should render with description', () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <svg>
          <RadarEntry {...optionalProps} />
        </svg>
      </ThemeProvider>,
    );

    userEvent.click(screen.getByRole('button'));

    const radarEntry = screen.getByTestId('radar-entry');
    expect(radarEntry).toBeInTheDocument();

    const radarDescription = screen.getByTestId('radar-description');
    expect(radarDescription).toBeInTheDocument();
    expect(screen.getByText(String(minProps.value))).toBeInTheDocument();
  });

  it('should render blip with url equal to # if description present', () => {
    const withUrl = {
      ...optionalProps,
      url: 'http://backstage.io',
    };
    render(
      <ThemeProvider theme={lightTheme}>
        <svg>
          <RadarEntry {...withUrl} />
        </svg>
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('href', '#');
  });
});
