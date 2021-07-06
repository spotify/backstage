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
  AzureIntegration,
  getAzureCommitsUrl,
  getAzureDownloadUrl,
  getAzureFileFetchUrl,
  getAzureRequestOptions,
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
  ReadUrlOptions,
  ReadUrlResponse,
} from './types';

export class AzureUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.azure.list().map(integration => {
      const reader = new AzureUrlReader(integration, { treeResponseFactory });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: AzureIntegration,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {}

  async read(url: string): Promise<Buffer> {
    const builtUrl = getAzureFileFetchUrl(url);

    let response: Response;
    try {
      response = await fetch(
        builtUrl,
        getAzureRequestOptions(this.integration.config),
      );
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    // for private repos when PAT is not valid, Azure API returns a http status code 203 with sign in page html
    if (response.ok && response.status !== 203) {
      return Buffer.from(await response.text());
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
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
    // TODO: Support filepath based reading tree feature like other providers

    // Get latest commit SHA

    const commitsAzureResponse = await fetch(
      getAzureCommitsUrl(url),
      getAzureRequestOptions(this.integration.config),
    );
    if (!commitsAzureResponse.ok) {
      const message = `Failed to read tree from ${url}, ${commitsAzureResponse.status} ${commitsAzureResponse.statusText}`;
      if (commitsAzureResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commitSha = (await commitsAzureResponse.json()).value[0].commitId;
    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const archiveAzureResponse = await fetch(
      getAzureDownloadUrl(url),
      getAzureRequestOptions(this.integration.config, {
        Accept: 'application/zip',
      }),
    );
    if (!archiveAzureResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveAzureResponse.status} ${archiveAzureResponse.statusText}`;
      if (archiveAzureResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromZipArchive({
      stream: (archiveAzureResponse.body as unknown) as Readable,
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
    const treeUrl = new URL(url);
    treeUrl.searchParams.delete('path');
    treeUrl.pathname = treeUrl.pathname.replace(/\/+$/, '');

    const tree = await this.readTree(treeUrl.toString(), {
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
    const { host, token } = this.integration.config;
    return `azure{host=${host},authed=${Boolean(token)}}`;
  }
}
