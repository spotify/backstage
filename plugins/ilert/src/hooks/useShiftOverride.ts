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
import { User, Shift } from '../types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export const useShiftOverride = (s: Shift, isModalOpened: boolean) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);

  const [shift, setShift] = React.useState<Shift>(s);
  const [usersList, setUsersList] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { error, retry } = useAsyncRetry(async () => {
    try {
      if (!isModalOpened) {
        return;
      }
      setIsLoading(true);
      const data = await ilertApi.fetchUsers();
      setUsersList(data || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [isModalOpened]);

  const setUser = (user: User) => {
    setShift({ ...shift, user });
  };

  const setStart = (start: string) => {
    setShift({ ...shift, start });
  };

  const setEnd = (end: string) => {
    setShift({ ...shift, end });
  };

  return [
    {
      shift,
      users: usersList,
      user: shift.user,
      start: shift.start,
      end: shift.end,
      error,
      isLoading,
    },
    {
      retry,
      setIsLoading,
      setUser,
      setStart,
      setEnd,
    },
  ] as const;
};
