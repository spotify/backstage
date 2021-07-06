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

import { Entity } from '@backstage/catalog-model';

export type EntityFilterFn = (entity: Entity) => boolean;

export type FilterGroup = {
  filters: {
    [filterId: string]: EntityFilterFn;
  };
};

export type FilterGroupState = {
  filters: {
    [filterId: string]: {
      isSelected: boolean;
      matchCount: number;
    };
  };
};

export type FilterGroupStatesReady = {
  type: 'ready';
  state: FilterGroupState;
};

export type FilterGroupStatesError = {
  type: 'error';
  error: Error;
};

export type FilterGroupStatesLoading = {
  type: 'loading';
};

export type FilterGroupStates =
  | FilterGroupStatesReady
  | FilterGroupStatesError
  | FilterGroupStatesLoading;
