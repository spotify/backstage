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
import { useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { jenkinsApiRef } from '../api';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

export enum ErrorType {
  CONNECTION_ERROR,
  NOT_FOUND,
}

export function useBuilds(projectName: string, branch?: string) {
  const api = useApi(jenkinsApiRef);
  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState<{
    message: string;
    errorType: ErrorType;
  }>();

  const restartBuild = async (buildName: string) => {
    try {
      await api.retry(buildName);
    } catch (e) {
      errorApi.post(e);
    }
  };

  const { loading, value: builds, retry } = useAsyncRetry(async () => {
    try {
      let build;
      if (branch) {
        build = await api.getLastBuild(`${projectName}/${branch}`);
      } else {
        build = await api.getFolder(`${projectName}`);
      }

      const size = Array.isArray(build) ? build?.[0].build_num! : 1;
      setTotal(size);

      return build || [];
    } catch (e) {
      const errorType = e.notFound
        ? ErrorType.NOT_FOUND
        : ErrorType.CONNECTION_ERROR;
      setError({ message: e.message, errorType });
      throw e;
    }
  }, [api, errorApi, projectName, branch]);

  return [
    {
      page,
      pageSize,
      loading,
      builds,
      projectName,
      total,
      error,
    },
    {
      builds,
      setPage,
      setPageSize,
      restartBuild,
      retry,
    },
  ] as const;
}
