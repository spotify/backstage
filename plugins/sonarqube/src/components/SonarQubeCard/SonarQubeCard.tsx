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
import { useEntity } from '@backstage/plugin-catalog-react';
import { Chip, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BugReport from '@material-ui/icons/BugReport';
import LockOpen from '@material-ui/icons/LockOpen';
import Security from '@material-ui/icons/Security';
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied';
import React, { useMemo } from 'react';
import { useAsync } from 'react-use';
import { sonarQubeApiRef } from '../../api';
import {
  SONARQUBE_PROJECT_KEY_ANNOTATION,
  useProjectKey,
} from '../useProjectKey';
import { Percentage } from './Percentage';
import { Rating } from './Rating';
import { RatingCard } from './RatingCard';
import { Value } from './Value';

import {
  EmptyState,
  InfoCard,
  InfoCardVariants,
  MissingAnnotationEmptyState,
  Progress,
} from '@backstage/core-components';

import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  badgeLabel: {
    color: theme.palette.common.white,
  },
  badgeError: {
    margin: 0,
    backgroundColor: theme.palette.error.main,
  },
  badgeSuccess: {
    margin: 0,
    backgroundColor: theme.palette.success.main,
  },
  badgeUnknown: {
    backgroundColor: theme.palette.grey[500],
  },
  header: {
    padding: theme.spacing(2, 2, 2, 2.5),
  },
  action: {
    margin: 0,
  },
  lastAnalyzed: {
    color: theme.palette.text.secondary,
  },
  disabled: {
    backgroundColor: theme.palette.background.default,
  },
}));

type DuplicationRating = {
  greaterThan: number;
  rating: '1.0' | '2.0' | '3.0' | '4.0' | '5.0';
};

const defaultDuplicationRatings: DuplicationRating[] = [
  { greaterThan: 0, rating: '1.0' },
  { greaterThan: 3, rating: '2.0' },
  { greaterThan: 5, rating: '3.0' },
  { greaterThan: 10, rating: '4.0' },
  { greaterThan: 20, rating: '5.0' },
];

export const SonarQubeCard = ({
  variant = 'gridItem',
  duplicationRatings = defaultDuplicationRatings,
}: {
  entity?: Entity;
  variant?: InfoCardVariants;
  duplicationRatings?: DuplicationRating[];
}) => {
  const { entity } = useEntity();
  const sonarQubeApi = useApi(sonarQubeApiRef);

  const projectTitle = useProjectKey(entity);

  const { value, loading } = useAsync(
    async () => sonarQubeApi.getFindingSummary(projectTitle),
    [sonarQubeApi, projectTitle],
  );

  const deepLink =
    !loading && value
      ? {
          title: 'View more',
          link: value.projectUrl,
        }
      : undefined;

  const classes = useStyles();
  let gateLabel = 'Not computed';
  let gateColor = classes.badgeUnknown;

  if (value?.metrics.alert_status) {
    const gatePassed = value.metrics.alert_status === 'OK';
    gateLabel = gatePassed ? 'Gate passed' : 'Gate failed';
    gateColor = gatePassed ? classes.badgeSuccess : classes.badgeError;
  }

  const qualityBadge = !loading && value && (
    <Chip
      label={gateLabel}
      classes={{ root: gateColor, label: classes.badgeLabel }}
    />
  );

  const duplicationRating = useMemo(() => {
    if (loading || !value || !value.metrics.duplicated_lines_density) {
      return '';
    }

    let rating = '';

    for (const r of duplicationRatings) {
      if (+value.metrics.duplicated_lines_density >= r.greaterThan) {
        rating = r.rating;
      }
    }

    return rating;
  }, [loading, value, duplicationRatings]);

  return (
    <InfoCard
      title="Code Quality"
      deepLink={deepLink}
      variant={variant}
      headerProps={{
        action: qualityBadge,
        classes: {
          root: classes.header,
          action: classes.action,
        },
      }}
      className={
        !loading && (!projectTitle || !value) ? classes.disabled : undefined
      }
    >
      {loading && <Progress />}

      {!loading && !projectTitle && (
        <MissingAnnotationEmptyState
          annotation={SONARQUBE_PROJECT_KEY_ANNOTATION}
        />
      )}

      {!loading && projectTitle && !value && (
        <EmptyState
          missing="info"
          title="No information to display"
          description={`There is no SonarQube project with key '${projectTitle}'.`}
        />
      )}

      {!loading && value && (
        <>
          <Grid
            item
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            style={{ height: '100%' }}
            spacing={0}
          >
            <Grid item container justify="space-around">
              <RatingCard
                titleIcon={<BugReport />}
                title="Bugs"
                link={value.getIssuesUrl('BUG')}
                leftSlot={<Value value={value.metrics.bugs} />}
                rightSlot={<Rating rating={value.metrics.reliability_rating} />}
              />
              <RatingCard
                titleIcon={<LockOpen />}
                title="Vulnerabilities"
                link={value.getIssuesUrl('VULNERABILITY')}
                leftSlot={<Value value={value.metrics.vulnerabilities} />}
                rightSlot={<Rating rating={value.metrics.security_rating} />}
              />
              <RatingCard
                titleIcon={<SentimentVeryDissatisfied />}
                title="Code Smells"
                link={value.getIssuesUrl('CODE_SMELL')}
                leftSlot={<Value value={value.metrics.code_smells} />}
                rightSlot={<Rating rating={value.metrics.sqale_rating} />}
              />
              {value.metrics.security_review_rating && (
                <RatingCard
                  titleIcon={<Security />}
                  title="Hotspots Reviewed"
                  link={value.getSecurityHotspotsUrl()}
                  leftSlot={
                    <Value
                      value={
                        value.metrics.security_hotspots_reviewed
                          ? `${value.metrics.security_hotspots_reviewed}%`
                          : '—'
                      }
                    />
                  }
                  rightSlot={
                    <Rating rating={value.metrics.security_review_rating} />
                  }
                />
              )}
              <div style={{ width: '100%' }} />
              <RatingCard
                link={value.getComponentMeasuresUrl('COVERAGE')}
                title="Coverage"
                leftSlot={<Percentage value={value.metrics.coverage} />}
                rightSlot={
                  <Value
                    value={
                      value.metrics.coverage !== undefined
                        ? `${value.metrics.coverage}%`
                        : '—'
                    }
                  />
                }
              />
              <RatingCard
                title="Duplications"
                link={value.getComponentMeasuresUrl('DUPLICATED_LINES_DENSITY')}
                leftSlot={<Rating rating={duplicationRating} hideValue />}
                rightSlot={
                  <Value value={`${value.metrics.duplicated_lines_density}%`} />
                }
              />
            </Grid>
            <Grid item className={classes.lastAnalyzed}>
              Last analyzed on{' '}
              {new Date(value.lastAnalysis).toLocaleString('en-US', {
                timeZone: 'UTC',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </Grid>
          </Grid>
        </>
      )}
    </InfoCard>
  );
};
