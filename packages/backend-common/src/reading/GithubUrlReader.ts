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
  getGitHubFileFetchUrl,
  GithubCredentialsProvider,
  GitHubIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import { RestEndpointMethodTypes } from '@octokit/rest';
import fetch from 'cross-fetch';
import parseGitUrl from 'git-url-parse';
import { Minimatch } from 'minimatch';
import { Readable } from 'stream';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import {
  ReadTreeResponseFactory,
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  SearchOptions,
  SearchResponse,
  SearchResponseFile,
  UrlReader,
  ReadUrlOptions,
  ReadUrlResponse,
} from './types';

export type GhRepoResponse = RestEndpointMethodTypes['repos']['get']['response']['data'];
export type GhBranchResponse = RestEndpointMethodTypes['repos']['getBranch']['response']['data'];
export type GhTreeResponse = RestEndpointMethodTypes['git']['getTree']['response']['data'];
export type GhBlobResponse = RestEndpointMethodTypes['git']['getBlob']['response']['data'];

/**
 * A processor that adds the ability to read files from GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 */
export class GithubUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.github.list().map(integration => {
      const credentialsProvider = GithubCredentialsProvider.create(
        integration.config,
      );
      const reader = new GithubUrlReader(integration, {
        treeResponseFactory,
        credentialsProvider,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: GitHubIntegration,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
      credentialsProvider: GithubCredentialsProvider;
    },
  ) {
    if (!integration.config.apiBaseUrl && !integration.config.rawBaseUrl) {
      throw new Error(
        `GitHub integration '${integration.title}' must configure an explicit apiBaseUrl or rawBaseUrl`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    const ghUrl = getGitHubFileFetchUrl(url, this.integration.config);
    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });
    let response: Response;
    try {
      response = await fetch(ghUrl.toString(), {
        headers: {
          ...headers,
          ...(options?.etag && { 'If-None-Match': options.etag }),
          Accept: 'application/vnd.github.v3.raw',
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

    const message = `${url} could not be read as ${ghUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const repoDetails = await this.getRepoDetails(url);
    const commitSha = repoDetails.branch.commit.sha!;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const { filepath } = parseGitUrl(url);
    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });

    return this.doReadTree(
      repoDetails.repo.archive_url,
      commitSha,
      filepath,
      { headers },
      options,
    );
  }

  async search(url: string, options?: SearchOptions): Promise<SearchResponse> {
    const repoDetails = await this.getRepoDetails(url);
    const commitSha = repoDetails.branch.commit.sha!;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const { filepath } = parseGitUrl(url);
    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });

    const files = await this.doSearch(
      url,
      repoDetails.repo.trees_url,
      repoDetails.repo.archive_url,
      commitSha,
      filepath,
      { headers },
    );

    return { files, etag: commitSha };
  }

  toString() {
    const { host, token } = this.integration.config;
    return `github{host=${host},authed=${Boolean(token)}}`;
  }

  private async doReadTree(
    archiveUrl: string,
    sha: string,
    subpath: string,
    init: RequestInit,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    // archive_url looks like "https://api.github.com/repos/owner/repo/{archive_format}{/ref}"
    const archive = await this.fetchResponse(
      archiveUrl
        .replace('{archive_format}', 'tarball')
        .replace('{/ref}', `/${sha}`),
      init,
    );

    return await this.deps.treeResponseFactory.fromTarArchive({
      // TODO(Rugvip): Underlying implementation of fetch will be node-fetch, we probably want
      //               to stick to using that in exclusively backend code.
      stream: (archive.body as unknown) as Readable,
      subpath,
      etag: sha,
      filter: options?.filter,
    });
  }

  private async doSearch(
    url: string,
    treesUrl: string,
    archiveUrl: string,
    sha: string,
    query: string,
    init: RequestInit,
  ): Promise<SearchResponseFile[]> {
    function pathToUrl(path: string): string {
      // TODO(freben): Use the integration package facility for this instead
      // pathname starts as /backstage/backstage/blob/master/<path>
      const updated = new URL(url);
      const base = updated.pathname.split('/').slice(1, 5).join('/');
      updated.pathname = `${base}/${path}`;
      return updated.toString();
    }

    const matcher = new Minimatch(query.replace(/^\/+/, ''));

    // trees_url looks like "https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}"
    const recursiveTree: GhTreeResponse = await this.fetchJson(
      treesUrl.replace('{/sha}', `/${sha}?recursive=true`),
      init,
    );

    // The simple case is that we got the entire tree in a single operation.
    if (!recursiveTree.truncated) {
      const matching = recursiveTree.tree.filter(
        item =>
          item.type === 'blob' &&
          item.path &&
          item.url &&
          matcher.match(item.path),
      );

      return matching.map(item => ({
        url: pathToUrl(item.path!),
        content: async () => {
          const blob: GhBlobResponse = await this.fetchJson(item.url!, init);
          return Buffer.from(blob.content, 'base64');
        },
      }));
    }

    // For larger repos, we leverage readTree and filter through that instead
    const tree = await this.doReadTree(archiveUrl, sha, '', init, {
      filter: path => matcher.match(path),
    });
    const files = await tree.files();

    return files.map(file => ({
      url: pathToUrl(file.path),
      content: file.content,
    }));
  }

  private async getRepoDetails(
    url: string,
  ): Promise<{
    repo: GhRepoResponse;
    branch: GhBranchResponse;
  }> {
    const parsed = parseGitUrl(url);
    const { ref, full_name } = parsed;

    // Caveat: The ref will totally be incorrect if the branch name includes a
    // slash. Thus, some operations can not work on URLs containing branch
    // names that have a slash in them.

    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });

    const repo: GhRepoResponse = await this.fetchJson(
      `${this.integration.config.apiBaseUrl}/repos/${full_name}`,
      { headers },
    );

    // branches_url looks like "https://api.github.com/repos/owner/repo/branches{/branch}"
    const branch: GhBranchResponse = await this.fetchJson(
      repo.branches_url.replace('{/branch}', `/${ref || repo.default_branch}`),
      { headers },
    );

    return { repo, branch };
  }

  private async fetchResponse(
    url: string | URL,
    init: RequestInit,
  ): Promise<Response> {
    const urlAsString = url.toString();

    const response = await fetch(urlAsString, init);

    if (!response.ok) {
      const message = `Request failed for ${urlAsString}, ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return response;
  }

  private async fetchJson(url: string | URL, init: RequestInit): Promise<any> {
    const response = await this.fetchResponse(url, init);
    return await response.json();
  }
}
