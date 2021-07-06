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

import { Entity } from '@backstage/catalog-model';
import React, { useEffect } from 'react';
import { useAsync } from 'react-use';
import { sentryApiRef } from '../../api';
import SentryIssuesTable from '../SentryIssuesTable/SentryIssuesTable';
import {
  SENTRY_PROJECT_SLUG_ANNOTATION,
  useProjectSlug,
} from '../useProjectSlug';

import {
  EmptyState,
  InfoCard,
  InfoCardVariants,
  MissingAnnotationEmptyState,
  Progress,
} from '@backstage/core-components';

import { ErrorApi, errorApiRef, useApi } from '@backstage/core-plugin-api';

export const SentryIssuesWidget = ({
  entity,
  statsFor = '24h',
  variant = 'gridItem',
}: {
  entity: Entity;
  statsFor?: '24h' | '12h';
  variant?: InfoCardVariants;
}) => {
  const errorApi = useApi<ErrorApi>(errorApiRef);
  const sentryApi = useApi(sentryApiRef);

  const projectId = useProjectSlug(entity);

  const { loading, value, error } = useAsync(
    () => sentryApi.fetchIssues(projectId, statsFor),
    [sentryApi, statsFor, projectId],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  if (loading || !projectId || error) {
    return (
      <InfoCard title="Sentry issues" variant={variant}>
        {loading && <Progress />}

        {!loading && !projectId && (
          <MissingAnnotationEmptyState
            annotation={SENTRY_PROJECT_SLUG_ANNOTATION}
          />
        )}

        {!loading && error && (
          <EmptyState
            missing="info"
            title="No information to display"
            description={`There is no Sentry project with id '${projectId}'.`}
          />
        )}
      </InfoCard>
    );
  }

  return <SentryIssuesTable sentryIssues={value || []} />;
};
