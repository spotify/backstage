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
import path from 'path';
import mockFs from 'mock-fs';
import { movePlugin } from './createPlugin';

const id = 'testPluginMock';

describe('createPlugin', () => {
  afterAll(() => {
    mockFs.restore();
  });

  describe('movePlugin', () => {
    it('should move the temporary plugin directory to its final place', async () => {
      mockFs({
        [id]: {},
      });
      const tempDir = id;
      const pluginDir = path.join('test-temp', 'plugins', id);

      await movePlugin(tempDir, pluginDir, id);
      await expect(fs.pathExists(pluginDir)).resolves.toBe(true);
      expect(pluginDir).toMatch(path.join('', 'plugins', id));
    });
  });
});
