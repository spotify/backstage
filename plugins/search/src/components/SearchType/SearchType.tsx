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
import { useSearch } from '../SearchContext';
import { useEffectOnce } from 'react-use';
import React, { ChangeEvent } from 'react';
import {
  Chip,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';

const useStyles = makeStyles({
  label: {
    textTransform: 'capitalize',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

export type SearchTypeProps = {
  className?: string;
  name: string;
  values?: string[];
  defaultValue?: string[] | string | null;
};

const SearchType = ({
  values = [],
  className,
  name,
  defaultValue,
}: SearchTypeProps) => {
  const classes = useStyles();
  const { types, setTypes } = useSearch();

  useEffectOnce(() => {
    if (defaultValue && Array.isArray(defaultValue)) {
      setTypes(defaultValue);
    } else if (defaultValue) {
      setTypes([defaultValue]);
    }
  });

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as string[];
    if (!value || value.includes('*')) {
      setTypes([]);
    } else {
      setTypes(value.filter(it => it !== 'All'));
    }
  };

  return (
    <FormControl
      className={className}
      variant="filled"
      fullWidth
      data-testid="search-typefilter-next"
    >
      <InputLabel className={classes.label} margin="dense">
        {name}
      </InputLabel>
      <Select
        multiple
        variant="outlined"
        value={types.length ? types : ['All']}
        onChange={handleChange}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as string[]).map(value => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
      >
        <MenuItem value="*">
          <em>All</em>
        </MenuItem>
        {values.map((value: string) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { SearchType };
