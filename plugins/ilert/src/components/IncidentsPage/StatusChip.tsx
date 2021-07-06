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
import { Chip, withStyles } from '@material-ui/core';
import { Incident, PENDING, ACCEPTED, RESOLVED } from '../../types';
import { incidentStatusLabels } from '../Incident/IncidentStatus';

const ResolvedChip = withStyles({
  root: {
    backgroundColor: '#4caf50',
    color: 'white',
    margin: 0,
  },
})(Chip);

const AcceptedChip = withStyles({
  root: {
    backgroundColor: '#ffb74d',
    color: 'white',
    margin: 0,
  },
})(Chip);
const PendingChip = withStyles({
  root: {
    backgroundColor: '#d32f2f',
    color: 'white',
    margin: 0,
  },
})(Chip);

export const StatusChip = ({ incident }: { incident: Incident }) => {
  const label = `${incidentStatusLabels[incident.status]}`;

  switch (incident.status) {
    case RESOLVED:
      return <ResolvedChip label={label} size="small" />;
    case ACCEPTED:
      return <AcceptedChip label={label} size="small" />;
    case PENDING:
      return <PendingChip label={label} size="small" />;
    default:
      return <Chip label={label} size="small" />;
  }
};
