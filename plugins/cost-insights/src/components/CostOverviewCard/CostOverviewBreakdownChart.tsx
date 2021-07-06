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
import React, { useState } from 'react';
import { DateTime } from 'luxon';
import {
  useTheme,
  Box,
  Typography,
  Divider,
  emphasize,
} from '@material-ui/core';
import { default as FullScreenIcon } from '@material-ui/icons/Fullscreen';
import {
  AreaChart,
  ContentRenderer,
  TooltipProps,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Cost, DEFAULT_DATE_FORMAT, CostInsightsTheme } from '../../types';
import {
  BarChartTooltip as Tooltip,
  BarChartTooltipItem as TooltipItem,
  BarChartLegend,
} from '../BarChart';
import {
  overviewGraphTickFormatter,
  formatGraphValue,
  isInvalid,
} from '../../utils/graphs';
import { useCostOverviewStyles as useStyles } from '../../utils/styles';
import { useFilters, useLastCompleteBillingDate } from '../../hooks';
import { mapFiltersToProps } from './selector';
import { getPreviousPeriodTotalCost } from '../../utils/change';
import { formatPeriod } from '../../utils/formatters';
import { aggregationSum } from '../../utils/sum';
import { BarChartLegendOptions } from '../BarChart/BarChartLegend';

export type CostOverviewBreakdownChartProps = {
  costBreakdown: Cost[];
};

const LOW_COST_THRESHOLD = 0.1;

export const CostOverviewBreakdownChart = ({
  costBreakdown,
}: CostOverviewBreakdownChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const classes = useStyles(theme);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const { duration } = useFilters(mapFiltersToProps);
  const [isExpanded, setExpanded] = useState(false);

  if (!costBreakdown) {
    return null;
  }

  const flattenedAggregation = costBreakdown
    .map(cost => cost.aggregation)
    .flat();

  const totalCost = aggregationSum(flattenedAggregation);

  const previousPeriodTotal = getPreviousPeriodTotalCost(
    flattenedAggregation,
    duration,
    lastCompleteBillingDate,
  );
  const currentPeriodTotal = totalCost - previousPeriodTotal;
  const canExpand = costBreakdown.length >= 8;
  const otherCategoryIds: string[] = [];

  const breakdownsByDate = costBreakdown.reduce(
    (breakdownByDate, breakdown) => {
      const breakdownTotal = aggregationSum(breakdown.aggregation);
      // Group breakdown items with less than 10% of the total cost into "Other" category if needed
      const isOtherCategory =
        canExpand && breakdownTotal < totalCost * LOW_COST_THRESHOLD;

      const updatedBreakdownByDate = { ...breakdownByDate };
      if (isOtherCategory) {
        otherCategoryIds.push(breakdown.id);
      }
      breakdown.aggregation.forEach(curAggregation => {
        const costsForDate = updatedBreakdownByDate[curAggregation.date] || {};

        updatedBreakdownByDate[curAggregation.date] = {
          ...costsForDate,
          [breakdown.id]:
            (costsForDate[breakdown.id] || 0) + curAggregation.amount,
        };
      });

      return updatedBreakdownByDate;
    },
    {} as Record<string, Record<string, number>>,
  );

  const chartData: Record<string, number>[] = Object.keys(breakdownsByDate).map(
    date => {
      const costsForDate = Object.keys(breakdownsByDate[date]).reduce(
        (dateCosts, breakdown) => {
          // Group costs for items that belong to 'Other' in the chart.
          const cost = breakdownsByDate[date][breakdown];
          const breakdownCost =
            !isExpanded && otherCategoryIds.includes(breakdown)
              ? { Other: (dateCosts.Other || 0) + cost }
              : { [breakdown]: cost };
          return { ...dateCosts, ...breakdownCost };
        },
        {} as Record<string, number>,
      );
      return {
        ...costsForDate,
        date: Date.parse(date),
      };
    },
  );

  const sortedBreakdowns = costBreakdown.sort(
    (a, b) => aggregationSum(a.aggregation) - aggregationSum(b.aggregation),
  );

  const renderAreas = () => {
    const separatedBreakdowns = sortedBreakdowns
      // Check that the breakdown is a separate group and hasn't been added to 'Other'
      .filter(
        breakdown =>
          breakdown.id !== 'Other' && !otherCategoryIds.includes(breakdown.id),
      )
      .map(breakdown => breakdown.id);
    // Keep 'Other' category at the bottom of the stack
    const breakdownsToDisplay = isExpanded
      ? sortedBreakdowns.map(breakdown => breakdown.id)
      : ['Other', ...separatedBreakdowns];

    return breakdownsToDisplay.map((breakdown, i) => {
      // Logic to handle case where there are more items than data viz colors.
      const color =
        theme.palette.dataViz[
          (breakdownsToDisplay.length - 1 - i) %
            (theme.palette.dataViz.length - 1)
        ];
      return (
        <Area
          key={breakdown}
          dataKey={breakdown}
          isAnimationActive={false}
          stackId="1"
          stroke={color}
          fill={color}
          onClick={() => setExpanded(true)}
          style={{
            cursor: breakdown === 'Other' && !isExpanded ? 'pointer' : null,
          }}
        />
      );
    });
  };

  const tooltipRenderer: ContentRenderer<TooltipProps> = ({
    label,
    payload = [],
  }) => {
    if (isInvalid({ label, payload })) return null;

    const date =
      typeof label === 'number'
        ? DateTime.fromMillis(label)
        : DateTime.fromISO(label!);
    const dateTitle = date.toUTC().toFormat(DEFAULT_DATE_FORMAT);
    const items = payload.map(p => ({
      label: p.dataKey as string,
      value: formatGraphValue(p.value as number),
      fill: p.fill!,
    }));
    const expandText = (
      <Box>
        <Divider
          style={{
            backgroundColor: emphasize(theme.palette.divider, 1),
            margin: '10px 0',
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FullScreenIcon />
          <Typography>Click to expand</Typography>
        </Box>
      </Box>
    );
    return (
      <Tooltip title={dateTitle}>
        {items.reverse().map((item, index) => (
          <TooltipItem key={`${item.label}-${index}`} item={item} />
        ))}
        {canExpand && !isExpanded ? expandText : null}
      </Tooltip>
    );
  };

  const options: Partial<BarChartLegendOptions> = {
    previousName: formatPeriod(duration, lastCompleteBillingDate, false),
    currentName: formatPeriod(duration, lastCompleteBillingDate, true),
    hideMarker: true,
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row">
        <BarChartLegend
          costStart={previousPeriodTotal}
          costEnd={currentPeriodTotal}
          options={options}
        />
      </Box>
      <ResponsiveContainer
        width={classes.container.width}
        height={classes.container.height}
      >
        <AreaChart
          data={chartData}
          margin={{
            top: 16,
            right: 30,
            bottom: 40,
          }}
        >
          <CartesianGrid stroke={classes.cartesianGrid.stroke} />
          <XAxis
            dataKey="date"
            domain={['dataMin', 'dataMax']}
            tickFormatter={overviewGraphTickFormatter}
            tickCount={6}
            type="number"
            stroke={classes.axis.fill}
          />
          <YAxis
            domain={[() => 0, 'dataMax']}
            tick={{ fill: classes.axis.fill }}
            tickFormatter={formatGraphValue}
            width={classes.yAxis.width}
          />
          {renderAreas()}
          <RechartsTooltip content={tooltipRenderer} animationDuration={100} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
