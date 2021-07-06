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

import React, { useEffect } from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  ListItemText,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { DateTime, Duration } from 'luxon';
import { Incident, IncidentPhase } from '../types';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { splunkOnCallApiRef } from '../../api/client';
import { useAsyncFn } from 'react-use';
import { TriggerAlarmRequest } from '../../api/types';

import {
  StatusError,
  StatusWarning,
  StatusOK,
} from '@backstage/core-components';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
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
  listItemIcon: {
    minWidth: '1em',
  },
  secondaryAction: {
    paddingRight: 48,
  },
});

type Props = {
  team: string;
  incident: Incident;
  onIncidentAction: () => void;
};

const IncidentPhaseStatus = ({
  currentPhase,
}: {
  currentPhase: IncidentPhase;
}) => {
  switch (currentPhase) {
    case 'UNACKED':
      return <StatusError />;
    case 'ACKED':
      return <StatusWarning />;
    default:
      return <StatusOK />;
  }
};

const incidentPhaseTooltip = (currentPhase: IncidentPhase) => {
  switch (currentPhase) {
    case 'UNACKED':
      return 'Triggered';
    case 'ACKED':
      return 'Acknowledged';
    default:
      return 'Resolved';
  }
};

const IncidentAction = ({
  currentPhase,
  incidentId,
  resolveAction,
  acknowledgeAction,
}: {
  currentPhase: string;
  incidentId: string;
  resolveAction: (args: TriggerAlarmRequest) => void;
  acknowledgeAction: (args: TriggerAlarmRequest) => void;
}) => {
  switch (currentPhase) {
    case 'UNACKED':
      return (
        <Tooltip title="Aknowledge" placement="top">
          <IconButton
            onClick={() =>
              acknowledgeAction({ incidentId, incidentType: 'ACKNOWLEDGEMENT' })
            }
          >
            <DoneIcon />
          </IconButton>
        </Tooltip>
      );
    case 'ACKED':
      return (
        <Tooltip title="Resolve" placement="top">
          <IconButton
            onClick={() =>
              resolveAction({ incidentId, incidentType: 'RECOVERY' })
            }
          >
            <DoneAllIcon />
          </IconButton>
        </Tooltip>
      );
    default:
      return <></>;
  }
};

export const IncidentListItem = ({
  incident,
  onIncidentAction,
  team,
}: Props) => {
  const classes = useStyles();
  const duration =
    new Date().getTime() - new Date(incident.startTime!).getTime();
  const createdAt = DateTime.local()
    .minus(Duration.fromMillis(duration))
    .toRelative({ locale: 'en' });
  const alertApi = useApi(alertApiRef);
  const api = useApi(splunkOnCallApiRef);

  const hasBeenManuallyTriggered = incident.monitorName?.includes('vouser-');

  const source = () => {
    if (hasBeenManuallyTriggered) {
      return incident.monitorName?.replace('vouser-', '');
    }
    if (incident.monitorType === 'API') {
      return '{ REST }';
    }

    return incident.monitorName;
  };

  const [
    { value: resolveValue, error: resolveError },
    handleResolveIncident,
  ] = useAsyncFn(
    async ({ incidentId, incidentType }: TriggerAlarmRequest) =>
      await api.incidentAction({
        routingKey: team,
        incidentType,
        incidentId,
      }),
  );

  const [
    { value: acknowledgeValue, error: acknowledgeError },
    handleAcknowledgeIncident,
  ] = useAsyncFn(
    async ({ incidentId, incidentType }: TriggerAlarmRequest) =>
      await api.incidentAction({
        routingKey: team,
        incidentType,
        incidentId,
      }),
  );

  useEffect(() => {
    if (acknowledgeValue) {
      alertApi.post({
        message: `Incident successfully acknowledged`,
      });
    }

    if (resolveValue) {
      alertApi.post({
        message: `Incident successfully resolved`,
      });
    }
    if (resolveValue || acknowledgeValue) {
      onIncidentAction();
    }
  }, [acknowledgeValue, resolveValue, alertApi, onIncidentAction]);

  if (acknowledgeError) {
    alertApi.post({
      message: `Failed to acknowledge incident. ${acknowledgeError.message}`,
      severity: 'error',
    });
  }

  if (resolveError) {
    alertApi.post({
      message: `Failed to resolve incident. ${resolveError.message}`,
      severity: 'error',
    });
  }

  return (
    <ListItem dense key={incident.entityId}>
      <ListItemIcon className={classes.listItemIcon}>
        <Tooltip
          title={incidentPhaseTooltip(incident.currentPhase)}
          placement="top"
        >
          <div className={classes.denseListIcon}>
            <IncidentPhaseStatus currentPhase={incident.currentPhase} />
          </div>
        </Tooltip>
      </ListItemIcon>
      <ListItemText
        primary={incident.entityDisplayName}
        primaryTypographyProps={{
          variant: 'body1',
          className: classes.listItemPrimary,
        }}
        secondary={
          <Typography noWrap variant="body2" color="textSecondary">
            #{incident.incidentNumber} - Created {createdAt}{' '}
            {source() && `by ${source()}`}
          </Typography>
        }
      />

      {incident.incidentLink && incident.incidentNumber && (
        <ListItemSecondaryAction>
          <IncidentAction
            currentPhase={incident.currentPhase || ''}
            incidentId={incident.entityId}
            resolveAction={handleResolveIncident}
            acknowledgeAction={handleAcknowledgeIncident}
          />
          <Tooltip title="View in Splunk On-Call" placement="top">
            <IconButton
              href={incident.incidentLink}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <OpenInBrowserIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};
