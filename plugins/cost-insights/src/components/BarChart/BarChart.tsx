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

import React, { useState, useCallback } from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ContentRenderer,
  TooltipProps as RechartsTooltipProps,
  RechartsFunction,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, useTheme } from '@material-ui/core';
import { BarChartTick } from './BarChartTick';
import { BarChartStepper } from './BarChartStepper';
import { BarChartTooltip } from './BarChartTooltip';
import { BarChartTooltipItem } from './BarChartTooltipItem';
import { currencyFormatter } from '../../utils/formatters';
import {
  BarChartData,
  ResourceData,
  DataKey,
  CostInsightsTheme,
} from '../../types';
import { notEmpty } from '../../utils/assert';
import { useBarChartStyles } from '../../utils/styles';
import { resourceSort } from '../../utils/sort';
import { isInvalid, titleOf, tooltipItemOf } from '../../utils/graphs';

export const defaultTooltip: ContentRenderer<RechartsTooltipProps> = ({
  label,
  payload = [],
}) => {
  if (isInvalid({ label, payload })) return null;

  const title = titleOf(label);
  const items = payload.map(tooltipItemOf).filter(notEmpty);
  return (
    <BarChartTooltip title={title}>
      {items.map((item, index) => (
        <BarChartTooltipItem key={`${item.label}-${index}`} item={item} />
      ))}
    </BarChartTooltip>
  );
};

export type BarChartProps = {
  resources: ResourceData[];
  responsive?: boolean;
  displayAmount?: number;
  options?: Partial<BarChartData>;
  tooltip?: ContentRenderer<RechartsTooltipProps>;
  onClick?: RechartsFunction;
  onMouseMove?: RechartsFunction;
};

export const BarChart = ({
  resources,
  responsive = true,
  displayAmount = 6,
  options = {},
  tooltip = defaultTooltip,
  onClick,
  onMouseMove,
}: BarChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useBarChartStyles(theme);
  const [activeChart, setActiveChart] = useState(false);
  const [stepWindow, setStepWindow] = useState(() => [0, displayAmount]);

  const data = Object.assign(
    {
      previousFill: theme.palette.lightBlue,
      currentFill: theme.palette.darkBlue,
      previousName: 'Previous',
      currentName: 'Current',
    },
    options,
  );

  const [stepStart, stepEnd] = stepWindow;
  const steps = Math.ceil(resources.length / displayAmount);
  const disableStepper = resources.length <= displayAmount;

  const sortedResources = resources
    .sort(resourceSort)
    .slice(stepStart, stepEnd);

  // Pin the domain to the largest value in the series.
  // Intentially redundant - This could simply be derived from the first element in the already sorted list,
  // but that may not be the case in the future when custom sorting is implemented.
  const globalResourcesMax = resources.reduce(
    (max, r: ResourceData) => Math.max(max, r.current, r.previous),
    0,
  );

  const onStepChange = useCallback(
    (activeStep: number) => {
      const start = activeStep * displayAmount;
      const end = start + displayAmount;
      if (end > resources.length) {
        setStepWindow([start, resources.length]);
      } else {
        setStepWindow([start, end]);
      }
    },
    [setStepWindow, resources, displayAmount],
  );

  return (
    <Box
      position="relative"
      onMouseLeave={() => setActiveChart(false)}
      onMouseEnter={() => setActiveChart(true)}
      data-testid="bar-chart-wrapper"
    >
      {/* Setting fixed values for height and width generates a console warning in testing but enables ResponsiveContainer to render its children. */}
      <ResponsiveContainer
        height={styles.container.height}
        width={responsive ? '100%' : styles.container.width}
      >
        <RechartsBarChart
          style={{ cursor: onClick ? 'pointer' : null }}
          onClick={onClick}
          onMouseMove={onMouseMove}
          data={sortedResources}
          margin={styles.barChart.margin}
          barSize={45}
          data-testid="bar-chart"
        >
          {tooltip && (
            <RechartsTooltip
              filterNull
              cursor={styles.cursor}
              animationDuration={100}
              content={tooltip}
            />
          )}
          <CartesianGrid
            vertical={false}
            stroke={styles.cartesianGrid.stroke}
          />
          <XAxis
            dataKey={DataKey.Name}
            tickLine={false}
            interval={0}
            height={styles.xAxis.height}
            tick={BarChartTick}
          />
          <YAxis
            tickFormatter={currencyFormatter.format}
            domain={[() => 0, globalResourcesMax]}
            tick={styles.axis}
          />
          <Bar
            dataKey={DataKey.Previous}
            name={data.previousName}
            fill={data.previousFill}
            isAnimationActive={false}
          />
          <Bar
            dataKey={DataKey.Current}
            name={data.currentName}
            fill={data.currentFill}
            isAnimationActive={false}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
      {!disableStepper && (
        <BarChartStepper
          steps={steps}
          disableScroll={!activeChart}
          onChange={onStepChange}
        />
      )}
    </Box>
  );
};
