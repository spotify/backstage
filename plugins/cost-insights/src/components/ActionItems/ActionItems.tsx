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
import React, { Fragment, MouseEventHandler } from 'react';
import {
  Avatar,
  Badge,
  Box,
  IconButtonProps,
  IconButton,
  Paper,
  Divider,
  Tooltip,
} from '@material-ui/core';
import { default as SnoozeIcon } from '@material-ui/icons/AccessTime';
import { default as AcceptIcon } from '@material-ui/icons/Check';
import { default as DismissIcon } from '@material-ui/icons/Delete';
import { ActionItemCard } from './ActionItemCard';
import { Alert, AlertStatus } from '../../types';
import { useScroll, ScrollType } from '../../hooks';
import { useActionItemCardStyles as useStyles } from '../../utils/styles';

type AlertStatusButtonProps = {
  title: string;
  amount: number;
  icon: JSX.Element;
  onClick: MouseEventHandler;
} & IconButtonProps;

const AlertStatusButton = ({
  title,
  amount,
  icon,
  onClick,
  ...buttonProps
}: AlertStatusButtonProps) => (
  <Tooltip title={title}>
    <IconButton
      onClick={onClick}
      role="button"
      aria-hidden={false}
      {...buttonProps}
    >
      <Badge badgeContent={amount}>{icon}</Badge>
    </IconButton>
  </Tooltip>
);

type ActionItemsProps = {
  active: Alert[];
  snoozed: Alert[];
  accepted: Alert[];
  dismissed: Alert[];
};

export const ActionItems = ({
  active,
  snoozed,
  accepted,
  dismissed,
}: ActionItemsProps) => {
  const classes = useStyles();
  const [, setScroll] = useScroll();

  const isSnoozedButtonDisplayed = !!snoozed.length;
  const isAcceptedButtonDisplayed = !!accepted.length;
  const isDismissedButtonDisplayed = !!dismissed.length;
  const isStatusButtonGroupDisplayed = !!active.length;

  const onStatusButtonClick: MouseEventHandler = () =>
    setScroll(ScrollType.AlertSummary);

  return (
    <>
      <Paper>
        {active.map((alert, index) => (
          <Fragment key={`alert-${index}`}>
            <ActionItemCard
              alert={alert}
              number={index + 1}
              avatar={<Avatar className={classes.avatar}>{index + 1}</Avatar>}
            />
            {index < active.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Paper>
      {isStatusButtonGroupDisplayed && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          {isAcceptedButtonDisplayed && (
            <AlertStatusButton
              title="Accepted"
              aria-label={AlertStatus.Accepted}
              icon={<AcceptIcon />}
              amount={accepted.length}
              onClick={onStatusButtonClick}
            />
          )}
          {isSnoozedButtonDisplayed && (
            <AlertStatusButton
              title="Snoozed"
              aria-label={AlertStatus.Snoozed}
              amount={snoozed.length}
              icon={<SnoozeIcon />}
              onClick={onStatusButtonClick}
            />
          )}
          {isDismissedButtonDisplayed && (
            <AlertStatusButton
              title="Dismissed"
              aria-label={AlertStatus.Dismissed}
              icon={<DismissIcon />}
              amount={dismissed.length}
              onClick={onStatusButtonClick}
            />
          )}
        </Box>
      )}
    </>
  );
};
