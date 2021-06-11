/*
 * Copyright 2020 Spotify AB
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

import {
  EmptyState,
  InfoCard,
  InfoCardVariants,
  MissingAnnotationEmptyState,
  Progress,
  ResponseErrorPanel,
  useApi,
} from '@backstage/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DateTime } from 'luxon';
import React, { PropsWithChildren } from 'react';
import { useAsync } from 'react-use';
import { fossaApiRef } from '../../api';
import {
  FOSSA_PROJECT_NAME_ANNOTATION,
  getProjectName,
} from '../getProjectName';

const useStyles = makeStyles(theme => ({
  numberError: {
    fontSize: '5rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(2, 0),
    color: theme.palette.error.main,
  },
  numberSuccess: {
    fontSize: '5rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(2, 0),
    color: theme.palette.success.main,
  },
  description: {
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.secondary,
  },
  disabled: {
    backgroundColor: theme.palette.background.default,
  },
  lastAnalyzed: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
  },
  branch: {
    textDecoration: 'underline dotted',
  },
}));

const Card = ({
  children,
  disabled,
  projectUrl,
  variant = 'gridItem',
}: PropsWithChildren<{
  disabled?: boolean;
  projectUrl?: string;
  variant?: InfoCardVariants;
}>) => {
  const classes = useStyles();

  return (
    <InfoCard
      title="License Findings"
      deepLink={
        projectUrl
          ? {
              title: 'View more',
              link: projectUrl,
            }
          : undefined
      }
      variant={variant}
      className={disabled ? classes.disabled : undefined}
    >
      {children}
    </InfoCard>
  );
};
export const FossaCard = ({ variant }: { variant?: InfoCardVariants }) => {
  const { entity } = useEntity();
  const fossaApi = useApi(fossaApiRef);

  const projectTitle = getProjectName(entity);
  const { value, loading, error } = useAsync(
    async () =>
      projectTitle ? fossaApi.getFindingSummary(projectTitle) : undefined,
    [fossaApi, projectTitle],
  );

  const classes = useStyles();

  if (error) {
    return (
      <Card disabled variant={variant}>
        <ResponseErrorPanel error={error} />
      </Card>
    );
  }

  if (loading) {
    return (
      <Card disabled variant={variant}>
        <Progress />
      </Card>
    );
  }

  if (!projectTitle) {
    return (
      <Card disabled variant={variant}>
        <MissingAnnotationEmptyState
          annotation={FOSSA_PROJECT_NAME_ANNOTATION}
        />
      </Card>
    );
  }

  if (!value) {
    return (
      <Card disabled variant={variant}>
        <EmptyState
          missing="info"
          title="No information to display"
          description={`There is no Fossa project with title '${projectTitle}'.`}
        />
      </Card>
    );
  }

  return (
    <Card projectUrl={value.projectUrl} variant={variant}>
      <Grid
        item
        container
        direction="column"
        justify="space-between"
        alignItems="center"
        style={{ height: '100%' }}
        spacing={0}
      >
        <Grid item>
          <p
            className={
              value.issueCount > 0 || value.dependencyCount === 0
                ? classes.numberError
                : classes.numberSuccess
            }
          >
            {value.issueCount}
          </p>
          {value.dependencyCount > 0 && (
            <p className={classes.description}>Number of issues</p>
          )}
          {value.dependencyCount === 0 && (
            <p className={classes.description}>
              No Dependencies.
              <br />
              Please check your FOSSA project settings.
            </p>
          )}
        </Grid>

        <Grid item className={classes.lastAnalyzed}>
          Last analyzed on{' '}
          {DateTime.fromISO(value.timestamp).toLocaleString(
            DateTime.DATETIME_MED,
          )}
        </Grid>
        <Grid item className={classes.lastAnalyzed}>
          Based on {value.dependencyCount} Dependencies on branch{' '}
          <Tooltip title="The default branch can be changed by a FOSSA admin.">
            <span className={classes.branch}>{value.projectDefaultBranch}</span>
          </Tooltip>
          .
        </Grid>
      </Grid>
    </Card>
  );
};
