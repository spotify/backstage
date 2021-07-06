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
import pluralize from 'pluralize';
import { Box, Grid, Snackbar } from '@material-ui/core';
import { default as MuiAlert } from '@material-ui/lab/Alert';
import { AlertDialog } from './AlertDialog';
import { AlertStatusSummary } from './AlertStatusSummary';
import { AlertStatusSummaryButton } from './AlertStatusSummaryButton';
import { AlertInsightsHeader } from './AlertInsightsHeader';
import { AlertInsightsSection } from './AlertInsightsSection';
import {
  useScroll,
  useLoading,
  ScrollType,
  MapLoadingToProps,
} from '../../hooks';
import { DefaultLoadingAction } from '../../utils/loading';
import { Alert, AlertOptions, AlertStatus, Maybe } from '../../types';
import {
  isStatusSnoozed,
  isStatusAccepted,
  isStatusDismissed,
  sumOfAllAlerts,
} from '../../utils/alerts';
import { ScrollAnchor } from '../../utils/scroll';

type MapLoadingtoAlerts = (isLoading: boolean) => void;

const mapLoadingToAlerts: MapLoadingToProps<MapLoadingtoAlerts> = ({
  dispatch,
}) => (isLoading: boolean) =>
  dispatch({ [DefaultLoadingAction.CostInsightsAlerts]: isLoading });

type AlertInsightsProps = {
  group: string;
  active: Alert[];
  snoozed: Alert[];
  accepted: Alert[];
  dismissed: Alert[];
  onChange: (alerts: Alert[]) => void;
};

export const AlertInsights = ({
  group,
  active,
  snoozed,
  accepted,
  dismissed,
  onChange,
}: AlertInsightsProps) => {
  const [scroll] = useScroll();
  const [alert, setAlert] = useState<Maybe<Alert>>(null);
  const dispatchLoadingAlerts = useLoading(mapLoadingToAlerts);
  const [status, setStatus] = useState<Maybe<AlertStatus>>(null);
  // Allow users to pass null values for data.
  const [data, setData] = useState<Maybe<any>>(undefined);
  const [error, setError] = useState<Maybe<Error>>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    async function callAlertHook(
      options: AlertOptions,
      callback: (options: AlertOptions) => Promise<Alert[]>,
    ) {
      setAlert(null);
      setStatus(null);
      setData(undefined);
      setDialogOpen(false);
      dispatchLoadingAlerts(true);
      try {
        const alerts: Alert[] = await callback(options);
        onChange(alerts);
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingAlerts(false);
      }
    }

    const options: AlertOptions = { data, group };
    const onSnoozed = alert?.onSnoozed?.bind(alert);
    const onAccepted = alert?.onAccepted?.bind(alert);
    const onDismissed = alert?.onDismissed?.bind(alert);

    if (data !== undefined) {
      if (isStatusSnoozed(status) && onSnoozed) {
        callAlertHook(options, onSnoozed);
      } else if (isStatusAccepted(status) && onAccepted) {
        callAlertHook(options, onAccepted);
      } else if (isStatusDismissed(status) && onDismissed) {
        callAlertHook(options, onDismissed);
      }
    }
  }, [group, data, alert, status, onChange, dispatchLoadingAlerts]);

  useEffect(() => {
    if (scroll === ScrollType.AlertSummary) {
      setSummaryOpen(true);
    }
  }, [scroll]);

  useEffect(() => {
    setDialogOpen(!!status);
  }, [status]);

  useEffect(() => {
    setSnackbarOpen(!!error);
  }, [error]);

  function onSnooze(alertToSnooze: Alert) {
    setAlert(alertToSnooze);
    setStatus(AlertStatus.Snoozed);
  }

  function onAccept(alertToAccept: Alert) {
    setAlert(alertToAccept);
    setStatus(AlertStatus.Accepted);
  }

  function onDismiss(alertToDismiss: Alert) {
    setAlert(alertToDismiss);
    setStatus(AlertStatus.Dismissed);
  }

  function onSnackbarClose() {
    setError(null);
  }

  function onDialogClose() {
    setAlert(null);
    setStatus(null);
  }

  function onDialogFormSubmit(formData: any) {
    setData(formData);
  }

  function onSummaryButtonClick() {
    setSummaryOpen(prevOpen => !prevOpen);
  }

  const total = [accepted, snoozed, dismissed].reduce(sumOfAllAlerts, 0);

  const isAlertStatusSummaryDisplayed = !!total;
  const isAlertInsightSectionDisplayed = !!active.length;

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <AlertInsightsHeader
          title="Your team's action items"
          subtitle={
            isAlertInsightSectionDisplayed
              ? 'This section outlines suggested action items your team can address to improve cloud costs.'
              : "All of your team's action items are hidden. Maybe it's time to give them another look?"
          }
        />
      </Grid>
      {isAlertInsightSectionDisplayed && (
        <Grid item container direction="column" spacing={4}>
          {active.map((activeAlert, index) => (
            <Grid item key={`alert-insights-section-${index}`}>
              <AlertInsightsSection
                alert={activeAlert}
                number={index + 1}
                onSnooze={onSnooze}
                onAccept={onAccept}
                onDismiss={onDismiss}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {isAlertStatusSummaryDisplayed && (
        <Grid item>
          <Box position="relative" display="flex" justifyContent="flex-end">
            <ScrollAnchor id={ScrollType.AlertSummary} />
            <AlertStatusSummaryButton onClick={onSummaryButtonClick}>
              {pluralize('Hidden Action Item', total)}
            </AlertStatusSummaryButton>
          </Box>
          <AlertStatusSummary
            open={isSummaryOpen}
            snoozed={snoozed}
            accepted={accepted}
            dismissed={dismissed}
          />
        </Grid>
      )}
      <AlertDialog
        group={group}
        open={isDialogOpen}
        alert={alert}
        status={status}
        onClose={onDialogClose}
        onSubmit={onDialogFormSubmit}
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6_000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={onSnackbarClose}
      >
        <MuiAlert onClose={onSnackbarClose} severity="error">
          {error?.message}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};
