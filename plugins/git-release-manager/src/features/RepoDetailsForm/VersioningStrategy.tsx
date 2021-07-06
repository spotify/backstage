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

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import { TEST_IDS } from '../../test-helpers/test-ids';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useQueryHandler } from '../../hooks/useQueryHandler';
import { VERSIONING_STRATEGIES } from '../../constants/constants';

export function VersioningStrategy() {
  const navigate = useNavigate();
  const { project } = useProjectContext();
  const { getParsedQuery, getQueryParamsWithUpdates } = useQueryHandler();

  useEffect(() => {
    const { parsedQuery } = getParsedQuery();

    if (!parsedQuery.versioningStrategy && !project.isProvidedViaProps) {
      const { queryParams } = getQueryParamsWithUpdates({
        updates: [
          { key: 'versioningStrategy', value: project.versioningStrategy },
        ],
      });

      navigate(`?${queryParams}`, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormControl
      component="fieldset"
      required
      disabled={project.isProvidedViaProps}
    >
      <FormLabel component="legend">Versioning strategy</FormLabel>

      <RadioGroup
        data-testid={TEST_IDS.form.versioningStrategy.radioGroup}
        aria-label="calendar-strategy"
        name="calendar-strategy"
        value={project.versioningStrategy}
        onChange={event => {
          const { queryParams } = getQueryParamsWithUpdates({
            updates: [{ key: 'versioningStrategy', value: event.target.value }],
          });

          navigate(`?${queryParams}`, { replace: true });
        }}
      >
        <FormControlLabel
          value={VERSIONING_STRATEGIES.semver}
          control={<Radio />}
          label="Semantic versioning"
        />

        <FormControlLabel
          value={VERSIONING_STRATEGIES.calver}
          control={<Radio />}
          label="Calendar versioning"
        />
      </RadioGroup>
    </FormControl>
  );
}
