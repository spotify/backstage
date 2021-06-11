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

import { Entity, EntityName, Location } from '@backstage/catalog-model';
import {
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  CatalogEntitiesRequest,
  CatalogListResponse,
  CatalogClient,
} from '@backstage/catalog-client';
import { IdentityApi } from '@backstage/core';

type CatalogRequestOptions = {
  token?: string;
};

/**
 * CatalogClient wrapper that injects identity token for all requests
 */
export class CatalogClientWrapper implements CatalogApi {
  private readonly identityApi: IdentityApi;
  private readonly client: CatalogClient;

  constructor(options: { client: CatalogClient; identityApi: IdentityApi }) {
    this.client = options.client;
    this.identityApi = options.identityApi;
  }

  async getLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getLocationById(id, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getEntities(
    request?: CatalogEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogListResponse<Entity>> {
    return await this.client.getEntities(request, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getEntityByName(
    compoundName: EntityName,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    return await this.client.getEntityByName(compoundName, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async addLocation(
    request: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    return await this.client.addLocation(request, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getOriginLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getOriginLocationByEntity(entity, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async getLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.client.getLocationByEntity(entity, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async removeLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return await this.client.removeLocationById(id, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }

  async removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    return await this.client.removeEntityByUid(uid, {
      token: options?.token ?? (await this.identityApi.getIdToken()),
    });
  }
}
