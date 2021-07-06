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

import axios from 'axios';
import { Logger } from 'winston';
import camelcaseKeys from 'camelcase-keys';
import { buildQuery } from '../util';
import {
  RollbarItemCount,
  RollbarItemsResponse,
  RollbarProject,
  RollbarProjectAccessToken,
  RollbarTopActiveItem,
} from './types';

const baseUrl = 'https://api.rollbar.com/api/1';

const buildUrl = (url: string) => `${baseUrl}${url}`;

export class RollbarApi {
  private projectMap: ProjectMetadataMap | undefined;

  constructor(
    private readonly accessToken: string,
    private readonly logger: Logger,
  ) {}

  async getAllProjects() {
    return this.get<RollbarProject[]>('/projects').then(projects =>
      projects.filter(p => p.name),
    );
  }

  async getProject(projectName: string) {
    return this.getForProject<RollbarProject>(
      `/project/:projectId`,
      projectName,
      false,
    );
  }

  async getProjectItems(projectName: string) {
    return this.getForProject<RollbarItemsResponse>(
      `/items`,
      projectName,
      true,
    );
  }

  async getTopActiveItems(
    projectName: string,
    options: { hours: number; environment: string } = {
      hours: 24,
      environment: 'production',
    },
  ) {
    return this.getForProject<RollbarTopActiveItem[]>(
      `/reports/top_active_items?${buildQuery(options)}`,
      projectName,
    );
  }

  async getOccuranceCounts(
    projectName: string,
    options: { environment: string; item_id?: number } = {
      environment: 'production',
    },
  ) {
    return this.getForProject<RollbarItemCount[]>(
      `/reports/occurrence_counts?${buildQuery(options as any)}`,
      projectName,
    );
  }

  async getActivatedCounts(
    projectName: string,
    options: { environment: string; item_id?: number } = {
      environment: 'production',
    },
  ) {
    return this.getForProject<RollbarItemCount[]>(
      `/reports/activated_counts?${buildQuery(options as any)}`,
      projectName,
    );
  }

  private async getProjectAccessTokens(projectId: number) {
    return this.get<RollbarProjectAccessToken[]>(
      `/project/${projectId}/access_tokens`,
    );
  }

  private async get<T>(url: string, accessToken?: string) {
    const fullUrl = buildUrl(url);

    if (this.logger) {
      this.logger.info(`Calling Rollbar REST API, ${fullUrl}`);
    }

    return axios
      .get(fullUrl, getRequestHeaders(accessToken || this.accessToken || ''))
      .then(response =>
        camelcaseKeys<T>(response?.data?.result, { deep: true }),
      );
  }

  private async getForProject<T>(
    url: string,
    projectName: string,
    useProjectToken = true,
  ) {
    const project = await this.getProjectMetadata(projectName);
    const resolvedUrl = url.replace(':projectId', project.id.toString());
    return this.get<T>(resolvedUrl, useProjectToken ? project.accessToken : '');
  }

  private async getProjectMetadata(name: string) {
    const projectMap = await this.getProjectMap();
    const project = projectMap[name];

    if (!project) {
      throw Error(`Invalid project: '${name}'`);
    }

    if (!project.accessToken) {
      const tokens = await this.getProjectAccessTokens(project.id);
      const token = tokens.find(t => t.scopes.includes('read'));
      project.accessToken = token ? token.accessToken : undefined;
    }

    if (!project.accessToken) {
      throw Error(`Could not find project read access token for '${name}'`);
    }

    return project;
  }

  private async getProjectMap() {
    if (this.projectMap) {
      return this.projectMap;
    }

    const projects = await this.getAllProjects();

    this.projectMap = projects.reduce((accum: ProjectMetadataMap, i) => {
      accum[i.name] = { id: i.id, name: i.name };
      return accum;
    }, {});

    return this.projectMap;
  }
}

export function getRequestHeaders(token: string) {
  return {
    headers: {
      'X-Rollbar-Access-Token': `${token}`,
    },
  };
}

type ProjectMetadata = {
  name: string;
  id: number;
  accessToken?: string | undefined;
};

interface ProjectMetadataMap {
  [name: string]: ProjectMetadata;
}
