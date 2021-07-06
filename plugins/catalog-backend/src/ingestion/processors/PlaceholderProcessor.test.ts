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
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import {
  jsonPlaceholderResolver,
  PlaceholderProcessor,
  PlaceholderResolver,
  ResolverParams,
  ResolverRead,
  textPlaceholderResolver,
  yamlPlaceholderResolver,
} from './PlaceholderProcessor';

describe('PlaceholderProcessor', () => {
  const read: jest.MockedFunction<ResolverRead> = jest.fn();
  const reader: UrlReader = { read, readTree: jest.fn(), search: jest.fn() };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns placeholder-free data unchanged', async () => {
    const input: Entity = {
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
    };
    const processor = new PlaceholderProcessor({
      resolvers: {
        foo: async () => 'replaced',
      },
      reader,
    });
    await expect(
      processor.preProcessEntity(input, { type: 't', target: 'l' }),
    ).resolves.toBe(input);
  });

  it('replaces placeholders deep in the data', async () => {
    const upperResolver: PlaceholderResolver = jest.fn(async ({ value }) =>
      value!.toString().toUpperCase(),
    );
    const processor = new PlaceholderProcessor({
      resolvers: {
        upper: upperResolver,
      },
      reader,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { a: [{ b: { $upper: 'text' } }] },
        },
        { type: 'fake', target: 'http://example.com' },
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { a: [{ b: 'TEXT' }] },
    });

    expect(read).not.toBeCalled();
    expect(upperResolver).toBeCalledWith(
      expect.objectContaining({
        key: 'upper',
        value: 'text',
        baseUrl: 'http://example.com',
      }),
    );
  });

  it('ignores multiple placeholders', async () => {
    const processor = new PlaceholderProcessor({
      resolvers: {
        foo: jest.fn(),
        bar: jest.fn(),
      },
      reader,
    });
    const entity: Entity = {
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n', x: { $foo: 'a', $bar: 'b' } },
    };

    await expect(
      processor.preProcessEntity(entity, { type: 'a', target: 'b' }),
    ).resolves.toEqual(entity);

    expect(read).not.toBeCalled();
  });

  it('ignores unknown placeholders', async () => {
    const processor = new PlaceholderProcessor({
      resolvers: {
        bar: jest.fn(),
      },
      reader,
    });
    const entity: Entity = {
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n', x: { $foo: 'a' } },
    };

    await expect(
      processor.preProcessEntity(entity, { type: 'a', target: 'b' }),
    ).resolves.toEqual(entity);

    expect(read).not.toBeCalled();
  });

  it('works with the text resolver', async () => {
    read.mockResolvedValue(Buffer.from('TEXT', 'utf-8'));
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { data: { $text: '../file.txt' } },
        },
        {
          type: 'github',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: 'TEXT' },
    });

    expect(read).toBeCalledWith(
      'https://github.com/backstage/backstage/a/file.txt',
    );
  });

  it('works with the json resolver', async () => {
    read.mockResolvedValue(
      Buffer.from(JSON.stringify({ a: ['b', 7] }), 'utf-8'),
    );
    const processor = new PlaceholderProcessor({
      resolvers: { json: jsonPlaceholderResolver },
      reader,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { data: { $json: './file.json' } },
        },
        {
          type: 'github',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: { a: ['b', 7] } },
    });

    expect(read).toBeCalledWith(
      'https://github.com/backstage/backstage/a/b/file.json',
    );
  });

  it('works with the yaml resolver', async () => {
    read.mockResolvedValue(Buffer.from('foo:\n  - bar: 7', 'utf-8'));
    const processor = new PlaceholderProcessor({
      resolvers: { yaml: yamlPlaceholderResolver },
      reader,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { data: { $yaml: '../file.yaml' } },
        },
        {
          type: 'github',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: { foo: [{ bar: 7 }] } },
    });

    expect(read).toBeCalledWith(
      'https://github.com/backstage/backstage/a/file.yaml',
    );
  });

  it('resolves absolute path for absolute location', async () => {
    read.mockResolvedValue(Buffer.from('TEXT', 'utf-8'));
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: {
            data: {
              $text: 'https://github.com/backstage/backstage/catalog-info.yaml',
            },
          },
        },
        {
          type: 'github',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: 'TEXT' },
    });

    expect(read).toBeCalledWith(
      'https://github.com/backstage/backstage/catalog-info.yaml',
    );
  });

  it('resolves absolute path for relative file location', async () => {
    read.mockResolvedValue(Buffer.from('TEXT', 'utf-8'));
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: {
            data: {
              $text: 'https://github.com/backstage/backstage/catalog-info.yaml',
            },
          },
        },
        {
          type: 'github',
          target: './a/b/catalog-info.yaml',
        },
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: 'TEXT' },
    });

    expect(read).toBeCalledWith(
      'https://github.com/backstage/backstage/catalog-info.yaml',
    );
  });

  it('not resolves relative file path for relative file location', async () => {
    // We explicitly don't support this case, as it would allow for file system
    // traversal attacks. If we want to implement this, we need to have additional
    // security measures in place!
    read.mockResolvedValue(Buffer.from('TEXT', 'utf-8'));
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: {
            data: {
              $text: '../c/catalog-info.yaml',
            },
          },
        },
        {
          type: 'github',
          target: './a/b/catalog-info.yaml',
        },
      ),
    ).rejects.toThrow(
      'Placeholder $text could not form a URL out of ./a/b/catalog-info.yaml and ../c/catalog-info.yaml',
    );

    expect(read).not.toBeCalled();
  });
});

describe('yamlPlaceholderResolver', () => {
  const read: jest.MockedFunction<ResolverRead> = jest.fn();
  const params: ResolverParams = {
    key: 'a',
    value: './file.yaml',
    baseUrl: 'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
    read,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('parses valid yaml', async () => {
    read.mockResolvedValue(Buffer.from('foo:\n  - bar: 7', 'utf-8'));
    await expect(yamlPlaceholderResolver(params)).resolves.toEqual({
      foo: [{ bar: 7 }],
    });
  });

  it('rejects invalid yaml', async () => {
    read.mockResolvedValue(Buffer.from('a: 1\n----\n', 'utf-8'));
    await expect(yamlPlaceholderResolver(params)).rejects.toThrow(
      'Placeholder $a found an error in the data at ./file.yaml, YAMLSemanticError: Implicit map keys need to be followed by map values',
    );
  });

  it('rejects multi-document yaml', async () => {
    read.mockResolvedValue(Buffer.from('foo: 1\n---\nbar: 2\n', 'utf-8'));
    await expect(yamlPlaceholderResolver(params)).rejects.toThrow(
      'Placeholder $a expected to find exactly one document of data at ./file.yaml, found 2',
    );
  });

  it('parses valid json', async () => {
    read.mockResolvedValue(
      Buffer.from(JSON.stringify({ a: ['b', 7] }), 'utf-8'),
    );
    await expect(yamlPlaceholderResolver(params)).resolves.toEqual({
      a: ['b', 7],
    });
  });
});

describe('jsonPlaceholderResolver', () => {
  const read: jest.MockedFunction<ResolverRead> = jest.fn();
  const params: ResolverParams = {
    key: 'a',
    value: './file.json',
    baseUrl: 'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
    read,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('parses valid json', async () => {
    read.mockResolvedValue(
      Buffer.from(JSON.stringify({ a: ['b', 7] }), 'utf-8'),
    );
    await expect(jsonPlaceholderResolver(params)).resolves.toEqual({
      a: ['b', 7],
    });
  });

  it('rejects invalid json', async () => {
    read.mockResolvedValue(Buffer.from('}', 'utf-8'));
    await expect(jsonPlaceholderResolver(params)).rejects.toThrow(
      'Placeholder $a failed to parse JSON data at ./file.json, SyntaxError: Unexpected token } in JSON at position 0',
    );
  });
});
