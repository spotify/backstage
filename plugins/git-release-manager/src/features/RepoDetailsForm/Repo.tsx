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
import { useAsync } from 'react-use';
import { useNavigate } from 'react-router';
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

import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export function Repo() {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const navigate = useNavigate();
  const formClasses = useFormClasses();
  const { getQueryParamsWithUpdates } = useQueryHandler();

  const { loading, error, value } = useAsync(
    async () => pluginApiClient.getRepositories({ owner: project.owner }),
    [project.owner],
  );

  if (project.owner.length === 0) {
    return null;
  }

  const repositories = value?.repositories ?? [];
  const customRepoFromUrl = !repositories.concat(['']).includes(project.repo);

  return (
    <FormControl
      className={formClasses.formControl}
      required
      disabled={project.isProvidedViaProps}
      error={!!error}
    >
      {loading ? (
        <Box data-testid={TEST_IDS.form.repo.loading}>
          <Progress />
        </Box>
      ) : (
        <>
          <InputLabel id="repo-select-label">Repositories</InputLabel>
          <Select
            data-testid={TEST_IDS.form.repo.select}
            labelId="repo-select-label"
            id="repo-select"
            value={project.repo}
            defaultValue=""
            onChange={event => {
              const { queryParams } = getQueryParamsWithUpdates({
                updates: [{ key: 'repo', value: event.target.value as string }],
              });

              navigate(`?${queryParams}`, { replace: true });
            }}
            className={formClasses.selectEmpty}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>

            {!error && customRepoFromUrl && (
              <MenuItem value={project.repo}>
                <strong>From URL: {project.repo}</strong>
              </MenuItem>
            )}

            {repositories.map((repositoryName, index) => (
              <MenuItem key={`repository-${index}`} value={repositoryName}>
                {repositoryName}
              </MenuItem>
            ))}
          </Select>

          {error && (
            <FormHelperText data-testid={TEST_IDS.form.repo.error}>
              Encountered an error ({error.message}")
            </FormHelperText>
          )}

          {!error && project.repo.length === 0 && (
            <>
              <FormHelperText data-testid={TEST_IDS.form.repo.empty}>
                Select a repository
              </FormHelperText>
              <FormHelperText data-testid={TEST_IDS.form.repo.empty}>
                Custom queries can be made via the query param{' '}
                <strong>repo</strong>
              </FormHelperText>
            </>
          )}
        </>
      )}
    </FormControl>
  );
}
