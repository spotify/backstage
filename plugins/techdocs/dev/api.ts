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
import { EntityName } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { DiscoveryApi, IdentityApi } from '@backstage/core';
import { NotFoundError } from '@backstage/errors';
import { TechDocsStorageApi } from '../src/api';

export class TechDocsDevStorageApi implements TechDocsStorageApi {
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

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  async getStorageUrl() {
    return (
      this.configApi.getOptionalString('techdocs.storageUrl') ??
      `${await this.discoveryApi.getBaseUrl('techdocs')}/static/docs`
    );
  }

  async getBuilder() {
    return this.configApi.getString('techdocs.builder');
  }

  async fetchUrl(url: string) {
    const token = await this.identityApi.getIdToken();
    return fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async getEntityDocs(entityId: EntityName, path: string) {
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
   * Check if docs are the latest version and trigger rebuilds if not
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   * @returns {boolean} Whether documents are currently synchronized to newest version
   * @throws {Error} Throws error on error from sync endpoint
   */
  async syncEntityDocs(entityId: EntityName) {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const url = `${apiOrigin}/sync/${namespace}/${kind}/${name}`;
    let request;
    let attempts: number = 0;
    // retry if request times out, up to 5 times
    // can happen due to docs taking too long to generate
    while (!request || (request.status === 408 && attempts < 5)) {
      attempts++;
      request = await this.fetchUrl(
        `${url.endsWith('/') ? url : `${url}/`}index.html`,
      );
    }

    switch (request.status) {
      case 404:
        throw (await request.json()).error;
      case 200:
      case 201:
        return true;
      // for timeout and misc errors, handle without error to allow viewing older docs
      // if older docs not available,
      // Reader will show 404 error coming from getEntityDocs
      case 408:
      default:
        return false;
    }
  }

  async getBaseUrl(
    oldBaseUrl: string,
    entityId: EntityName,
    path: string,
  ): Promise<string> {
    const { name } = entityId;
    const apiOrigin = await this.getApiOrigin();
    return new URL(oldBaseUrl, `${apiOrigin}/${name}/${path}`).toString();
  }
}
