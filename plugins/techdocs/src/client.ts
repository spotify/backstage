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

import { EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { NotFoundError, ResponseError } from '@backstage/errors';
import EventSource from 'eventsource';
import { SyncResult, TechDocsApi, TechDocsStorageApi } from './api';
import { TechDocsEntityMetadata, TechDocsMetadata } from './types';

/**
 * API to talk to techdocs-backend.
 *
 * @property {string} apiOrigin Set to techdocs.requestUrl as the URL for techdocs-backend API
 */
export class TechDocsClient implements TechDocsApi {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;
  public identityApi: IdentityApi;

  constructor({
    configApi,
    discoveryApi,
    identityApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
  }

  async getApiOrigin(): Promise<string> {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  /**
   * Retrieve TechDocs metadata.
   *
   * When docs are built, we generate a techdocs_metadata.json and store it along with the generated
   * static files. It includes necessary data about the docs site. This method requests techdocs-backend
   * which retrieves the TechDocs metadata.
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   */
  async getTechDocsMetadata(entityId: EntityName): Promise<TechDocsMetadata> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/metadata/techdocs/${namespace}/${kind}/${name}`;
    const token = await this.identityApi.getIdToken();

    const request = await fetch(`${requestUrl}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!request.ok) {
      throw await ResponseError.fromResponse(request);
    }

    return await request.json();
  }

  /**
   * Retrieve metadata about an entity.
   *
   * This method requests techdocs-backend which uses the catalog APIs to respond with filtered
   * information required here.
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   */
  async getEntityMetadata(
    entityId: EntityName,
  ): Promise<TechDocsEntityMetadata> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/metadata/entity/${namespace}/${kind}/${name}`;
    const token = await this.identityApi.getIdToken();

    const request = await fetch(`${requestUrl}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!request.ok) {
      throw await ResponseError.fromResponse(request);
    }

    return await request.json();
  }
}

/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @property {string} apiOrigin Set to techdocs.requestUrl as the URL for techdocs-backend API
 */
export class TechDocsStorageClient implements TechDocsStorageApi {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;
  public identityApi: IdentityApi;

  constructor({
    configApi,
    discoveryApi,
    identityApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
  }

  async getApiOrigin(): Promise<string> {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  async getStorageUrl(): Promise<string> {
    return (
      this.configApi.getOptionalString('techdocs.storageUrl') ??
      `${await this.discoveryApi.getBaseUrl('techdocs')}/static/docs`
    );
  }

  async getBuilder(): Promise<string> {
    return this.configApi.getString('techdocs.builder');
  }

  /**
   * Fetch HTML content as text for an individual docs page in an entity's docs site.
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   * @param {string} path The unique path to an individual docs page e.g. overview/what-is-new
   * @returns {string} HTML content of the docs page as string
   * @throws {Error} Throws error when the page is not found.
   */
  async getEntityDocs(entityId: EntityName, path: string): Promise<string> {
    const { kind, namespace, name } = entityId;

    const storageUrl = await this.getStorageUrl();
    const url = `${storageUrl}/${namespace}/${kind}/${name}/${path}`;
    const token = await this.identityApi.getIdToken();

    const request = await fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );

    let errorMessage = '';
    switch (request.status) {
      case 404:
        errorMessage = 'Page not found. ';
        // path is empty for the home page of an entity's docs site
        if (!path) {
          errorMessage +=
            'This could be because there is no index.md file in the root of the docs directory of this repository.';
        }
        throw new NotFoundError(errorMessage);
      case 500:
        errorMessage =
          'Could not generate documentation or an error in the TechDocs backend. ';
        throw new Error(errorMessage);
      default:
        // Do nothing
        break;
    }

    return request.text();
  }

  /**
   * Check if docs are on the latest version and trigger rebuild if not
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   * @param {Function} logHandler Callback to receive log messages from the build process
   * @returns {SyncResult} Whether documents are currently synchronized to newest version
   * @throws {Error} Throws error on error from sync endpoint in Techdocs Backend
   */
  async syncEntityDocs(
    entityId: EntityName,
    logHandler: (line: string) => void = () => {},
  ): Promise<SyncResult> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const url = `${apiOrigin}/sync/${namespace}/${kind}/${name}`;
    const token = await this.identityApi.getIdToken();

    return new Promise((resolve, reject) => {
      const source = new EventSource(url, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      source.addEventListener('log', (e: any) => {
        if (e.data) {
          logHandler(JSON.parse(e.data));
        }
      });

      source.addEventListener('finish', (e: any) => {
        let updated: boolean = false;

        if (e.data) {
          ({ updated } = JSON.parse(e.data));
        }

        resolve(updated ? 'updated' : 'cached');
      });

      source.onerror = (e: any) => {
        source.close();

        switch (e.status) {
          // the endpoint returned a 404 status
          case 404:
            reject(new NotFoundError(e.message));
            return;

          // also handles the event-stream close. the reject is ignored if the Promise was already
          // resolved by a finish event.
          default:
            reject(new Error(e.data));
            return;
        }
      };
    });
  }

  async getBaseUrl(
    oldBaseUrl: string,
    entityId: EntityName,
    path: string,
  ): Promise<string> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    return new URL(
      oldBaseUrl,
      `${apiOrigin}/static/docs/${namespace}/${kind}/${name}/${path}`,
    ).toString();
  }
}
