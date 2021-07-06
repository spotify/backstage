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
import { useCallback, useMemo } from 'react';
import { useAsyncRetry } from 'react-use';
import { circleCIApiRef } from '../api';
import { useAsyncPolling } from './useAsyncPolling';
import { useProjectSlugFromEntity, mapVcsType } from './useBuilds';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

const INTERVAL_AMOUNT = 1500;
export function useBuildWithSteps(buildId: number) {
  const { vcs, repo, owner } = useProjectSlugFromEntity();
  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);

  const vcsOption = useMemo(
    () => ({
      owner: owner,
      repo: repo,
      type: mapVcsType(vcs),
    }),
    [owner, repo, vcs],
  );

  const getBuildWithSteps = useCallback(async () => {
    if (owner === '' || repo === '' || vcs === '') {
      return Promise.reject('No credentials provided');
    }

    try {
      const options = {
        vcs: vcsOption,
      };
      const build = await api.getBuild(buildId, options);
      return Promise.resolve(build);
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  }, [vcsOption, buildId, api, errorApi]); // eslint-disable-line react-hooks/exhaustive-deps

  const restartBuild = async () => {
    try {
      await api.retry(buildId, {
        vcs: vcsOption,
      });
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
