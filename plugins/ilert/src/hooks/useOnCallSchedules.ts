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
import { Schedule } from '../types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export const useOnCallSchedules = () => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [onCallSchedulesList, setOnCallSchedulesList] = React.useState<
    Schedule[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchOnCallSchedulesCall = async () => {
    try {
      setIsLoading(true);
      const data = await ilertApi.fetchOnCallSchedules();
      setOnCallSchedulesList(data || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };

  const { error, retry } = useAsyncRetry(fetchOnCallSchedulesCall, []);

  return [
    {
      onCallSchedules: onCallSchedulesList,
      error,
      isLoading,
    },
    {
      retry,
      setIsLoading,
      refetchOnCallSchedules: fetchOnCallSchedulesCall,
    },
  ] as const;
};
