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
import Tooltip from '@material-ui/core/Tooltip';
import { ACCEPTED, Incident, PENDING, RESOLVED } from '../../types';
import { StatusError, StatusOK } from '@backstage/core-components';

const useStyles = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const incidentStatusLabels = {
  [RESOLVED]: 'Resolved',
  [ACCEPTED]: 'Accepted',
  [PENDING]: 'Pending',
} as Record<string, string>;

export const IncidentStatus = ({ incident }: { incident: Incident }) => {
  const classes = useStyles();

  return (
    <Tooltip title={incident.status} placement="top">
      <div className={classes.denseListIcon}>
        {incident.status === 'PENDING' ? <StatusError /> : <StatusOK />}
      </div>
    </Tooltip>
  );
};
