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
import { AlertSource, OnCall } from '../types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export const useAlertSourceOnCalls = (alertSource?: AlertSource | null) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [onCallsList, setOnCallsList] = React.useState<OnCall[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAlertSourceOnCallsCall = async () => {
    try {
      if (!alertSource) {
        return;
      }
      setIsLoading(true);
      const data = await ilertApi.fetchAlertSourceOnCalls(alertSource);
      setOnCallsList(data || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };

  const { error, retry } = useAsyncRetry(fetchAlertSourceOnCallsCall, [
    alertSource,
  ]);

  return [
    {
      onCalls: onCallsList,
      error,
      isLoading,
    },
    {
      retry,
      setIsLoading,
      refetchAlertSourceOnCalls: fetchAlertSourceOnCallsCall,
    },
  ] as const;
};
