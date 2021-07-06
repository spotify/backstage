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
import mockFs from 'mock-fs';
import * as os from 'os';
import * as path from 'path';
import { getFileTreeRecursively, getHeadersForFileExtension } from './helpers';

describe('getHeadersForFileExtension', () => {
  const correctMapOfExtensions = [
    ['.html', 'text/plain; charset=utf-8'],
    ['.htm', 'text/plain; charset=utf-8'],
    ['.HTML', 'text/plain; charset=utf-8'],
    ['.dhtml', 'text/plain; charset=utf-8'],
    ['.xhtml', 'text/plain; charset=utf-8'],
    ['.xml', 'text/plain; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.svg', 'text/plain; charset=utf-8'],
    ['.SVG', 'text/plain; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.this-in-not-an-extension', 'text/plain; charset=utf-8'],
  ];

  test.each(correctMapOfExtensions)(
    'check content-type for %s extension',
    (extension, expectedContentType) => {
      const headers = getHeadersForFileExtension(extension);
      expect(headers).toHaveProperty('Content-Type');
      expect(headers['Content-Type'].toLowerCase()).toBe(expectedContentType);
    },
  );
});

describe('getFileTreeRecursively', () => {
  const root = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

  beforeEach(() => {
    mockFs({
      [root]: {
        file1: '',
        subDirA: {
          file2: '',
          emptyDir1: mockFs.directory(),
        },
        emptyDir2: mockFs.directory(),
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('returns complete file tree of a path', async () => {
    const fileList = await getFileTreeRecursively(root);
    expect(fileList.length).toBe(2);
    expect(fileList).toContain(path.resolve(root, 'file1'));
    expect(fileList).toContain(path.resolve(root, 'subDirA/file2'));
  });
});
