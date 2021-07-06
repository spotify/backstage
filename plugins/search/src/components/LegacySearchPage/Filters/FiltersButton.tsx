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
import FilterListIcon from '@material-ui/icons/FilterList';
import { makeStyles, IconButton, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  filters: {
    width: '250px',
    display: 'flex',
  },
  icon: {
    margin: theme.spacing(-1, 0, 0, 0),
  },
}));

type FiltersButtonProps = {
  numberOfSelectedFilters: number;
  handleToggleFilters: () => void;
};

export const FiltersButton = ({
  numberOfSelectedFilters,
  handleToggleFilters,
}: FiltersButtonProps) => {
  const classes = useStyles();

  return (
    <div className={classes.filters}>
      <IconButton
        className={classes.icon}
        aria-label="settings"
        onClick={handleToggleFilters}
      >
        <FilterListIcon />
      </IconButton>
      <Typography variant="h6">
        Filters ({numberOfSelectedFilters ? numberOfSelectedFilters : 0})
      </Typography>
    </div>
  );
};
