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
import { bitriseApiRef } from '../plugin';
import { AsyncState } from 'react-use/lib/useAsync';
import { BitriseApp } from '../api/bitriseApi.model';
import { useApi } from '@backstage/core-plugin-api';

export const useBitriseBuildWorkflows = (
  appName: string,
): AsyncState<string[]> => {
  const bitriseApi = useApi(bitriseApiRef);

  const app = useAsync(
    async (): Promise<BitriseApp | undefined> => bitriseApi.getApp(appName),
    [appName],
  );

  const workflows = useAsync(async (): Promise<string[]> => {
    if (!app.value?.slug) {
      return [];
    }

    return bitriseApi.getBuildWorkflows(app.value.slug);
  }, [app.value?.slug, bitriseApi]);

  return {
    loading: app.loading || workflows.loading,
    error: app.error || workflows.error,
    value: workflows.value,
  } as AsyncState<string[]>;
};
