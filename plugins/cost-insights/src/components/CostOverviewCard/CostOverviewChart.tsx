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
import { useTheme, Box } from '@material-ui/core';
import {
  ComposedChart,
  ContentRenderer,
  TooltipProps,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Area,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartData,
  Cost,
  DEFAULT_DATE_FORMAT,
  Maybe,
  Metric,
  MetricData,
  CostInsightsTheme,
} from '../../types';
import {
  BarChartTooltip as Tooltip,
  BarChartTooltipItem as TooltipItem,
} from '../BarChart';
import {
  overviewGraphTickFormatter,
  formatGraphValue,
  isInvalid,
} from '../../utils/graphs';
import { useCostOverviewStyles as useStyles } from '../../utils/styles';
import { groupByDate, toDataMax, trendFrom } from '../../utils/charts';
import { aggregationSort } from '../../utils/sort';
import { CostOverviewLegend } from './CostOverviewLegend';

type CostOverviewChartProps = {
  metric: Maybe<Metric>;
  metricData: Maybe<MetricData>;
  dailyCostData: Cost;
  responsive?: boolean;
};

export const CostOverviewChart = ({
  dailyCostData,
  metric,
  metricData,
  responsive = true,
}: CostOverviewChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useStyles(theme);

  const data = {
    dailyCost: {
      dataKey: 'dailyCost',
      name: `Daily Cost`,
      format: 'currency',
      data: dailyCostData,
    },
    metric: {
      dataKey: metric?.kind ?? 'Unknown',
      name: metric?.name ?? 'Unknown',
      format: metricData?.format ?? 'number',
      data: metricData,
    },
  };

  const metricsByDate = data.metric.data
    ? data.metric.data.aggregation.reduce(groupByDate, {})
    : {};

  const chartData: ChartData[] = data.dailyCost.data.aggregation
    .slice()
    .sort(aggregationSort)
    .map(entry => ({
      date: Date.parse(entry.date),
      trend: trendFrom(data.dailyCost.data.trendline!, Date.parse(entry.date)),
      dailyCost: entry.amount,
      ...(metric && data.metric.data
        ? { [data.metric.dataKey]: metricsByDate[`${entry.date}`] }
        : {}),
    }));

  const tooltipRenderer: ContentRenderer<TooltipProps> = ({
    label,
    payload = [],
  }) => {
    if (isInvalid({ label, payload })) return null;

    const dataKeys = [data.dailyCost.dataKey, data.metric.dataKey];
    const date =
      typeof label === 'number'
        ? DateTime.fromMillis(label)
        : DateTime.fromISO(label!);
    const title = date.toUTC().toFormat(DEFAULT_DATE_FORMAT);
    const items = payload
      .filter(p => dataKeys.includes(p.dataKey as string))
      .map(p => ({
        label:
          p.dataKey === data.dailyCost.dataKey
            ? data.dailyCost.name
            : data.metric.name,
        value:
          p.dataKey === data.dailyCost.dataKey
            ? formatGraphValue(p.value as number, data.dailyCost.format)
            : formatGraphValue(p.value as number, data.metric.format),
        fill:
          p.dataKey === data.dailyCost.dataKey
            ? theme.palette.blue
            : theme.palette.magenta,
      }));

    return (
      <Tooltip title={title}>
        {items.map((item, index) => (
          <TooltipItem key={`${item.label}-${index}`} item={item} />
        ))}
      </Tooltip>
    );
  };

  return (
    <Box display="flex" flexDirection="column">
      <CostOverviewLegend
        dailyCostData={dailyCostData}
        metric={metric}
        metricData={metricData}
      />
      <ResponsiveContainer
        width={responsive ? '100%' : styles.container.width}
        height={styles.container.height}
        className="cost-overview-chart"
      >
        <ComposedChart margin={styles.chart.margin} data={chartData}>
          <CartesianGrid stroke={styles.cartesianGrid.stroke} />
          <XAxis
            dataKey="date"
            domain={['dataMin', 'dataMax']}
            tickFormatter={overviewGraphTickFormatter}
            tickCount={6}
            type="number"
            stroke={styles.axis.fill}
          />
          <YAxis
            domain={[() => 0, 'dataMax']}
            tick={{ fill: styles.axis.fill }}
            tickFormatter={formatGraphValue}
            width={styles.yAxis.width}
            yAxisId={data.dailyCost.dataKey}
          />
          {metric && (
            <YAxis
              hide
              domain={[() => 0, toDataMax(data.metric.dataKey, chartData)]}
              width={styles.yAxis.width}
              yAxisId={data.metric.dataKey}
            />
          )}
          <Area
            dataKey={data.dailyCost.dataKey}
            isAnimationActive={false}
            fill={theme.palette.blue}
            fillOpacity={0.4}
            stroke="none"
            yAxisId={data.dailyCost.dataKey}
          />
          <Line
            activeDot={false}
            dataKey="trend"
            dot={false}
            isAnimationActive={false}
            label={false}
            strokeWidth={2}
            stroke={theme.palette.blue}
            yAxisId={data.dailyCost.dataKey}
          />
          {metric && (
            <Line
              dataKey={data.metric.dataKey}
              dot={false}
              isAnimationActive={false}
              label={false}
              strokeWidth={2}
              stroke={theme.palette.magenta}
              yAxisId={data.metric.dataKey}
            />
          )}
          <RechartsTooltip content={tooltipRenderer} animationDuration={100} />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};
