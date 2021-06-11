/*
 * Copyright 2020 Spotify AB
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

import React, { PropsWithChildren } from 'react';
import { Box, useTheme } from '@material-ui/core';
import { LegendItem } from '../LegendItem';
import {
  CostInsightsTheme,
  MetricData,
  Maybe,
  Cost,
  Metric,
} from '../../types';
import { useLastCompleteBillingDate, useFilters } from '../../hooks';
import { getComparedChange, choose } from '../../utils/change';
import { mapFiltersToProps } from './selector';
import { formatChange } from '../../utils/formatters';
import { CostGrowth } from '../CostGrowth';

type CostOverviewLegendProps = {
  metric: Maybe<Metric>;
  metricData: Maybe<MetricData>;
  dailyCostData: Cost;
};

export const CostOverviewLegend = ({
  dailyCostData,
  metric,
  metricData,
}: PropsWithChildren<CostOverviewLegendProps>) => {
  const theme = useTheme<CostInsightsTheme>();
  const { duration } = useFilters(mapFiltersToProps);
  const lastCompleteBillingDate = useLastCompleteBillingDate();

  const comparedChange = metricData
    ? getComparedChange(
        dailyCostData,
        metricData,
        duration,
        lastCompleteBillingDate,
      )
    : null;

  return (
    <Box display="flex" flexDirection="row">
      {dailyCostData.change && (
        <Box mr={2}>
          <LegendItem title="Cost Trend" markerColor={theme.palette.blue}>
            {formatChange(dailyCostData.change)}
          </LegendItem>
        </Box>
      )}
      {metricData && metric && comparedChange && (
        <>
          <Box mr={2}>
            <LegendItem
              title={`${metric.name} Trend`}
              markerColor={theme.palette.magenta}
            >
              {formatChange(metricData.change)}
            </LegendItem>
          </Box>
          <LegendItem
            title={choose(['Your Savings', 'Your Excess'], comparedChange)}
          >
            <CostGrowth change={comparedChange} duration={duration} />
          </LegendItem>
        </>
      )}
    </Box>
  );
};
