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

import { Entity, EntityMeta } from '@backstage/catalog-model';
import fetch from 'cross-fetch';
import { JsonObject } from '@backstage/config';

export interface ReaderEntityMeta extends EntityMeta {
  uid: string;
  etag: string;
  generation: number;
  namespace: string;
  annotations: Record<string, string>;
  labels: Record<string, string>;
}
export interface ReaderEntity extends Entity {
  metadata: JsonObject & ReaderEntityMeta;
}
export class CatalogClient {
  constructor(private baseUrl: string) {}
  async list(): Promise<ReaderEntity[]> {
    const res = await fetch(`${this.baseUrl}/catalog/entities`);
    if (!res.ok) {
      // todo(blam): need some better way to handle errors here
      // experiment with throwing the input errors etc and having graphql versions of that
      throw new Error(await res.text());
    }

    const entities: ReaderEntity[] = await res.json();
    return entities;
  }
}
