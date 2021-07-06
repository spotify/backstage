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

import React from 'react';
import { SearchResult } from '@backstage/search-common';
import { Alert } from '@material-ui/lab';
import { useSearch } from '../SearchContext';

import { EmptyState, Progress } from '@backstage/core-components';

type Props = {
  children: (results: { results: SearchResult[] }) => JSX.Element;
};

const SearchResultComponent = ({ children }: Props) => {
  const {
    result: { loading, error, value },
  } = useSearch();

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return (
      <Alert severity="error">
        Error encountered while fetching search results. {error.toString()}
      </Alert>
    );
  }

  if (!value?.results.length) {
    return <EmptyState missing="data" title="Sorry, no results were found" />;
  }

  return children({ results: value.results });
};

export { SearchResultComponent as SearchResult };
