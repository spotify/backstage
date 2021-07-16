/*
 * Copyright 2021 The Backstage Authors
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

import React, { PropsWithChildren, useCallback, useState } from 'react';
import {
  DefaultEntityFilters,
  EntityListContext,
  EntityListContextProps,
} from '../hooks/useEntityListProvider';

export const MockEntityListContextProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: Partial<EntityListContextProps>;
}>) => {
  // Provides a default implementation that stores filter state, for testing components that
  // reflect filter state.
  const [filters, setFilters] = useState<DefaultEntityFilters>(
    value.filters ?? {},
  );
  const updateFilters = useCallback(
    (
      update:
        | Partial<DefaultEntityFilters>
        | ((
            prevFilters: DefaultEntityFilters,
          ) => Partial<DefaultEntityFilters>),
    ) => {
      setFilters(prevFilters => {
        const newFilters =
          typeof update === 'function' ? update(prevFilters) : update;
        return { ...prevFilters, ...newFilters };
      });
    },
    [],
  );

  const defaultContext: EntityListContextProps = {
    entities: [],
    backendEntities: [],
    updateFilters,
    filters,
    loading: false,
    queryParameters: {},
  };

  // Extract value.filters to avoid overwriting it; some tests exercise filter updates. The value
  // provided is used as the initial seed in useState above.
  const { filters: _, ...otherContextFields } = value;

  return (
    <EntityListContext.Provider
      value={{ ...defaultContext, ...otherContextFields }}
    >
      {children}
    </EntityListContext.Provider>
  );
};
