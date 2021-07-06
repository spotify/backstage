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
import { Alert } from '@material-ui/lab';
import { Box, Button } from '@material-ui/core';

import { useProjectContext } from '../../contexts/ProjectContext';
import { useReleaseStatsContext } from './contexts/ReleaseStatsContext';

export const Warn = () => {
  const { releaseStats } = useReleaseStatsContext();
  const { project } = useProjectContext();

  return (
    <Box marginTop={2}>
      <Alert severity="warning" style={{ marginBottom: 10 }}>
        {releaseStats.unmappableTags.length > 0 && (
          <div>
            Failed to map <strong>{releaseStats.unmappableTags.length}</strong>{' '}
            tags to releases
          </div>
        )}

        {releaseStats.unmatchedTags.length > 0 && (
          <div>
            Failed to match <strong>{releaseStats.unmatchedTags.length}</strong>{' '}
            tags to {project.versioningStrategy}
          </div>
        )}

        {releaseStats.unmatchedReleases.length > 0 && (
          <div>
            Failed to match{' '}
            <strong>{releaseStats.unmatchedReleases.length}</strong> releases to{' '}
            {project.versioningStrategy}
          </div>
        )}

        <Box marginTop={1} marginBottom={1}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log("Here's all unmapped/unmatched tags/releases", {
                unmatchedReleases: releaseStats.unmatchedReleases,
                unmatchedTags: releaseStats.unmatchedTags,
                unmappableTags: releaseStats.unmappableTags,
              });
            }}
          >
            Log all unmapped/unmatched tags/releases to the console
          </Button>
        </Box>
      </Alert>
    </Box>
  );
};
