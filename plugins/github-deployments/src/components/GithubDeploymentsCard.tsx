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
import React from 'react';
import { useAsyncRetry } from 'react-use';
import { GithubDeployment, githubDeploymentsApiRef } from '../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  GITHUB_PROJECT_SLUG_ANNOTATION,
  isGithubDeploymentsAvailable,
} from '../Router';
import { GithubDeploymentsTable } from './GithubDeploymentsTable/GithubDeploymentsTable';
import {
  LOCATION_ANNOTATION,
  SOURCE_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';

import {
  MissingAnnotationEmptyState,
  ResponseErrorPanel,
  TableColumn,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const GithubDeploymentsComponent = ({
  projectSlug,
  last,
  lastStatuses,
  columns,
  host,
}: {
  projectSlug: string;
  last: number;
  lastStatuses: number;
  columns: TableColumn<GithubDeployment>[];
  host: string | undefined;
}) => {
  const api = useApi(githubDeploymentsApiRef);
  const [owner, repo] = projectSlug.split('/');

  const { loading, value, error, retry: reload } = useAsyncRetry(
    async () =>
      await api.listDeployments({
        host,
        owner,
        repo,
        last,
        lastStatuses,
      }),
  );

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <GithubDeploymentsTable
      deployments={value || []}
      isLoading={loading}
      reload={reload}
      columns={columns}
    />
  );
};

export const GithubDeploymentsCard = ({
  last,
  lastStatuses,
  columns,
}: {
  last?: number;
  lastStatuses?: number;
  columns?: TableColumn<GithubDeployment>[];
}) => {
  const { entity } = useEntity();
  const [host] = [
    entity?.metadata.annotations?.[SOURCE_LOCATION_ANNOTATION],
    entity?.metadata.annotations?.[LOCATION_ANNOTATION],
  ].filter(Boolean);

  return !isGithubDeploymentsAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={GITHUB_PROJECT_SLUG_ANNOTATION} />
  ) : (
    <GithubDeploymentsComponent
      projectSlug={
        entity?.metadata.annotations?.[GITHUB_PROJECT_SLUG_ANNOTATION] || ''
      }
      last={last || 10}
      lastStatuses={lastStatuses || 5}
      host={host}
      columns={columns || GithubDeploymentsTable.defaultDeploymentColumns}
    />
  );
};
