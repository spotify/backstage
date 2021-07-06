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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../api';
import {
  DefaultEntityFilters,
  useEntityListProvider,
} from './useEntityListProvider';
import { EntityTypeFilter } from '../types';
import { useApi } from '@backstage/core-plugin-api';

type EntityTypeReturn = {
  loading: boolean;
  error?: Error;
  types: string[];
  selectedType: string | undefined;
  setType: (type: string | undefined) => void;
};

/**
 * A hook built on top of `useEntityListProvider` for enabling selection of valid `spec.type` values
 * based on the selected EntityKindFilter.
 */
export function useEntityTypeFilter(): EntityTypeReturn {
  const catalogApi = useApi(catalogApiRef);
  const {
    filters: { kind: kindFilter, type: typeFilter },
    updateFilters,
  } = useEntityListProvider();

  const [types, setTypes] = useState<string[]>([]);
  const kind = useMemo(() => kindFilter?.value, [kindFilter]);

  // Load all valid spec.type values straight from the catalogApi, paying attention to only the
  // kind filter for a complete list.
  const { error, loading, value: entities } = useAsync(async () => {
    if (kind) {
      const items = await catalogApi
        .getEntities({
          filter: { kind },
          fields: ['spec.type'],
        })
        .then(response => response.items);
      return items;
    }
    return [];
  }, [kind, catalogApi]);

  useEffect(() => {
    // Resolve the unique set of types from returned entities; could be optimized by a new endpoint
    // in the catalog-backend that does this, rather than loading entities with redundant types.
    const newTypes = [
      ...new Set(
        (entities ?? []).map(e => e.spec?.type).filter(Boolean) as string[],
      ),
    ].sort();
    setTypes(newTypes);

    // Reset type filter if no longer applicable
    updateFilters((oldFilters: DefaultEntityFilters) =>
      oldFilters.type && !newTypes.includes(oldFilters.type.value)
        ? { type: undefined }
        : {},
    );
  }, [updateFilters, entities]);

  const setType = useCallback(
    (type: string | undefined) =>
      updateFilters({
        type: type === undefined ? undefined : new EntityTypeFilter(type),
      }),
    [updateFilters],
  );

  return {
    loading,
    error,
    types,
    selectedType: typeFilter?.value,
    setType,
  };
}
