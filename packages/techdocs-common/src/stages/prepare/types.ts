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
import type { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';

export type PreparerResponse = {
  /**
   * The path to directory where the tree is downloaded.
   */
  preparedDir: string;
  /**
   * A unique identifer of the tree blob, usually the commit SHA or etag from the target.
   */
  etag: string;
};

export type PreparerBase = {
  /**
   * Given an Entity definition from the Software Catalog, go and prepare a directory
   * with contents from the location in temporary storage and return the path.
   *
   * @param entity The entity from the Software Catalog
   * @param options.etag (Optional) If etag is provider, it will be used to check if the target has
   * updated since the last build.
   * @throws {NotModifiedError} when the prepared directory has not been changed since the last build.
   */
  prepare(
    entity: Entity,
    options?: { logger?: Logger; etag?: string },
  ): Promise<PreparerResponse>;
};

export type PreparerBuilder = {
  register(protocol: RemoteProtocol, preparer: PreparerBase): void;
  get(entity: Entity): PreparerBase;
};

/**
 * Everything except `url` will be deprecated.
 * Read more https://github.com/backstage/backstage/issues/4409
 */
export type RemoteProtocol =
  | 'url'
  | 'dir'
  | 'github'
  | 'gitlab'
  | 'file'
  | 'azure/api';
