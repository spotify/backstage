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

import parseGitUrl from 'git-url-parse';
import { AzureIntegrationConfig } from './config';

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * Converts
 * from: https://dev.azure.com/{organization}/{project}/_git/reponame?path={path}&version=GB{commitOrBranch}&_a=contents
 * to:   https://dev.azure.com/{organization}/{project}/_apis/git/repositories/reponame/items?path={path}&version={commitOrBranch}
 *
 * @param url A URL pointing to a file
 */
export function getAzureFileFetchUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    const [
      empty,
      userOrOrg,
      project,
      srcKeyword,
      repoName,
    ] = parsedUrl.pathname.split('/');

    const path = parsedUrl.searchParams.get('path') || '';
    const ref = parsedUrl.searchParams.get('version')?.substr(2);

    if (
      empty !== '' ||
      userOrOrg === '' ||
      project === '' ||
      srcKeyword !== '_git' ||
      repoName === '' ||
      path === '' ||
      ref === ''
    ) {
      throw new Error('Wrong Azure Devops URL or Invalid file path');
    }

    // transform to api
    parsedUrl.pathname = [
      empty,
      userOrOrg,
      project,
      '_apis',
      'git',
      'repositories',
      repoName,
      'items',
    ].join('/');

    const queryParams = [`path=${path}`];

    if (ref) {
      queryParams.push(`version=${ref}`);
    }

    parsedUrl.search = queryParams.join('&');

    parsedUrl.protocol = 'https';

    return parsedUrl.toString();
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}

/**
 * Given a URL pointing to a path on a provider, returns a URL that is suitable
 * for downloading the subtree.
 *
 * @param url A URL pointing to a path
 */
export function getAzureDownloadUrl(url: string): string {
  const {
    name: repoName,
    owner: project,
    organization,
    protocol,
    resource,
    filepath,
  } = parseGitUrl(url);

  // scopePath will limit the downloaded content
  // /docs will only download the docs folder and everything below it
  // /docs/index.md will only download index.md but put it in the root of the archive
  const scopePath = filepath
    ? `&scopePath=${encodeURIComponent(filepath)}`
    : '';

  return `${protocol}://${resource}/${organization}/${project}/_apis/git/repositories/${repoName}/items?recursionLevel=full&download=true&api-version=6.0${scopePath}`;
}

/**
 * Given a URL, return the API URL to fetch commits on the branch.
 *
 * @param url A URL pointing to a repository or a sub-path
 */
export function getAzureCommitsUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    const [
      empty,
      userOrOrg,
      project,
      srcKeyword,
      repoName,
    ] = parsedUrl.pathname.split('/');

    // Remove the "GB" from "GBmain" for example.
    const ref = parsedUrl.searchParams.get('version')?.substr(2);

    if (
      !!empty ||
      !userOrOrg ||
      !project ||
      srcKeyword !== '_git' ||
      !repoName
    ) {
      throw new Error('Wrong Azure Devops URL');
    }

    // transform to commits api
    parsedUrl.pathname = [
      empty,
      userOrOrg,
      project,
      '_apis',
      'git',
      'repositories',
      repoName,
      'commits',
    ].join('/');

    const queryParams = [];
    if (ref) {
      queryParams.push(`searchCriteria.itemVersion.version=${ref}`);
    }
    parsedUrl.search = queryParams.join('&');

    parsedUrl.protocol = 'https';

    return parsedUrl.toString();
  } catch (e) {
    throw new Error(`Incorrect URL: ${url}, ${e}`);
  }
}

/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config The relevant provider config
 */
export function getAzureRequestOptions(
  config: AzureIntegrationConfig,
  additionalHeaders?: Record<string, string>,
): RequestInit {
  const headers: HeadersInit = additionalHeaders
    ? { ...additionalHeaders }
    : {};

  if (config.token) {
    const buffer = Buffer.from(`:${config.token}`, 'utf8');
    headers.Authorization = `Basic ${buffer.toString('base64')}`;
  }

  return { headers };
}
