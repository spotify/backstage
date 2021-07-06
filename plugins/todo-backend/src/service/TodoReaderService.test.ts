/*
 * Copyright 2021 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { TodoItem, TodoReader } from '../lib';
import { TodoReaderService } from './TodoReaderService';

const entityName = {
  kind: 'Component',
  namespace: 'default',
  name: 'my-component',
};

const mockEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'my-component',
    annotations: {
      'backstage.io/managed-by-location':
        'url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    },
  },
  spec: {
    type: 'library',
  },
};

function mockCatalogClient(entity?: Entity): jest.Mocked<CatalogApi> {
  const mock = {
    addLocation: jest.fn(),
    getEntities: jest.fn(),
    getEntityByName: jest.fn(),
    getOriginLocationByEntity: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationById: jest.fn(),
    removeLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
  };
  if (entity) {
    mock.getEntityByName.mockReturnValue(entity);
  }
  return mock;
}

function mockTodoReader(items?: TodoItem[]): jest.Mocked<TodoReader> {
  const mock = {
    readTodos: jest.fn(),
  };
  if (items) {
    mock.readTodos.mockReturnValue({ items });
  }
  return mock;
}

function makeTodo(text: string, extra?: Partial<TodoItem>): TodoItem {
  return { text, tag: 'TODO', ...extra };
}

describe('TodoReaderService', () => {
  it('should be created', () => {
    const service = new TodoReaderService({
      todoReader: mockTodoReader(),
      catalogClient: mockCatalogClient(),
    });
    expect(service.listTodos).toEqual(expect.any(Function));
  });

  it('should list 0 todos', async () => {
    const todoReader = mockTodoReader([]);
    const catalogClient = mockCatalogClient(mockEntity);
    const service = new TodoReaderService({ todoReader, catalogClient });

    await expect(service.listTodos({ entity: entityName })).resolves.toEqual({
      items: [],
      totalCount: 0,
      offset: 0,
      limit: 10,
    });
    expect(catalogClient.getEntityByName).toHaveBeenCalledWith(entityName, {
      token: undefined,
    });
  });

  it('should list, order, and filter todos', async () => {
    const todo1 = makeTodo('todo1');
    const todo2 = makeTodo('todo2', { author: 'foo' });
    const todo3 = makeTodo('todo3', {
      author: 'bar',
      repoFilePath: 'a/b/c.js',
    });
    const todo4 = makeTodo('todo4', { author: 'baz', viewUrl: 'example.com' });
    const todo5 = makeTodo('todo5', { tag: 'FIXME' });

    const todoReader = mockTodoReader([todo1, todo2, todo3, todo4, todo5]);
    const catalogClient = mockCatalogClient({
      ...mockEntity,
      metadata: {
        ...mockEntity.metadata,
        annotations: {
          ['backstage.io/source-location']:
            'url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
        },
      },
    });
    const service = new TodoReaderService({ todoReader, catalogClient });

    await expect(service.listTodos({ entity: entityName })).resolves.toEqual({
      items: [todo1, todo2, todo3, todo4, todo5],
      totalCount: 5,
      offset: 0,
      limit: 10,
    });

    await expect(
      service.listTodos({ entity: entityName, limit: 3 }),
    ).resolves.toEqual({
      items: [todo1, todo2, todo3],
      totalCount: 5,
      offset: 0,
      limit: 3,
    });

    await expect(
      service.listTodos({ entity: entityName, offset: 2 }),
    ).resolves.toEqual({
      items: [todo3, todo4, todo5],
      totalCount: 5,
      offset: 2,
      limit: 10,
    });

    await expect(
      service.listTodos({
        entity: entityName,
        orderBy: { field: 'author', direction: 'asc' },
      }),
    ).resolves.toEqual({
      items: [todo3, todo4, todo2, todo1, todo5],
      totalCount: 5,
      offset: 0,
      limit: 10,
    });

    await expect(
      service.listTodos({
        entity: entityName,
        orderBy: { field: 'author', direction: 'desc' },
        offset: -2,
      }),
    ).resolves.toEqual({
      items: [todo2, todo4, todo3, todo1, todo5],
      totalCount: 5,
      offset: 0,
      limit: 10,
    });

    await expect(
      service.listTodos({
        entity: entityName,
        orderBy: { field: 'text', direction: 'desc' },
        offset: 2,
        limit: 2,
      }),
    ).resolves.toEqual({
      items: [todo3, todo2],
      totalCount: 5,
      offset: 2,
      limit: 2,
    });

    await expect(
      service.listTodos({
        entity: entityName,
        filters: [{ field: 'text', value: '*4' }],
      }),
    ).resolves.toEqual({ items: [todo4], totalCount: 1, offset: 0, limit: 10 });

    await expect(
      service.listTodos({
        entity: entityName,
        filters: [{ field: 'author', value: 'ba*' }],
      }),
    ).resolves.toEqual({
      items: [todo3, todo4],
      totalCount: 2,
      offset: 0,
      limit: 10,
    });

    await expect(
      service.listTodos({
        entity: entityName,
        filters: [{ field: 'author', value: 'ba*' }],
        limit: 1,
      }),
    ).resolves.toEqual({ items: [todo3], totalCount: 2, offset: 0, limit: 1 });

    await expect(
      service.listTodos({
        entity: entityName,
        filters: [
          { field: 'author', value: 'ba*' },
          { field: 'tag', value: 'FIXME' },
        ],
      }),
    ).resolves.toEqual({ items: [], totalCount: 0, offset: 0, limit: 10 });

    await expect(
      service.listTodos({
        entity: entityName,
        filters: [{ field: 'tag', value: 'FIXME' }],
        limit: 500,
      }),
    ).resolves.toEqual({ items: [todo5], totalCount: 1, offset: 0, limit: 50 });

    await expect(
      service.listTodos({ entity: entityName, limit: -5 }),
    ).resolves.toEqual({ items: [], totalCount: 5, offset: 0, limit: 0 });
  });

  it('should have configurable pagination', async () => {
    const todo1 = makeTodo('todo1');
    const todo2 = makeTodo('todo2');
    const todo3 = makeTodo('todo3');
    const todo4 = makeTodo('todo4');
    const todo5 = makeTodo('todo5');

    const todoReader = mockTodoReader([todo1, todo2, todo3, todo4, todo5]);
    const catalogClient = mockCatalogClient(mockEntity);
    const service = new TodoReaderService({
      todoReader,
      catalogClient,
      defaultPageSize: 2,
      maxPageSize: 3,
    });

    await expect(service.listTodos({ entity: entityName })).resolves.toEqual({
      items: [todo1, todo2],
      totalCount: 5,
      offset: 0,
      limit: 2,
    });
    await expect(
      service.listTodos({ entity: entityName, limit: 1 }),
    ).resolves.toEqual({
      items: [todo1],
      totalCount: 5,
      offset: 0,
      limit: 1,
    });
    await expect(
      service.listTodos({ entity: entityName, limit: 3 }),
    ).resolves.toEqual({
      items: [todo1, todo2, todo3],
      totalCount: 5,
      offset: 0,
      limit: 3,
    });
    await expect(
      service.listTodos({ entity: entityName, limit: 4 }),
    ).resolves.toEqual({
      items: [todo1, todo2, todo3],
      totalCount: 5,
      offset: 0,
      limit: 3,
    });
  });

  it('should require an entity', async () => {
    const service = new TodoReaderService({
      todoReader: mockTodoReader(),
      catalogClient: mockCatalogClient(),
    });
    await expect(service.listTodos({})).rejects.toThrow(
      'Entity filter is required to list TODOs',
    );
  });

  it('should throw if entity is not found', async () => {
    const todoReader = mockTodoReader([]);
    const catalogClient = mockCatalogClient();
    const service = new TodoReaderService({ todoReader, catalogClient });

    await expect(service.listTodos({ entity: entityName })).rejects.toEqual(
      expect.objectContaining({
        name: 'NotFoundError',
        message: 'Entity not found, Component:default/my-component',
      }),
    );
    expect(catalogClient.getEntityByName).toHaveBeenCalledWith(entityName, {
      token: undefined,
    });
  });

  it('should throw if entity does not have a location', async () => {
    const todoReader = mockTodoReader([]);
    const catalogClient = mockCatalogClient({
      ...mockEntity,
      metadata: { ...mockEntity.metadata, annotations: undefined },
    });
    const service = new TodoReaderService({ todoReader, catalogClient });

    await expect(service.listTodos({ entity: entityName })).rejects.toEqual(
      expect.objectContaining({
        name: 'InputError',
        message:
          'No entity location annotation found for Component:my-component',
      }),
    );
  });

  it('should throw if entity has an invalid location', async () => {
    const todoReader = mockTodoReader([]);
    const catalogClient = mockCatalogClient({
      ...mockEntity,
      metadata: {
        ...mockEntity.metadata,
        annotations: {
          ['backstage.io/managed-by-location']: 'file:../info.yaml',
        },
      },
    });
    const service = new TodoReaderService({ todoReader, catalogClient });

    await expect(service.listTodos({ entity: entityName })).rejects.toEqual(
      expect.objectContaining({
        name: 'InputError',
        message: `Invalid entity location type for Component:my-component, got 'file'`,
      }),
    );
  });

  it('should throw if entity has an invalid source location', async () => {
    const todoReader = mockTodoReader([]);
    const catalogClient = mockCatalogClient({
      ...mockEntity,
      metadata: {
        ...mockEntity.metadata,
        annotations: {
          ['backstage.io/source-location']: 'file:../info.yaml',
        },
      },
    });
    const service = new TodoReaderService({ todoReader, catalogClient });

    await expect(service.listTodos({ entity: entityName })).rejects.toEqual(
      expect.objectContaining({
        name: 'InputError',
        message: `Invalid entity source location type for Component:my-component, got 'file'`,
      }),
    );
  });
});
