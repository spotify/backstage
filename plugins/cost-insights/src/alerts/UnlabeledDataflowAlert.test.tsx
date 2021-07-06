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
import pluralize from 'pluralize';
import { renderInTestApp } from '@backstage/test-utils';
import { UnlabeledDataflowAlert } from './UnlabeledDataflowAlert';
import { UnlabeledDataflowData } from '../types';
import {
  MockCurrencyProvider,
  MockConfigProvider,
  MockBillingDateProvider,
} from '../testUtils';

const mockData: UnlabeledDataflowData = {
  periodStart: '2021-02-01',
  periodEnd: '2021-03-31',
  unlabeledCost: 0,
  labeledCost: 0,
  projects: [
    {
      id: 'project-a',
      labeledCost: 0,
      unlabeledCost: 0,
    },
  ],
};

// suppress recharts componentDidUpdate deprecation warnings
jest.spyOn(console, 'warn').mockImplementation(() => {});

async function renderInContext(children: JSX.Element) {
  return renderInTestApp(
    <MockConfigProvider>
      <MockBillingDateProvider>
        <MockCurrencyProvider>{children}</MockCurrencyProvider>
      </MockBillingDateProvider>
    </MockConfigProvider>,
  );
}

class CustomUnlabeledDataflowAlert extends UnlabeledDataflowAlert {
  get url() {
    return 'path/to/resource';
  }
  get title() {
    return `Add labels to ${pluralize(
      'workflow',
      this.data.projects.length,
      true,
    )}`;
  }
}

describe('UnlabeledDataflowAlert', () => {
  describe('constructor', () => {
    it('should create an unlabeled dataflow alert', async () => {
      const alert = new UnlabeledDataflowAlert(mockData);
      const { getByText } = await renderInContext(alert.element);

      expect(alert.url).toBe('/cost-insights/labeling-jobs');
      expect(alert.title).toBe('Add labels to workflows');
      expect(alert.subtitle).toBe(
        'Labels show in billing data, enabling cost insights for each workflow.',
      );
      expect(
        getByText(
          'Showing costs from 1 project with unlabeled Dataflow jobs in the last 30 days.',
        ),
      ).toBeInTheDocument();
    });

    it('a subclass can inherit and override defaults using accessors', async () => {
      const alert = new CustomUnlabeledDataflowAlert(mockData);
      const { getByText } = await renderInContext(alert.element);

      expect(alert.url).toBe('path/to/resource');
      expect(alert.title).toBe('Add labels to 1 workflow');
      expect(alert.subtitle).toBe(
        'Labels show in billing data, enabling cost insights for each workflow.',
      );
      expect(
        getByText(
          'Showing costs from 1 project with unlabeled Dataflow jobs in the last 30 days.',
        ),
      ).toBeInTheDocument();
    });
  });
});
