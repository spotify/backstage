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
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ilertApiRef } from '../../api';
import { Incident, IncidentAction } from '../../types';
import { IncidentAssignModal } from './IncidentAssignModal';
import { useIncidentActions } from '../../hooks/useIncidentActions';

import {
  alertApiRef,
  useApi,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { Progress, Link } from '@backstage/core-components';

export const IncidentActionsMenu = ({
  incident,
  onIncidentChanged,
  setIsLoading,
}: {
  incident: Incident;
  onIncidentChanged?: (incident: Incident) => void;
  setIsLoading?: (isLoading: boolean) => void;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const identityApi = useApi(identityApiRef);
  const userName = identityApi.getUserId();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const callback = onIncidentChanged || ((_: Incident): void => {});
  const setProcessing = setIsLoading || ((_: boolean): void => {});
  const [
    isAssignIncidentModalOpened,
    setIsAssignIncidentModalOpened,
  ] = React.useState(false);

  const [{ incidentActions, isLoading }] = useIncidentActions(
    incident,
    Boolean(anchorEl),
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAccept = async (): Promise<void> => {
    try {
      handleCloseMenu();
      setProcessing(true);
      const newIncident = await ilertApi.acceptIncident(incident, userName);
      alertApi.post({ message: 'Incident accepted.' });

      callback(newIncident);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleResolve = async (): Promise<void> => {
    try {
      handleCloseMenu();
      setProcessing(true);
      const newIncident = await ilertApi.resolveIncident(incident, userName);
      alertApi.post({ message: 'Incident resolved.' });

      callback(newIncident);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const handleAssign = () => {
    handleCloseMenu();
    setIsAssignIncidentModalOpened(true);
  };

  const handleTriggerAction = (action: IncidentAction) => async () => {
    try {
      handleCloseMenu();
      setProcessing(true);
      await ilertApi.triggerIncidentAction(incident, action);
      alertApi.post({ message: 'Incident action triggered.' });
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: 'error' });
    }
  };

  const actions: React.ReactNode[] = incidentActions.map(a => {
    const successTrigger = a.history
      ? a.history.find(h => h.success)
      : undefined;
    const triggeredBy =
      successTrigger && successTrigger.actor
        ? `${successTrigger.actor.firstName} ${successTrigger.actor.lastName}`
        : '';
    return (
      <MenuItem
        key={a.webhookId}
        onClick={handleTriggerAction(a)}
        disabled={!!successTrigger}
      >
        <Typography variant="inherit" noWrap>
          {triggeredBy ? `${a.name} (by ${triggeredBy})` : a.name}
        </Typography>
      </MenuItem>
    );
  });

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`incident-actions-menu-${incident.id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: { maxHeight: 48 * 5.5 },
        }}
      >
        {incident.status === 'PENDING' ? (
          <MenuItem key="ack" onClick={handleAccept}>
            <Typography variant="inherit" noWrap>
              Accept
            </Typography>
          </MenuItem>
        ) : null}

        {incident.status !== 'RESOLVED' ? (
          <MenuItem key="close" onClick={handleResolve}>
            <Typography variant="inherit" noWrap>
              Resolve
            </Typography>
          </MenuItem>
        ) : null}

        {incident.status !== 'RESOLVED' ? (
          <MenuItem key="assign" onClick={handleAssign}>
            <Typography variant="inherit" noWrap>
              Assign
            </Typography>
          </MenuItem>
        ) : null}

        {isLoading ? (
          <MenuItem key="loading">
            <Progress style={{ width: '100%' }} />
          </MenuItem>
        ) : (
          actions
        )}

        <MenuItem key="details" onClick={handleCloseMenu}>
          <Typography variant="inherit" noWrap>
            <Link to={ilertApi.getIncidentDetailsURL(incident)}>
              View in iLert
            </Link>
          </Typography>
        </MenuItem>
      </Menu>
      <IncidentAssignModal
        incident={incident}
        setIsModalOpened={setIsAssignIncidentModalOpened}
        isModalOpened={isAssignIncidentModalOpened}
        onIncidentChanged={onIncidentChanged}
      />
    </>
  );
};
