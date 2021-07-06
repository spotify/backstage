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
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { SearchBar } from './LegacySearchBar';
import { SearchResult } from './LegacySearchResult';
import {
  Content,
  Header,
  Page,
  useQueryParamState,
} from '@backstage/core-components';

/**
 * @deprecated This SearchPage, powered directly by the Catalog API, will be
 * removed from a future release of this plugin.
 */
export const LegacySearchPage = () => {
  const [queryString, setQueryString] = useQueryParamState<string>('query');
  const [searchQuery, setSearchQuery] = useState(queryString ?? '');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
  };

  useEffect(() => setSearchQuery(queryString ?? ''), [queryString]);

  useDebounce(
    () => {
      setQueryString(searchQuery);
    },
    200,
    [searchQuery],
  );

  const handleClearSearchBar = () => {
    setSearchQuery('');
  };

  return (
    <Page themeId="home">
      <Header title="Search" />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchBar
              handleSearch={handleSearch}
              handleClearSearchBar={handleClearSearchBar}
              searchQuery={searchQuery}
            />
          </Grid>
          <Grid item xs={12}>
            <SearchResult
              searchQuery={(queryString ?? '').toLocaleLowerCase('en-US')}
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
