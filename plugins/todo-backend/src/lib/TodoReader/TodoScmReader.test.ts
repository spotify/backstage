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

import {
  getVoidLogger,
  ReadTreeResponse,
  UrlReader,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { createTodoParser } from './createTodoParser';
import { TodoScmReader } from './TodoScmReader';

function mockReader(): jest.Mocked<UrlReader> {
  return {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  } as jest.Mocked<UrlReader>;
}

describe('TodoScmReader', () => {
  it('should be created from config', () => {
    const todoReader = TodoScmReader.fromConfig(new ConfigReader({}), {
      logger: getVoidLogger(),
      reader: mockReader(),
    });
    expect(todoReader).toEqual(expect.any(TodoScmReader));
  });

  it('should read TODOs', async () => {
    const reader = mockReader();
    const todoReader = new TodoScmReader({
      logger: getVoidLogger(),
      reader,
      integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
    });

    reader.readTree.mockResolvedValueOnce({
      etag: 'my-etag',
      files: async () => [
        {
          content: async () => Buffer.from('// TODO: my-todo', 'utf8'),
          path: 'my-folder/my-file.js',
        },
      ],
    } as ReadTreeResponse);

    const url = 'https://github.com/backstage/backstage/catalog-info.yaml';
    const expected = {
      items: [
        {
          text: 'my-todo',
          tag: 'TODO',
          lineNumber: 1,
          repoFilePath: 'my-folder/my-file.js',
          viewUrl:
            'https://github.com/backstage/backstage/my-folder/my-file.js#L1',
        },
      ],
    };

    await expect(todoReader.readTodos({ url })).resolves.toEqual(expected);

    expect(reader.readTree).toHaveBeenCalledTimes(1);
    expect(reader.readTree).toHaveBeenCalledWith(
      'https://github.com/backstage/backstage/catalog-info.yaml',
      {
        etag: undefined,
        filter: expect.any(Function),
      },
    );

    // Filter function should filter out dotfiles
    const filterFunc = reader.readTree.mock.calls[0][1]!.filter!;
    expect(filterFunc('my-file.js')).toBe(true);
    expect(filterFunc('my-folder/my-file.js')).toBe(true);
    expect(filterFunc('.my-file.js')).toBe(false);
    expect(filterFunc('.my-folder/my-file.js')).toBe(false);
    expect(filterFunc('my-folder/.my-file.js')).toBe(false);

    // A NotModifiedError should return a cached result
    reader.readTree.mockRejectedValueOnce(new NotModifiedError('nope'));
    await expect(todoReader.readTodos({ url })).resolves.toEqual(expected);

    expect(reader.readTree).toHaveBeenCalledTimes(2);
    expect(reader.readTree).toHaveBeenLastCalledWith(
      'https://github.com/backstage/backstage/catalog-info.yaml',
      {
        etag: 'my-etag',
        filter: expect.any(Function),
      },
    );

    // Other errors should re-throw
    reader.readTree.mockRejectedValueOnce(new NotFoundError('not found'));
    await expect(todoReader.readTodos({ url })).rejects.toThrow('not found');
  });

  it('should use custom parser', async () => {
    const parser = jest.fn(createTodoParser({ additionalTags: ['XXX'] }));
    const reader = mockReader();
    const todoReader = new TodoScmReader({
      logger: getVoidLogger(),
      reader,
      parser,
      integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
    });

    reader.readTree.mockResolvedValueOnce({
      files: async () => [
        {
          content: async () => Buffer.from('-- XXX: my-todo', 'utf8'),
          path: 'my-file.lua',
        },
      ],
    } as ReadTreeResponse);

    await expect(
      todoReader.readTodos({
        url: 'https://github.com/backstage/backstage/catalog-info.yaml',
      }),
    ).resolves.toEqual({
      items: [
        {
          text: 'my-todo',
          tag: 'XXX',
          lineNumber: 1,
          repoFilePath: 'my-file.lua',
          viewUrl: 'https://github.com/backstage/backstage/my-file.lua#L1',
        },
      ],
    });
    expect(parser).toHaveBeenCalledTimes(1);
    expect(parser).toHaveBeenCalledWith({
      content: '-- XXX: my-todo',
      path: 'my-file.lua',
    });
  });

  it('should log and ignore parser errors', async () => {
    const logger = getVoidLogger();
    const errorSpy = jest.spyOn(logger, 'error');
    const reader = mockReader();
    const todoReader = new TodoScmReader({
      logger,
      reader,
      parser() {
        throw new Error('failed to parse');
      },
      integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
    });

    reader.readTree.mockResolvedValueOnce({
      files: async () => [
        {
          content: async () => Buffer.from('# XXX: my-todo', 'utf8'),
          path: 'my-file.sh',
        },
      ],
    } as ReadTreeResponse);

    await expect(
      todoReader.readTodos({
        url: 'https://github.com/o/r/catalog-info.yaml',
      }),
    ).resolves.toEqual({ items: [] });
    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to parse TODO in https://github.com/o/r/catalog-info.yaml at my-file.sh, Error: failed to parse',
    );
  });
});
