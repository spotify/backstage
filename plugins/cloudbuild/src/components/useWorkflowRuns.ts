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
import { cloudbuildApiRef } from '../api/CloudbuildApi';
import {
  ActionsListWorkflowRunsForRepoResponseData,
  Substitutions,
} from '../api/types';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export type WorkflowRun = {
  id: string;
  message: string;
  url?: string;
  googleUrl?: string;
  status: string;
  substitutions: Substitutions;
  createTime: string;
  rerun: () => void;
};

export function useWorkflowRuns({ projectId }: { projectId: string }) {
  const api = useApi(cloudbuildApiRef);
  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { loading, value: runs, retry, error } = useAsyncRetry<
    WorkflowRun[]
  >(async () => {
    return api
      .listWorkflowRuns({
        projectId,
      })
      .then(
        (
          workflowRunsData: ActionsListWorkflowRunsForRepoResponseData,
        ): WorkflowRun[] => {
          setTotal(workflowRunsData.builds.length);
          // Transformation here
          return workflowRunsData.builds.map(run => ({
            message: run.substitutions.REPO_NAME,
            id: run.id,
            rerun: async () => {
              try {
                await api.reRunWorkflow({
                  projectId,
                  runId: run.id,
                });
              } catch (e) {
                errorApi.post(e);
              }
            },
            substitutions: run.substitutions,
            source: {
              branchName: run.substitutions.REPO_NAME,
              commit: {
                hash: run.substitutions.COMMIT_SHA,
                url: run.substitutions.REPO_NAME,
              },
            },
            status: run.status,
            url: run.logUrl,
            googleUrl: run.logUrl,
            createTime: run.createTime,
          }));
        },
      );
  }, [page, pageSize, projectId]);

  return [
    {
      page,
      pageSize,
      loading,
      runs,
      projectName: `${projectId}`,
      total,
      error,
    },
    {
      runs,
      setPage,
      setPageSize,
      retry,
    },
  ] as const;
}
