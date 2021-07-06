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

import { Entity } from '@backstage/catalog-model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useMemo } from 'react';
import { useEntityListProvider } from '../../hooks/useEntityListProvider';
import { EntityLifecycleFilter } from '../../types';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const EntityLifecyclePicker = () => {
  const { updateFilters, backendEntities, filters } = useEntityListProvider();
  const availableLifecycles = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .map((e: Entity) => e.spec?.lifecycle)
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  if (!availableLifecycles.length) return null;

  const onChange = (lifecycles: string[]) => {
    updateFilters({
      lifecycles: lifecycles.length
        ? new EntityLifecycleFilter(lifecycles)
        : undefined,
    });
  };

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Lifecycle</Typography>
      <Autocomplete<string>
        multiple
        options={availableLifecycles}
        value={filters.lifecycles?.values ?? []}
        onChange={(_: object, value: string[]) => onChange(value)}
        renderOption={(option, { selected }) => (
          <FormControlLabel
            control={
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
            }
            label={option}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon data-testid="lifecycle-picker-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
