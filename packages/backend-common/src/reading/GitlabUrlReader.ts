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
  getGitLabFileFetchUrl,
  getGitLabRequestOptions,
  GitLabIntegration,
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

export class GitlabUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.gitlab.list().map(integration => {
      const reader = new GitlabUrlReader(integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: GitLabIntegration,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {}

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    const builtUrl = await getGitLabFileFetchUrl(url, this.integration.config);

    let response: Response;
    try {
      response = await fetch(builtUrl, {
        headers: {
          ...getGitLabRequestOptions(this.integration.config).headers,
          ...(options?.etag && { 'If-None-Match': options.etag }),
        },
      });
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    if (response.ok) {
      return {
        buffer: async () => Buffer.from(await response.text()),
        etag: response.headers.get('ETag') ?? undefined,
      };
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const { ref, full_name, filepath } = parseGitUrl(url);

    // Use GitLab API to get the default branch
    // encodeURIComponent is required for GitLab API
    // https://docs.gitlab.com/ee/api/README.html#namespaced-path-encoding
    const projectGitlabResponse = await fetch(
      new URL(
        `${this.integration.config.apiBaseUrl}/projects/${encodeURIComponent(
          full_name,
        )}`,
      ).toString(),
      getGitLabRequestOptions(this.integration.config),
    );
    if (!projectGitlabResponse.ok) {
      const msg = `Failed to read tree from ${url}, ${projectGitlabResponse.status} ${projectGitlabResponse.statusText}`;
      if (projectGitlabResponse.status === 404) {
        throw new NotFoundError(msg);
      }
      throw new Error(msg);
    }
    const projectGitlabResponseJson = await projectGitlabResponse.json();

    // ref is an empty string if no branch is set in provided url to readTree.
    const branch = ref || projectGitlabResponseJson.default_branch;

    // Fetch the latest commit that modifies the the filepath in the provided or default branch
    // to compare against the provided sha.
    const commitsReqParams = new URLSearchParams();
    commitsReqParams.set('ref_name', branch);
    if (!!filepath) {
      commitsReqParams.set('path', filepath);
    }
    const commitsGitlabResponse = await fetch(
      new URL(
        `${this.integration.config.apiBaseUrl}/projects/${encodeURIComponent(
          full_name,
        )}/repository/commits?${commitsReqParams.toString()}`,
      ).toString(),
      getGitLabRequestOptions(this.integration.config),
    );
    if (!commitsGitlabResponse.ok) {
      const message = `Failed to read tree (branch) from ${url}, ${commitsGitlabResponse.status} ${commitsGitlabResponse.statusText}`;
      if (commitsGitlabResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commitSha = (await commitsGitlabResponse.json())[0].id;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    // https://docs.gitlab.com/ee/api/repositories.html#get-file-archive
    const archiveGitLabResponse = await fetch(
      `${this.integration.config.apiBaseUrl}/projects/${encodeURIComponent(
        full_name,
      )}/repository/archive?sha=${branch}`,
      getGitLabRequestOptions(this.integration.config),
    );
    if (!archiveGitLabResponse.ok) {
      const message = `Failed to read tree (archive) from ${url}, ${archiveGitLabResponse.status} ${archiveGitLabResponse.statusText}`;
      if (archiveGitLabResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      stream: (archiveGitLabResponse.body as unknown) as Readable,
      subpath: filepath,
      etag: commitSha,
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
        url: this.integration.resolveUrl({ url: `/${file.path}`, base: url }),
        content: file.content,
      })),
    };
  }

  toString() {
    const { host, token } = this.integration.config;
    return `gitlab{host=${host},authed=${Boolean(token)}}`;
  }
}
