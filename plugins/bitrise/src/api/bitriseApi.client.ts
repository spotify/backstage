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

import { BitriseApi } from './bitriseApi';
import {
  BitriseBuildResponseItem,
  BitriseApp,
  BitriseBuildArtifact,
  BitriseBuildArtifactDetails,
  BitriseQueryParams,
  BitriseBuildListResponse,
  BitriseBuildResult,
} from './bitriseApi.model';
import qs from 'qs';
import { DateTime, Interval } from 'luxon';
import { pickBy, identity } from 'lodash';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export class BitriseClientApi implements BitriseApi {
  constructor(private readonly discoveryApi: DiscoveryApi) {}

  async getArtifactDetails(
    appSlug: string,
    buildSlug: string,
    artifactSlug: string,
  ): Promise<BitriseBuildArtifactDetails | undefined> {
    const baseUrl = await this.discoveryApi.getBaseUrl('proxy');
    const artifactResponse = await fetch(
      `${baseUrl}/bitrise/apps/${appSlug}/builds/${buildSlug}/artifacts/${artifactSlug}`,
    );

    const data = await artifactResponse.json();

    return data.data;
  }

  async getBuildArtifacts(
    appSlug: string,
    buildSlug: string,
  ): Promise<BitriseBuildArtifact[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('proxy');
    const response = await fetch(
      `${baseUrl}/bitrise/apps/${appSlug}/builds/${buildSlug}/artifacts`,
    );

    const data = await response.json();

    return data.data;
  }

  async getAppsPaginated(from: string): Promise<BitriseApp[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('proxy');
    const appsResponse = await fetch(`${baseUrl}/bitrise/apps?next=${from}`);

    const appsData = await appsResponse.json();

    if (appsData.paging?.next) {
      return appsData.data.concat(
        await this.getAppsPaginated(appsData.paging.next),
      );
    }

    return appsData.data;
  }

  async getApps(): Promise<BitriseApp[]> {
    return await this.getAppsPaginated('');
  }

  async getApp(appName: string): Promise<BitriseApp | undefined> {
    const apps = await this.getApps();

    return apps.find(app => app.title === appName);
  }

  async getBuildWorkflows(appSlug: string): Promise<string[]> {
    const baseUrl = await this.discoveryApi.getBaseUrl('proxy');
    const response = await fetch(
      `${baseUrl}/bitrise/apps/${appSlug}/build-workflows`,
    );
    const data = await response.json();
    return data.data;
  }

  async getBuilds(
    appSlug: string,
    params?: BitriseQueryParams,
  ): Promise<BitriseBuildListResponse> {
    const baseUrl = await this.discoveryApi.getBaseUrl('proxy');
    let url = `${baseUrl}/bitrise/apps/${appSlug}/builds`;

    if (params) {
      url = `${url}?${qs.stringify(pickBy(params, identity))}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    const builds: BitriseBuildResponseItem[] = data.data;

    return {
      data: builds.map(
        (build: BitriseBuildResponseItem): BitriseBuildResult => {
          const duration = String(
            Math.round(
              Interval.fromDateTimes(
                DateTime.fromISO(build.started_on_worker_at),
                DateTime.fromISO(build.finished_at),
              ).length('minutes'),
            ),
          );

          return {
            id: build.build_number,
            source: build.commit_view_url,
            status: build.status,
            statusText: build.status_text,
            buildSlug: build.slug,
            message: `${build.branch}`,
            workflow: build.triggered_workflow,
            commitHash: `${build.commit_hash}`,
            triggerTime: build.triggered_at,
            duration: `${duration} minutes`,
            appSlug,
          };
        },
      ),
      paging: data.paging,
    };
  }
}
