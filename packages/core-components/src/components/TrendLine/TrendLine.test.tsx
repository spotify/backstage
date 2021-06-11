/*
 * Copyright 2020 Spotify AB
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

/* eslint-disable jest/no-disabled-tests */
import React from 'react';
import { render } from '@testing-library/react';
import { renderInTestApp, wrapInTestApp } from '@backstage/test-utils';

import { TrendLine } from './TrendLine';

describe('TrendLine', () => {
  describe('when no data is present', () => {
    it('renders null without throwing', async () => {
      const rendered = await renderInTestApp(
        <TrendLine data={[]} title="sparkline" />,
      );
      expect(rendered.queryByTitle('sparkline')).not.toBeInTheDocument();
    });
  });

  describe('when one datapoint is present', () => {
    it('renders as a straight line', async () => {
      const rendered = await renderInTestApp(
        <TrendLine data={[0.5]} title="sparkline" />,
      );
      expect(rendered.getByTitle('sparkline')).toBeInTheDocument();
    });
  });

  describe.skip('when the data finishes above the success threshold', () => {
    it('renders with the correct color', () => {
      const rendered = render(
        wrapInTestApp(<TrendLine data={[0.5, 0.95]} title="sparkline" />),
      );
      expect(rendered.getByTitle('sparkline')).toBeInTheDocument();
    });
  });

  describe.skip('when the data finishes within the the warning threshold', () => {
    it('renders with the correct color', () => {
      const rendered = render(
        wrapInTestApp(<TrendLine data={[0.5, 0.65]} title="sparkline" />),
      );
      expect(rendered.getByTitle('sparkline')).toBeInTheDocument();
    });
  });

  describe.skip('when the data finishes within the the error threshold', () => {
    it('renders with the correct color', () => {
      const rendered = render(
        wrapInTestApp(<TrendLine data={[0.5, 0.4]} title="sparkline" />),
      );
      expect(rendered.getByTitle('sparkline')).toBeInTheDocument();
    });
  });
});
