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

import { wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import * as React from 'react';
import { RollbarTopActiveItem } from '../../api/types';
import { RollbarTopItemsTable } from './RollbarTopItemsTable';

const items: RollbarTopActiveItem[] = [
  {
    item: {
      id: 89898989,
      counter: 1234,
      environment: 'production',
      framework: 0,
      lastOccurrenceTimestamp: new Date().getTime() / 1000,
      level: 50,
      occurrences: 150,
      title: 'Error in foo',
      uniqueOccurrences: 40,
      projectId: 12345,
    },
    counts: [10, 20, 30, 40, 50],
  },
];

describe('RollbarTopItemsTable component', () => {
  it('should render empty data message when loaded and no data', async () => {
    const rendered = render(
      wrapInTestApp(
        <RollbarTopItemsTable
          items={[]}
          organization="foo"
          project="bar"
          loading={false}
        />,
      ),
    );
    expect(rendered.getByText(/No records to display/)).toBeInTheDocument();
  });

  it('should display item attributes when loading has finished', async () => {
    const rendered = render(
      wrapInTestApp(
        <RollbarTopItemsTable
          items={items}
          organization="foo"
          project="bar"
          loading={false}
        />,
      ),
    );
    expect(rendered.getByText(/1234/)).toBeInTheDocument();
    expect(rendered.getByText(/Error in foo/)).toBeInTheDocument();
    expect(rendered.getByText(/critical/)).toBeInTheDocument();
  });
});
