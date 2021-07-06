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

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  DialogContent,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  createStyles,
  makeStyles,
  Theme,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { useAsyncFn } from 'react-use';
import { splunkOnCallApiRef } from '../../api';
import { Alert } from '@material-ui/lab';
import { TriggerAlarmRequest } from '../../api/types';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';

type Props = {
  team: string;
  showDialog: boolean;
  handleDialog: () => void;
  onIncidentCreated: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    formControl: {
      margin: theme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: `calc(100% - ${theme.spacing(2)}px)`,
    },
    formHeader: {
      width: '50%',
    },
    incidentType: {
      width: '90%',
    },
    targets: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
  }),
);

export const TriggerDialog = ({
  team,
  showDialog,
  handleDialog,
  onIncidentCreated: onIncidentCreated,
}: Props) => {
  const alertApi = useApi(alertApiRef);
  const api = useApi(splunkOnCallApiRef);
  const classes = useStyles();

  const [incidentType, setIncidentType] = useState<string>('');
  const [incidentId, setIncidentId] = useState<string>();
  const [incidentDisplayName, setIncidentDisplayName] = useState<string>('');
  const [incidentMessage, setIncidentMessage] = useState<string>('');
  const [incidentStartTime, setIncidentStartTime] = useState<number>();

  const [
    { value, loading: triggerLoading, error: triggerError },
    handleTriggerAlarm,
  ] = useAsyncFn(
    async (params: TriggerAlarmRequest) => await api.incidentAction(params),
  );

  const handleIncidentType = (event: React.ChangeEvent<{ value: unknown }>) => {
    setIncidentType(event.target.value as string);
  };

  const handleIncidentId = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIncidentId(event.target.value as string);
  };

  const handleIncidentDisplayName = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setIncidentDisplayName(event.target.value);
  };

  const handleIncidentMessage = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setIncidentMessage(event.target.value);
  };

  const handleIncidentStartTime = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const dateTime = new Date(event.target.value).getTime();
    const dateTimeInSeconds = Math.floor(dateTime / 1000);
    setIncidentStartTime(dateTimeInSeconds);
  };

  useEffect(() => {
    if (value) {
      alertApi.post({
        message: `Alarm successfully triggered`,
      });
      onIncidentCreated();
      handleDialog();
    }
  }, [value, alertApi, handleDialog, onIncidentCreated]);

  if (triggerError) {
    alertApi.post({
      message: `Failed to trigger alarm. ${triggerError.message}`,
      severity: 'error',
    });
  }

  return (
    <Dialog maxWidth="md" open={showDialog} onClose={handleDialog} fullWidth>
      <DialogTitle>This action will trigger an incident</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom align="justify">
          Created by: <b>{`{ REST } Endpoint`}</b>
        </Typography>
        <Alert severity="info">
          <Typography variant="body1" align="justify">
            If the issue you are seeing does not need urgent attention, please
            get in touch with the responsible team using their preferred
            communications channel. You can find information about the owner of
            this entity in the "About" card. If the issue is urgent, please
            don't hesitate to trigger the alert.
          </Typography>
        </Alert>
        <Typography
          variant="body1"
          style={{ marginTop: '1em' }}
          gutterBottom
          align="justify"
        >
          Please describe the problem you want to report. Be as descriptive as
          possible. <br />
          Note that only the <b>Incident type</b>, <b>Incident display name</b>{' '}
          and the <b>Incident message</b> fields are <b>required</b>.
        </Typography>
        <FormControl className={classes.formControl}>
          <div className={classes.formHeader}>
            <InputLabel id="demo-simple-select-label">Incident type</InputLabel>
            <Select
              id="incident-type"
              className={classes.incidentType}
              value={incidentType}
              onChange={handleIncidentType}
              inputProps={{ 'data-testid': 'trigger-incident-type' }}
            >
              <MenuItem value="CRITICAL">Critical</MenuItem>
              <MenuItem value="WARNING">Warning</MenuItem>
              <MenuItem value="INFO">Info</MenuItem>
            </Select>
          </div>
          <TextField
            className={classes.formHeader}
            id="datetime-local"
            label="Incident start time"
            type="datetime-local"
            onChange={handleIncidentStartTime}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <TextField
          inputProps={{ 'data-testid': 'trigger-incident-id' }}
          id="summary"
          fullWidth
          margin="normal"
          label="Incident id"
          variant="outlined"
          onChange={handleIncidentId}
        />
        <TextField
          required
          inputProps={{ 'data-testid': 'trigger-incident-displayName' }}
          id="summary"
          fullWidth
          margin="normal"
          label="Incident display name"
          variant="outlined"
          onChange={handleIncidentDisplayName}
        />
        <TextField
          required
          inputProps={{ 'data-testid': 'trigger-incident-message' }}
          id="details"
          multiline
          fullWidth
          rows="2"
          margin="normal"
          label="Incident message"
          variant="outlined"
          onChange={handleIncidentMessage}
        />
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="trigger-button"
          id="trigger"
          color="secondary"
          disabled={
            !incidentType.length ||
            !incidentDisplayName ||
            !incidentMessage ||
            triggerLoading
          }
          variant="contained"
          onClick={() =>
            handleTriggerAlarm({
              routingKey: team,
              incidentType,
              incidentDisplayName,
              incidentMessage,
              ...(incidentId ? { incidentId } : {}),
              ...(incidentStartTime ? { incidentStartTime } : {}),
            } as TriggerAlarmRequest)
          }
          endIcon={triggerLoading && <CircularProgress size={16} />}
        >
          Trigger Incident
        </Button>
        <Button id="close" color="primary" onClick={handleDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
