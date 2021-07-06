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
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import GetBBoxPolyfill from '../../utils/polyfills/getBBox';

import RadarFooter, { Props } from './RadarFooter';

const minProps: Props = {
  x: 2,
  y: 2,
};

describe('RadarFooter', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  it('should render', () => {
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <svg>
          <RadarFooter {...minProps} />
        </svg>
      </ThemeProvider>,
    );
    const radarFooter = rendered.getByTestId('radar-footer');
    const { x, y } = minProps;
    expect(radarFooter).toBeInTheDocument();
    expect(radarFooter.getAttribute('transform')).toBe(`translate(${x}, ${y})`);
  });
});
