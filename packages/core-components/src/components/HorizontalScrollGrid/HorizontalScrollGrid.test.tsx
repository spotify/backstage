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
import { fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { HorizontalScrollGrid } from './HorizontalScrollGrid';
import { Grid } from '@material-ui/core';

describe('<HorizontalScrollGrid />', () => {
  beforeEach(() => {
    jest.spyOn(window.performance, 'now').mockReturnValue(5);
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(20);
      return 1;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <HorizontalScrollGrid>
        <Grid item>item1</Grid>
        <Grid item>item2</Grid>
      </HorizontalScrollGrid>,
    );
    rendered.getByText('item1');
    rendered.getByText('item2');
    expect(rendered.queryByLabelText('Scroll Left')).toBeNull();
    expect(rendered.queryByLabelText('Scroll Right')).toBeNull();
  });

  it('should show scroll buttons', async () => {
    jest
      .spyOn(HTMLElement.prototype, 'scrollLeft', 'get')
      .mockImplementation(() => 5);
    jest
      .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockImplementation(() => 10);
    jest
      .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
      .mockImplementation(() => 20);

    let lastScroll = 0;
    const scrollBy = HTMLElement.prototype.scrollBy;
    HTMLElement.prototype.scrollBy = (({ left }: ScrollToOptions): void => {
      lastScroll = left || 0;
    }) as any;

    const rendered = await renderInTestApp(
      <HorizontalScrollGrid>
        <Grid item style={{ minWidth: 200 }}>
          item1
        </Grid>
        <Grid item style={{ minWidth: 200 }}>
          item2
        </Grid>
      </HorizontalScrollGrid>,
    );

    rendered.getByTitle('Scroll Left');
    rendered.getByTitle('Scroll Right');
    expect(lastScroll).toBe(0);
    fireEvent.click(rendered.getByTitle('Scroll Right'));
    expect(lastScroll).toBeGreaterThan(0);
    fireEvent.click(rendered.getByTitle('Scroll Left'));
    expect(lastScroll).toBeLessThan(0);

    HTMLElement.prototype.scrollBy = scrollBy;
  });
});
