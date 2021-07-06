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

import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
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
import { EntityOwnerFilter } from '../../types';
import { getEntityRelations } from '../../utils';
import { formatEntityRefTitle } from '../EntityRefLink';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const EntityOwnerPicker = () => {
  const { updateFilters, backendEntities, filters } = useEntityListProvider();
  const availableOwners = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .flatMap((e: Entity) =>
              getEntityRelations(e, RELATION_OWNED_BY).map(o =>
                formatEntityRefTitle(o, { defaultKind: 'group' }),
              ),
            )
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  if (!availableOwners.length) return null;

  const onChange = (owners: string[]) => {
    updateFilters({
      owners: owners.length ? new EntityOwnerFilter(owners) : undefined,
    });
  };

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Owner</Typography>
      <Autocomplete<string>
        multiple
        options={availableOwners}
        value={filters.owners?.values ?? []}
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
        popupIcon={<ExpandMoreIcon data-testid="owner-picker-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
