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
import { wrapInTestApp } from '@backstage/test-utils';
import { ProductEntityDialog } from './ProductEntityDialog';
import { render } from '@testing-library/react';
import { Entity } from '../../types';

const atomicEntity: Entity = {
  id: null,
  aggregation: [0, 0],
  change: { ratio: 0, amount: 0 },
  entities: {},
};

const singleBreakdownEntity = {
  ...atomicEntity,
  entities: {
    SKU: [
      {
        id: 'sku-1',
        aggregation: [0, 0],
        change: { ratio: 0, amount: 0 },
        entities: {},
      },
      {
        id: 'sku-2',
        aggregation: [0, 0],
        change: { ratio: 0, amount: 0 },
        entities: {},
      },
    ] as Entity[],
  },
};

const multiBreakdownEntity = {
  ...singleBreakdownEntity,
  entities: {
    ...singleBreakdownEntity.entities,
    deployment: [
      {
        id: 'd-1',
        aggregation: [0, 0],
        change: { ratio: 0, amount: 0 },
        entities: {},
      },
      {
        id: 'd-2',
        aggregation: [0, 0],
        change: { ratio: 0, amount: 0 },
        entities: {},
      },
    ] as Entity[],
  },
};

describe('<ProductEntityDialog/>', () => {
  it('Should error if no sub-entities exist', () => {
    expect(() =>
      render(
        wrapInTestApp(
          <ProductEntityDialog
            open
            entity={atomicEntity}
            onClose={jest.fn()}
          />,
        ),
      ),
    ).toThrow();
  });

  it('Should show a tab for a single sub-entity type', () => {
    const { getByText } = render(
      wrapInTestApp(
        <ProductEntityDialog
          open
          entity={singleBreakdownEntity}
          onClose={jest.fn()}
        />,
      ),
    );
    expect(getByText('Breakdown by SKU')).toBeInTheDocument();
  });

  it('Should show tabs when multiple sub-entity types exist', () => {
    const { getByText } = render(
      wrapInTestApp(
        <ProductEntityDialog
          open
          entity={multiBreakdownEntity}
          onClose={jest.fn()}
        />,
      ),
    );
    expect(getByText('Breakdown by SKU')).toBeInTheDocument();
    expect(getByText('Breakdown by deployment')).toBeInTheDocument();
    expect(getByText('sku-1')).toBeInTheDocument();
  });
});
