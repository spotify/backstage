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
import { List, ListSubheader } from '@material-ui/core';
import { IncidentListItem } from './IncidentListItem';
import { IncidentsEmptyState } from './IncidentEmptyState';
import { useAsyncFn } from 'react-use';
import { pagerDutyApiRef } from '../../api';
import { Alert } from '@material-ui/lab';

import { useApi } from '@backstage/core-plugin-api';
import { Progress } from '@backstage/core-components';

type Props = {
  serviceId: string;
  refreshIncidents: boolean;
};

export const Incidents = ({ serviceId, refreshIncidents }: Props) => {
  const api = useApi(pagerDutyApiRef);

  const [{ value: incidents, loading, error }, getIncidents] = useAsyncFn(
    async () => await api.getIncidentsByServiceId(serviceId),
  );

  useEffect(() => {
    getIncidents();
  }, [refreshIncidents, getIncidents]);

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

  if (!incidents?.length) {
    return <IncidentsEmptyState />;
  }

  return (
    <List dense subheader={<ListSubheader>INCIDENTS</ListSubheader>}>
      {incidents!.map((incident, index) => (
        <IncidentListItem key={incident.id + index} incident={incident} />
      ))}
    </List>
  );
};
