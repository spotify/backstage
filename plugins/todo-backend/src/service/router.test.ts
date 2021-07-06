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

import express from 'express';
import request from 'supertest';
import { errorHandler } from '@backstage/backend-common';

import {
  createRouter,
  parseFilterParam,
  parseIntegerParam,
  parseOrderByParam,
} from './router';
import { TodoService } from './types';

const mockListBody = {
  items: [{ text: 'my todo', tag: 'TODO' }],
  totalCount: 1,
  offset: 0,
  limit: 10,
};

function matchErrorResponse(status: number, name: string, message: string) {
  return {
    status,
    body: expect.objectContaining({
      error: { name, message },
      response: {
        statusCode: status,
      },
    }),
  };
}

describe('createRouter', () => {
  let app: express.Express;
  const mockService: jest.Mocked<TodoService> = {
    listTodos: jest.fn(),
  };

  beforeAll(async () => {
    const router = await createRouter({
      todoService: mockService,
    });
    app = express().use(router).use(errorHandler());
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /todos', () => {
    it('returns list without query', async () => {
      mockService.listTodos.mockResolvedValueOnce(mockListBody);

      const response = await request(app).get('/v1/todos');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockListBody);
      expect(mockService.listTodos).toHaveBeenCalledWith(
        {
          entity: undefined,
          offset: undefined,
          limit: undefined,
        },
        { token: undefined },
      );
    });

    it('forwards auth token', async () => {
      mockService.listTodos.mockResolvedValueOnce(mockListBody);

      const response = await request(app)
        .get('/v1/todos')
        .set('Authorization', 'Bearer secret');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockListBody);
      expect(mockService.listTodos).toHaveBeenCalledWith(
        {
          entity: undefined,
          offset: undefined,
          limit: undefined,
        },
        { token: 'secret' },
      );
    });

    it('forwards pagination query', async () => {
      mockService.listTodos.mockResolvedValueOnce(mockListBody);

      const response = await request(app).get('/v1/todos?offset=5&limit=3');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockListBody);
      expect(mockService.listTodos).toHaveBeenCalledWith(
        {
          entity: undefined,
          offset: 5,
          limit: 3,
        },
        { token: undefined },
      );
    });

    it('forwards entity query', async () => {
      mockService.listTodos.mockResolvedValueOnce(mockListBody);

      const response = await request(app).get(
        '/v1/todos?entity=component:my-component',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockListBody);
      expect(mockService.listTodos).toHaveBeenCalledWith(
        {
          entity: {
            name: 'my-component',
            kind: 'component',
            namespace: 'default',
          },
          offset: undefined,
          limit: undefined,
        },
        { token: undefined },
      );
    });

    it('rejects invalid queries', async () => {
      await expect(
        request(app).get('/v1/todos?entity=k:n&entity=k:n'),
      ).resolves.toMatchObject(
        matchErrorResponse(400, 'InputError', 'entity query must be a string'),
      );

      await expect(
        request(app).get('/v1/todos?entity=:n'),
      ).resolves.toMatchObject(
        matchErrorResponse(
          400,
          'InputError',
          'Invalid entity ref, TypeError: Entity reference ":n" was not on the form [<kind>:][<namespace>/]<name>',
        ),
      );

      await expect(
        request(app).get('/v1/todos?offset=1.5'),
      ).resolves.toMatchObject(
        matchErrorResponse(
          400,
          'InputError',
          'invalid offset query, not an integer',
        ),
      );

      expect(mockService.listTodos).not.toHaveBeenCalled();
    });
  });
});

describe('parseIntegerParam', () => {
  it('should parse a param', () => {
    expect(parseIntegerParam('1', 'ctx')).toBe(1);
  });

  it('should reject invalid params', () => {
    expect(() => parseIntegerParam(['1'], 'ctx')).toThrow(
      'invalid ctx, must be a string',
    );
    expect(() => parseIntegerParam('1.5', 'ctx')).toThrow(
      'invalid ctx, not an integer',
    );
    expect(() => parseIntegerParam('foo', 'ctx')).toThrow(
      'invalid ctx, not an integer',
    );
    expect(() => parseIntegerParam('1foo', 'ctx')).toThrow(
      'invalid ctx, not an integer',
    );
  });
});

describe('parseOrderByParam', () => {
  it('should parse a param', () => {
    expect(parseOrderByParam('a=asc', ['a'])).toEqual({
      field: 'a',
      direction: 'asc',
    });
    expect(parseOrderByParam('a=desc', ['a'])).toEqual({
      field: 'a',
      direction: 'desc',
    });
  });

  it('should reject invalid params', () => {
    expect(() => parseOrderByParam(['a=asc'], ['a'])).toThrow(
      'invalid orderBy query, must be a string',
    );
    expect(() => parseOrderByParam('a=desc', ['b', 'c'])).toThrow(
      'invalid orderBy field, must be one of b, c',
    );
    expect(() => parseOrderByParam('b=down', ['a'])).toThrow(
      `invalid orderBy query, order direction must be 'asc' or 'desc'`,
    );
    expect(() => parseOrderByParam('=asc', ['a'])).toThrow(
      'invalid orderBy query, field name is empty',
    );
  });
});

describe('parseFilterParam', () => {
  it('should parse a param', () => {
    expect(parseFilterParam('a=b', ['a'])).toEqual([
      { field: 'a', value: 'b' },
    ]);
    expect(parseFilterParam(['a=b=c', 'c=d*'], ['a', 'c'])).toEqual([
      { field: 'a', value: 'b=c' },
      { field: 'c', value: 'd*' },
    ]);
  });

  it('should reject invalid params', () => {
    expect(() => parseFilterParam({ a: 'a=b' }, ['a'])).toThrow(
      'invalid filter query, must be a string or list of strings',
    );
    expect(() => parseFilterParam('a=b', ['b', 'c'])).toThrow(
      'invalid filter field, must be one of b, c',
    );
    expect(() => parseFilterParam('b', ['a'])).toThrow(
      `invalid filter query, must separate field from value using '='`,
    );
    expect(() => parseFilterParam('=a', ['a'])).toThrow(
      `invalid filter query, must separate field from value using '='`,
    );
    expect(() => parseFilterParam('a=', ['a'])).toThrow(
      'invalid filter query, value may not be empty',
    );
  });
});
