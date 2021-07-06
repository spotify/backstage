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
import { GetIncidentsOpts, ilertApiRef, TableState } from '../api';
import { AuthenticationError } from '@backstage/errors';
import { useAsyncRetry } from 'react-use';
import {
  ACCEPTED,
  PENDING,
  Incident,
  IncidentStatus,
  AlertSource,
} from '../types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export const useIncidents = (
  paging: boolean,
  singleSource?: boolean,
  alertSource?: AlertSource | null,
) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [tableState, setTableState] = React.useState<TableState>({
    page: 0,
    pageSize: 10,
  });
  const [states, setStates] = React.useState<IncidentStatus[]>([
    ACCEPTED,
    PENDING,
  ]);
  const [incidentsList, setIncidentsList] = React.useState<Incident[]>([]);
  const [incidentsCount, setIncidentsCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchIncidentsCall = async () => {
    try {
      if (singleSource && !alertSource) {
        return;
      }
      setIsLoading(true);
      const opts: GetIncidentsOpts = {
        states,
        alertSources: alertSource ? [alertSource.id] : [],
      };
      if (paging) {
        opts.maxResults = tableState.pageSize;
        opts.startIndex = tableState.page * tableState.pageSize;
      }
      const data = await ilertApi.fetchIncidents(opts);
      setIncidentsList(data || []);
      setIsLoading(false);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      setIsLoading(false);
      throw e;
    }
  };

  const fetchIncidentsCountCall = async () => {
    try {
      const count = await ilertApi.fetchIncidentsCount({ states });
      setIncidentsCount(count || 0);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };
  const fetchIncidents = useAsyncRetry(fetchIncidentsCall, [
    tableState,
    states,
    singleSource,
    alertSource,
  ]);

  const refetchIncidents = () => {
    setTableState({ ...tableState, page: 0 });
    Promise.all([fetchIncidentsCall(), fetchIncidentsCountCall()]);
  };

  const fetchIncidentsCount = useAsyncRetry(fetchIncidentsCountCall, [states]);

  const error = fetchIncidents.error || fetchIncidentsCount.error;
  const retry = () => {
    fetchIncidents.retry();
    fetchIncidentsCount.retry();
  };

  const onIncidentChanged = (newIncident: Incident) => {
    let shouldRefetchIncidents = false;
    setIncidentsList(
      incidentsList.reduce((acc: Incident[], incident: Incident) => {
        if (newIncident.id === incident.id) {
          if (states.includes(newIncident.status)) {
            acc.push(newIncident);
          } else {
            shouldRefetchIncidents = true;
          }
          return acc;
        }
        acc.push(incident);
        return acc;
      }, []),
    );
    if (shouldRefetchIncidents) {
      refetchIncidents();
    }
  };

  const onChangePage = (page: number) => {
    setTableState({ ...tableState, page });
  };
  const onChangeRowsPerPage = (p: number) => {
    setTableState({ ...tableState, pageSize: p });
  };
  const onIncidentStatesChange = (s: IncidentStatus[]) => {
    setStates(s);
  };

  return [
    {
      tableState,
      states,
      incidents: incidentsList,
      incidentsCount,
      error,
      isLoading,
    },
    {
      setTableState,
      setStates,
      setIncidentsList,
      setIsLoading,
      retry,
      onIncidentChanged,
      refetchIncidents,
      onChangePage,
      onChangeRowsPerPage,
      onIncidentStatesChange,
    },
  ] as const;
};
