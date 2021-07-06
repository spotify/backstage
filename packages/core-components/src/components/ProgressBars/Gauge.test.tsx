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
import { renderInTestApp } from '@backstage/test-utils';
import { Gauge, getProgressColor } from './Gauge';
import * as theme from '@backstage/theme';

describe('<Gauge />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <Gauge value={10} fractional={false} />,
    );
    getByText('10%');
  });
  it('handles fractional prop', async () => {
    const { getByText } = await renderInTestApp(
      <Gauge value={0.1} fractional />,
    );
    getByText('10%');
  });

  it('handles max prop', async () => {
    const { getByText } = await renderInTestApp(
      <Gauge value={1} max={10} fractional={false} />,
    );
    getByText('1%');
  });

  it('handles unit prop', async () => {
    const { getByText } = await renderInTestApp(
      <Gauge value={10} fractional={false} unit="m" />,
    );
    getByText('10m');
  });

  const ok = '#111';
  const warning = '#222';
  const error = '#333';
  const palette = {
    ...theme.lightTheme.palette,
    status: { ...theme.lightTheme.palette.status, ok, warning, error },
  };

  it('colors the progress correctly', () => {
    expect(getProgressColor(palette, 'Not a Number' as any)).toBe('#ddd');
    expect(getProgressColor(palette, 10)).toBe(error);
    expect(getProgressColor(palette, 50)).toBe(warning);
    expect(getProgressColor(palette, 90)).toBe(ok);
  });

  it('colors the inverse progress correctly', () => {
    expect(getProgressColor(palette, 'Not a Number' as any)).toBe('#ddd');
    expect(getProgressColor(palette, 10, true)).toBe(ok);
    expect(getProgressColor(palette, 50, true)).toBe(warning);
    expect(getProgressColor(palette, 90, true)).toBe(error);
  });
});
