/*
 * Copyright 2021 Spotify AB
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
import { EntityTagFilter } from '../../types';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const EntityTagPicker = () => {
  const { updateFilters, backendEntities, filters } = useEntityListProvider();
  const availableTags = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .flatMap((e: Entity) => e.metadata.tags)
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  if (!availableTags.length) return null;

  const onChange = (tags: string[]) => {
    updateFilters({
      tags: tags.length ? new EntityTagFilter(tags) : undefined,
    });
  };

  return (
    <>
      <Typography variant="button">Tags</Typography>
      <Autocomplete<string>
        multiple
        options={availableTags}
        value={filters.tags?.values ?? []}
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
        popupIcon={<ExpandMoreIcon data-testid="tag-picker-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </>
  );
};
