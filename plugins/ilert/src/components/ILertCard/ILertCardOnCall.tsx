/*
 * Copyright 2021 The Backstage Authors
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import ReplayIcon from '@material-ui/icons/Replay';
import { makeStyles } from '@material-ui/core/styles';
import { AlertSource } from '../../types';
import { useAlertSourceOnCalls } from '../../hooks/useAlertSourceOnCalls';
import { ILertCardOnCallEmptyState } from './ILertCardOnCallEmptyState';
import { ILertCardOnCallItem } from './ILertCardOnCallItem';
import { Progress } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  repeatText: {
    fontStyle: 'italic',
  },
  repeatIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export const ILertCardOnCall = ({
  alertSource,
}: {
  alertSource: AlertSource | null;
}) => {
  const classes = useStyles();
  const [{ onCalls, isLoading }, {}] = useAlertSourceOnCalls(alertSource);

  if (isLoading) {
    return <Progress />;
  }

  if (!alertSource || !onCalls) {
    return null;
  }

  const repeatInfo = () => {
    if (
      !alertSource ||
      !alertSource.escalationPolicy ||
      !alertSource.escalationPolicy.repeating ||
      !alertSource.escalationPolicy.frequency
    ) {
      return null;
    }

    return (
      <ListItem key="repeat">
        <ListItemIcon>
          <ReplayIcon className={classes.repeatIcon} fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.repeatText}
            >
              {`Repeat ${alertSource.escalationPolicy.frequency} times`}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  if (!onCalls.length) {
    return (
      <List dense subheader={<ListSubheader>ON CALL</ListSubheader>}>
        <ILertCardOnCallEmptyState />
      </List>
    );
  }

  if (onCalls.length === 1) {
    <List dense subheader={<ListSubheader>ON CALL</ListSubheader>}>
      <ILertCardOnCallItem
        onCall={onCalls[0]}
        fistItem={false}
        lastItem={false}
      />
    </List>;
  }

  return (
    <List dense subheader={<ListSubheader>ON CALL</ListSubheader>}>
      {onCalls.map((onCall, index) => (
        <ILertCardOnCallItem
          key={index}
          onCall={onCall}
          fistItem={index === 0}
          lastItem={index === onCalls.length - 1}
        />
      ))}
      {repeatInfo()}
    </List>
  );
};
