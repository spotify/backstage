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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { ilertApiRef } from '../../api';
import { AlertSource } from '../../types';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

export const ILertCardMaintenanceModal = ({
  alertSource,
  refetchAlertSource,
  isModalOpened,
  setIsModalOpened,
}: {
  alertSource: AlertSource | null;
  refetchAlertSource: () => void;
  isModalOpened: boolean;
  setIsModalOpened: (isModalOpened: boolean) => void;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const [minutes, setMinutes] = React.useState(5);

  const handleClose = () => {
    setIsModalOpened(false);
  };

  const handleImmediateMaintenance = () => {
    if (!alertSource) {
      return;
    }
    setIsModalOpened(false);
    setTimeout(async () => {
      try {
        await ilertApi.addImmediateMaintenance(alertSource.id, minutes);
        alertApi.post({ message: 'Maintenance started.' });
        refetchAlertSource();
      } catch (err) {
        alertApi.post({ message: err, severity: 'error' });
      }
    }, 250);
  };

  const handleMinutesChange = (event: any) => {
    setMinutes(event.target.value);
  };

  const minuteOptions = [
    {
      value: 5,
      label: '5 minutes',
    },
    {
      value: 10,
      label: '10 minutes',
    },
    {
      value: 15,
      label: '15 minutes',
    },
    {
      value: 30,
      label: '30 minutes',
    },
    {
      value: 60,
      label: '60 minutes',
    },
  ];

  if (!alertSource) {
    return null;
  }

  return (
    <Dialog
      open={isModalOpened}
      onClose={handleClose}
      aria-labelledby="maintenance-form-title"
    >
      <DialogTitle id="maintenance-form-title">
        New maintenance window
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Keep your alert sources quiet, when your systems are under
          maintenance.
        </DialogContentText>
        <TextField
          select
          label="Duration"
          value={minutes}
          onChange={handleMinutesChange}
          variant="outlined"
          fullWidth
        >
          {minuteOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleImmediateMaintenance}
          color="primary"
          variant="contained"
        >
          Create
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
