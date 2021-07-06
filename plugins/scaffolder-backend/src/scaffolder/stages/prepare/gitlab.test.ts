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
import os from 'os';
import path from 'path';
import { GitlabPreparer } from './gitlab';
import { getVoidLogger, Git } from '@backstage/backend-common';

jest.mock('fs-extra');

describe('GitLabPreparer', () => {
  const workspacePath = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';
  const checkoutPath = path.resolve(workspacePath, 'checkout');
  const templatePath = path.resolve(workspacePath, 'template');

  const mockGitClient = {
    clone: jest.fn(),
  };
  const logger = getVoidLogger();

  jest.spyOn(Git, 'fromAuth').mockReturnValue(mockGitClient as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const preparer = GitlabPreparer.fromConfig({
    host: '<ignored>',
    token: 'fake-token',
    apiBaseUrl: '<ignored>',
    baseUrl: '<ignored>',
  });

  it(`calls the clone command with the correct arguments for a repository`, async () => {
    await preparer.prepare({
      url:
        'https://gitlab.com/benjdlambert/backstage-graphql-template/-/blob/master',
      logger,
      workspacePath,
    });

    expect(mockGitClient.clone).toHaveBeenCalledWith({
      url: 'https://gitlab.com/benjdlambert/backstage-graphql-template.git',
      dir: checkoutPath,
      ref: expect.any(String),
    });

    expect(Git.fromAuth).toHaveBeenCalledWith({
      logger,
      username: 'oauth2',
      password: 'fake-token',
    });

    expect(fs.move).toHaveBeenCalledWith(checkoutPath, templatePath);
    expect(fs.rmdir).toHaveBeenCalledWith(path.resolve(templatePath, '.git'));
  });

  it(`clones the template from a sub directory if specified`, async () => {
    await preparer.prepare({
      url:
        'https://gitlab.com/benjdlambert/backstage-graphql-template/-/blob/master/1/2/3',
      logger,
      workspacePath,
    });
    expect(fs.move).toHaveBeenCalledWith(
      path.resolve(checkoutPath, '1', '2', '3'),
      templatePath,
    );
  });
});
