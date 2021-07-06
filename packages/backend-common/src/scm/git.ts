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
import git, {
  ProgressCallback,
  MergeResult,
  ReadCommitResult,
} from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs-extra';
import { Logger } from 'winston';

/*
provider    username         password
GitHub      'x-access-token' token
BitBucket   'x-token-auth'   token
GitLab      'oauth2'         token
From : https://isomorphic-git.org/docs/en/onAuth with fix for GitHub

Azure       'notempty'      token
*/
export class Git {
  private constructor(
    private readonly config: {
      username?: string;
      password?: string;
      logger?: Logger;
    },
  ) {}

  async add({
    dir,
    filepath,
  }: {
    dir: string;
    filepath: string;
  }): Promise<void> {
    this.config.logger?.info(`Adding file {dir=${dir},filepath=${filepath}}`);

    return git.add({ fs, dir, filepath });
  }

  async addRemote({
    dir,
    url,
    remote,
  }: {
    dir: string;
    remote: string;
    url: string;
  }): Promise<void> {
    this.config.logger?.info(
      `Creating new remote {dir=${dir},remote=${remote},url=${url}}`,
    );
    return git.addRemote({ fs, dir, remote, url });
  }

  async commit({
    dir,
    message,
    author,
    committer,
  }: {
    dir: string;
    message: string;
    author: { name: string; email: string };
    committer: { name: string; email: string };
  }): Promise<string> {
    this.config.logger?.info(
      `Committing file to repo {dir=${dir},message=${message}}`,
    );

    return git.commit({ fs, dir, message, author, committer });
  }

  async clone({
    url,
    dir,
    ref,
  }: {
    url: string;
    dir: string;
    ref?: string;
  }): Promise<void> {
    this.config.logger?.info(`Cloning repo {dir=${dir},url=${url}}`);
    return git.clone({
      fs,
      http,
      url,
      dir,
      ref,
      singleBranch: true,
      depth: 1,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      onAuth: this.onAuth,
    });
  }

  // https://isomorphic-git.org/docs/en/currentBranch
  async currentBranch({
    dir,
    fullName,
  }: {
    dir: string;
    fullName?: boolean;
  }): Promise<string | undefined> {
    const fullname = fullName ?? false;
    return git.currentBranch({ fs, dir, fullname }) as Promise<
      string | undefined
    >;
  }

  // https://isomorphic-git.org/docs/en/fetch
  async fetch({
    dir,
    remote,
  }: {
    dir: string;
    remote?: string;
  }): Promise<void> {
    const remoteValue = remote ?? 'origin';
    this.config.logger?.info(
      `Fetching remote=${remoteValue} for repository {dir=${dir}}`,
    );
    await git.fetch({
      fs,
      http,
      dir,
      remote: remoteValue,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      onAuth: this.onAuth,
    });
  }

  async init({
    dir,
    defaultBranch = 'master',
  }: {
    dir: string;
    defaultBranch?: string;
  }): Promise<void> {
    this.config.logger?.info(`Init git repository {dir=${dir}}`);

    return git.init({
      fs,
      dir,
      defaultBranch,
    });
  }

  // https://isomorphic-git.org/docs/en/merge
  async merge({
    dir,
    theirs,
    ours,
    author,
    committer,
  }: {
    dir: string;
    theirs: string;
    ours?: string;
    author: { name: string; email: string };
    committer: { name: string; email: string };
  }): Promise<MergeResult> {
    this.config.logger?.info(
      `Merging branch '${theirs}' into '${ours}' for repository {dir=${dir}}`,
    );

    // If ours is undefined, current branch is used.
    return git.merge({
      fs,
      dir,
      ours,
      theirs,
      author,
      committer,
    });
  }

  async push({ dir, remote }: { dir: string; remote: string }) {
    this.config.logger?.info(
      `Pushing directory to remote {dir=${dir},remote=${remote}}`,
    );
    return git.push({
      fs,
      dir,
      http,
      onProgress: this.onProgressHandler(),
      headers: {
        'user-agent': 'git/@isomorphic-git',
      },
      remote: remote,
      onAuth: this.onAuth,
    });
  }

  // https://isomorphic-git.org/docs/en/readCommit
  async readCommit({
    dir,
    sha,
  }: {
    dir: string;
    sha: string;
  }): Promise<ReadCommitResult> {
    return git.readCommit({ fs, dir, oid: sha });
  }

  // https://isomorphic-git.org/docs/en/resolveRef
  async resolveRef({
    dir,
    ref,
  }: {
    dir: string;
    ref: string;
  }): Promise<string> {
    return git.resolveRef({ fs, dir, ref });
  }

  private onAuth = () => ({
    username: this.config.username,
    password: this.config.password,
  });

  private onProgressHandler = (): ProgressCallback => {
    let currentPhase = '';

    return event => {
      if (currentPhase !== event.phase) {
        currentPhase = event.phase;
        this.config.logger?.info(event.phase);
      }
      const total = event.total
        ? `${Math.round((event.loaded / event.total) * 100)}%`
        : event.loaded;
      this.config.logger?.debug(`status={${event.phase},total={${total}}}`);
    };
  };

  static fromAuth = ({
    username,
    password,
    logger,
  }: {
    username?: string;
    password?: string;
    logger?: Logger;
  }) => new Git({ username, password, logger });
}
