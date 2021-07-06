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

import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import {
  GetBranchResult,
  GetLatestReleaseResult,
  GetRepositoryResult,
} from '../../api/GitReleaseClient';
import { ComponentConfigCreateRc } from '../../types/types';
import { Differ } from '../../components/Differ';
import { getReleaseCandidateGitInfo } from '../../helpers/getReleaseCandidateGitInfo';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { ResponseStepDialog } from '../../components/ResponseStepDialog/ResponseStepDialog';
import { SEMVER_PARTS } from '../../constants/constants';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { useCreateReleaseCandidate } from './hooks/useCreateReleaseCandidate';
import { useProjectContext } from '../../contexts/ProjectContext';

interface CreateReleaseCandidateProps {
  defaultBranch: GetRepositoryResult['repository']['defaultBranch'];
  latestRelease: GetLatestReleaseResult['latestRelease'];
  releaseBranch: GetBranchResult['branch'] | null;
  onSuccess?: ComponentConfigCreateRc['onSuccess'];
}

const InfoCardPlusWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <InfoCardPlus>
      <Box marginBottom={2}>
        <Typography variant="h4">Create Release Candidate</Typography>
      </Box>
      {children}
    </InfoCardPlus>
  );
};

export const CreateReleaseCandidate = ({
  defaultBranch,
  latestRelease,
  releaseBranch,
  onSuccess,
}: CreateReleaseCandidateProps) => {
  const { project } = useProjectContext();

  const [semverBumpLevel, setSemverBumpLevel] = useState<'major' | 'minor'>(
    SEMVER_PARTS.minor,
  );
  const [releaseCandidateGitInfo, setReleaseCandidateGitInfo] = useState(
    getReleaseCandidateGitInfo({ latestRelease, project, semverBumpLevel }),
  );

  useEffect(() => {
    setReleaseCandidateGitInfo(
      getReleaseCandidateGitInfo({ latestRelease, project, semverBumpLevel }),
    );
  }, [semverBumpLevel, setReleaseCandidateGitInfo, latestRelease, project]);

  const {
    progress,
    responseSteps,
    run,
    runInvoked,
  } = useCreateReleaseCandidate({
    defaultBranch,
    latestRelease,
    releaseCandidateGitInfo,
    project,
    onSuccess,
  });
  if (responseSteps.length > 0) {
    return (
      <ResponseStepDialog
        progress={progress}
        responseSteps={responseSteps}
        title="Create Release Candidate"
      />
    );
  }

  if (releaseCandidateGitInfo.error !== undefined) {
    return (
      <InfoCardPlusWrapper>
        <Alert severity="error">
          {releaseCandidateGitInfo.error.title && (
            <AlertTitle>{releaseCandidateGitInfo.error.title}</AlertTitle>
          )}

          {releaseCandidateGitInfo.error.subtitle}
        </Alert>
      </InfoCardPlusWrapper>
    );
  }

  const tagAlreadyExists =
    latestRelease !== null &&
    latestRelease.tagName === releaseCandidateGitInfo.rcReleaseTag;
  const conflictingPreRelease =
    latestRelease !== null && latestRelease.prerelease;

  return (
    <InfoCardPlusWrapper>
      {project.versioningStrategy === 'semver' &&
        latestRelease &&
        !conflictingPreRelease && (
          <Box marginBottom={2} data-testid={TEST_IDS.createRc.semverSelect}>
            <FormControl style={{ margin: 5, minWidth: 250 }}>
              <InputLabel>Select bump severity</InputLabel>

              <Select
                value={semverBumpLevel}
                onChange={({ target: { value: semverSeverity } }: any) => {
                  setSemverBumpLevel(semverSeverity);
                }}
              >
                <MenuItem value={SEMVER_PARTS.minor}>
                  {SEMVER_PARTS.minor}
                </MenuItem>
                <MenuItem value={SEMVER_PARTS.major}>
                  {SEMVER_PARTS.major}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

      {conflictingPreRelease || tagAlreadyExists ? (
        <>
          {conflictingPreRelease && (
            <Box marginBottom={2}>
              <Alert severity="warning">
                The most recent release is already a Release Candidate
              </Alert>
            </Box>
          )}

          {tagAlreadyExists && (
            <Box marginBottom={2}>
              <Alert severity="warning">
                There's already a tag named{' '}
                <strong>{releaseCandidateGitInfo.rcReleaseTag}</strong>
              </Alert>
            </Box>
          )}
        </>
      ) : (
        <Box marginBottom={2}>
          <Typography>
            <Differ
              icon="branch"
              current={releaseBranch?.name}
              next={releaseCandidateGitInfo.rcBranch}
            />
          </Typography>

          <Typography>
            <Differ
              icon="tag"
              current={latestRelease?.tagName}
              next={releaseCandidateGitInfo.rcReleaseTag}
            />
          </Typography>
        </Box>
      )}

      <Button
        data-testid={TEST_IDS.createRc.cta}
        disabled={conflictingPreRelease || tagAlreadyExists || runInvoked}
        variant="contained"
        color="primary"
        onClick={() => run()}
      >
        Create Release Candidate
      </Button>
    </InfoCardPlusWrapper>
  );
};
