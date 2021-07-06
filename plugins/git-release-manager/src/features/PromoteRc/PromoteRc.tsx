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
import { Alert, AlertTitle } from '@material-ui/lab';
import { Box, Typography } from '@material-ui/core';

import { ComponentConfigPromoteRc } from '../../types/types';
import { GetLatestReleaseResult } from '../../api/GitReleaseClient';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { NoLatestRelease } from '../../components/NoLatestRelease';
import { PromoteRcBody } from './PromoteRcBody';
import { TEST_IDS } from '../../test-helpers/test-ids';

interface PromoteRcProps {
  latestRelease: GetLatestReleaseResult['latestRelease'];
  onSuccess?: ComponentConfigPromoteRc['onSuccess'];
}

export const PromoteRc = ({ latestRelease, onSuccess }: PromoteRcProps) => {
  function Body() {
    if (latestRelease === null) {
      return <NoLatestRelease />;
    }

    if (!latestRelease.prerelease) {
      return (
        <Box marginBottom={2}>
          <Alert
            data-testid={TEST_IDS.promoteRc.notRcWarning}
            severity="warning"
          >
            <AlertTitle>
              Latest Git release is not a Release Candidate
            </AlertTitle>
            One can only promote Release Candidates to Release Versions
          </Alert>
        </Box>
      );
    }

    return <PromoteRcBody rcRelease={latestRelease} onSuccess={onSuccess} />;
  }

  return (
    <InfoCardPlus>
      <Box marginBottom={2}>
        <Typography variant="h4">Promote Release Candidate</Typography>
      </Box>

      <Body />
    </InfoCardPlus>
  );
};
