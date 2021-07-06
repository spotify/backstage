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

import { GcpApi } from './GcpApi';
import { Operation, Project } from './types';
import { OAuthApi } from '@backstage/core-plugin-api';

const BASE_URL =
  'https://content-cloudresourcemanager.googleapis.com/v1/projects';

export class GcpClient implements GcpApi {
  constructor(private readonly googleAuthApi: OAuthApi) {}

  async listProjects(): Promise<Project[]> {
    const response = await fetch(BASE_URL, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${await this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `List request failed to ${BASE_URL} with ${response.status} ${response.statusText}`,
      );
    }

    const { projects } = await response.json();
    return projects;
  }

  async getProject(projectId: string): Promise<Project> {
    const url = `${BASE_URL}/${projectId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Get request failed to ${url} with ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async createProject(options: {
    projectId: string;
    projectName: string;
  }): Promise<Operation> {
    const newProject: Project = {
      name: options.projectName,
      projectId: options.projectId,
    };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${await this.getToken()}`,
      },
      body: JSON.stringify(newProject),
    });

    if (!response.ok) {
      throw new Error(
        `Create request failed to ${BASE_URL} with ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  async getToken(): Promise<string> {
    // NOTE(freben): There's a .read-only variant of this scope that we could
    // use for readonly operations, but that means we would ask the user for a
    // second auth during creation and I decided to keep the wider scope for
    // all ops for now
    return this.googleAuthApi.getAccessToken(
      'https://www.googleapis.com/auth/cloud-platform',
    );
  }
}
