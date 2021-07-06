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
import { Publishers } from './publishers';
import { GithubPublisher } from './github';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { AzurePublisher } from './azure';
import { GitlabPublisher } from './gitlab';
import { BitbucketPublisher } from './bitbucket';

jest.mock('@octokit/rest');
jest.mock('azure-devops-node-api');

describe('Publishers', () => {
  const logger = getVoidLogger();

  it('should throw an error when the publisher for the source location is not registered', () => {
    const publishers = new Publishers();

    expect(() => publishers.get('https://github.com/org/repo')).toThrow(
      expect.objectContaining({
        message:
          'Unable to find a publisher for URL: https://github.com/org/repo. Please make sure to register this host under an integration in app-config',
      }),
    );
  });

  it('should return the correct preparer when the source matches for github', async () => {
    const publishers = await Publishers.fromConfig(
      new ConfigReader({
        integrations: {
          github: [{ host: 'github.com', token: 'blob' }],
        },
      }),
      {
        logger,
      },
    );

    expect(publishers.get('https://github.com/org/repo')).toBeInstanceOf(
      GithubPublisher,
    );
  });

  it('should return the correct preparer when the source matches for azure', async () => {
    const publishers = await Publishers.fromConfig(
      new ConfigReader({
        integrations: {
          azure: [{ host: 'dev.azure.com', token: 'blob' }],
        },
      }),
      {
        logger,
      },
    );

    expect(
      publishers.get('https://dev.azure.com/org/project/_git/repo'),
    ).toBeInstanceOf(AzurePublisher);
  });

  it('should return the correct preparer when the source matches for bitbucket', async () => {
    const publishers = await Publishers.fromConfig(
      new ConfigReader({
        integrations: {
          bitbucket: [
            { host: 'bitbucket.com', username: 'foo', token: 'blob' },
          ],
        },
      }),
      {
        logger,
      },
    );
    expect(publishers.get('https://bitbucket.org/owner/repo')).toBeInstanceOf(
      BitbucketPublisher,
    );
  });

  it('should return the correct preparer when the source matches for gitlab', async () => {
    const publishers = await Publishers.fromConfig(
      new ConfigReader({
        integrations: {
          gitlab: [{ host: 'gitlab.com', token: 'blob' }],
        },
      }),
      {
        logger,
      },
    );
    expect(publishers.get('https://gitlab.com/owner/repo')).toBeInstanceOf(
      GitlabPublisher,
    );
  });

  it('should respect registrations for custom URLs for providers using the integrations config', async () => {
    const publishers = await Publishers.fromConfig(
      new ConfigReader({
        integrations: {
          github: [
            { host: 'my.special.github.enterprise.thing', token: 'lolghe' },
          ],
        },
      }),
      {
        logger,
      },
    );

    expect(
      publishers.get('https://my.special.github.enterprise.thing/org/repo'),
    ).toBeInstanceOf(GithubPublisher);
  });
});
