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

import React, { useEffect, useState } from 'react';
import {
  Box,
  capitalize,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  useTheme,
} from '@material-ui/core';
import { CostOverviewChart } from './CostOverviewChart';
import { CostOverviewBreakdownChart } from './CostOverviewBreakdownChart';
import { CostOverviewHeader } from './CostOverviewHeader';
import { MetricSelect } from '../MetricSelect';
import { PeriodSelect } from '../PeriodSelect';
import { useConfig, useFilters } from '../../hooks';
import { mapFiltersToProps } from './selector';
import { DefaultNavigation } from '../../utils/navigation';
import { findAlways } from '../../utils/assert';
import { Cost, CostInsightsTheme, Maybe, MetricData } from '../../types';
import { useOverviewTabsStyles } from '../../utils/styles';
import { ScrollAnchor } from '../../utils/scroll';

export type CostOverviewCardProps = {
  dailyCostData: Cost;
  metricData: Maybe<MetricData>;
};

export const CostOverviewCard = ({
  dailyCostData,
  metricData,
}: CostOverviewCardProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useOverviewTabsStyles(theme);
  const config = useConfig();
  const [tabIndex, setTabIndex] = useState(0);
  const { setDuration, setProject, setMetric, ...filters } = useFilters(
    mapFiltersToProps,
  );

  // Reset tabIndex if breakdowns available change
  useEffect(() => {
    // Intentionally off-by-one to account for the overview tab
    const lastIndex = Object.keys(dailyCostData.groupedCosts ?? {}).length;
    if (tabIndex > lastIndex) {
      setTabIndex(0);
    }
  }, [dailyCostData, tabIndex, setTabIndex]);

  const metric = filters.metric
    ? findAlways(config.metrics, m => m.kind === filters.metric)
    : null;

  const breakdownTabs = Object.keys(dailyCostData.groupedCosts ?? {}).map(
    key => ({
      id: key,
      label: `Breakdown by ${key}`,
      title: `Cloud Cost By ${capitalize(key)}`,
    }),
  );
  const tabs = [
    { id: 'overview', label: 'Total cost', title: 'Cloud Cost' },
  ].concat(breakdownTabs);
  // tabIndex can temporarily be invalid while the useEffect above processes
  const safeTabIndex = tabIndex > tabs.length - 1 ? 0 : tabIndex;

  const OverviewTabs = () => {
    return (
      <>
        <Tabs
          indicatorColor="primary"
          onChange={(_, index) => setTabIndex(index)}
          value={safeTabIndex}
        >
          {tabs.map((tab, index) => (
            <Tab
              className={styles.default}
              label={tab.label}
              key={tab.id}
              value={index}
              classes={{ selected: styles.selected }}
            />
          ))}
        </Tabs>
      </>
    );
  };

  // Metrics can only be selected on the total cost graph
  const showMetricSelect = config.metrics.length && safeTabIndex === 0;

  return (
    <Card style={{ position: 'relative' }}>
      <ScrollAnchor id={DefaultNavigation.CostOverviewCard} />
      <CardContent>
        {dailyCostData.groupedCosts && <OverviewTabs />}
        <CostOverviewHeader title={tabs[safeTabIndex].title}>
          <PeriodSelect duration={filters.duration} onSelect={setDuration} />
        </CostOverviewHeader>
        <Divider />
        <Box ml={2} my={1} display="flex" flexDirection="column">
          {safeTabIndex === 0 ? (
            <CostOverviewChart
              dailyCostData={dailyCostData}
              metric={metric}
              metricData={metricData}
            />
          ) : (
            <CostOverviewBreakdownChart
              costBreakdown={dailyCostData.groupedCosts![tabs[safeTabIndex].id]}
            />
          )}
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {showMetricSelect && (
            <MetricSelect
              metric={filters.metric}
              metrics={config.metrics}
              onSelect={setMetric}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
