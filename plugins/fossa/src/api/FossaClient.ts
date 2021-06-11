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

import { DiscoveryApi, IdentityApi } from '@backstage/core';
import { ResponseError } from '@backstage/errors';
import fetch from 'cross-fetch';
import pLimit from 'p-limit';
import { FindingSummary, FossaApi } from './FossaApi';

type FossaProjectsResponse = {
  title: string;
  default_branch: string;
  locator: string;
  revisions: Array<{
    updatedAt: string;
    unresolved_licensing_issue_count: number;
    unresolved_issue_count: number;
    dependency_count: number;
  }>;
};

export class FossaClient implements FossaApi {
  discoveryApi: DiscoveryApi;
  identityApi: IdentityApi;
  organizationId?: string;
  private readonly limit = pLimit(5);

  constructor({
    discoveryApi,
    identityApi,
    organizationId,
  }: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    organizationId?: string;
  }) {
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
    this.organizationId = organizationId;
  }

  private async callApi<T>(
    path: string,
    query: Record<string, any>,
  ): Promise<T> {
    const apiUrl = `${await this.discoveryApi.getBaseUrl('proxy')}/fossa`;
    const idToken = await this.identityApi.getIdToken();
    const response = await fetch(
      `${apiUrl}/${path}?${new URLSearchParams(query).toString()}`,
      {
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
      },
    );

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return (await response.json()) as T;
  }

  async *getProject(
    projectTitles: Set<string>,
  ): AsyncIterable<{ title: string; summary: FindingSummary }> {
    const pageSize = 1000;

    for (let page = 0; ; page++) {
      const projects = await this.limit(() =>
        this.callApi<FossaProjectsResponse[]>('projects', {
          count: pageSize,
          page,
          sort: 'title+',
          ...(this.organizationId && {
            organizationId: this.organizationId,
          }),
          ...(projectTitles.size === 1 && {
            title: projectTitles.values().next().value,
          }),
        }),
      );

      for (const project of projects) {
        if (projectTitles.has(project.title) && project.revisions.length > 0) {
          const revision = project.revisions[0];
          yield {
            title: project.title,
            summary: {
              timestamp: revision.updatedAt,
              issueCount:
                revision.unresolved_licensing_issue_count ||
                revision.unresolved_issue_count,
              dependencyCount: revision.dependency_count,
              projectDefaultBranch: project.default_branch,
              projectUrl: `https://app.fossa.com/projects/${encodeURIComponent(
                project.locator,
              )}`,
            },
          };
        }
      }

      if (projects.length < pageSize) {
        break;
      }
    }
  }

  async getFindingSummaries(
    projectTitles: string[],
  ): Promise<Map<string, FindingSummary>> {
    const map = new Map<string, FindingSummary>();

    if (projectTitles.length === 0) {
      return map;
    }

    for await (const { title, summary } of this.getProject(
      new Set(projectTitles),
    )) {
      map.set(title, summary);
    }

    return map;
  }

  async getFindingSummary(
    projectTitle: string,
  ): Promise<FindingSummary | undefined> {
    const summaries = await this.getFindingSummaries([projectTitle]);
    return summaries.get(projectTitle);
  }
}
