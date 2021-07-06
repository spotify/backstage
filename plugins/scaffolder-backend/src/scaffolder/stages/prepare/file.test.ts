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

import { getVoidLogger } from '@backstage/backend-common';
import fs from 'fs-extra';
import { FilePreparer } from './file';
import os from 'os';
import path from 'path';

jest.mock('fs-extra');

describe('File preparer', () => {
  it('prepares templates from a file path', async () => {
    const logger = getVoidLogger();
    const preparer = new FilePreparer();
    const root = os.platform() === 'win32' ? 'C:\\' : '/';
    const workspacePath = path.join(root, 'tmp');
    const targetPath = path.resolve(workspacePath, 'template');

    await preparer.prepare({
      url: `file://${root}path/to/template`,
      logger,
      workspacePath,
    });
    expect(fs.copy).toHaveBeenCalledWith(
      path.join(root, 'path', 'to', 'template'),
      targetPath,
      {
        recursive: true,
      },
    );
    expect(fs.ensureDir).toHaveBeenCalledWith(targetPath);

    await expect(
      preparer.prepare({
        url: 'http://not/file/path',
        logger,
        workspacePath,
      }),
    ).rejects.toThrow(
      "Wrong location protocol, should be 'file', http://not/file/path",
    );

    if (os.platform() === 'win32') {
      // eslint-disable-next-line jest/no-conditional-expect
      await expect(
        preparer.prepare({
          url: 'file:///unix/file/path',
          logger,
          workspacePath,
        }),
      ).rejects.toThrow('File URL path must be absolute');
    } else {
      // eslint-disable-next-line jest/no-conditional-expect
      await expect(
        preparer.prepare({
          url: 'file://not/full/path',
          logger,
          workspacePath,
        }),
      ).rejects.toThrow(
        `File URL host must be "localhost" or empty on ${os.platform()}`,
      );
    }
  });
});
