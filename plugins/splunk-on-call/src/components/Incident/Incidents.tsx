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
  createStyles,
  List,
  ListSubheader,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { IncidentListItem } from './IncidentListItem';
import { IncidentsEmptyState } from './IncidentEmptyState';
import { useAsyncFn } from 'react-use';
import { splunkOnCallApiRef } from '../../api';
import { Alert } from '@material-ui/lab';

import { useApi } from '@backstage/core-plugin-api';
import { Progress } from '@backstage/core-components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxHeight: '400px',
      overflow: 'auto',
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    progress: {
      margin: `0 ${theme.spacing(2)}px`,
    },
  }),
);

type Props = {
  refreshIncidents: boolean;
  team: string;
};

export const Incidents = ({ refreshIncidents, team }: Props) => {
  const classes = useStyles();
  const api = useApi(splunkOnCallApiRef);

  const [{ value: incidents, loading, error }, getIncidents] = useAsyncFn(
    async () => {
      // For some reason the changes applied to incidents (trigger-resolve-acknowledge)
      // may take some time to actually be applied after receiving the response from the server.
      // The timeout compensates for this latency.
      await new Promise(resolve => setTimeout(resolve, 2000));
      const allIncidents = await api.getIncidents();
      const teams = await api.getTeams();
      const teamSlug = teams.find(teamValue => teamValue.name === team)?.slug;
      const filteredIncidents = teamSlug
        ? allIncidents.filter(incident =>
            incident.pagedTeams?.includes(teamSlug),
          )
        : [];
      return filteredIncidents;
    },
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

  if (!loading && !incidents?.length) {
    return <IncidentsEmptyState />;
  }

  return (
    <List
      className={classes.root}
      dense
      subheader={
        <ListSubheader className={classes.subheader}>
          CRITICAL INCIDENTS
        </ListSubheader>
      }
    >
      {loading ? (
        <Progress className={classes.progress} />
      ) : (
        incidents!.map((incident, index) => (
          <IncidentListItem
            onIncidentAction={() => getIncidents()}
            key={index}
            team={team}
            incident={incident}
          />
        ))
      )}
    </List>
  );
};
