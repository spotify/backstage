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
import { default as HappyFace } from '@material-ui/icons/SentimentSatisfiedAlt';
import { renderInTestApp } from '@backstage/test-utils';
import { CostInsightsNavigation } from './CostInsightsNavigation';
import { Product, Icon } from '../../types';
import { MockConfigProvider, MockScrollProvider } from '../../testUtils';
import { getDefaultNavigationItems } from '../../utils/navigation';

const mockIcons: Icon[] = [
  {
    kind: 'some-product',
    component: <HappyFace />,
  },
];

const mockProducts: Product[] = [
  {
    kind: 'some-product',
    name: 'Some Product',
  },
];

const renderWrapped = (children: React.ReactNode) =>
  renderInTestApp(
    <MockConfigProvider products={mockProducts} icons={mockIcons}>
      <MockScrollProvider>{children}</MockScrollProvider>
    </MockConfigProvider>,
  );

describe('<CostInsightsNavigation />', () => {
  it('should render each navigation item', async () => {
    const { getByText } = await renderWrapped(
      <CostInsightsNavigation products={mockProducts} alerts={3} />,
    );
    getDefaultNavigationItems(3)
      .map(item => item.title)
      .concat(mockProducts.map(p => p.name))
      .forEach(name => expect(getByText(name)).toBeInTheDocument());
  });

  it('should not display action items navigation if there are no action items', async () => {
    const rendered = await renderWrapped(
      <CostInsightsNavigation products={mockProducts} alerts={0} />,
    );
    expect(rendered.queryByText(/Action Items/)).not.toBeInTheDocument();
  });

  it('should display the correct amount of action items in the badge', async () => {
    const rendered = await renderWrapped(
      <CostInsightsNavigation products={mockProducts} alerts={3} />,
    );
    expect(rendered.getByText(/3/)).toBeInTheDocument();
  });
});
