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

import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import {
  Content,
  Page,
  Progress,
  StatusError,
  StatusOK,
} from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import { ClusterObjects } from '@backstage/plugin-kubernetes-common';
import { ErrorPanel } from './ErrorPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DeploymentsAccordions } from '../DeploymentsAccordions';
import { ErrorReporting } from '../ErrorReporting';
import { groupResponses } from '../../utils/response';
import { DetectedError, detectErrors } from '../../error-detection';
import { IngressesAccordions } from '../IngressesAccordions';
import { ServicesAccordions } from '../ServicesAccordions';
import { CustomResources } from '../CustomResources';
import EmptyStateImage from '../../assets/emptystate.svg';

import {
  GroupedResponsesContext,
  PodNamesWithErrorsContext,
  useKubernetesObjects,
} from '../../hooks';

type ClusterSummaryProps = {
  clusterName: string;
  totalNumberOfPods: number;
  numberOfPodsWithErrors: number;
  children?: React.ReactNode;
};

const ClusterSummary = ({
  clusterName,
  totalNumberOfPods,
  numberOfPodsWithErrors,
}: ClusterSummaryProps) => {
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid
        xs={4}
        item
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item xs>
          <Typography variant="h3">{clusterName}</Typography>
          <Typography color="textSecondary" variant="body1">
            Cluster
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={1}>
        <Divider style={{ height: '4em' }} orientation="vertical" />
      </Grid>
      <Grid
        item
        container
        xs={3}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item>
          <StatusOK>{totalNumberOfPods} pods</StatusOK>
        </Grid>
        <Grid item>
          {numberOfPodsWithErrors > 0 ? (
            <StatusError>{numberOfPodsWithErrors} pods with errors</StatusError>
          ) : (
            <StatusOK>No pods with errors</StatusOK>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

type ClusterProps = {
  clusterObjects: ClusterObjects;
  podsWithErrors: Set<string>;
  children?: React.ReactNode;
};

const Cluster = ({ clusterObjects, podsWithErrors }: ClusterProps) => {
  const groupedResponses = groupResponses(clusterObjects.resources);
  return (
    <GroupedResponsesContext.Provider value={groupedResponses}>
      <PodNamesWithErrorsContext.Provider value={podsWithErrors}>
        <Accordion TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ClusterSummary
              clusterName={clusterObjects.cluster.name}
              totalNumberOfPods={groupedResponses.pods.length}
              numberOfPodsWithErrors={podsWithErrors.size}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column">
              <Grid item>
                <CustomResources />
              </Grid>
              <Grid item>
                <DeploymentsAccordions />
              </Grid>
              <Grid item>
                <IngressesAccordions />
              </Grid>
              <Grid item>
                <ServicesAccordions />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </PodNamesWithErrorsContext.Provider>
    </GroupedResponsesContext.Provider>
  );
};

type KubernetesContentProps = { entity: Entity; children?: React.ReactNode };

export const KubernetesContent = ({ entity }: KubernetesContentProps) => {
  const { kubernetesObjects, error } = useKubernetesObjects(entity);

  const clustersWithErrors =
    kubernetesObjects?.items.filter(r => r.errors.length > 0) ?? [];

  const detectedErrors =
    kubernetesObjects !== undefined
      ? detectErrors(kubernetesObjects)
      : new Map<string, DetectedError[]>();

  return (
    <Page themeId="tool">
      <Content>
        {kubernetesObjects === undefined && error === undefined && <Progress />}

        {/* errors retrieved from the kubernetes clusters */}
        {clustersWithErrors.length > 0 && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorPanel
                entityName={entity.metadata.name}
                clustersWithErrors={clustersWithErrors}
              />
            </Grid>
          </Grid>
        )}

        {/* other errors */}
        {error !== undefined && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorPanel
                entityName={entity.metadata.name}
                errorMessage={error}
              />
            </Grid>
          </Grid>
        )}

        {kubernetesObjects && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <ErrorReporting detectedErrors={detectedErrors} />
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            <Grid item>
              <Typography variant="h3">Your Clusters</Typography>
            </Grid>
            <Grid item container>
              {kubernetesObjects?.items.length <= 0 && (
                <Grid
                  container
                  justify="space-around"
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={4}>
                    <Typography variant="h5">
                      No resources on any known clusters for{' '}
                      {entity.metadata.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <img
                      src={EmptyStateImage}
                      alt="EmptyState"
                      data-testid="emptyStateImg"
                    />
                  </Grid>
                </Grid>
              )}
              {kubernetesObjects?.items.length > 0 &&
                kubernetesObjects?.items.map((item, i) => {
                  const podsWithErrors = new Set<string>(
                    detectedErrors
                      .get(item.cluster.name)
                      ?.filter(de => de.kind === 'Pod')
                      .map(de => de.names)
                      .flat() ?? [],
                  );

                  return (
                    <Grid item key={i} xs={12}>
                      <Cluster
                        clusterObjects={item}
                        podsWithErrors={podsWithErrors}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        )}
      </Content>
    </Page>
  );
};
