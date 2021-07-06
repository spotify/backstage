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

import React, { Fragment } from 'react';
import { Avatar, Box, Collapse, Divider, Tooltip } from '@material-ui/core';
import { default as AcceptIcon } from '@material-ui/icons/Check';
import { default as DismissIcon } from '@material-ui/icons/Delete';
import { default as SnoozeIcon } from '@material-ui/icons/AccessTime';
import { ActionItemCard } from '../ActionItems';
import { Alert, AlertStatus } from '../../types';
import { useActionItemCardStyles as useStyles } from '../../utils/styles';

type AlertGroupProps = {
  alerts: Alert[];
  status: AlertStatus;
  title: string;
  icon: JSX.Element;
};

const AlertGroup = ({ alerts, status, title, icon }: AlertGroupProps) => {
  const classes = useStyles();
  return (
    <Box p={1}>
      {alerts.map((alert, index) => (
        <Fragment key={`alert-${status}-${index}`}>
          <ActionItemCard
            disableScroll
            alert={alert}
            avatar={
              <Tooltip title={title}>
                <Avatar className={classes.avatar}>{icon}</Avatar>
              </Tooltip>
            }
          />
          {index < alerts.length - 1 && <Divider />}
        </Fragment>
      ))}
    </Box>
  );
};

type AlertStatusSummaryProps = {
  open: boolean;
  snoozed: Alert[];
  accepted: Alert[];
  dismissed: Alert[];
};

export const AlertStatusSummary = ({
  open,
  snoozed,
  accepted,
  dismissed,
}: AlertStatusSummaryProps) => {
  const isSnoozedListDisplayed = !!snoozed.length;
  const isAcceptedListDisplayed = !!accepted.length;
  const isDismissedListDisplayed = !!dismissed.length;

  return (
    <Collapse in={open}>
      {isAcceptedListDisplayed && (
        <AlertGroup
          title="Accepted"
          alerts={accepted}
          status={AlertStatus.Accepted}
          icon={
            <AcceptIcon
              role="img"
              aria-hidden={false}
              aria-label={AlertStatus.Accepted}
            />
          }
        />
      )}
      {isSnoozedListDisplayed && (
        <AlertGroup
          title="Snoozed"
          alerts={snoozed}
          status={AlertStatus.Snoozed}
          icon={
            <SnoozeIcon
              role="img"
              aria-hidden={false}
              aria-label={AlertStatus.Snoozed}
            />
          }
        />
      )}
      {isDismissedListDisplayed && (
        <AlertGroup
          title="Dismissed"
          alerts={dismissed}
          status={AlertStatus.Dismissed}
          icon={
            <DismissIcon
              role="img"
              aria-hidden={false}
              aria-label={AlertStatus.Dismissed}
            />
          }
        />
      )}
    </Collapse>
  );
};
