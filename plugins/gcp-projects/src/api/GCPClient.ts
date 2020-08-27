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

import { GCPApi } from './GCPApi';
import { Project, Status, ProjectTrivago } from './types';
import { ProfileInfo } from '@backstage/core';

const BaseURL =
  'https://content-cloudresourcemanager.googleapis.com/v1/projects';

export class GCPClient implements GCPApi {
  async listProjects({ token }: { token: string }): Promise<Project[]> {
    const response = await fetch(BaseURL, {
      headers: new Headers({
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      }),
    });

    if (!response.ok) {
      return [
        {
          name: 'Error',
          projectNumber: 'Response status is not OK',
          projectId: 'Error',
          lifecycleState: 'error',
          createTime: 'Error',
        },
      ];
    }

    const data = await response.json();

    return data.projects;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProject(
    projectId: string,
    token: Promise<string>,
  ): Promise<Project> {
    const url = `${BaseURL}/${projectId}`;
    const response = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${await token}`,
      }),
    });

    const dataBlank: Project = {
      name: 'Error',
      projectNumber: `Response status is ${response.status}`,
      projectId: 'Error',
      lifecycleState: 'error',
      createTime: 'Error',
    };

    if (!response.ok) {
      return dataBlank;
    }

    const data = await response.json();

    const newData: Project = data;

    return newData;
  }

  async createProject(
    projectName: string,
    projectId: string,
    profile?: Promise<ProfileInfo | undefined>,
  ): Promise<string> {
    const status: Status = {
      code: 0,
      message: '',
      details: [],
    };

    // Trivago Specific
    const waitProfile = await profile;

    const newProject: ProjectTrivago = {
      name: projectName,
      projectId: projectId,
      email: waitProfile?.email,
    };

    const cuerpo = JSON.stringify(newProject);

    const middleManURL = 'http://127.0.0.1:8089/newProject';
    const response = await fetch(middleManURL, {
      method: 'POST',
      body: cuerpo,
    });

    if (!response.ok) {
      status.code = response.status;
      return 'Error';
    }

    const data = await response.text();

    return data;
  }
}
