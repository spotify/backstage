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
import { MenuItem, Select, SelectProps } from '@material-ui/core';
import { Duration } from '../../types';
import { formatLastTwoLookaheadQuarters } from '../../utils/formatters';
import { findAlways } from '../../utils/assert';
import { useSelectStyles as useStyles } from '../../utils/styles';
import { useLastCompleteBillingDate } from '../../hooks';

export type PeriodOption = {
  value: Duration;
  label: string;
};

export function getDefaultOptions(
  lastCompleteBillingDate: string,
): PeriodOption[] {
  return [
    {
      value: Duration.P90D,
      label: 'Past 6 Months',
    },
    {
      value: Duration.P30D,
      label: 'Past 60 Days',
    },
    {
      value: Duration.P3M,
      label: formatLastTwoLookaheadQuarters(lastCompleteBillingDate),
    },
  ];
}

type PeriodSelectProps = {
  duration: Duration;
  onSelect: (duration: Duration) => void;
  options?: PeriodOption[];
};

export const PeriodSelect = ({
  duration,
  onSelect,
  options,
}: PeriodSelectProps) => {
  const classes = useStyles();
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const optionsOrDefault =
    options ?? getDefaultOptions(lastCompleteBillingDate);

  const handleOnChange: SelectProps['onChange'] = e => {
    onSelect(e.target.value as Duration);
  };

  const renderValue: SelectProps['renderValue'] = value => {
    const option = findAlways(optionsOrDefault, o => o.value === value);
    return <b>{option.label}</b>;
  };

  return (
    <Select
      className={classes.select}
      variant="outlined"
      onChange={handleOnChange}
      value={duration}
      renderValue={renderValue}
      data-testid="period-select"
    >
      {optionsOrDefault.map(option => (
        <MenuItem
          className={classes.menuItem}
          key={option.value}
          value={option.value}
          data-testid={`period-select-option-${option.value}`}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};
