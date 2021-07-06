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
import { Box, CircularProgress, Collapse } from '@material-ui/core';
import { ProductInsightsCard } from './ProductInsightsCard';
import { Duration, Entity, Product } from '../../types';
import { ProductState } from '../../utils/loading';

type ProductInsightsCardListProps = {
  initialStates: ProductState[];
  onSelectAsync: (product: Product, duration: Duration) => Promise<Entity>;
};

export const ProductInsightsCardList = ({
  initialStates,
  onSelectAsync,
}: ProductInsightsCardListProps) => {
  if (!initialStates.length) {
    return (
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Collapse in timeout={1000}>
      {initialStates.map(({ product, entity, duration }) => (
        <Box
          key={product.kind}
          mb={6}
          position="relative"
          data-testid={`product-list-item-${product.kind}`}
        >
          <ProductInsightsCard
            product={product}
            onSelectAsync={onSelectAsync}
            initialState={{ entity: entity, duration: duration }}
          />
        </Box>
      ))}
    </Collapse>
  );
};
