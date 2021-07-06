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
jest.mock('./helpers');

import os from 'os';
import { resolve as resolvePath } from 'path';
import { getVoidLogger, UrlReader } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createFetchPlainAction } from './plain';
import { PassThrough } from 'stream';
import { fetchContents } from './helpers';

describe('fetch:plain', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );
  const reader: UrlReader = {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const action = createFetchPlainAction({ integrations, reader });
  const mockContext = {
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should disallow a target path outside working directory', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          url:
            'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
          targetPath: '/foobar',
        },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext,
      input: {
        url:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
        targetPath: 'lol',
      },
    });
    expect(fetchContents).toBeCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath, 'lol'),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
      }),
    );
  });
});
