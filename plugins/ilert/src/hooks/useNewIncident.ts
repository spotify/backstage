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
import { AlertSource } from '../types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export const useNewIncident = (
  open: boolean,
  initialAlertSource?: AlertSource | null,
) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [alertSourcesList, setAlertSourcesList] = React.useState<AlertSource[]>(
    [],
  );
  const [alertSource, setAlertSource] = React.useState<AlertSource | null>(
    null,
  );
  const [summary, setSummary] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAlertSources = useAsyncRetry(async () => {
    try {
      if (!open || initialAlertSource) {
        return;
      }
      const count = await ilertApi.fetchAlertSources();
      setAlertSourcesList(count || 0);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [open]);

  const error = fetchAlertSources.error;
  const retry = () => {
    fetchAlertSources.retry();
  };

  return [
    {
      alertSources: alertSourcesList,
      alertSource: initialAlertSource ? initialAlertSource : alertSource,
      summary,
      details,
      error,
      isLoading,
    },
    {
      setAlertSourcesList,
      setAlertSource,
      setSummary,
      setDetails,
      setIsLoading,
      retry,
    },
  ] as const;
};
