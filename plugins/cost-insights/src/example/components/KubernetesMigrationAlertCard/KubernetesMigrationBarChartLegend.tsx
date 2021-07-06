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

import React from 'react';
import { Box, useTheme } from '@material-ui/core';
import { CostGrowth, LegendItem } from '../../../components';
import { ChangeStatistic, CostInsightsTheme, Duration } from '../../../types';
import { monthOf } from '../../../utils/formatters';

export type MigrationBarChartLegendProps = {
  change: ChangeStatistic;
  startDate: string;
  currentProduct: string;
  comparedProduct: string;
};

export const KubernetesMigrationBarChartLegend = ({
  currentProduct,
  comparedProduct,
  change,
  startDate,
}: MigrationBarChartLegendProps) => {
  const theme = useTheme<CostInsightsTheme>();
  return (
    <Box display="flex" flexDirection="row">
      <Box marginRight={2}>
        <LegendItem
          title={monthOf(startDate)}
          markerColor={theme.palette.magenta}
        >
          {currentProduct}
        </LegendItem>
      </Box>
      <Box marginRight={2}>
        <LegendItem title="Estimated Cost" markerColor={theme.palette.yellow}>
          {comparedProduct}
        </LegendItem>
      </Box>
      <LegendItem title="Total Savings">
        <CostGrowth change={change} duration={Duration.P30D} />
      </LegendItem>
    </Box>
  );
};
