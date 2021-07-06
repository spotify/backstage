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
import { Typography, Box } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import {
  GetBranchResult,
  GetLatestReleaseResult,
} from '../../api/GitReleaseClient';
import { ComponentConfigPatch } from '../../types/types';
import { getBumpedTag } from '../../helpers/getBumpedTag';
import { InfoCardPlus } from '../../components/InfoCardPlus';
import { NoLatestRelease } from '../../components/NoLatestRelease';
import { PatchBody } from './PatchBody';
import { useProjectContext } from '../../contexts/ProjectContext';

interface PatchProps {
  latestRelease: GetLatestReleaseResult['latestRelease'];
  releaseBranch: GetBranchResult['branch'] | null;
  onSuccess?: ComponentConfigPatch['onSuccess'];
}

export const Patch = ({
  latestRelease,
  releaseBranch,
  onSuccess,
}: PatchProps) => {
  return (
    <InfoCardPlus>
      <Box marginBottom={2}>
        <Typography variant="h4">
          Patch Release {latestRelease?.prerelease ? 'Candidate' : 'Version'}
        </Typography>
      </Box>

      <BodyWrapper
        latestRelease={latestRelease}
        releaseBranch={releaseBranch}
        onSuccess={onSuccess}
      />
    </InfoCardPlus>
  );
};

function BodyWrapper({ latestRelease, releaseBranch, onSuccess }: PatchProps) {
  const { project } = useProjectContext();

  if (latestRelease === null) {
    return <NoLatestRelease />;
  }

  if (releaseBranch === null) {
    return <NoLatestRelease />;
  }

  const bumpedTag = getBumpedTag({
    project,
    tag: latestRelease.tagName,
    bumpLevel: 'patch',
  });

  if (bumpedTag.error !== undefined) {
    return (
      <Alert severity="error">
        {bumpedTag.error.title && (
          <AlertTitle>{bumpedTag.error.title}</AlertTitle>
        )}

        {bumpedTag.error.subtitle}
      </Alert>
    );
  }

  return (
    <PatchBody
      bumpedTag={bumpedTag.bumpedTag}
      latestRelease={latestRelease}
      releaseBranch={releaseBranch}
      onSuccess={onSuccess}
      tagParts={bumpedTag.tagParts}
    />
  );
}
