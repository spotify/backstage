/*
 * Copyright 2020 The Backstage Authors
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

import { useEntity } from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Typography,
} from '@material-ui/core';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Alert } from '@material-ui/lab';
import { ClassNameMap } from '@material-ui/styles';
import React from 'react';
import { useAsync } from 'react-use';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { codeCoverageApiRef } from '../../api';

import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

type Coverage = 'line' | 'branch';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  trendDown: {
    color: theme.palette.status.warning,
  },
  trendUp: {
    color: theme.palette.status.ok,
  },
}));

const getTrendIcon = (trend: number, classes: ClassNameMap) => {
  switch (true) {
    case trend > 0:
      return <TrendingUpIcon className={classes.trendUp} />;
    case trend < 0:
      return <TrendingDownIcon className={classes.trendDown} />;
    case trend === 0:
    default:
      return <TrendingFlatIcon />;
  }
};

export const CoverageHistoryChart = () => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const {
    loading: loadingHistory,
    error: errorHistory,
    value: valueHistory,
  } = useAsync(
    async () =>
      await codeCoverageApi.getCoverageHistoryForEntity({
        kind: entity.kind,
        namespace: entity.metadata.namespace || 'default',
        name: entity.metadata.name,
      }),
  );
  const classes = useStyles();

  if (loadingHistory) {
    return <Progress />;
  }
  if (errorHistory) {
    return <ResponseErrorPanel error={errorHistory} />;
  } else if (!valueHistory) {
    return <Alert severity="warning">No history found.</Alert>;
  }

  if (!valueHistory.history.length) {
    return (
      <Card>
        <CardHeader title="History" />
        <CardContent>No coverage history found</CardContent>
      </Card>
    );
  }

  const oldestCoverage = valueHistory.history[0];
  const [latestCoverage] = valueHistory.history.slice(-1);

  const getTrendForCoverage = (type: Coverage) => {
    if (!oldestCoverage[type].percentage) {
      return 0;
    }
    return (
      ((latestCoverage[type].percentage - oldestCoverage[type].percentage) /
        oldestCoverage[type].percentage) *
      100
    );
  };

  const lineTrend = getTrendForCoverage('line');
  const branchTrend = getTrendForCoverage('branch');

  return (
    <Card>
      <CardHeader title="History" />
      <CardContent>
        <Box px={6} display="flex">
          <Box display="flex" mr={4}>
            {getTrendIcon(lineTrend, classes)}
            <Typography>
              Current line: {latestCoverage.line.percentage}%<br />(
              {Math.floor(lineTrend)}% change over {valueHistory.history.length}{' '}
              builds)
            </Typography>
          </Box>
          <Box display="flex">
            {getTrendIcon(branchTrend, classes)}
            <Typography>
              Current branch: {latestCoverage.branch.percentage}%<br />(
              {Math.floor(branchTrend)}% change over{' '}
              {valueHistory.history.length} builds)
            </Typography>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={valueHistory.history}
            margin={{ right: 48, top: 32 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis dataKey="line.percentage" />
            <YAxis dataKey="branch.percentage" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="branch.percentage"
              stroke="#8884d8"
            />
            <Line type="monotone" dataKey="line.percentage" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
