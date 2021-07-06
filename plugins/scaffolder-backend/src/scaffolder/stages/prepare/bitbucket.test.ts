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
import { BitbucketPreparer } from './bitbucket';
import { getVoidLogger, Git } from '@backstage/backend-common';
import path from 'path';
import os from 'os';

jest.mock('fs-extra');

describe('BitbucketPreparer', () => {
  const logger = getVoidLogger();
  const mockGitClient = {
    clone: jest.fn(),
  };

  jest.spyOn(Git, 'fromAuth').mockReturnValue(mockGitClient as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const preparer = BitbucketPreparer.fromConfig({
    host: 'bitbucket.org',
    username: 'fake-user',
    appPassword: 'fake-password',
  });

  const workspacePath = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';
  const checkoutPath = path.resolve(workspacePath, 'checkout');
  const templatePath = path.resolve(workspacePath, 'template');

  const prepareOptions = {
    url: 'https://bitbucket.org/backstage-project/backstage-repo',
    logger,
    workspacePath,
  };

  it('calls the clone command with the correct arguments for a repository', async () => {
    await preparer.prepare(prepareOptions);
    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://bitbucket.org/backstage-project/backstage-repo',
      dir: checkoutPath,
      ref: expect.any(String),
    });
    expect(fs.move).toHaveBeenCalledWith(checkoutPath, templatePath);
    expect(fs.rmdir).toHaveBeenCalledWith(path.resolve(templatePath, '.git'));
  });

  it('calls the clone command with the correct arguments if an app password is provided for a repository', async () => {
    const preparerCheck = BitbucketPreparer.fromConfig({
      host: 'bitbucket.org',
      username: 'fake-user',
      appPassword: 'fake-password',
    });
    await preparerCheck.prepare(prepareOptions);

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      username: 'fake-user',
      password: 'fake-password',
    });
  });

  it('calls the clone command with the correct arguments for a repository when no path is provided', async () => {
    await preparer.prepare(prepareOptions);
    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://bitbucket.org/backstage-project/backstage-repo',
      dir: checkoutPath,
      ref: expect.any(String),
    });
  });

  it('moves a template subdirectory to checkout if specified', async () => {
    await preparer.prepare({
      url: 'https://bitbucket.org/foo/bar/src/master/1/2/3',
      logger,
      workspacePath,
    });
    expect(fs.move).toHaveBeenCalledWith(
      path.resolve(checkoutPath, '1', '2', '3'),
      templatePath,
    );
  });

  it('calls the clone command with with token for auth method', async () => {
    const preparerCheck = BitbucketPreparer.fromConfig({
      host: 'bitbucket.org',
      token: 'fake-token',
    });
    await preparerCheck.prepare(prepareOptions);

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      username: 'x-token-auth',
      password: 'fake-token',
    });
  });
});
