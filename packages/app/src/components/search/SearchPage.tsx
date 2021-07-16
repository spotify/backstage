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

import React, { useState } from 'react';
import { makeStyles, Theme, Grid, List, Paper } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { CatalogResultListItem } from '@backstage/plugin-catalog';
import {
  SearchBar,
  SearchFilter,
  SearchResult,
  SearchType,
  DefaultResultListItem,
} from '@backstage/plugin-search';
import { Content, Header, Lifecycle, Page } from '@backstage/core-components';
import { DocsResultListItem } from '@backstage/plugin-techdocs';
import { SearchResultSet } from '@backstage/search-common';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
  },
  filter: {
    marginTop: theme.spacing(2.5),
  },
}));

// TODO: Move this into the search plugin once pagination is natively supported.
// See: https://github.com/backstage/backstage/issues/6062
const SearchResultList = ({ results }: SearchResultSet) => {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const changePage = (_: any, pageIndex: number) => {
    setPage(pageIndex);
  };
  const pageAmount = Math.ceil((results.length || 0) / pageSize);
  return (
    <>
      <List>
        {results
          .slice(pageSize * (page - 1), pageSize * page)
          .map(({ type, document }) => {
            switch (type) {
              case 'software-catalog':
                return (
                  <CatalogResultListItem
                    key={document.location}
                    result={document}
                  />
                );
              case 'techdocs':
                return (
                  <DocsResultListItem
                    key={document.location}
                    result={document}
                  />
                );
              default:
                return (
                  <DefaultResultListItem
                    key={document.location}
                    result={document}
                  />
                );
            }
          })}
      </List>
      <Pagination
        count={pageAmount}
        page={page}
        onChange={changePage}
        showFirstButton
        showLastButton
      />
    </>
  );
};

const SearchPage = () => {
  const classes = useStyles();
  return (
    <Page themeId="home">
      <Header title="Search" subtitle={<Lifecycle alpha />} />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Paper className={classes.bar}>
              <SearchBar debounceTime={100} />
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className={classes.filters}>
              <SearchType
                values={['techdocs', 'software-catalog']}
                name="type"
                defaultValue="software-catalog"
              />
              <SearchFilter.Select
                className={classes.filter}
                name="kind"
                values={['Component', 'Template']}
              />
              <SearchFilter.Checkbox
                className={classes.filter}
                name="lifecycle"
                values={['experimental', 'production']}
              />
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <SearchResult>
              {({ results }) => <SearchResultList results={results} />}
            </SearchResult>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export const searchPage = <SearchPage />;
