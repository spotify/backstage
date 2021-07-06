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

import fs from 'fs-extra';
import mockFs from 'mock-fs';
import { resolve as resolvePath } from 'path';
import { TarArchiveResponse } from './TarArchiveResponse';

const archiveData = fs.readFileSync(
  resolvePath(__filename, '../../__fixtures__/mock-main.tar.gz'),
);

describe('TarArchiveResponse', () => {
  beforeEach(() => {
    mockFs({
      '/test-archive.tar.gz': archiveData,
      '/tmp': mockFs.directory(),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should read files', async () => {
    const stream = fs.createReadStream('/test-archive.tar.gz');

    const res = new TarArchiveResponse(stream, '', '/tmp', 'etag');
    const files = await res.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
      },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should read files with filter', async () => {
    const stream = fs.createReadStream('/test-archive.tar.gz');

    const res = new TarArchiveResponse(stream, '', '/tmp', 'etag', path =>
      path.endsWith('.yml'),
    );
    const files = await res.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
      },
    ]);
    const content = await files[0].content();
    expect(content.toString('utf8').trim()).toEqual('site_name: Test');
  });

  it('should read as archive and files', async () => {
    const stream = fs.createReadStream('/test-archive.tar.gz');

    const res = new TarArchiveResponse(stream, '', '/tmp', 'etag');
    const buffer = await res.archive();

    await expect(res.archive()).rejects.toThrow(
      'Response has already been read',
    );

    const res2 = new TarArchiveResponse(buffer, '', '/tmp', 'etag');
    const files = await res2.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
      },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should extract entire archive into directory', async () => {
    const stream = fs.createReadStream('/test-archive.tar.gz');

    const res = new TarArchiveResponse(stream, '', '/tmp', 'etag');
    const dir = await res.dir();
    await expect(
      fs.readFile(resolvePath(dir, 'mkdocs.yml'), 'utf8'),
    ).resolves.toBe('site_name: Test\n');
    await expect(
      fs.readFile(resolvePath(dir, 'docs/index.md'), 'utf8'),
    ).resolves.toBe('# Test\n');
  });

  it('should extract archive into directory with a subpath', async () => {
    const stream = fs.createReadStream('/test-archive.tar.gz');

    const res = new TarArchiveResponse(stream, 'docs', '/tmp', 'etag');
    const dir = await res.dir();

    expect(dir).toMatch(/^[\/\\]tmp[\/\\].*$/);
    await expect(
      fs.readFile(resolvePath(dir, 'index.md'), 'utf8'),
    ).resolves.toBe('# Test\n');
  });

  it('should extract archive into directory with a subpath and filter', async () => {
    const stream = fs.createReadStream('/test-archive.tar.gz');

    const res = new TarArchiveResponse(stream, '', '/tmp', 'etag', path =>
      path.endsWith('.yml'),
    );
    const dir = await res.dir({ targetDir: '/tmp' });

    expect(dir).toBe('/tmp');
    await expect(fs.pathExists(resolvePath(dir, 'mkdocs.yml'))).resolves.toBe(
      true,
    );
    await expect(
      fs.pathExists(resolvePath(dir, 'docs/index.md')),
    ).resolves.toBe(false);
  });
});
