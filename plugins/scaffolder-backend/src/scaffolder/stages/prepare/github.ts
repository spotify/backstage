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
import { Git } from '@backstage/backend-common';
import { PreparerBase, PreparerOptions } from './types';
import parseGitUrl from 'git-url-parse';
import {
  GitHubIntegrationConfig,
  GithubCredentialsProvider,
} from '@backstage/integration';

export class GithubPreparer implements PreparerBase {
  static fromConfig(config: GitHubIntegrationConfig) {
    const credentialsProvider = GithubCredentialsProvider.create(config);
    return new GithubPreparer({ credentialsProvider });
  }

  constructor(
    private readonly config: { credentialsProvider: GithubCredentialsProvider },
  ) {}

  async prepare({ url, workspacePath, logger }: PreparerOptions) {
    const parsedGitUrl = parseGitUrl(url);
    const checkoutPath = path.join(workspacePath, 'checkout');
    const targetPath = path.join(workspacePath, 'template');
    const fullPathToTemplate = path.resolve(
      checkoutPath,
      parsedGitUrl.filepath ?? '',
    );

    const { token } = await this.config.credentialsProvider.getCredentials({
      url,
    });

    const git = token
      ? Git.fromAuth({
          username: 'x-access-token',
          password: token,
          logger,
        })
      : Git.fromAuth({ logger });

    await git.clone({
      url: parsedGitUrl.toString('https'),
      dir: checkoutPath,
      ref: parsedGitUrl.ref,
    });

    await fs.move(fullPathToTemplate, targetPath);

    try {
      await fs.rmdir(path.join(targetPath, '.git'));
    } catch {
      // Ignore intentionally
    }
  }
}
