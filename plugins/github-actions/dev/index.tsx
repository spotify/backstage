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

import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { EntityGithubActionsContent, githubActionsPlugin } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { GithubActionsApi, githubActionsApiRef } from '../src';
import getWorkflowRunResponse from '../src/__fixtures__/get-workflow-run.json';
import listJobsForWorkflowRunResponse from '../src/__fixtures__/list-jobs-for-workflow-run.json';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
    annotations: {
      'github.com/project-slug': 'backstage/backstage',
    },
  },
  spec: {
    lifecycle: 'production',
    type: 'website',
    owner: 'user:guest',
  },
};

const mockGithubActionsApi: GithubActionsApi = {
  async downloadJobLogsForWorkflowRun() {},
  async getWorkflow() {
    return {} as any;
  },
  async getWorkflowRun() {
    return getWorkflowRunResponse;
  },
  async listJobsForWorkflowRun() {
    return listJobsForWorkflowRunResponse as any;
  },
  async listWorkflowRuns() {
    return {} as any;
  },
  async reRunWorkflow() {
    return {} as any;
  },
};

createDevApp()
  .registerApi({
    api: githubActionsApiRef,
    deps: {},
    factory: () => mockGithubActionsApi,
  })
  .registerPlugin(githubActionsPlugin)
  .addPage({
    path: '/github-actions',
    title: 'Github Actions',
    element: (
      <EntityProvider entity={mockEntity}>
        <EntityGithubActionsContent />
      </EntityProvider>
    ),
  })
  .render();
