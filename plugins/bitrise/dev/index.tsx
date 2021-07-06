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

import { Entity } from '@backstage/catalog-model';
import { createDevApp, EntityGridItem } from '@backstage/dev-utils';
import React from 'react';
import { EntityBitriseContent } from '../src';
import { BitriseApi } from '../src/api/bitriseApi';
import {
  BitriseBuildArtifact,
  BitriseBuildArtifactDetails,
  BitriseBuildResult,
  BitrisePagingResponse,
} from '../src/api/bitriseApi.model';
import { BITRISE_APP_ANNOTATION } from '../src/components/BitriseBuildsComponent';
import { bitriseApiRef } from '../src/plugin';
import { Content, Header, Page } from '@backstage/core-components';

const mockedPagingResponse: BitrisePagingResponse = {
  next: 'fae3232de3d2',
  page_item_limit: 20,
  total_item_count: 400,
};

const entities: (string | undefined)[] = [
  'builds',
  'searchBuilds',
  'searchNotFound',
  'empty',
  'error',
  'never',
  undefined,
];

const mockedBuildResults: BitriseBuildResult[] = [
  {
    appSlug: 'ios-app',
    buildSlug: '3291j9390d39239d3',
    commitHash: '27c988e4f13e26bc2d1b0af292026a3079aqsxe1',
    id: 29525,
    message: 'develop',
    source:
      'https://github.com/ORG/APPNAME/commit/27c988e4f13e26bc2d1b0af292026a3079aqsxe1',
    statusText: 'success',
    status: 1,
    workflow: 'app-ios-test',
    triggerTime: '2019-01-27T17:55:17Z',
    duration: '12 minutes',
  },
  {
    appSlug: 'ios-app',
    buildSlug: '38i23sk2923js9231s1',
    commitHash: '13c988d4f13e06bcdd1b0af292086a3079cdaxb0',
    id: 19523,
    message: 'main',
    source:
      'https://github.com/ORG/APPNAME/commit/13c988d4f13e06bcdd1b0af292086a3079cdaxb0',
    statusText: 'in-progress',
    status: 0,
    workflow: 'app-ios-release',
    triggerTime: '2020-01-28T17:55:17Z',
    duration: '19 minutes',
  },
];
const entity = (name?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [BITRISE_APP_ANNOTATION]: name,
      },
      name: name,
    },
  } as Entity);

createDevApp()
  .registerApi({
    api: bitriseApiRef,
    deps: {},
    factory: () =>
      ({
        getBuilds: async (appName: string) => {
          switch (appName) {
            case 'error':
              throw new Error('Error!');

            case 'never':
              return new Promise(() => {});

            case 'builds':
              return { data: mockedBuildResults, paging: mockedPagingResponse };

            case 'searchBuilds':
              return {
                data: [mockedBuildResults.find(b => b.message === 'develop')],
                paging: mockedPagingResponse,
              };

            case 'searchNotFound':
              return [];

            default:
              return undefined;
          }
        },
        getBuildWorkflows: async (_buildSlug: string) => {
          return ['app-ios-release', 'app-ios-test'];
        },
        getApp: async (_appName: string) => {
          return {
            slug: _appName,
          };
        },
        getBuildArtifacts: async (_appName: string, _buildSlug: string) => {
          return [
            {
              title: 'App artifact',
              slug: 'some-artifact-slug',
            },
            {
              title: 'App artifact 2',
              slug: 'some-artifact-slug-2',
            },
            {
              title: 'App artifact 3',
              slug: 'some-artifact-slug-3',
            },
          ] as BitriseBuildArtifact[];
        },
        getArtifactDetails: async (
          _appName: string,
          _buildSlug: string,
          _artifactSlug: string,
        ) => {
          return {
            title: 'App artifact',
            slug: 'some-artifact-slug',
            public_install_page_url: 'some-url',
            expiring_download_url: 'some-url',
          } as BitriseBuildArtifactDetails;
        },
      } as BitriseApi),
  })
  .addPage({
    title: 'Bitrise CI',
    element: (
      <Page themeId="home">
        <Header title="Bitrise CI" />
        <Content>
          {entities.map(entityItem => (
            <EntityGridItem entity={entity(entityItem)} key={entityItem}>
              <EntityBitriseContent />
            </EntityGridItem>
          ))}
        </Content>
      </Page>
    ),
  })
  .render();
