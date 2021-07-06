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
import React, { useCallback, useState } from 'react';
import { useAsync } from 'react-use';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@material-ui/core';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import WebIcon from '@material-ui/icons/Web';
import { Alert } from '@material-ui/lab';
import { splunkOnCallApiRef, UnauthorizedError } from '../api';
import { MissingApiKeyOrApiIdError } from './Errors/MissingApiKeyOrApiIdError';
import { EscalationPolicy } from './Escalation';
import { Incidents } from './Incident';
import { TriggerDialog } from './TriggerDialog';
import { User } from './types';

import { configApiRef, useApi } from '@backstage/core-plugin-api';

import {
  EmptyState,
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  MissingAnnotationEmptyState,
  Progress,
} from '@backstage/core-components';

export const SPLUNK_ON_CALL_TEAM = 'splunk.com/on-call-team';

export const MissingTeamAnnotation = () => (
  <MissingAnnotationEmptyState annotation={SPLUNK_ON_CALL_TEAM} />
);

export const InvalidTeamAnnotation = ({ teamName }: { teamName: string }) => (
  <CardContent>
    <EmptyState
      title={`Could not find team named "${teamName}" in the Splunk On-Call API`}
      missing="info"
      description={`Escalation Policy and incident information unavailable. Please verify that the team you added "${teamName}" is valid if you want to enable Splunk On-Call.`}
    />
  </CardContent>
);

export const MissingEventsRestEndpoint = () => (
  <CardContent>
    <EmptyState
      title="No Splunk On-Call REST endpoint available."
      missing="info"
      description="You need to add a valid REST endpoint to your 'app-config.yaml' if you want to enable Splunk On-Call."
    />
  </CardContent>
);

export const isSplunkOnCallAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[SPLUNK_ON_CALL_TEAM]);

export const EntitySplunkOnCallCard = () => {
  const config = useApi(configApiRef);
  const api = useApi(splunkOnCallApiRef);
  const { entity } = useEntity();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [refreshIncidents, setRefreshIncidents] = useState<boolean>(false);
  const team = entity.metadata.annotations![SPLUNK_ON_CALL_TEAM];

  const eventsRestEndpoint =
    config.getOptionalString('splunkOnCall.eventsRestEndpoint') || null;

  const handleRefresh = useCallback(() => {
    setRefreshIncidents(x => !x);
  }, []);

  const handleDialog = useCallback(() => {
    setShowDialog(x => !x);
  }, []);

  const { value: usersAndTeam, loading, error } = useAsync(async () => {
    const allUsers = await api.getUsers();
    const usersHashMap = allUsers.reduce(
      (map: Record<string, User>, obj: User) => {
        if (obj.username) {
          map[obj.username] = obj;
        }
        return map;
      },
      {},
    );
    const teams = await api.getTeams();
    const foundTeam = teams.find(teamValue => teamValue.name === team);
    return { usersHashMap, foundTeam };
  });

  if (error instanceof UnauthorizedError) {
    return <MissingApiKeyOrApiIdError />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Error encountered while fetching information. {error.message}
      </Alert>
    );
  }

  if (loading) {
    return <Progress />;
  }

  const Content = () => {
    if (!team) {
      return <MissingTeamAnnotation />;
    }

    if (!usersAndTeam?.foundTeam) {
      return <InvalidTeamAnnotation teamName={team} />;
    }

    if (!eventsRestEndpoint) {
      return <MissingEventsRestEndpoint />;
    }

    return (
      <>
        <Incidents team={team} refreshIncidents={refreshIncidents} />
        {usersAndTeam?.usersHashMap && team && (
          <EscalationPolicy team={team} users={usersAndTeam.usersHashMap} />
        )}
        <TriggerDialog
          team={team}
          showDialog={showDialog}
          handleDialog={handleDialog}
          onIncidentCreated={handleRefresh}
        />
      </>
    );
  };

  const triggerLink: IconLinkVerticalProps = {
    label: 'Create Incident',
    onClick: handleDialog,
    color: 'secondary',
    icon: <AlarmAddIcon />,
  };

  const serviceLink = {
    label: 'Portal',
    href: 'https://portal.victorops.com/',
    icon: <WebIcon />,
  };

  return (
    <Card>
      <CardHeader
        title="Splunk On-Call"
        subheader={[
          <Typography key="team_name">Team: {team}</Typography>,
          <HeaderIconLinkRow
            key="incident_trigger"
            links={[serviceLink, triggerLink]}
          />,
        ]}
      />
      <Divider />
      <CardContent>
        <Content />
      </CardContent>
    </Card>
  );
};
