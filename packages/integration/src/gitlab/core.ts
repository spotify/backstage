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

import { GitLabIntegrationConfig } from './config';
import fetch from 'cross-fetch';

/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * Converts
 * from: https://gitlab.example.com/a/b/blob/master/c.yaml
 * to:   https://gitlab.example.com/a/b/raw/master/c.yaml
 * -or-
 * from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
 * to:   https://gitlab.com/api/v4/projects/projectId/repository/files/filepath?ref=branch
 *
 * @param url A URL pointing to a file
 * @param config The relevant provider config
 */
export async function getGitLabFileFetchUrl(
  url: string,
  config: GitLabIntegrationConfig,
): Promise<string> {
  // TODO(Rugvip): From the old GitlabReaderProcessor; used
  // the existence of /-/blob/ to switch the logic. Don't know if this
  // makes sense and it might require some more work.
  if (url.includes('/-/blob/')) {
    const projectID = await getProjectId(url, config);
    return buildProjectUrl(url, projectID).toString();
  }
  return buildRawUrl(url).toString();
}

/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config The relevant provider config
 */
export function getGitLabRequestOptions(
  config: GitLabIntegrationConfig,
): RequestInit {
  const { token = '' } = config;
  return {
    headers: {
      'PRIVATE-TOKEN': token,
    },
  };
}

// Converts
// from: https://gitlab.example.com/a/b/blob/master/c.yaml
// to:   https://gitlab.example.com/a/b/raw/master/c.yaml
export function buildRawUrl(target: string): URL {
  try {
    const url = new URL(target);

    const [
      empty,
      userOrOrg,
      repoName,
      blobKeyword,
      ...restOfPath
    ] = url.pathname.split('/');

    if (
      empty !== '' ||
      userOrOrg === '' ||
      repoName === '' ||
      blobKeyword !== 'blob' ||
      !restOfPath.join('/').match(/\.yaml$/)
    ) {
      throw new Error('Wrong GitLab URL');
    }

    // Replace 'blob' with 'raw'
    url.pathname = [empty, userOrOrg, repoName, 'raw', ...restOfPath].join('/');

    return url;
  } catch (e) {
    throw new Error(`Incorrect url: ${target}, ${e}`);
  }
}

// Converts
// from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
// to:   https://gitlab.com/api/v4/projects/projectId/repository/files/filepath?ref=branch
export function buildProjectUrl(target: string, projectID: Number): URL {
  try {
    const url = new URL(target);

    const branchAndFilePath = url.pathname.split('/-/blob/')[1];
    const [branch, ...filePath] = branchAndFilePath.split('/');

    url.pathname = [
      '/api/v4/projects',
      projectID,
      'repository/files',
      encodeURIComponent(decodeURIComponent(filePath.join('/'))),
      'raw',
    ].join('/');
    url.search = `?ref=${branch}`;

    return url;
  } catch (e) {
    throw new Error(`Incorrect url: ${target}, ${e}`);
  }
}

// Convert
// from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
// to:   The project ID that corresponds to the URL
export async function getProjectId(
  target: string,
  config: GitLabIntegrationConfig,
): Promise<number> {
  const url = new URL(target);

  if (!url.pathname.includes('/-/blob/')) {
    throw new Error('Please provide full path to yaml file from GitLab');
  }

  try {
    const repo = url.pathname.split('/-/blob/')[0];

    // Convert
    // to: https://gitlab.com/api/v4/projects/groupA%2Fteams%2FsubgroupA%2FteamA%2Frepo
    const repoIDLookup = new URL(
      `${url.protocol + url.hostname}/api/v4/projects/${encodeURIComponent(
        repo.replace(/^\//, ''),
      )}`,
    );
    const response = await fetch(
      repoIDLookup.toString(),
      getGitLabRequestOptions(config),
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `GitLab Error '${data.error}', ${data.error_description}`,
      );
    }

    return Number(data.id);
  } catch (e) {
    throw new Error(`Could not get GitLab project ID for: ${target}, ${e}`);
  }
}
