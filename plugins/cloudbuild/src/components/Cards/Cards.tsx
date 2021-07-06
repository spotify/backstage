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
import React, { useEffect } from 'react';
import { useWorkflowRuns, WorkflowRun } from '../useWorkflowRuns';
import { WorkflowRunsTable } from '../WorkflowRunsTable';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { WorkflowRunStatus } from '../WorkflowRunStatus';
import { Link, Theme, makeStyles, LinearProgress } from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { CLOUDBUILD_ANNOTATION } from '../useProjectName';

import {
  InfoCard,
  StructuredMetadataTable,
  WarningPanel,
} from '@backstage/core-components';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles<Theme>({
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
});

const WidgetContent = ({
  error,
  loading,
  lastRun,
  branch,
}: {
  error?: Error;
  loading?: boolean;
  lastRun: WorkflowRun;
  branch: string;
}) => {
  const classes = useStyles();
  if (error)
    return <WarningPanel>Couldn't fetch latest {branch} run</WarningPanel>;
  if (loading) return <LinearProgress />;
  return (
    <StructuredMetadataTable
      metadata={{
        status: (
          <>
            <WorkflowRunStatus status={lastRun.status} />
          </>
        ),
        message: lastRun.message,
        url: (
          <Link href={lastRun.googleUrl} target="_blank">
            See more on Google{' '}
            <ExternalLinkIcon className={classes.externalLinkIcon} />
          </Link>
        ),
      }}
    />
  );
};

export const LatestWorkflowRunCard = ({
  branch = 'master',
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  branch: string;
}) => {
  const { entity } = useEntity();
  const errorApi = useApi(errorApiRef);
  const projectId = entity?.metadata.annotations?.[CLOUDBUILD_ANNOTATION] || '';

  const [{ runs, loading, error }] = useWorkflowRuns({
    projectId,
  });
  const lastRun = runs?.[0] ?? ({} as WorkflowRun);
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return (
    <InfoCard title={`Last ${branch} build`}>
      <WidgetContent
        error={error}
        loading={loading}
        branch={branch}
        lastRun={lastRun}
      />
    </InfoCard>
  );
};

export const LatestWorkflowsForBranchCard = ({
  branch = 'master',
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  branch: string;
}) => {
  const { entity } = useEntity();

  return (
    <InfoCard title={`Last ${branch} build`}>
      <WorkflowRunsTable entity={entity} />
    </InfoCard>
  );
};
