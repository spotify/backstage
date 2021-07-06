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

import { InputError } from '@backstage/errors';
import { Knex } from 'knex';
import {
  EntitiesCatalog,
  EntitiesRequest,
  EntitiesResponse,
} from '../catalog/types';
import { DbPageInfo, EntityPagination } from '../database/types';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from './database/tables';

function parsePagination(
  input?: EntityPagination,
): { limit?: number; offset?: number } {
  if (!input) {
    return {};
  }

  let { limit, offset } = input;

  if (input.after !== undefined) {
    let cursor;
    try {
      const json = Buffer.from(input.after, 'base64').toString('utf8');
      cursor = JSON.parse(json);
    } catch {
      throw new InputError('Malformed after cursor, could not be parsed');
    }
    if (cursor.limit !== undefined) {
      if (!Number.isInteger(cursor.limit)) {
        throw new InputError('Malformed after cursor, limit was not an number');
      }
      limit = cursor.limit;
    }
    if (cursor.offset !== undefined) {
      if (!Number.isInteger(cursor.offset)) {
        throw new InputError('Malformed after cursor, offset was not a number');
      }
      offset = cursor.offset;
    }
  }

  return { limit, offset };
}

function stringifyPagination(input: { limit: number; offset: number }) {
  const json = JSON.stringify({ limit: input.limit, offset: input.offset });
  const base64 = Buffer.from(json, 'utf8').toString('base64');
  return base64;
}

export class NextEntitiesCatalog implements EntitiesCatalog {
  constructor(private readonly database: Knex) {}

  async entities(request?: EntitiesRequest): Promise<EntitiesResponse> {
    const db = this.database;

    let entitiesQuery = db<DbFinalEntitiesRow>('final_entities');

    for (const singleFilter of request?.filter?.anyOf ?? []) {
      entitiesQuery = entitiesQuery.orWhere(function singleFilterFn() {
        for (const { key, matchValueIn } of singleFilter.allOf) {
          // NOTE(freben): This used to be a set of OUTER JOIN, which may seem to
          // make a lot of sense. However, it had abysmal performance on sqlite
          // when datasets grew large, so we're using IN instead.
          const matchQuery = db<DbSearchRow>('search')
            .select('entity_id')
            .where(function keyFilter() {
              this.andWhere({ key: key.toLowerCase() });
              if (matchValueIn) {
                if (matchValueIn.length === 1) {
                  this.andWhere({ value: matchValueIn[0].toLowerCase() });
                } else if (matchValueIn.length > 1) {
                  this.andWhere(
                    'value',
                    'in',
                    matchValueIn.map(v => v.toLowerCase()),
                  );
                }
              }
            });
          this.andWhere('entity_id', 'in', matchQuery);
        }
      });
    }

    // TODO: move final_entities to use entity_ref
    entitiesQuery = entitiesQuery
      .select('final_entities.*')
      .whereNotNull('final_entities.final_entity')
      .orderBy('entity_id', 'asc');

    const { limit, offset } = parsePagination(request?.pagination);
    if (limit !== undefined) {
      entitiesQuery = entitiesQuery.limit(limit + 1);
    }
    if (offset !== undefined) {
      entitiesQuery = entitiesQuery.offset(offset);
    }

    let rows = await entitiesQuery;

    let pageInfo: DbPageInfo;
    if (limit === undefined || rows.length <= limit) {
      pageInfo = { hasNextPage: false };
    } else {
      rows = rows.slice(0, -1);
      pageInfo = {
        hasNextPage: true,
        endCursor: stringifyPagination({
          limit,
          offset: (offset ?? 0) + limit,
        }),
      };
    }

    const dbResponse = rows.map(e => JSON.parse(e.final_entity!));

    const entities = dbResponse.map(e =>
      request?.fields ? request.fields(e) : e,
    );

    return {
      entities,
      pageInfo,
    };
  }

  async removeEntityByUid(uid: string): Promise<void> {
    await this.database<DbRefreshStateRow>('refresh_state')
      .where('entity_id', uid)
      .delete();
  }

  async batchAddOrUpdateEntities(): Promise<never> {
    throw new Error('Not implemented');
  }
}
