/*
 * Copyright 2021 Spotify AB
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

import { uptimerobotApiRef } from '../api';
import { useApi } from '@backstage/core';
import { useAsyncFn, useInterval } from 'react-use';
import { useEffect } from 'react';

export function useAutoUpdatingRequest(apiMethod: Function) {
  const uptimerobotApi = useApi(uptimerobotApiRef);

  const [{ value, loading, error }, doApiMethod] = useAsyncFn(async () => {
    return await apiMethod();
  }, [apiMethod]);

  useInterval(() => {
    doApiMethod();
  }, uptimerobotApi.getUpdateInterval() * 1000);

  useEffect(() => {
    doApiMethod();
  }, [doApiMethod]);

  return {
    value,
    loading,
    error,
  };
}
