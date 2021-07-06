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

import { useLocation } from 'react-router';
import qs from 'qs';

import { Project } from '../contexts/ProjectContext';

export function useQueryHandler() {
  const location = useLocation();

  function getParsedQuery() {
    const { decodedSearch } = getDecodedSearch(location);
    const parsedQuery: Partial<Project> = qs.parse(decodedSearch);

    return {
      parsedQuery,
    };
  }

  function getQueryParamsWithUpdates({
    updates,
  }: {
    updates: {
      key: keyof Project;
      value: string;
    }[];
  }) {
    const { decodedSearch } = getDecodedSearch(location);
    const queryParams = qs.parse(decodedSearch);

    for (const { key, value } of updates) {
      queryParams[key] = value;
    }

    return {
      queryParams: qs.stringify(queryParams),
    };
  }

  return {
    getParsedQuery,
    getQueryParamsWithUpdates,
  };
}

function getDecodedSearch(location: ReturnType<typeof useLocation>) {
  return {
    decodedSearch: new URLSearchParams(location.search).toString(),
  };
}

export const testables = {
  getDecodedSearch,
};
