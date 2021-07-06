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

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

export type Item = {
  label: string;
  value: string | number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

type SelectComponentProps = {
  value: string;
  items: Item[];
  label: string;
  onChange: (value: string) => void;
};

const renderItems = (items: Item[]) => {
  return items.map(item => {
    return (
      <MenuItem value={item.value} key={item.label}>
        {item.label}
      </MenuItem>
    );
  });
};

export const SelectComponent = ({
  value,
  items,
  label,
  onChange,
}: SelectComponentProps) => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as string;
    onChange(val);
  };

  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      disabled={items.length === 0}
    >
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={handleChange}>
        {renderItems(items)}
      </Select>
    </FormControl>
  );
};
