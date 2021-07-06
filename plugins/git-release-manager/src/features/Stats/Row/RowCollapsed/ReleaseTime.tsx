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
import { DateTime } from 'luxon';
import { Box, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { getDecimalNumber } from '../../helpers/getDecimalNumber';
import { getTagDates } from '../../helpers/getTagDates';
import { gitReleaseManagerApiRef } from '../../../../api/serviceApiRef';
import { ReleaseStats } from '../../contexts/ReleaseStatsContext';
import { useProjectContext } from '../../../../contexts/ProjectContext';

import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

interface ReleaseTimeProps {
  releaseStat: ReleaseStats['releases']['0'];
}

export function ReleaseTime({ releaseStat }: ReleaseTimeProps) {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();

  const releaseTimes = useAsync(() =>
    getTagDates({
      pluginApiClient,
      project,
      startTag: [...releaseStat.candidates].reverse()[0],
      endTag: releaseStat.versions[0],
    }),
  );

  if (releaseTimes.loading || releaseTimes.loading) {
    return (
      <Wrapper>
        <Progress />
      </Wrapper>
    );
  }

  if (releaseTimes.error) {
    return (
      <Alert severity="error">
        Failed to fetch the first Release Candidate commit (
        {releaseTimes.error.message})
      </Alert>
    );
  }

  const { days = 0, hours = 0 } =
    releaseTimes.value?.startDate && releaseTimes.value?.endDate
      ? DateTime.fromISO(releaseTimes.value.endDate)
          .diff(DateTime.fromISO(releaseTimes.value.startDate), [
            'days',
            'hours',
          ])
          .toObject()
      : { days: -1 };

  return (
    <Wrapper>
      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Typography variant="body1">
          {releaseStat.versions.length === 0 ? '-' : 'Release completed '}
          {releaseTimes.value?.endDate &&
            DateTime.fromISO(releaseTimes.value.endDate).toFormat('yyyy-MM-dd')}
        </Typography>
      </Box>

      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="secondary">
          {days === -1 ? (
            <>Ongoing</>
          ) : (
            <>
              Completed in: {days} days {getDecimalNumber(hours, 1)} hours
            </>
          )}
        </Typography>
      </Box>

      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Typography variant="body1">
          Release Candidate created{' '}
          {releaseTimes.value?.startDate &&
            DateTime.fromISO(releaseTimes.value.startDate).toFormat(
              'yyyy-MM-dd',
            )}
        </Typography>
      </Box>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  );
}
