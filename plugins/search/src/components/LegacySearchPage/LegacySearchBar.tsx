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
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearButton from '@material-ui/icons/Clear';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
}));

type SearchBarProps = {
  searchQuery: string;
  handleSearch: any;
  handleClearSearchBar: any;
};

export const SearchBar = ({
  searchQuery,
  handleSearch,
  handleClearSearchBar,
}: SearchBarProps) => {
  const classes = useStyles();

  return (
    <Paper
      component="form"
      onSubmit={e => handleSearch(e)}
      className={classes.root}
    >
      <IconButton disabled type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search in Backstage"
        value={searchQuery}
        onChange={e => handleSearch(e)}
        inputProps={{ 'aria-label': 'search backstage' }}
      />
      <IconButton aria-label="search" onClick={() => handleClearSearchBar()}>
        <ClearButton />
      </IconButton>
    </Paper>
  );
};
