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
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { Maybe, Metric } from '../../types';
import { useSelectStyles as useStyles } from '../../utils/styles';

export type MetricSelectProps = {
  metric: Maybe<string>;
  metrics: Array<Metric>;
  onSelect: (metric: Maybe<string>) => void;
};

export const MetricSelect = ({
  metric,
  metrics,
  onSelect,
}: MetricSelectProps) => {
  const classes = useStyles();

  function onChange(e: React.ChangeEvent<{ value: unknown }>) {
    if (e.target.value === 'none') {
      onSelect(null);
    } else {
      onSelect(e.target.value as string);
    }
  }

  return (
    <FormControl variant="outlined">
      <InputLabel shrink id="metric-select-label">
        Compare to:
      </InputLabel>
      <Select
        id="metric-select"
        labelId="metric-select-label"
        labelWidth={100}
        className={classes.select}
        value={metric ?? 'none'}
        onChange={onChange}
      >
        <MenuItem className={classes.menuItem} key="none" value="none">
          <em>None</em>
        </MenuItem>
        {metrics.map((m: Metric) => (
          <MenuItem className={classes.menuItem} key={m.kind} value={m.kind}>
            <b>{m.name}</b>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
