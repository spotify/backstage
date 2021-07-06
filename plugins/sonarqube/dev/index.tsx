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
import { createDevApp, EntityGridItem } from '@backstage/dev-utils';
import { Grid } from '@material-ui/core';
import React from 'react';
import { EntitySonarQubeCard, sonarQubePlugin } from '../src';
import { FindingSummary, SonarQubeApi, sonarQubeApiRef } from '../src/api';
import { SONARQUBE_PROJECT_KEY_ANNOTATION } from '../src/components/useProjectKey';
import { Content, Header, Page } from '@backstage/core-components';

const entity = (name?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [SONARQUBE_PROJECT_KEY_ANNOTATION]: name,
      },
      name: name,
    },
  } as Entity);

createDevApp()
  .registerPlugin(sonarQubePlugin)
  .addPage({
    title: 'Cards',
    element: (
      <Page themeId="home">
        <Header title="SonarQube" />
        <Content>
          <Grid container>
            <EntityGridItem xs={12} md={6} entity={entity('empty')}>
              <EntitySonarQubeCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('error')}>
              <EntitySonarQubeCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('never')}>
              <EntitySonarQubeCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('not-computed')}>
              <EntitySonarQubeCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('failed')}>
              <EntitySonarQubeCard />
            </EntityGridItem>
            <EntityGridItem xs={12} md={6} entity={entity('passed')}>
              <EntitySonarQubeCard />
            </EntityGridItem>
            <EntityGridItem xs={12} entity={entity(undefined)}>
              <EntitySonarQubeCard />
            </EntityGridItem>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .registerApi({
    api: sonarQubeApiRef,
    deps: {},
    factory: () =>
      ({
        getFindingSummary: async componentKey => {
          switch (componentKey) {
            case 'error':
              throw new Error('Error!');

            case 'never':
              return new Promise(() => {});

            case 'not-computed':
              return {
                lastAnalysis: new Date().toISOString(),
                metrics: {
                  bugs: '0',
                  reliability_rating: '1.0',
                  vulnerabilities: '0',
                  security_rating: '1.0',
                  code_smells: '0',
                  sqale_rating: '1.0',
                  coverage: '0.0',
                  duplicated_lines_density: '0.0',
                },
                projectUrl: `/#${componentKey}`,
                getIssuesUrl: i => `/#${componentKey}/issues/${i}`,
                getComponentMeasuresUrl: i => `/#${componentKey}/measures/${i}`,
                getSecurityHotspotsUrl: () =>
                  `#${componentKey}/security_hotspots`,
              } as FindingSummary;

            case 'failed':
              return {
                lastAnalysis: new Date().toISOString(),
                metrics: {
                  alert_status: 'FAILED',
                  bugs: '4',
                  reliability_rating: '2.0',
                  vulnerabilities: '18',
                  security_rating: '3.0',
                  security_review_rating: '3.0',
                  code_smells: '22',
                  sqale_rating: '5.0',
                  coverage: '15.7',
                  duplicated_lines_density: '15.6',
                },
                projectUrl: `/#${componentKey}`,
                getIssuesUrl: i => `/#${componentKey}/issues/${i}`,
                getComponentMeasuresUrl: i => `/#${componentKey}/measures/${i}`,
                getSecurityHotspotsUrl: () =>
                  `#${componentKey}/security_hotspots`,
              } as FindingSummary;

            case 'passed':
              return {
                lastAnalysis: new Date().toISOString(),
                metrics: {
                  alert_status: 'OK',
                  bugs: '0',
                  reliability_rating: '1.0',
                  vulnerabilities: '0',
                  security_rating: '1.0',
                  security_hotspots_reviewed: '100.0',
                  security_review_rating: '1.0',
                  code_smells: '0',
                  sqale_rating: '1.0',
                  coverage: '100.0',
                  duplicated_lines_density: '0.0',
                },
                projectUrl: `/#${componentKey}`,
                getIssuesUrl: i => `/#${componentKey}/issues/${i}`,
                getComponentMeasuresUrl: i => `/#${componentKey}/measures/${i}`,
                getSecurityHotspotsUrl: () =>
                  `#${componentKey}/security_hotspots`,
              } as FindingSummary;

            default:
              return undefined;
          }
        },
      } as SonarQubeApi),
  })
  .render();
