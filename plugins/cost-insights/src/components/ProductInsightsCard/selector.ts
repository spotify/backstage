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

import { MapFiltersToProps } from '../../hooks/useFilters';
import { MapLoadingToProps } from '../../hooks/useLoading';
import { Duration, PageFilters, ProductPeriod } from '../../types';
import { findAlways } from '../../utils/assert';

type ProductInsightsCardFilterProps = PageFilters & {
  product: ProductPeriod;
  setProduct: (duration: Duration) => void;
};

type ProductInsightsCardLoadingProps = {
  loadingProduct: boolean;
  dispatchLoading: (isLoading: boolean) => void;
};

export const mapFiltersToProps = (
  product: string,
): MapFiltersToProps<ProductInsightsCardFilterProps> => ({
  pageFilters,
  productFilters,
  setProductFilters,
}) => ({
  ...pageFilters,
  product: findAlways(productFilters, p => p.productType === product),
  setProduct: (duration: Duration) =>
    setProductFilters(
      productFilters.map(period =>
        period.productType === product ? { ...period, duration } : period,
      ),
    ),
});

export const mapLoadingToProps = (
  product: string,
): MapLoadingToProps<ProductInsightsCardLoadingProps> => ({
  state,
  dispatch,
}) => ({
  loadingProduct: state[product],
  dispatchLoading: (isLoading: boolean) => dispatch({ [product]: isLoading }),
});
