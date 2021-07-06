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

import * as msal from '@azure/msal-node';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import fetch from 'cross-fetch';
import qs from 'qs';
import { MicrosoftGraphProviderConfig } from './config';

export type ODataQuery = {
  filter?: string;
  expand?: string[];
  select?: string[];
};

export type GroupMember =
  | (MicrosoftGraph.Group & { '@odata.type': '#microsoft.graph.user' })
  | (MicrosoftGraph.User & { '@odata.type': '#microsoft.graph.group' });

export class MicrosoftGraphClient {
  static create(config: MicrosoftGraphProviderConfig): MicrosoftGraphClient {
    const clientConfig: msal.Configuration = {
      auth: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        authority: `${config.authority}/${config.tenantId}`,
      },
    };
    const pca = new msal.ConfidentialClientApplication(clientConfig);
    return new MicrosoftGraphClient(config.target, pca);
  }

  constructor(
    private readonly baseUrl: string,
    private readonly pca: msal.ConfidentialClientApplication,
  ) {}

  async *requestCollection<T>(
    path: string,
    query?: ODataQuery,
  ): AsyncIterable<T> {
    let response = await this.requestApi(path, query);

    for (;;) {
      if (response.status !== 200) {
        await this.handleError(path, response);
      }

      const result = await response.json();
      const elements: T[] = result.value;

      yield* elements;

      // Follow cursor to the next page if one is available
      if (!result['@odata.nextLink']) {
        return;
      }

      response = await this.requestRaw(result['@odata.nextLink']);
    }
  }

  async requestApi(path: string, query?: ODataQuery): Promise<Response> {
    const queryString = qs.stringify(
      {
        $filter: query?.filter,
        $select: query?.select?.join(','),
        $expand: query?.expand?.join(','),
      },
      {
        addQueryPrefix: true,
        // Microsoft Graph doesn't like an encoded query string
        encode: false,
      },
    );

    return await this.requestRaw(`${this.baseUrl}/${path}${queryString}`);
  }

  async requestRaw(url: string): Promise<Response> {
    // Make sure that we always have a valid access token (might be cached)
    const token = await this.pca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    if (!token) {
      throw new Error('Error while requesting token for Microsoft Graph');
    }

    return await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
  }

  async getUserProfile(userId: string): Promise<MicrosoftGraph.User> {
    const response = await this.requestApi(`users/${userId}`);

    if (response.status !== 200) {
      await this.handleError('user profile', response);
    }

    return await response.json();
  }

  async getUserPhotoWithSizeLimit(
    userId: string,
    maxSize: number,
  ): Promise<string | undefined> {
    return await this.getPhotoWithSizeLimit('users', userId, maxSize);
  }

  async getUserPhoto(
    userId: string,
    sizeId?: string,
  ): Promise<string | undefined> {
    return await this.getPhoto('users', userId, sizeId);
  }

  async *getUsers(query?: ODataQuery): AsyncIterable<MicrosoftGraph.User> {
    yield* this.requestCollection<MicrosoftGraph.User>(`users`, query);
  }

  async getGroupPhotoWithSizeLimit(
    groupId: string,
    maxSize: number,
  ): Promise<string | undefined> {
    return await this.getPhotoWithSizeLimit('groups', groupId, maxSize);
  }

  async getGroupPhoto(
    groupId: string,
    sizeId?: string,
  ): Promise<string | undefined> {
    return await this.getPhoto('groups', groupId, sizeId);
  }

  async *getGroups(query?: ODataQuery): AsyncIterable<MicrosoftGraph.Group> {
    yield* this.requestCollection<MicrosoftGraph.Group>(`groups`, query);
  }

  async *getGroupMembers(groupId: string): AsyncIterable<GroupMember> {
    yield* this.requestCollection<GroupMember>(`groups/${groupId}/members`);
  }

  async getOrganization(
    tenantId: string,
  ): Promise<MicrosoftGraph.Organization> {
    const response = await this.requestApi(`organization/${tenantId}`);

    if (response.status !== 200) {
      await this.handleError(`organization/${tenantId}`, response);
    }

    return await response.json();
  }

  private async getPhotoWithSizeLimit(
    entityName: string,
    id: string,
    maxSize: number,
  ): Promise<string | undefined> {
    const response = await this.requestApi(`${entityName}/${id}/photos`);

    if (response.status === 404) {
      return undefined;
    } else if (response.status !== 200) {
      await this.handleError(`${entityName} photos`, response);
    }

    const result = await response.json();
    const photos = result.value as MicrosoftGraph.ProfilePhoto[];
    let selectedPhoto: MicrosoftGraph.ProfilePhoto | undefined = undefined;

    // Find the biggest picture that is smaller than the max size
    for (const p of photos) {
      if (
        !selectedPhoto ||
        (p.height! >= selectedPhoto.height! && p.height! <= maxSize)
      ) {
        selectedPhoto = p;
      }
    }

    if (!selectedPhoto) {
      return undefined;
    }

    return await this.getPhoto(entityName, id, selectedPhoto.id!);
  }

  private async getPhoto(
    entityName: string,
    id: string,
    sizeId?: string,
  ): Promise<string | undefined> {
    const path = sizeId
      ? `${entityName}/${id}/photos/${sizeId}/$value`
      : `${entityName}/${id}/photo/$value`;
    const response = await this.requestApi(path);

    if (response.status === 404) {
      return undefined;
    } else if (response.status !== 200) {
      await this.handleError('photo', response);
    }

    return `data:image/jpeg;base64,${Buffer.from(
      await response.arrayBuffer(),
    ).toString('base64')}`;
  }

  private async handleError(path: string, response: Response): Promise<void> {
    const result = await response.json();
    const error = result.error as MicrosoftGraph.PublicError;

    throw new Error(
      `Error while reading ${path} from Microsoft Graph: ${error.code} - ${error.message}`,
    );
  }
}
