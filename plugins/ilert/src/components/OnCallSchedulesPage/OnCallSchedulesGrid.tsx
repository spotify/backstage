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
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { Schedule } from '../../types';
import { ilertApiRef } from '../../api';
import { OnCallShiftItem } from './OnCallShiftItem';

import { useApi } from '@backstage/core-plugin-api';
import { ItemCardGrid, Progress, Link } from '@backstage/core-components';

const useStyles = makeStyles(() => ({
  card: {
    margin: 16,
    width: 'calc(100% - 32px)',
  },

  cardHeader: {
    maxWidth: '100%',
  },

  cardContent: {
    marginLeft: 80,
    borderLeft: '1px #808289 solid',
    position: 'relative',
  },

  indicatorNext: {
    position: 'absolute',
    top: 'calc(40% - 10px)',
    left: -6,
    width: 12,
    height: 12,
    background: '#92949c !important',
    borderRadius: '50%',
  },

  indicatorCurrent: {
    position: 'absolute',
    top: 'calc(40% - 10px)',
    left: -6,
    width: 12,
    height: 12,
    background: '#ffb74d !important',
    color: '#ffb74d !important',
    borderRadius: '50%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },

  beforeText: {
    position: 'absolute',
    top: 'calc(31% - 10px)',
    left: -78,
    width: 65,
    height: 20,
    textAlign: 'center',
    color: '#808289',
  },

  marginBottom: {
    marginBottom: 16,
  },

  link: {
    fontSize: '1.5rem',
    fontWeight: 700,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    display: 'block',
  },
}));

export const OnCallSchedulesGrid = ({
  onCallSchedules,
  isLoading,
  refetchOnCallSchedules,
}: {
  onCallSchedules: Schedule[];
  isLoading: boolean;
  refetchOnCallSchedules: () => void;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles();

  if (isLoading) {
    return <Progress />;
  }
  return (
    <ItemCardGrid data-testid="docs-explore">
      {!onCallSchedules?.length
        ? null
        : onCallSchedules.map((schedule, index) => (
            <Card key={index}>
              <CardHeader
                classes={{ content: classes.cardHeader }}
                title={
                  <Link
                    to={ilertApi.getScheduleDetailsURL(schedule)}
                    className={classes.link}
                  >
                    {schedule.name}
                  </Link>
                }
              />

              <CardContent className={classes.cardContent}>
                <div className={classes.indicatorCurrent} />
                <OnCallShiftItem
                  shift={schedule.currentShift}
                  scheduleId={schedule.id}
                  refetchOnCallSchedules={refetchOnCallSchedules}
                />
                <Typography className={classes.beforeText} variant="body2">
                  On call now
                </Typography>
              </CardContent>

              <CardContent
                className={`${classes.cardContent} ${classes.marginBottom}`}
              >
                <div className={classes.indicatorNext} />
                <OnCallShiftItem
                  shift={schedule.nextShift}
                  scheduleId={schedule.id}
                  refetchOnCallSchedules={refetchOnCallSchedules}
                />
                <Typography className={classes.beforeText} variant="body2">
                  Next on call
                </Typography>
              </CardContent>
            </Card>
          ))}
    </ItemCardGrid>
  );
};
