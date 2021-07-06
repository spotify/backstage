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
import { ProductInsights } from './ProductInsights';
import { ProductInsightsOptions } from '../../api';
import {
  mockDefaultLoadingState,
  MockConfigProvider,
  MockCostInsightsApiProvider,
  MockCurrencyProvider,
  MockFilterProvider,
  MockBillingDateProvider,
  MockScrollProvider,
  MockLoadingProvider,
} from '../../testUtils';
import { Entity, Product } from '../../types';

// suppress recharts componentDidUpdate warnings
jest.spyOn(console, 'warn').mockImplementation(() => {});

const MockComputeEngine: Product = {
  kind: 'compute-engine',
  name: 'Compute Engine',
};

const MockComputeEngineInsights: Entity = {
  id: 'compute-engine',
  entities: {},
  aggregation: [0, 0],
  change: {
    ratio: 0,
    amount: 0,
  },
};

const MockCloudDataflow: Product = {
  kind: 'cloud-dataflow',
  name: 'Cloud Dataflow',
};

const MockCloudDataflowInsights: Entity = {
  id: MockCloudDataflow.kind,
  entities: {},
  aggregation: [1_000, 2_000],
  change: {
    ratio: 1,
    amount: 1_000,
  },
};

const MockCloudStorage: Product = {
  kind: 'cloud-storage',
  name: 'Cloud Storage',
};

const MockCloudStorageInsights: Entity = {
  id: MockCloudStorage.kind,
  entities: {},
  aggregation: [2_000, 4_000],
  change: {
    ratio: 1,
    amount: 2_000,
  },
};

const MockBigQuery: Product = {
  kind: 'big-query',
  name: 'BigQuery',
};

const MockBigQueryInsights: Entity = {
  id: MockBigQuery.kind,
  entities: {},
  aggregation: [8_000, 16_000],
  change: {
    ratio: 1,
    amount: 8_000,
  },
};

const MockBigTable: Product = {
  kind: 'big-table',
  name: 'BigTable',
};

const MockBigTableInsights: Entity = {
  id: MockBigTable.kind,
  entities: {},
  aggregation: [16_000, 32_000],
  change: {
    ratio: 1,
    amount: 16_000,
  },
};

const MockCloudPubSub: Product = {
  kind: 'cloud-pub-sub',
  name: 'Cloud Pub/Sub',
};

const MockCloudPubSubInsights: Entity = {
  id: MockCloudPubSub.kind,
  entities: {},
  aggregation: [32_000, 64_000],
  change: {
    ratio: 1,
    amount: 32_000,
  },
};

const ProductEntityMap = {
  [MockBigQueryInsights.id!]: MockBigQueryInsights,
  [MockBigTableInsights.id!]: MockBigTableInsights,
  [MockCloudPubSubInsights.id!]: MockCloudPubSubInsights,
  [MockCloudStorageInsights.id!]: MockCloudStorageInsights,
  [MockCloudDataflowInsights.id!]: MockCloudDataflowInsights,
  [MockComputeEngineInsights.id!]: MockComputeEngineInsights,
};

const costInsightsApi = {
  getProductInsights: ({ product }: ProductInsightsOptions): Promise<Entity> =>
    Promise.resolve(ProductEntityMap[product]),
};

function renderInContext(children: JSX.Element) {
  return renderInTestApp(
    <MockCostInsightsApiProvider costInsightsApi={costInsightsApi}>
      <MockConfigProvider>
        <MockFilterProvider>
          <MockCurrencyProvider>
            <MockLoadingProvider state={mockDefaultLoadingState}>
              <MockBillingDateProvider>
                <MockScrollProvider>{children}</MockScrollProvider>
              </MockBillingDateProvider>
            </MockLoadingProvider>
          </MockCurrencyProvider>
        </MockFilterProvider>
      </MockConfigProvider>
    </MockCostInsightsApiProvider>,
  );
}

describe('<ProductInsights />', () => {
  const MockProducts: Product[] = [
    MockComputeEngine,
    MockCloudDataflow,
    MockCloudStorage,
    MockBigQuery,
    MockBigTable,
    MockCloudPubSub,
  ];

  function reverse(products: Product[]): Product[] {
    return products.slice().reverse();
  }

  it('should render each product panel', async () => {
    const noComputeEngineCostsRgx = /There are no Compute Engine costs within this time frame for your team's projects./;
    const { getByText } = await renderInContext(
      <ProductInsights
        onLoaded={jest.fn()}
        group="test-group"
        project="test-project"
        products={MockProducts}
      />,
    );

    expect(getByText(noComputeEngineCostsRgx)).toBeInTheDocument();
    MockProducts.forEach(product =>
      expect(getByText(product.name)).toBeInTheDocument(),
    );
  });

  it('product panels should be sorted by total aggregated cost', async () => {
    const { queryAllByTestId } = await renderInContext(
      <ProductInsights
        onLoaded={jest.fn()}
        group="test-group"
        project="test-project"
        products={MockProducts}
      />,
    );

    const productPanels = queryAllByTestId(/^product-list-item/);
    const expectedOrder = reverse(MockProducts).map(
      product => `product-list-item-${product.kind}`,
    );

    expect(productPanels.length).toBe(MockProducts.length);
    Array.from(productPanels)
      .map(el => el.getAttribute('data-testid'))
      .forEach((id, i) => {
        expect(id).toBe(expectedOrder[i]);
      });
  });

  it('should call onLoaded with the correct sorted order', async () => {
    const mockOnLoaded = jest.fn();
    const expectedOrder = reverse(MockProducts);

    await renderInContext(
      <ProductInsights
        onLoaded={mockOnLoaded}
        group="test-group"
        project="test-project"
        products={MockProducts}
      />,
    );

    expect(mockOnLoaded).toHaveBeenCalledTimes(1);
    expect(mockOnLoaded).toHaveBeenCalledWith(expectedOrder);
  });
});
