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

import { ConflictError, NotFoundError } from '@backstage/errors';
import { CatalogApi } from '@backstage/catalog-client';
import { UserEntity } from '@backstage/catalog-model';
import { TokenIssuer } from '../../identity';

type UserQuery = {
  annotations: Record<string, string>;
};

/**
 * A catalog client tailored for reading out identity data from the catalog.
 */
export class CatalogIdentityClient {
  private readonly catalogApi: CatalogApi;
  private readonly tokenIssuer: TokenIssuer;

  constructor(options: { catalogApi: CatalogApi; tokenIssuer: TokenIssuer }) {
    this.catalogApi = options.catalogApi;
    this.tokenIssuer = options.tokenIssuer;
  }

  /**
   * Looks up a single user using a query.
   *
   * Throws a NotFoundError or ConflictError if 0 or multiple users are found.
   */
  async findUser(query: UserQuery): Promise<UserEntity> {
    const filter: Record<string, string> = {
      kind: 'user',
    };
    for (const [key, value] of Object.entries(query.annotations)) {
      filter[`metadata.annotations.${key}`] = value;
    }

    // TODO(Rugvip): cache the token
    const token = await this.tokenIssuer.issueToken({
      claims: { sub: 'backstage.io/auth-backend' },
    });
    const { items } = await this.catalogApi.getEntities({ filter }, { token });

    if (items.length !== 1) {
      if (items.length > 1) {
        throw new ConflictError('User lookup resulted in multiple matches');
      } else {
        throw new NotFoundError('User not found');
      }
    }

    return items[0] as UserEntity;
  }
}
