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

import {
  BitbucketIntegration,
  getBitbucketDefaultBranch,
  getBitbucketDownloadUrl,
  getBitbucketFileFetchUrl,
  getBitbucketRequestOptions,
  ScmIntegrations,
} from '@backstage/integration';
import fetch from 'cross-fetch';
import parseGitUrl from 'git-url-parse';
import { Minimatch } from 'minimatch';
import { Readable } from 'stream';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import { stripFirstDirectoryFromPath } from './tree/util';
import {
  ReadTreeResponseFactory,
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  SearchOptions,
  SearchResponse,
  UrlReader,
  ReadUrlResponse,
  ReadUrlOptions,
} from './types';

/**
 * A processor that adds the ability to read files from Bitbucket v1 and v2 APIs, such as
 * the one exposed by Bitbucket Cloud itself.
 */
export class BitbucketUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.bitbucket.list().map(integration => {
      const reader = new BitbucketUrlReader(integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: BitbucketIntegration,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {
    const {
      host,
      apiBaseUrl,
      token,
      username,
      appPassword,
    } = integration.config;

    if (!apiBaseUrl) {
      throw new Error(
        `Bitbucket integration for '${host}' must configure an explicit apiBaseUrl`,
      );
    } else if (!token && username && !appPassword) {
      throw new Error(
        `Bitbucket integration for '${host}' has configured a username but is missing a required appPassword.`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const bitbucketUrl = getBitbucketFileFetchUrl(url, this.integration.config);
    const options = getBitbucketRequestOptions(this.integration.config);

    let response: Response;
    try {
      response = await fetch(bitbucketUrl.toString(), options);
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return Buffer.from(await response.text());
    }

    const message = `${url} could not be read as ${bitbucketUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readUrl(
    url: string,
    _options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    // TODO etag is not implemented yet.
    const buffer = await this.read(url);
    return { buffer: async () => buffer };
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const { filepath } = parseGitUrl(url);

    const lastCommitShortHash = await this.getLastCommitShortHash(url);
    if (options?.etag && options.etag === lastCommitShortHash) {
      throw new NotModifiedError();
    }

    const downloadUrl = await getBitbucketDownloadUrl(
      url,
      this.integration.config,
    );
    const archiveBitbucketResponse = await fetch(
      downloadUrl,
      getBitbucketRequestOptions(this.integration.config),
    );
    if (!archiveBitbucketResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveBitbucketResponse.status} ${archiveBitbucketResponse.statusText}`;
      if (archiveBitbucketResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      stream: (archiveBitbucketResponse.body as unknown) as Readable,
      subpath: filepath,
      etag: lastCommitShortHash,
      filter: options?.filter,
    });
  }

  async search(url: string, options?: SearchOptions): Promise<SearchResponse> {
    const { filepath } = parseGitUrl(url);
    const matcher = new Minimatch(filepath);

    // TODO(freben): For now, read the entire repo and filter through that. In
    // a future improvement, we could be smart and try to deduce that non-glob
    // prefixes (like for filepaths such as some-prefix/**/a.yaml) can be used
    // to get just that part of the repo.
    const treeUrl = url.replace(filepath, '').replace(/\/+$/, '');

    const tree = await this.readTree(treeUrl, {
      etag: options?.etag,
      filter: path => matcher.match(stripFirstDirectoryFromPath(path)),
    });
    const files = await tree.files();

    return {
      etag: tree.etag,
      files: files.map(file => ({
        url: this.integration.resolveUrl({
          url: `/${file.path}`,
          base: url,
        }),
        content: file.content,
      })),
    };
  }

  toString() {
    const { host, token, username, appPassword } = this.integration.config;
    let authed = Boolean(token);
    if (!authed) {
      authed = Boolean(username && appPassword);
    }
    return `bitbucket{host=${host},authed=${authed}}`;
  }

  private async getLastCommitShortHash(url: string): Promise<string> {
    const { resource, name: repoName, owner: project, ref } = parseGitUrl(url);

    let branch = ref;
    if (!branch) {
      branch = await getBitbucketDefaultBranch(url, this.integration.config);
    }

    const isHosted = resource === 'bitbucket.org';
    // Bitbucket Server https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp222
    const commitsApiUrl = isHosted
      ? `${this.integration.config.apiBaseUrl}/repositories/${project}/${repoName}/commits/${branch}`
      : `${this.integration.config.apiBaseUrl}/projects/${project}/repos/${repoName}/commits`;

    const commitsResponse = await fetch(
      commitsApiUrl,
      getBitbucketRequestOptions(this.integration.config),
    );
    if (!commitsResponse.ok) {
      const message = `Failed to retrieve commits from ${commitsApiUrl}, ${commitsResponse.status} ${commitsResponse.statusText}`;
      if (commitsResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commits = await commitsResponse.json();
    if (isHosted) {
      if (
        commits &&
        commits.values &&
        commits.values.length > 0 &&
        commits.values[0].hash
      ) {
        return commits.values[0].hash.substring(0, 12);
      }
    } else {
      if (
        commits &&
        commits.values &&
        commits.values.length > 0 &&
        commits.values[0].id
      ) {
        return commits.values[0].id.substring(0, 12);
      }
    }

    throw new Error(`Failed to read response from ${commitsApiUrl}`);
  }
}
