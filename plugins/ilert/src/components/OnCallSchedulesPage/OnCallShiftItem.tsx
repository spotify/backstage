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
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RepeatIcon from '@material-ui/icons/Repeat';
import { Shift } from '../../types';
import { DateTime as dt } from 'luxon';
import { makeStyles } from '@material-ui/core/styles';
import { ShiftOverrideModal } from '../Shift/ShiftOverrideModal';

const useStyles = makeStyles({
  button: {
    marginTop: 4,
    padding: 0,
    lineHeight: 1.8,
    '& span': {
      lineHeight: 1.8,
      fontSize: '0.65rem',
    },
    '& svg': {
      fontSize: '0.85rem !important',
    },
  },
});

export const OnCallShiftItem = ({
  scheduleId,
  shift,
  refetchOnCallSchedules,
}: {
  scheduleId: number;
  shift: Shift;
  refetchOnCallSchedules: () => void;
}) => {
  const classes = useStyles();
  const [isModalOpened, setIsModalOpened] = React.useState(false);

  const handleOverride = () => {
    setIsModalOpened(true);
  };

  if (!shift || !shift.start) {
    return (
      <Grid container spacing={0}>
        <Grid item sm={12}>
          <Typography variant="subtitle1" color="textSecondary">
            Nobody
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={0}>
      {shift && shift.user ? (
        <Grid item sm={12}>
          <Typography variant="subtitle1" noWrap>
            {`${shift.user.firstName} ${shift.user.lastName} (${shift.user.username})`}
          </Typography>
        </Grid>
      ) : null}
      <Grid item sm={12}>
        <Typography variant="subtitle2" color="textSecondary">
          {`${dt.fromISO(shift.start).toFormat('D MMM, HH:mm')} - ${dt
            .fromISO(shift.end)
            .toFormat('D MMM, HH:mm')}`}
        </Typography>
      </Grid>
      <Grid item sm={12}>
        <Button
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<RepeatIcon />}
          onClick={handleOverride}
        >
          <Typography variant="overline">Override shift</Typography>
        </Button>
        <ShiftOverrideModal
          scheduleId={scheduleId}
          shift={shift}
          refetchOnCallSchedules={refetchOnCallSchedules}
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
        />
      </Grid>
    </Grid>
  );
};
