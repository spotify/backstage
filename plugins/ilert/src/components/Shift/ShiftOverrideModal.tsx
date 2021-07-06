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
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Typography } from '@material-ui/core';
import { ilertApiRef } from '../../api';
import { useShiftOverride } from '../../hooks/useShiftOverride';
import { Shift } from '../../types';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  optionWrapper: {
    display: 'flex',
    width: '100%',
  },
  sourceImage: {
    height: 22,
    paddingRight: 4,
  },
  grow: {
    flexGrow: 1,
  },
}));

export const ShiftOverrideModal = ({
  scheduleId,
  shift,
  refetchOnCallSchedules,
  isModalOpened,
  setIsModalOpened,
}: {
  scheduleId: number;
  shift: Shift;
  refetchOnCallSchedules: () => void;
  isModalOpened: boolean;
  setIsModalOpened: (isModalOpened: boolean) => void;
}) => {
  const [
    { isLoading, users, user, start, end },
    { setUser, setStart, setEnd, setIsLoading },
  ] = useShiftOverride(shift, isModalOpened);
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const classes = useStyles();

  const handleClose = () => {
    setIsModalOpened(false);
  };

  const handleOverride = () => {
    if (!shift || !shift.user) {
      return;
    }
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const success = await ilertApi.overrideShift(
          scheduleId,
          user.id,
          start,
          end,
        );
        if (success) {
          alertApi.post({ message: 'Shift overridden.' });
          refetchOnCallSchedules();
        }
      } catch (err) {
        alertApi.post({ message: err, severity: 'error' });
      }
      setIsModalOpened(false);
    }, 250);
  };

  if (!shift) {
    return null;
  }

  return (
    <Dialog
      open={isModalOpened}
      onClose={handleClose}
      aria-labelledby="override-shift-form-title"
    >
      <DialogTitle id="override-shift-form-title">Shift override</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
          <Autocomplete
            disabled={isLoading}
            options={users}
            value={user}
            classes={{
              root: classes.formControl,
              option: classes.option,
            }}
            onChange={(_event: any, newValue: any) => {
              setUser(newValue);
            }}
            autoHighlight
            getOptionLabel={a => ilertApi.getUserInitials(a)}
            renderOption={a => (
              <div className={classes.optionWrapper}>
                <Typography noWrap>{ilertApi.getUserInitials(a)}</Typography>
              </div>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label="User"
                variant="outlined"
                fullWidth
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
          <DateTimePicker
            label="Start"
            inputVariant="outlined"
            fullWidth
            margin="normal"
            ampm={false}
            value={start}
            className={classes.formControl}
            onChange={date => {
              setStart(date ? date.toISO() : '');
            }}
          />
          <DateTimePicker
            label="End"
            inputVariant="outlined"
            fullWidth
            margin="normal"
            ampm={false}
            value={end}
            className={classes.formControl}
            onChange={date => {
              setEnd(date ? date.toISO() : '');
            }}
          />
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isLoading}
          onClick={handleOverride}
          color="primary"
          variant="contained"
        >
          Override
        </Button>
        <Button disabled={isLoading} onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
