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

import { CloudbuildApi } from './CloudbuildApi';
import {
  ActionsListWorkflowRunsForRepoResponseData,
  ActionsGetWorkflowResponseData,
} from '../api/types';
import { OAuthApi } from '@backstage/core-plugin-api';

export class CloudbuildClient implements CloudbuildApi {
  constructor(private readonly googleAuthApi: OAuthApi) {}

  async reRunWorkflow({
    projectId,
    runId,
  }: {
    projectId: string;
    runId: string;
  }): Promise<void> {
    await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        projectId,
      )}/builds/${encodeURIComponent(runId)}:retry`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${await this.getToken()}`,
        }),
      },
    );
  }
  async listWorkflowRuns({
    projectId,
  }: {
    projectId: string;
  }): Promise<ActionsListWorkflowRunsForRepoResponseData> {
    const workflowRuns = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        projectId,
      )}/builds`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${await this.getToken()}`,
        }),
      },
    );

    const builds: ActionsListWorkflowRunsForRepoResponseData = await workflowRuns.json();

    return builds;
  }
  async getWorkflow({
    projectId,
    id,
  }: {
    projectId: string;
    id: string;
  }): Promise<ActionsGetWorkflowResponseData> {
    const workflow = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        projectId,
      )}/builds/${encodeURIComponent(id)}`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${await this.getToken()}`,
        }),
      },
    );

    const build: ActionsGetWorkflowResponseData = await workflow.json();

    return build;
  }
  async getWorkflowRun({
    projectId,
    id,
  }: {
    projectId: string;
    id: string;
  }): Promise<ActionsGetWorkflowResponseData> {
    const workflow = await fetch(
      `https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(
        projectId,
      )}/builds/${encodeURIComponent(id)}`,
      {
        headers: new Headers({
          Accept: '*/*',
          Authorization: `Bearer ${await this.getToken()}`,
        }),
      },
    );
    const build: ActionsGetWorkflowResponseData = await workflow.json();

    return build;
  }

  async getToken(): Promise<string> {
    // NOTE(freben - gcp-projects): There's a .read-only variant of this scope that we could
    // use for readonly operations, but that means we would ask the user for a
    // second auth during creation and I decided to keep the wider scope for
    // all ops for now
    return this.googleAuthApi.getAccessToken(
      'https://www.googleapis.com/auth/cloud-platform',
    );
  }
}
