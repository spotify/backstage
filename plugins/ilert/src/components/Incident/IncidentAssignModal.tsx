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
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAssignIncident } from '../../hooks/useAssignIncident';
import { Typography } from '@material-ui/core';
import { ilertApiRef } from '../../api';
import { Incident } from '../../types';
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
}));

export const IncidentAssignModal = ({
  incident,
  isModalOpened,
  setIsModalOpened,
  onIncidentChanged,
}: {
  incident: Incident | null;
  isModalOpened: boolean;
  setIsModalOpened: (open: boolean) => void;
  onIncidentChanged?: (incident: Incident) => void;
}) => {
  const [
    { incidentRespondersList, incidentResponder, isLoading },
    { setIsLoading, setIncidentResponder, setIncidentRespondersList },
  ] = useAssignIncident(incident, isModalOpened);
  const callback = onIncidentChanged || ((_: Incident): void => {});
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const classes = useStyles();

  const handleClose = () => {
    setIncidentRespondersList([]);
    setIsModalOpened(false);
  };

  const handleAssign = () => {
    if (!incident || !incidentResponder) {
      return;
    }
    setIsLoading(true);
    setIncidentRespondersList([]);
    setTimeout(async () => {
      try {
        const newIncident = await ilertApi.assignIncident(
          incident,
          incidentResponder,
        );
        callback(newIncident);
        alertApi.post({ message: 'Incident assigned.' });
      } catch (err) {
        alertApi.post({ message: err, severity: 'error' });
      }
      setIsLoading(false);
      setIsModalOpened(false);
    }, 250);
  };

  const canAssign = !!incidentResponder;

  return (
    <Dialog
      open={isModalOpened}
      onClose={handleClose}
      aria-labelledby="assign-incident-form-title"
    >
      <DialogTitle id="assign-incident-form-title">
        Select responder to assign
      </DialogTitle>
      <DialogContent>
        <Alert severity="info">
          <Typography variant="body1" gutterBottom align="justify">
            This action will assign the incident to the selected responder.
          </Typography>
        </Alert>
        <Autocomplete
          disabled={isLoading}
          options={incidentRespondersList}
          value={incidentResponder}
          classes={{
            root: classes.formControl,
            option: classes.option,
          }}
          onChange={(_event: any, newValue: any) => {
            setIncidentResponder(newValue);
          }}
          autoHighlight
          groupBy={option => {
            switch (option.group) {
              case 'SUGGESTED':
                return 'Suggested responders';
              case 'USER':
                return 'Users';
              case 'ESCALATION_POLICY':
                return 'Escalation policies';
              case 'ON_CALL_SCHEDULE':
                return 'Schedules';
              default:
                return '';
            }
          }}
          getOptionLabel={a => a.name}
          renderOption={a => (
            <div className={classes.optionWrapper}>
              <Typography noWrap>{a.name}</Typography>
            </div>
          )}
          renderInput={params => (
            <TextField
              {...params}
              label="Responder"
              variant="outlined"
              margin="normal"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password', // disable autocomplete and autofill
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!canAssign}
          onClick={handleAssign}
          color="primary"
          variant="contained"
        >
          Assign
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
