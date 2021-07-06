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
import { DateTime } from 'luxon';
import { Box } from '@material-ui/core';
import { BarChart, BarChartLegend, BarChartLegendOptions } from '../BarChart';
import { LegendItem } from '../LegendItem';
import { CostGrowth } from '../CostGrowth';
import { Duration, ProjectGrowthData } from '../../types';
import { useBarChartLayoutStyles as useStyles } from '../../utils/styles';
import { resourceOf } from '../../utils/graphs';

type ProjectGrowthAlertChartProps = {
  alert: ProjectGrowthData;
};

export const ProjectGrowthAlertChart = ({
  alert,
}: ProjectGrowthAlertChartProps) => {
  const classes = useStyles();

  const costStart = alert.aggregation[0];
  const costEnd = alert.aggregation[1];
  const resourceData = alert.products.map(resourceOf);

  const options: Partial<BarChartLegendOptions> = {
    previousName: DateTime.fromFormat(alert.periodStart, "yyyy-'Q'q").toFormat(
      "'Q'q yyyy",
    ),
    currentName: DateTime.fromFormat(alert.periodEnd, "yyyy-'Q'q").toFormat(
      "'Q'q yyyy",
    ),
  };

  return (
    <Box className={classes.wrapper}>
      <BarChartLegend costStart={costStart} costEnd={costEnd} options={options}>
        <LegendItem title="Cost Growth">
          <CostGrowth change={alert.change} duration={Duration.P3M} />
        </LegendItem>
      </BarChartLegend>
      <BarChart resources={resourceData} options={options} />
    </Box>
  );
};
