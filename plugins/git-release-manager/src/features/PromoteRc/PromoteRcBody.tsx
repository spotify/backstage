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
import { Button, Typography, Box } from '@material-ui/core';

import { ComponentConfigPromoteRc } from '../../types/types';
import { Differ } from '../../components/Differ';
import { GetLatestReleaseResult } from '../../api/GitReleaseClient';
import { ResponseStepDialog } from '../../components/ResponseStepDialog/ResponseStepDialog';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { usePromoteRc } from './hooks/usePromoteRc';

interface PromoteRcBodyProps {
  rcRelease: NonNullable<GetLatestReleaseResult['latestRelease']>;
  onSuccess?: ComponentConfigPromoteRc['onSuccess'];
}

export const PromoteRcBody = ({ rcRelease, onSuccess }: PromoteRcBodyProps) => {
  const releaseVersion = rcRelease.tagName.replace('rc-', 'version-');

  const { progress, responseSteps, run, runInvoked } = usePromoteRc({
    rcRelease,
    releaseVersion,
    onSuccess,
  });

  if (responseSteps.length > 0) {
    return (
      <ResponseStepDialog
        progress={progress}
        responseSteps={responseSteps}
        title="Promote Release Candidate"
      />
    );
  }

  return (
    <>
      <Box marginBottom={2}>
        <Typography>
          Promotes the current Release Candidate to a <b>Release Version</b>.
        </Typography>
      </Box>

      <Box marginBottom={2}>
        <Typography>
          <Differ
            icon="tag"
            current={rcRelease.tagName}
            next={releaseVersion}
          />
        </Typography>
      </Box>

      <Button
        data-testid={TEST_IDS.promoteRc.cta}
        variant="contained"
        color="primary"
        disabled={runInvoked}
        onClick={() => run()}
      >
        Promote Release Candidate
      </Button>
    </>
  );
};
