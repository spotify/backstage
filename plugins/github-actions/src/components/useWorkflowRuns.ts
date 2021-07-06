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
import { githubActionsApiRef } from '../api/GithubActionsApi';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

export type WorkflowRun = {
  workflowName: string;
  id: string;
  message: string;
  url?: string;
  githubUrl?: string;
  source: {
    branchName: string;
    commit: {
      hash: string;
      url?: string;
    };
  };
  status: string;
  conclusion: string;
  onReRunClick: () => void;
};

export function useWorkflowRuns({
  hostname,
  owner,
  repo,
  branch,
  initialPageSize = 5,
}: {
  hostname?: string;
  owner: string;
  repo: string;
  branch?: string;
  initialPageSize?: number;
}) {
  const api = useApi(githubActionsApiRef);

  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const { loading, value: runs, retry, error } = useAsyncRetry<
    WorkflowRun[]
  >(async () => {
    // GitHub API pagination count starts from 1
    const workflowRunsData = await api.listWorkflowRuns({
      hostname,
      owner,
      repo,
      pageSize,
      page: page + 1,
      branch,
    });
    setTotal(workflowRunsData.total_count);
    // Transformation here
    return workflowRunsData.workflow_runs.map(run => ({
      workflowName: run.name,
      message: run.head_commit.message,
      id: `${run.id}`,
      onReRunClick: async () => {
        try {
          await api.reRunWorkflow({
            hostname,
            owner,
            repo,
            runId: run.id,
          });
        } catch (e) {
          errorApi.post(e);
        }
      },
      source: {
        branchName: run.head_branch,
        commit: {
          hash: run.head_commit.id,
          url: run.head_repository?.branches_url?.replace(
            '{/branch}',
            run.head_branch,
          ),
        },
      },
      status: run.status,
      conclusion: run.conclusion,
      url: run.url,
      githubUrl: run.html_url,
    }));
  }, [page, pageSize, repo, owner]);

  return [
    {
      page,
      pageSize,
      loading,
      runs,
      projectName: `${owner}/${repo}`,
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
