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

import { getVoidLogger } from '@backstage/backend-common';
import mock from 'mock-fs';
import os from 'os';
import { Writable } from 'stream';
import { createDebugLogAction } from './log';
import { join } from 'path';

describe('debug:log', () => {
  const logStream = ({
    write: jest.fn(),
  } as jest.Mocked<Partial<Writable>>) as jest.Mocked<Writable>;

  const mockTmpDir = os.tmpdir();
  const mockContext = {
    input: {},
    baseUrl: 'somebase',
    workspacePath: mockTmpDir,
    logger: getVoidLogger(),
    logStream,
    output: jest.fn(),
    createTemporaryDirectory: jest.fn().mockResolvedValue(mockTmpDir),
  };

  const action = createDebugLogAction();

  beforeEach(() => {
    mock({
      [`${mockContext.workspacePath}/README.md`]: '',
      [`${mockContext.workspacePath}/a-directory/index.md`]: '',
    });
    jest.resetAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should do nothing', async () => {
    await action.handler(mockContext);

    expect(logStream.write).toBeCalledTimes(0);
  });

  it('should log the workspace content, if active', async () => {
    const context = {
      ...mockContext,
      input: {
        listWorkspace: 'true',
      },
    };

    await action.handler(context);

    expect(logStream.write).toBeCalledTimes(1);
    expect(logStream.write).toBeCalledWith(
      expect.stringContaining('README.md'),
    );
    expect(logStream.write).toBeCalledWith(
      expect.stringContaining(join('a-directory', 'index.md')),
    );
  });

  it('should log message', async () => {
    const context = {
      ...mockContext,
      input: {
        message: 'Hello Backstage!',
      },
    };

    await action.handler(context);

    expect(logStream.write).toBeCalledTimes(1);
    expect(logStream.write).toBeCalledWith(
      expect.stringContaining('Hello Backstage!'),
    );
  });
});
