/*
 * Copyright 2020 Spotify AB
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

import globby from 'globby';
import { Logger } from 'winston';
import { Git } from '@backstage/backend-common';
import { Octokit } from '@octokit/rest';

export async function initRepoAndPush({
  dir,
  remoteUrl,
  auth,
  logger,
}: {
  dir: string;
  remoteUrl: string;
  auth: { username: string; password: string };
  logger: Logger;
}): Promise<void> {
  const git = Git.fromAuth({
    username: auth.username,
    password: auth.password,
    logger,
  });

  await git.init({
    dir,
  });

  const paths = await globby(['./**', './**/.*', '!.git'], {
    cwd: dir,
    gitignore: true,
    dot: true,
  });

  for (const filepath of paths) {
    await git.add({ dir, filepath });
  }

  await git.commit({
    dir,
    message: 'Initial commit',
    author: { name: 'Scaffolder', email: 'scaffolder@backstage.io' },
    committer: { name: 'Scaffolder', email: 'scaffolder@backstage.io' },
  });

  await git.addRemote({
    dir,
    url: remoteUrl,
    remote: 'origin',
  });

  await git.push({
    dir,
    remote: 'origin',
  });
}

type BranchProtectionOptions = {
  client: Octokit;
  owner: string;
  repoName: string;
  logger: Logger;
};

export const enableBranchProtectionOnDefaultRepoBranch = async ({
  repoName,
  client,
  owner,
  logger,
}: BranchProtectionOptions): Promise<void> => {
  const tryOnce = async () => {
    try {
      await client.repos.updateBranchProtection({
        mediaType: {
          /**
           * 👇 we need this preview because allowing a custom
           * reviewer count on branch protection is a preview
           * feature
           *
           * More here: https://docs.github.com/en/rest/overview/api-previews#require-multiple-approving-reviews
           */
          previews: ['luke-cage-preview'],
        },
        owner,
        repo: repoName,
        branch: 'master',
        required_status_checks: { strict: true, contexts: [] },
        restrictions: null,
        enforce_admins: true,
        required_pull_request_reviews: { required_approving_review_count: 1 },
      });
    } catch (e) {
      if (
        e.message.includes(
          'Upgrade to GitHub Pro or make this repository public to enable this feature',
        )
      ) {
        logger.warn(
          'Branch protection was not enabled as it requires GitHub Pro for private repositories',
        );
      } else {
        throw e;
      }
    }
  };

  try {
    await tryOnce();
  } catch (e) {
    if (!e.message.includes('Branch not found')) {
      throw e;
    }

    // GitHub has eventual consistency. Fail silently, wait, and try again.
    await new Promise(resolve => setTimeout(resolve, 600));
    await tryOnce();
  }
};
