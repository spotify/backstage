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
import { useCallback } from 'react';
import { useAsyncRetry } from 'react-use';
import { jenkinsApiRef } from '../api';
import { useAsyncPolling } from './useAsyncPolling';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

const INTERVAL_AMOUNT = 1500;
export function useBuildWithSteps(buildName: string) {
  const api = useApi(jenkinsApiRef);
  const errorApi = useApi(errorApiRef);

  const getBuildWithSteps = useCallback(async () => {
    try {
      const build = await api.getBuild(buildName);

      const { jobName } = api.extractJobDetailsFromBuildName(buildName);
      const job = await api.getJob(jobName);
      const jobInfo = api.extractScmDetailsFromJob(job);

      return Promise.resolve(api.mapJenkinsBuildToCITable(build, jobInfo));
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  }, [buildName, api, errorApi]);

  const restartBuild = async () => {
    try {
      await api.retry(buildName);
    } catch (e) {
      errorApi.post(e);
    }
  };

  const { loading, value, retry } = useAsyncRetry(() => getBuildWithSteps(), [
    getBuildWithSteps,
  ]);

  const { startPolling, stopPolling } = useAsyncPolling(
    getBuildWithSteps,
    INTERVAL_AMOUNT,
  );

  return [
    { loading, value, retry },
    {
      restartBuild,
      getBuildWithSteps,
      startPolling,
      stopPolling,
    },
  ] as const;
}
