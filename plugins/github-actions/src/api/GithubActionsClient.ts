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

import { readGitHubIntegrationConfigs } from '@backstage/integration';
import { GithubActionsApi } from './GithubActionsApi';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';

export class GithubActionsClient implements GithubActionsApi {
  private readonly configApi: ConfigApi;
  private readonly githubAuthApi: OAuthApi;

  constructor(options: { configApi: ConfigApi; githubAuthApi: OAuthApi }) {
    this.configApi = options.configApi;
    this.githubAuthApi = options.githubAuthApi;
  }

  private async getOctokit(hostname?: string): Promise<Octokit> {
    // TODO: Get access token for the specified hostname
    const token = await this.githubAuthApi.getAccessToken(['repo']);
    const configs = readGitHubIntegrationConfigs(
      this.configApi.getOptionalConfigArray('integrations.github') ?? [],
    );
    const githubIntegrationConfig = configs.find(
      v => v.host === hostname ?? 'github.com',
    );
    const baseUrl = githubIntegrationConfig?.apiBaseUrl;
    return new Octokit({ auth: token, baseUrl });
  }

  async reRunWorkflow({
    hostname,
    owner,
    repo,
    runId,
  }: {
    hostname?: string;
    owner: string;
    repo: string;
    runId: number;
  }): Promise<any> {
    const octokit = await this.getOctokit(hostname);
    return octokit.actions.reRunWorkflow({
      owner,
      repo,
      run_id: runId,
    });
  }
  async listWorkflowRuns({
    hostname,
    owner,
    repo,
    pageSize = 100,
    page = 0,
    branch,
  }: {
    hostname?: string;
    owner: string;
    repo: string;
    pageSize?: number;
    page?: number;
    branch?: string;
  }): Promise<
    RestEndpointMethodTypes['actions']['listWorkflowRuns']['response']['data']
  > {
    const octokit = await this.getOctokit(hostname);
    const workflowRuns = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: pageSize,
      page,
      ...(branch ? { branch } : {}),
    });
    return workflowRuns.data;
  }
  async getWorkflow({
    hostname,
    owner,
    repo,
    id,
  }: {
    hostname?: string;
    owner: string;
    repo: string;
    id: number;
  }): Promise<
    RestEndpointMethodTypes['actions']['getWorkflow']['response']['data']
  > {
    const octokit = await this.getOctokit(hostname);
    const workflow = await octokit.actions.getWorkflow({
      owner,
      repo,
      workflow_id: id,
    });
    return workflow.data;
  }
  async getWorkflowRun({
    hostname,
    owner,
    repo,
    id,
  }: {
    hostname?: string;
    owner: string;
    repo: string;
    id: number;
  }): Promise<
    RestEndpointMethodTypes['actions']['getWorkflowRun']['response']['data']
  > {
    const octokit = await this.getOctokit(hostname);
    const run = await octokit.actions.getWorkflowRun({
      owner,
      repo,
      run_id: id,
    });
    return run.data;
  }
  async listJobsForWorkflowRun({
    hostname,
    owner,
    repo,
    id,
    pageSize = 100,
    page = 0,
  }: {
    hostname?: string;
    owner: string;
    repo: string;
    id: number;
    pageSize?: number;
    page?: number;
  }): Promise<
    RestEndpointMethodTypes['actions']['listJobsForWorkflowRun']['response']['data']
  > {
    const octokit = await this.getOctokit(hostname);
    const jobs = await octokit.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: id,
      per_page: pageSize,
      page,
    });
    return jobs.data;
  }
  async downloadJobLogsForWorkflowRun({
    hostname,
    owner,
    repo,
    runId,
  }: {
    hostname?: string;
    owner: string;
    repo: string;
    runId: number;
  }): Promise<
    RestEndpointMethodTypes['actions']['downloadJobLogsForWorkflowRun']['response']['data']
  > {
    const octokit = await this.getOctokit(hostname);
    const workflow = await octokit.actions.downloadJobLogsForWorkflowRun({
      owner,
      repo,
      job_id: runId,
    });
    return workflow.data;
  }
}
