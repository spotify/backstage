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
import {
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  SelectProps,
} from '@material-ui/core';
import { Currency, CurrencyType } from '../../types';
import { findAlways } from '../../utils/assert';
import { useSelectStyles as useStyles } from '../../utils/styles';

const NULL_VALUE = 'engineers';

type CurrencySelectProps = {
  currency: Currency;
  currencies: Currency[];
  onSelect: (currency: Currency) => void;
};

export const CurrencySelect = ({
  currency,
  currencies,
  onSelect,
}: CurrencySelectProps) => {
  const classes = useStyles();

  const getOption = (value: unknown) => {
    const kind = (value === NULL_VALUE ? null : value) as CurrencyType;
    return findAlways(currencies, c => c.kind === kind);
  };

  const handleOnChange: SelectProps['onChange'] = e => {
    const option = getOption(e.target.value);
    onSelect(option);
  };

  const renderValue: SelectProps['renderValue'] = value => {
    const option = getOption(value);
    return <b>{option.label}</b>;
  };

  return (
    <FormControl variant="outlined">
      <InputLabel shrink>Convert to:</InputLabel>
      <Select
        className={classes.select}
        variant="outlined"
        labelWidth={100}
        onChange={handleOnChange}
        value={currency.kind || NULL_VALUE}
        renderValue={renderValue}
      >
        {currencies.map((c: Currency) => (
          <MenuItem
            className={classes.menuItem}
            key={c.kind || NULL_VALUE}
            value={c.kind || NULL_VALUE}
          >
            <span role="img" aria-label={c.label}>
              {c.label}
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
