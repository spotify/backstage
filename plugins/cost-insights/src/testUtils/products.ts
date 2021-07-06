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

import { Entity, Product } from '../types';
import { findAlways } from '../utils/assert';

type mockEntityRenderer<T> = (entity: T) => T;

export const createMockEntity = (
  callback?: mockEntityRenderer<Entity>,
): Entity => {
  const defaultEntity: Entity = {
    id: 'test-entity',
    aggregation: [100, 200],
    entities: {},
    change: {
      ratio: 0,
      amount: 0,
    },
  };

  if (typeof callback === 'function') {
    return callback({ ...defaultEntity });
  }
  return { ...defaultEntity };
};

export const createMockProduct = (
  callback?: mockEntityRenderer<Product>,
): Product => {
  const defaultProduct: Product = {
    kind: 'compute-engine',
    name: 'Compute Engine',
  };
  if (typeof callback === 'function') {
    return callback({ ...defaultProduct });
  }
  return { ...defaultProduct };
};

export const MockProductTypes: Record<string, string> = {
  'compute-engine': 'Compute Engine',
  'cloud-dataflow': 'Cloud Dataflow',
  'cloud-storage': 'Cloud Storage',
  'big-query': 'Big Query',
  'big-table': 'BigTable',
  'cloud-pub-sub': 'Cloud Pub/Sub',
};

export const MockProducts: Product[] = Object.keys(MockProductTypes).map(
  productType =>
    createMockProduct(() => ({
      kind: productType,
      name: MockProductTypes[productType],
    })),
);

export const MockComputeEngine = findAlways(
  MockProducts,
  p => p.kind === 'compute-engine',
);
export const MockCloudDataflow = findAlways(
  MockProducts,
  p => p.kind === 'cloud-dataflow',
);
export const MockCloudStorage = findAlways(
  MockProducts,
  p => p.kind === 'cloud-storage',
);
export const MockBigQuery = findAlways(
  MockProducts,
  p => p.kind === 'big-query',
);
export const MockBigtable = findAlways(
  MockProducts,
  p => p.kind === 'big-table',
);
