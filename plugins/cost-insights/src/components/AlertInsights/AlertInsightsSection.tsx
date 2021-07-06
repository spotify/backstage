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
import { Box, Button } from '@material-ui/core';
import { default as SnoozeIcon } from '@material-ui/icons/AccessTime';
import { default as AcceptIcon } from '@material-ui/icons/Check';
import { default as DismissIcon } from '@material-ui/icons/Delete';
import { AlertInsightsSectionHeader } from './AlertInsightsSectionHeader';
import { Alert } from '../../types';
import {
  isSnoozeEnabled,
  isAcceptEnabled,
  isDismissEnabled,
} from '../../utils/alerts';

type AlertInsightsSectionProps = {
  alert: Alert;
  number: number;
  onSnooze: (alert: Alert) => void;
  onAccept: (alert: Alert) => void;
  onDismiss: (alert: Alert) => void;
};

export const AlertInsightsSection = ({
  alert,
  number,
  onSnooze,
  onAccept,
  onDismiss,
}: AlertInsightsSectionProps) => {
  const isSnoozeButtonDisplayed = isSnoozeEnabled(alert);
  const isAcceptButtonDisplayed = isAcceptEnabled(alert);
  const isDismissButtonDisplayed = isDismissEnabled(alert);
  const isButtonGroupDisplayed =
    isSnoozeButtonDisplayed ||
    isAcceptButtonDisplayed ||
    isDismissButtonDisplayed;

  return (
    <Box display="flex" flexDirection="column" mb={6}>
      <AlertInsightsSectionHeader alert={alert} number={number} />
      {isButtonGroupDisplayed && (
        <Box display="flex" alignItems="center" mb={4}>
          {isAcceptButtonDisplayed && (
            <Box mr={1}>
              <Button
                color="primary"
                variant="contained"
                aria-label="accept"
                onClick={() => onAccept(alert)}
                startIcon={<AcceptIcon />}
              >
                Accept
              </Button>
            </Box>
          )}
          {isSnoozeButtonDisplayed && (
            <Box mr={1}>
              <Button
                color="default"
                variant="outlined"
                aria-label="snooze"
                disableElevation
                onClick={() => onSnooze(alert)}
                startIcon={<SnoozeIcon />}
              >
                Snooze
              </Button>
            </Box>
          )}
          {isDismissButtonDisplayed && (
            <Button
              color="secondary"
              variant="outlined"
              aria-label="dismiss"
              disableElevation
              onClick={() => onDismiss(alert)}
              startIcon={<DismissIcon />}
            >
              Dismiss
            </Button>
          )}
        </Box>
      )}
      {alert.element}
    </Box>
  );
};
