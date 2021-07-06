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

import { useEntity } from '@backstage/plugin-catalog-react';
import { BuildSummary, GitType } from 'circleci-api';
import { getOr } from 'lodash/fp';
import { useCallback, useEffect, useState } from 'react';
import { useAsyncRetry } from 'react-use';
import { circleCIApiRef } from '../api';
import type { CITableBuildInfo } from '../components/BuildsPage/lib/CITable';
import { CIRCLECI_ANNOTATION } from '../constants';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

const makeReadableStatus = (status: string | undefined) => {
  if (!status) return '';
  return ({
    retried: 'Retried',
    canceled: 'Canceled',
    infrastructure_fail: 'Infra fail',
    timedout: 'Timedout',
    not_run: 'Not run',
    running: 'Running',
    failed: 'Failed',
    queued: 'Queued',
    scheduled: 'Scheduled',
    not_running: 'Not running',
    no_tests: 'No tests',
    fixed: 'Fixed',
    success: 'Success',
  } as Record<string, string>)[status];
};

const mapWorkflowDetails = (buildData: BuildSummary) => {
  // Workflows should be an object: fixed in https://github.com/worldturtlemedia/circleci-api/pull/787
  const { workflows } = (buildData as any) ?? {};

  return {
    id: workflows?.workflow_id,
    url: `${buildData.build_url}/workflows/${workflows?.workflow_id}`,
    jobName: workflows?.job_name,
    name: workflows?.workflow_name,
  };
};

const mapSourceDetails = (buildData: BuildSummary) => {
  const commitDetails = getOr({}, 'all_commit_details[0]', buildData);

  return {
    branchName: String(buildData.branch),
    commit: {
      hash: String(buildData.vcs_revision),
      shortHash: String(buildData.vcs_revision).substr(0, 7),
      committerName: buildData.committer_name,
      url: commitDetails.commit_url,
    },
  };
};

const mapUser = (buildData: BuildSummary) => ({
  isUser: buildData?.user?.is_user || false,
  login: buildData?.user?.login || 'none',
  name: (buildData?.user as any)?.name,
  avatarUrl: (buildData?.user as any)?.avatar_url,
});

export const transform = (
  buildsData: BuildSummary[],
  restartBuild: { (buildId: number): Promise<void> },
): CITableBuildInfo[] => {
  return buildsData.map(buildData => {
    const tableBuildInfo: CITableBuildInfo = {
      id: String(buildData.build_num),
      buildName: buildData.subject
        ? buildData.subject +
          (buildData.retry_of ? ` (retry of #${buildData.retry_of})` : '')
        : '',
      startTime: buildData.start_time,
      stopTime: buildData.stop_time,
      onRestartClick: () =>
        typeof buildData.build_num !== 'undefined' &&
        restartBuild(buildData.build_num),
      source: mapSourceDetails(buildData),
      workflow: mapWorkflowDetails(buildData),
      user: mapUser(buildData),
      status: makeReadableStatus(buildData.status),
      buildUrl: buildData.build_url,
    };
    return tableBuildInfo;
  });
};

export const useProjectSlugFromEntity = () => {
  const { entity } = useEntity();
  const [vcs, owner, repo] = (
    entity.metadata.annotations?.[CIRCLECI_ANNOTATION] ?? ''
  ).split('/');
  return { vcs, owner, repo };
};

export function mapVcsType(vcs: string): GitType {
  switch (vcs) {
    case 'gh':
    case 'github':
      return GitType.GITHUB;
    default:
      return GitType.BITBUCKET;
  }
}

export function useBuilds() {
  const { repo, owner, vcs } = useProjectSlugFromEntity();
  const api = useApi(circleCIApiRef);
  const errorApi = useApi(errorApiRef);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const getBuilds = useCallback(
    async ({ limit, offset }: { limit: number; offset: number }) => {
      if (owner === '' || repo === '' || vcs === '') {
        return Promise.reject('No credentials provided');
      }

      try {
        return await api.getBuilds(
          { limit, offset },
          {
            vcs: {
              owner: owner,
              repo: repo,
              type: mapVcsType(vcs),
            },
          },
        );
      } catch (e) {
        errorApi.post(e);
        return Promise.reject(e);
      }
    },
    [repo, owner, vcs, api, errorApi],
  );

  const restartBuild = async (buildId: number) => {
    try {
      await api.retry(buildId, {
        vcs: {
          owner: owner,
          repo: repo,
          type: GitType.GITHUB,
        },
      });
    } catch (e) {
      errorApi.post(e);
    }
  };

  useEffect(() => {
    getBuilds({ limit: 1, offset: 0 }).then(b => setTotal(b?.[0].build_num!));
  }, [repo, getBuilds]);

  const { loading, value, retry } = useAsyncRetry(
    () =>
      getBuilds({
        offset: page * pageSize,
        limit: pageSize,
      }).then(builds => transform(builds ?? [], restartBuild)),
    [page, pageSize, getBuilds],
  );

  const projectName = `${owner}/${repo}`;
  return [
    {
      page,
      pageSize,
      loading,
      value,
      projectName,
      total,
    },
    {
      getBuilds,
      setPage,
      setPageSize,
      restartBuild,
      retry,
    },
  ] as const;
}
