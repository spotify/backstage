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

export {
  costInsightsPlugin,
  costInsightsPlugin as plugin,
  CostInsightsPage,
  CostInsightsProjectGrowthInstructionsPage,
  CostInsightsLabelDataflowInstructionsPage,
} from './plugin';
export { ExampleCostInsightsClient } from './example';
export {
  BarChart,
  BarChartLegend,
  BarChartTooltip,
  BarChartTooltipItem,
  CostGrowth,
  CostGrowthIndicator,
  LegendItem,
} from './components';
export { MockConfigProvider, MockCurrencyProvider } from './testUtils';
export * from './api';
export * from './alerts';
export * from './types';

export type {
  BarChartProps,
  BarChartLegendOptions,
  BarChartLegendProps,
  BarChartTooltipProps,
  BarChartTooltipItemProps,
  CostGrowthProps,
  CostGrowthIndicatorProps,
  TooltipItem,
  LegendItemProps,
} from './components';
