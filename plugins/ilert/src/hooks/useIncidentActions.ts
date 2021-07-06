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
import { ilertApiRef } from '../api';
import { AuthenticationError } from '@backstage/errors';
import { useAsyncRetry } from 'react-use';
import { Incident, IncidentAction } from '../types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export const useIncidentActions = (
  incident: Incident | null,
  open: boolean,
) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [incidentActionsList, setIncidentActionsList] = React.useState<
    IncidentAction[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { error, retry } = useAsyncRetry(async () => {
    try {
      if (!incident || !open) {
        return;
      }
      const data = await ilertApi.fetchIncidentActions(incident);
      setIncidentActionsList(data);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [incident, open]);

  return [
    {
      incidentActions: incidentActionsList,
      error,
      isLoading,
    },
    {
      setIncidentActionsList,
      setIsLoading,
      retry,
    },
  ] as const;
};
