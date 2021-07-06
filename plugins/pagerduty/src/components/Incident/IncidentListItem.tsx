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
import {
  ListItem,
  ListItemSecondaryAction,
  Tooltip,
  ListItemText,
  makeStyles,
  IconButton,
  Link,
  Typography,
  Chip,
} from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Warning from '@material-ui/icons/Warning';
import { DateTime, Duration } from 'luxon';
import { Incident } from '../types';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  denseListIcon: {
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemPrimary: {
    fontWeight: 'bold',
  },
  warning: {
    borderColor: theme.palette.status.warning,
    color: theme.palette.status.warning,
    '& *': {
      color: theme.palette.status.warning,
    },
  },
  error: {
    borderColor: theme.palette.status.error,
    color: theme.palette.status.error,
    '& *': {
      color: theme.palette.status.error,
    },
  },
}));

type Props = {
  incident: Incident;
};

export const IncidentListItem = ({ incident }: Props) => {
  const classes = useStyles();
  const duration =
    new Date().getTime() - new Date(incident.created_at).getTime();
  const createdAt = DateTime.local()
    .minus(Duration.fromMillis(duration))
    .toRelative({ locale: 'en' });
  const user = incident.assignments[0]?.assignee;

  return (
    <ListItem dense key={incident.id}>
      <ListItemText
        primary={
          <>
            <Chip
              data-testid={`chip-${incident.status}`}
              label={incident.status}
              size="small"
              variant="outlined"
              icon={incident.status === 'acknowledged' ? <Done /> : <Warning />}
              className={
                incident.status === 'triggered'
                  ? classes.error
                  : classes.warning
              }
            />
            {incident.title}
          </>
        }
        primaryTypographyProps={{
          variant: 'body1',
          className: classes.listItemPrimary,
        }}
        secondary={
          <Typography noWrap variant="body2" color="textSecondary">
            Created {createdAt} and assigned to{' '}
            <Link
              href={user?.html_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user?.summary ?? 'nobody'}
            </Link>
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="View in PagerDuty" placement="top">
          <IconButton
            href={incident.html_url}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            <OpenInBrowserIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
