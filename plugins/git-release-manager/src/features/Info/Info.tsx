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

import React, { useState } from 'react';
import { Typography, Button, Box } from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';

import {
  GetBranchResult,
  GetLatestReleaseResult,
} from '../../api/GitReleaseClient';
import { Differ } from '../../components/Differ';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { Stats } from '../Stats/Stats';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useProjectContext } from '../../contexts/ProjectContext';
import flowImage from './flow.png';
import { Link } from '@backstage/core-components';

interface InfoCardProps {
  releaseBranch: GetBranchResult['branch'] | null;
  latestRelease: GetLatestReleaseResult['latestRelease'];
  statsEnabled: boolean;
}

export const Info = ({
  releaseBranch,
  latestRelease,
  statsEnabled,
}: InfoCardProps) => {
  const { project } = useProjectContext();
  const [showStats, setShowStats] = useState(false);

  return (
    <InfoCardPlus>
      <Box marginBottom={1} data-testid={TEST_IDS.info.info}>
        <Typography variant="h6">Terminology</Typography>

        <Typography>
          <strong>Git</strong>: The source control system where releases reside
          in a practical sense. Read more about{' '}
          <Link
            to="https://docs.github.com/en/github/administering-a-repository/managing-releases-in-a-repository"
            target="_blank"
          >
            Git releases
          </Link>
          .
        </Typography>

        <Typography>
          <strong>Release Candidate</strong>: A Git <i>prerelease</i> intended
          primarily for internal testing
        </Typography>

        <Typography>
          <strong>Release Version</strong>: A Git release intended for end users
        </Typography>
      </Box>

      <Box marginBottom={1}>
        <Typography variant="h6">Flow</Typography>

        <Box marginBottom={2}>
          <Typography>
            Git Release Manager is built with a specific flow in mind. For
            example, it assumes your project is configured to react to tags
            prefixed with <b>rc</b> or <b>version</b>.
          </Typography>
        </Box>

        <Box marginBottom={2}>
          <Typography>Here's an overview of the flow:</Typography>
        </Box>

        <img alt="flow" src={flowImage} style={{ width: '100%' }} />
      </Box>

      <Box marginBottom={1}>
        <Typography variant="h6">Details</Typography>

        <Typography>
          Repository:{' '}
          <Differ icon="github" next={`${project.owner}/${project.repo}`} />
        </Typography>

        <Typography>
          Versioning strategy:{' '}
          <Differ icon="versioning" next={project.versioningStrategy} />
        </Typography>

        <Typography>
          Latest release branch:{' '}
          <Differ icon="branch" next={releaseBranch?.name} />
        </Typography>

        <Typography>
          Latest release: <Differ icon="tag" next={latestRelease?.tagName} />
        </Typography>
      </Box>

      {statsEnabled && (
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowStats(true)}
            startIcon={<BarChartIcon />}
            size="small"
          >
            Show stats
          </Button>

          {showStats && <Stats setShowStats={setShowStats} />}
        </Box>
      )}
    </InfoCardPlus>
  );
};
