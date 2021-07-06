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

import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';

import { GitReleaseApi } from '../api/GitReleaseClient';
import { Project } from '../contexts/ProjectContext';

interface GetGitBatchInfo {
  project: Project;
  pluginApiClient: GitReleaseApi;
}

export const useGetGitBatchInfo = ({
  project,
  pluginApiClient,
}: GetGitBatchInfo) => {
  const [gitBatchInfo, fetchGitBatchInfo] = useAsyncFn(async () => {
    const [{ repository }, { latestRelease }] = await Promise.all([
      pluginApiClient.getRepository({
        owner: project.owner,
        repo: project.repo,
      }),
      pluginApiClient.getLatestRelease({
        owner: project.owner,
        repo: project.repo,
      }),
    ]);

    if (latestRelease === null) {
      return {
        latestRelease,
        releaseBranch: null,
        repository,
      };
    }

    const { branch: releaseBranch } = await pluginApiClient.getBranch({
      owner: project.owner,
      repo: project.repo,
      branch: latestRelease.targetCommitish,
    });

    return {
      latestRelease,
      releaseBranch,
      repository,
    };
  });

  useEffect(() => {
    fetchGitBatchInfo();
  }, [fetchGitBatchInfo, project]);

  return {
    gitBatchInfo,
    fetchGitBatchInfo,
  };
};
