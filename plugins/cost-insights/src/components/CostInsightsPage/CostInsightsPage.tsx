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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Collapse,
  Container,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import { default as MaterialAlert } from '@material-ui/lab/Alert';
import { costInsightsApiRef } from '../../api';
import { ActionItems } from '../ActionItems';
import { AlertInsights } from '../AlertInsights';
import { CostInsightsLayout } from '../CostInsightsLayout';
import { CopyUrlToClipboard } from '../CopyUrlToClipboard';
import { CurrencySelect } from '../CurrencySelect';
import { WhyCostsMatter } from '../WhyCostsMatter';
import {
  CostInsightsHeader,
  CostInsightsHeaderNoGroups,
} from '../CostInsightsHeader';
import { CostInsightsNavigation } from '../CostInsightsNavigation';
import { CostOverviewCard } from '../CostOverviewCard';
import { ProductInsights } from '../ProductInsights';
/* https://github.com/backstage/backstage/issues/2574 */
// import { CostInsightsSupportButton } from '../CostInsightsSupportButton';
import {
  useConfig,
  useCurrency,
  useFilters,
  useGroups,
  useLastCompleteBillingDate,
  useLoading,
} from '../../hooks';
import { Alert, Cost, Maybe, MetricData, Product, Project } from '../../types';
import { mapLoadingToProps } from './selector';
import { ProjectSelect } from '../ProjectSelect';
import { intervalsOf } from '../../utils/duration';
import { useSubtleTypographyStyles } from '../../utils/styles';
import {
  isAlertActive,
  isAlertAccepted,
  isAlertDismissed,
  isAlertSnoozed,
} from '../../utils/alerts';

import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export const CostInsightsPage = () => {
  const classes = useSubtleTypographyStyles();
  const client = useApi(costInsightsApiRef);
  const config = useConfig();
  const groups = useGroups();
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currency, setCurrency] = useCurrency();
  const [projects, setProjects] = useState<Maybe<Project[]>>(null);
  const [products, setProducts] = useState<Maybe<Product[]>>(null);
  const [dailyCost, setDailyCost] = useState<Maybe<Cost>>(null);
  const [metricData, setMetricData] = useState<Maybe<MetricData>>(null);
  const [error, setError] = useState<Maybe<Error>>(null);

  const { pageFilters, setPageFilters } = useFilters(p => p);

  const active = useMemo(() => alerts.filter(isAlertActive), [alerts]);
  const snoozed = useMemo(() => alerts.filter(isAlertSnoozed), [alerts]);
  const accepted = useMemo(() => alerts.filter(isAlertAccepted), [alerts]);
  const dismissed = useMemo(() => alerts.filter(isAlertDismissed), [alerts]);

  const isActionItemsDisplayed = !!active.length;
  const isAlertInsightsDisplayed = !!alerts.length;

  const {
    loadingActions,
    loadingGroups,
    loadingBillingDate,
    loadingInitial,
    dispatchInitial,
    dispatchInsights,
    dispatchNone,
    dispatchReset,
  } = useLoading(mapLoadingToProps);

  /* eslint-disable react-hooks/exhaustive-deps */
  // The dispatchLoading functions are derived from loading state using mapLoadingToProps, to
  // provide nicer props for the component. These are re-derived whenever loading state changes,
  // which causes an infinite loop as product panels load and re-trigger the useEffect below.
  // Since the functions don't change, we can memoize - but we trigger the same loop if we satisfy
  // exhaustive-deps by including the function itself in dependencies.

  const dispatchLoadingInitial = useCallback(dispatchInitial, []);
  const dispatchLoadingInsights = useCallback(dispatchInsights, []);
  const dispatchLoadingNone = useCallback(dispatchNone, []);
  const dispatchLoadingReset = useCallback(dispatchReset, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const setProject = (project: Maybe<string>) =>
    setPageFilters({
      ...pageFilters,
      project: project === 'all' ? null : project,
    });

  useEffect(() => {
    async function getInsights() {
      setError(null);
      try {
        if (pageFilters.group) {
          dispatchLoadingInsights(true);
          const intervals = intervalsOf(
            pageFilters.duration,
            lastCompleteBillingDate,
          );
          const [
            fetchedProjects,
            fetchedAlerts,
            fetchedMetricData,
            fetchedDailyCost,
          ] = await Promise.all([
            client.getGroupProjects(pageFilters.group),
            client.getAlerts(pageFilters.group),
            pageFilters.metric
              ? client.getDailyMetricData(pageFilters.metric, intervals)
              : null,
            pageFilters.project
              ? client.getProjectDailyCost(pageFilters.project, intervals)
              : client.getGroupDailyCost(pageFilters.group, intervals),
          ]);
          setProjects(fetchedProjects);
          setAlerts(fetchedAlerts);
          setMetricData(fetchedMetricData);
          setDailyCost(fetchedDailyCost);
        } else {
          dispatchLoadingNone(loadingActions);
        }
      } catch (e) {
        setError(e);
        dispatchLoadingNone(loadingActions);
      } finally {
        dispatchLoadingInitial(false);
        dispatchLoadingInsights(false);
      }
    }

    // Wait for metadata to finish loading
    if (!(loadingGroups && loadingBillingDate)) {
      getInsights();
    }
  }, [
    client,
    pageFilters,
    loadingActions,
    loadingGroups,
    loadingBillingDate,
    dispatchLoadingInsights,
    dispatchLoadingInitial,
    dispatchLoadingNone,
    lastCompleteBillingDate,
  ]);

  if (loadingInitial) {
    return <Progress />;
  }

  if (error) {
    return <MaterialAlert severity="error">{error.message}</MaterialAlert>;
  }

  // Loaded but no groups found for the user
  if (!pageFilters.group) {
    return (
      <CostInsightsLayout groups={groups}>
        <Box textAlign="right">
          <CopyUrlToClipboard />
          {/* <CostInsightsSupportButton /> */}
        </Box>
        <Container maxWidth="lg">
          <CostInsightsHeaderNoGroups />
        </Container>
        <Divider />
        <Container maxWidth="lg">
          <WhyCostsMatter />
        </Container>
      </CostInsightsLayout>
    );
  }

  if (!dailyCost) {
    return (
      <MaterialAlert severity="error">{`Error: Could not fetch cost insights data for team ${pageFilters.group}`}</MaterialAlert>
    );
  }

  const onProjectSelect = (project: Maybe<string>) => {
    setProject(project);
    dispatchLoadingReset(loadingActions);
  };

  const CostOverviewBanner = () => (
    <Box
      px={3}
      pt={6}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      minHeight={40}
    >
      <Box>
        <Typography variant="h4">Cost Overview</Typography>
        <Typography classes={classes}>
          Billing data as of {lastCompleteBillingDate}
        </Typography>
      </Box>
      <Box display="flex">
        <Box mr={1}>
          <CurrencySelect
            currency={currency}
            currencies={config.currencies}
            onSelect={setCurrency}
          />
        </Box>
        <ProjectSelect
          project={pageFilters.project}
          projects={projects || []}
          onSelect={onProjectSelect}
        />
      </Box>
    </Box>
  );

  return (
    <CostInsightsLayout groups={groups}>
      <Grid container wrap="nowrap">
        <Grid item>
          <Box position="sticky" top={20}>
            <CostInsightsNavigation
              products={products}
              alerts={active.length}
            />
          </Box>
        </Grid>
        <Grid item xs>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            mb={2}
          >
            <CopyUrlToClipboard />
            {/* <CostInsightsSupportButton /> */}
          </Box>
          <Container maxWidth="lg" disableGutters>
            <Grid container direction="column">
              <Grid item xs>
                <CostInsightsHeader
                  owner={pageFilters.group}
                  groups={groups}
                  hasCostData={!!dailyCost.aggregation.length}
                  alerts={active.length}
                />
              </Grid>
              <Collapse in={isActionItemsDisplayed} enter={false}>
                <Grid item xs>
                  <Box px={3} py={6}>
                    <ActionItems
                      active={active}
                      snoozed={snoozed}
                      accepted={accepted}
                      dismissed={dismissed}
                    />
                  </Box>
                </Grid>
                <Divider />
              </Collapse>
              <Grid item xs>
                <CostOverviewBanner />
              </Grid>
              <Grid item xs>
                <Box px={3} py={6}>
                  {!!dailyCost.aggregation.length && (
                    <CostOverviewCard
                      dailyCostData={dailyCost}
                      metricData={metricData}
                    />
                  )}
                  <WhyCostsMatter />
                </Box>
              </Grid>
              <Collapse in={isAlertInsightsDisplayed} enter={false}>
                <Grid item xs>
                  <Box px={6} py={6} mx={-3} bgcolor="alertBackground">
                    <AlertInsights
                      group={pageFilters.group}
                      active={active}
                      snoozed={snoozed}
                      accepted={accepted}
                      dismissed={dismissed}
                      onChange={setAlerts}
                    />
                  </Box>
                </Grid>
              </Collapse>
              {!isAlertInsightsDisplayed && <Divider />}
              <Grid item xs>
                <Box px={3} py={6}>
                  <ProductInsights
                    group={pageFilters.group}
                    project={pageFilters.project}
                    products={config.products}
                    onLoaded={setProducts}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </CostInsightsLayout>
  );
};
