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

import React from 'react';
import { useNavigate } from 'react-router';
import { useAsync } from 'react-use';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from '@material-ui/core';

import { gitReleaseManagerApiRef } from '../../api/serviceApiRef';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useFormClasses } from './styles';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useQueryHandler } from '../../hooks/useQueryHandler';
import { useUserContext } from '../../contexts/UserContext';

import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export function Owner() {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const { user } = useUserContext();
  const formClasses = useFormClasses();
  const navigate = useNavigate();
  const { getQueryParamsWithUpdates } = useQueryHandler();

  const { loading, error, value } = useAsync(() => pluginApiClient.getOwners());
  const owners = value?.owners ?? [];
  const customOwnerFromUrl = !owners
    .concat(['', user.username])
    .includes(project.owner);

  return (
    <FormControl
      className={formClasses.formControl}
      required
      disabled={project.isProvidedViaProps}
      error={!!error}
    >
      {loading ? (
        <Box data-testid={TEST_IDS.form.owner.loading}>
          <Progress />
        </Box>
      ) : (
        <>
          <InputLabel id="owner-select-label">Owners</InputLabel>
          <Select
            data-testid={TEST_IDS.form.owner.select}
            labelId="owner-select-label"
            id="owner-select"
            value={project.owner}
            defaultValue=""
            onChange={event => {
              const { queryParams } = getQueryParamsWithUpdates({
                updates: [
                  { key: 'repo', value: '' },
                  { key: 'owner', value: event.target.value as string },
                ],
              });

              navigate(`?${queryParams}`, { replace: true });
            }}
            className={formClasses.selectEmpty}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            <MenuItem value={user.username}>
              <strong>{user.username}</strong>
            </MenuItem>

            {!error && customOwnerFromUrl && (
              <MenuItem value={project.owner}>
                <strong>From URL: {project.owner}</strong>
              </MenuItem>
            )}

            {owners.map((orgName, index) => (
              <MenuItem key={`organization-${index}`} value={orgName}>
                {orgName}
              </MenuItem>
            ))}
          </Select>

          {error && (
            <FormHelperText data-testid={TEST_IDS.form.owner.error}>
              Encountered an error ({error.message})
            </FormHelperText>
          )}

          {!error && project.owner.length === 0 && (
            <>
              <FormHelperText data-testid={TEST_IDS.form.owner.empty}>
                Select an owner (org or user)
              </FormHelperText>
              <FormHelperText data-testid={TEST_IDS.form.owner.empty}>
                Custom queries can be made via the query param{' '}
                <strong>owner</strong>
              </FormHelperText>
            </>
          )}
        </>
      )}
    </FormControl>
  );
}
