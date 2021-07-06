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
import {
  Box,
  Button,
  Tooltip as MaterialTooltip,
  Typography,
} from '@material-ui/core';
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from 'recharts';

import { AverageReleaseTime } from './AverageReleaseTime';
import { LinearProgressWithLabel } from '../../../../components/ResponseStepDialog/LinearProgressWithLabel';
import { LongestReleaseTime } from './LongestReleaseTime';
import { useGetReleaseTimes } from '../hooks/useGetReleaseTimes';
import { useReleaseStatsContext } from '../../contexts/ReleaseStatsContext';

export function InDepth() {
  const { releaseStats } = useReleaseStatsContext();
  const {
    averageReleaseTime,
    progress,
    releaseCommitPairs,
    run,
  } = useGetReleaseTimes();

  const skipped =
    Object.keys(releaseStats.releases).length - releaseCommitPairs.length;

  return (
    <Box style={{ flex: 1 }}>
      <Box margin={1}>
        <Typography variant="h4">In-depth</Typography>
      </Box>

      <Box style={{ display: 'flex' }}>
        <Box margin={1} style={{ display: 'flex', flex: 1 }}>
          <Box>
            <Typography variant="h6">Release time</Typography>

            <Typography variant="body2">
              <strong>Release time</strong> is derived by comparing{' '}
              <i>createdAt</i> of the commits belonging to the first and last
              tag of each release. Releases without patches will have tags
              pointing towards the same commit and will thus be omitted. This
              project will omit {skipped} out of the total{' '}
              {Object.keys(releaseStats.releases).length} releases.
            </Typography>
          </Box>
        </Box>

        <Box
          margin={1}
          style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
        >
          <Box>
            <Typography variant="h6">In numbers</Typography>

            <Typography variant="body2" color="textSecondary">
              <strong>Average release time</strong>:{' '}
              <AverageReleaseTime averageReleaseTime={averageReleaseTime} />
            </Typography>

            <Typography variant="body2" color="textSecondary">
              <strong>Lengthiest release</strong>:{' '}
              <LongestReleaseTime averageReleaseTime={averageReleaseTime} />
            </Typography>
          </Box>

          <Box marginTop={1}>
            {progress === 0 && (
              <MaterialTooltip
                title={`This action will send ~${
                  releaseCommitPairs.length * 2
                } requests`}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => run()}
                  size="small"
                >
                  Crunch the numbers
                </Button>
              </MaterialTooltip>
            )}
          </Box>
        </Box>
      </Box>

      <Box marginTop={4}>
        <BarChart
          width={700}
          height={70 + averageReleaseTime.length * 22}
          data={
            averageReleaseTime.length > 0
              ? averageReleaseTime
              : [{ version: 'x.y.z', days: 0 }]
          }
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <XAxis type="number" />
          <YAxis dataKey="version" type="category" />
          <Tooltip labelStyle={{ color: '#000', fontWeight: 'bold' }} />
          <Legend />
          <Bar dataKey="days" fill="#82ca9d" />
        </BarChart>

        {progress > 0 && progress < 100 && (
          <Box marginTop={1}>
            <LinearProgressWithLabel progress={progress} responseSteps={[]} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
