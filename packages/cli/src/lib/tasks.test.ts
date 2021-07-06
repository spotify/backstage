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
import { templatingTask } from './tasks';

describe('templatingTask', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should template a directory with mix of regular files and templates', async () => {
    // Testing template directory
    const tmplDir = 'test-tmpl';

    // Temporary dest dir to write the template to
    const destDir = 'test-dest';

    // Files content
    const testFileContent = 'testing';
    const testVersionFileContent =
      "version: {{pluginVersion}} {{version 'mock-pkg'}}";

    mockFs({
      [tmplDir]: {
        sub: {
          'version.txt.hbs': testVersionFileContent,
        },
        'test.txt': testFileContent,
      },
      [destDir]: {},
    });

    await templatingTask(
      tmplDir,
      destDir,
      {
        pluginVersion: '0.0.0',
      },
      { 'mock-pkg': '0.1.2' },
    );

    await expect(
      fs.readFile(resolvePath(destDir, 'test.txt'), 'utf8'),
    ).resolves.toBe(testFileContent);
    await expect(
      fs.readFile(resolvePath(destDir, 'sub/version.txt'), 'utf8'),
    ).resolves.toBe('version: 0.0.0 0.1.2');
  });
});
