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

import { EntityName, parseEntityName } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import express from 'express';
import Router from 'express-promise-router';
import { TodoService } from './types';

const TODO_FIELDS = [
  'text',
  'tag',
  'author',
  'viewUrl',
  'repoFilePath',
] as const;

export interface RouterOptions {
  todoService: TodoService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { todoService } = options;

  const router = Router();
  router.use(express.json());

  router.get('/v1/todos', async (req, res) => {
    const offset = parseIntegerParam(req.query.offset, 'offset query');
    const limit = parseIntegerParam(req.query.limit, 'limit query');
    const orderBy = parseOrderByParam(req.query.orderBy, TODO_FIELDS);
    const filters = parseFilterParam(req.query.filter, TODO_FIELDS);

    const entityRef = req.query.entity;
    if (entityRef && typeof entityRef !== 'string') {
      throw new InputError(`entity query must be a string`);
    }
    let entity: EntityName | undefined = undefined;
    if (entityRef) {
      try {
        entity = parseEntityName(entityRef);
      } catch (error) {
        throw new InputError(`Invalid entity ref, ${error}`);
      }
    }

    const todos = await todoService.listTodos(
      {
        entity,
        offset,
        limit,
        orderBy,
        filters,
      },
      {
        token: getBearerToken(req.headers.authorization),
      },
    );
    res.json(todos);
  });

  return router;
}

export function parseIntegerParam(
  str: unknown,
  ctx: string,
): number | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new InputError(`invalid ${ctx}, must be a string`);
  }
  const parsed = parseInt(str, 10);
  if (!Number.isInteger(parsed) || String(parsed) !== str) {
    throw new InputError(`invalid ${ctx}, not an integer`);
  }
  return parsed;
}

export function parseOrderByParam<T extends readonly string[]>(
  str: unknown,
  allowedFields: T,
): { field: T[number]; direction: 'asc' | 'desc' } | undefined {
  if (str === undefined) {
    return undefined;
  }
  if (typeof str !== 'string') {
    throw new InputError(`invalid orderBy query, must be a string`);
  }
  const [field, direction] = str.split('=');
  if (!field) {
    throw new InputError(`invalid orderBy query, field name is empty`);
  }
  if (direction !== 'asc' && direction !== 'desc') {
    throw new InputError(
      `invalid orderBy query, order direction must be 'asc' or 'desc'`,
    );
  }

  if (field && !allowedFields.includes(field)) {
    throw new InputError(
      `invalid orderBy field, must be one of ${allowedFields.join(', ')}`,
    );
  }
  return { field, direction };
}

export function parseFilterParam<T extends readonly string[]>(
  str: unknown,
  allowedFields: T,
): { field: T[number]; value: string }[] | undefined {
  if (str === undefined) {
    return undefined;
  }

  const filters = new Array<{ field: T[number]; value: string }>();

  const strs = [str].flat();
  for (const filterStr of strs) {
    if (typeof filterStr !== 'string') {
      throw new InputError(
        `invalid filter query, must be a string or list of strings`,
      );
    }
    const splitIndex = filterStr.indexOf('=');
    if (splitIndex <= 0) {
      throw new InputError(
        `invalid filter query, must separate field from value using '='`,
      );
    }

    const field = filterStr.slice(0, splitIndex);
    if (!allowedFields.includes(field)) {
      throw new InputError(
        `invalid filter field, must be one of ${allowedFields.join(', ')}`,
      );
    }

    const value = filterStr.slice(splitIndex + 1);
    if (!value) {
      throw new InputError(`invalid filter query, value may not be empty`);
    }
    filters.push({ field, value });
  }

  return filters;
}

function getBearerToken(header?: string): string | undefined {
  return header?.match(/Bearer\s+(\S+)/i)?.[1];
}
