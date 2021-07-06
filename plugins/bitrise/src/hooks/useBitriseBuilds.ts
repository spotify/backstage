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

import { useAsync } from 'react-use';
import {
  BitriseApp,
  BitriseBuildListResponse,
  BitriseQueryParams,
} from '../api/bitriseApi.model';
import { bitriseApiRef } from '../plugin';
import { AsyncState } from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';

export const useBitriseBuilds = (
  appName: string,
  params: BitriseQueryParams,
): AsyncState<BitriseBuildListResponse> => {
  const bitriseApi = useApi(bitriseApiRef);

  const app = useAsync(
    async (): Promise<BitriseApp | undefined> => bitriseApi.getApp(appName),
    [appName],
  );

  const builds = useAsync(async (): Promise<BitriseBuildListResponse> => {
    if (!app.value?.slug) {
      return { data: [] };
    }

    return bitriseApi.getBuilds(app.value.slug, params);
  }, [
    app.value?.slug,
    bitriseApi,
    params.workflow,
    params.branch,
    params.limit,
    params.next,
  ]);

  return {
    loading: app.loading || builds.loading,
    error: app.error || builds.error,
    value: builds.value,
  } as AsyncState<BitriseBuildListResponse>;
};
