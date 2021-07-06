/*
 * Copyright 2021 The Backstage Authors
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

import { GitReleaseApi } from '../../../api/GitReleaseClient';
import { GitReleaseManagerError } from '../../../errors/GitReleaseManagerError';
import { Project } from '../../../contexts/ProjectContext';

interface GetTagDates {
  pluginApiClient: GitReleaseApi;
  project: Project;
  startTag: {
    tagSha: string;
    tagType: 'tag' | 'commit';
  };
  endTag?: {
    tagSha: string;
    tagType: 'tag' | 'commit';
  };
}

export const getTagDates = async ({
  pluginApiClient,
  project,
  startTag,
  endTag,
}: GetTagDates) => {
  if (!endTag) {
    if (startTag.tagType === 'tag') {
      const { tag: startTagResponse } = await pluginApiClient.getTag({
        owner: project.owner,
        repo: project.repo,
        tagSha: startTag.tagSha,
      });

      return {
        startDate: startTagResponse.date,
        endDate: undefined,
      };
    }

    // If tagType is not a 'tag', it has to be a commit
    const { commit: startCommit } = await pluginApiClient.getCommit({
      owner: project.owner,
      repo: project.repo,
      ref: startTag.tagSha,
    });

    return {
      startDate: startCommit.createdAt,
      endDate: undefined,
    };
  }

  if (startTag.tagType === 'tag' && endTag.tagType === 'tag') {
    const [
      { tag: startTagResponse },
      { tag: endTagResponse },
    ] = await Promise.all([
      pluginApiClient.getTag({
        owner: project.owner,
        repo: project.repo,
        tagSha: startTag.tagSha,
      }),
      pluginApiClient.getTag({
        owner: project.owner,
        repo: project.repo,
        tagSha: endTag.tagSha,
      }),
    ]);

    return {
      startDate: startTagResponse.date,
      endDate: endTagResponse.date,
    };
  }

  if (startTag.tagType === 'commit' && endTag.tagType === 'commit') {
    const [{ commit: startCommit }, { commit: endCommit }] = await Promise.all([
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: startTag.tagSha,
      }),
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: endTag.tagSha,
      }),
    ]);

    return {
      startDate: startCommit.createdAt,
      endDate: endCommit.createdAt,
    };
  }

  if (startTag.tagType === 'tag' && endTag.tagType === 'commit') {
    const [{ date: startDate }, { commit: endCommit }] = await Promise.all([
      getCommitFromTag({ pluginApiClient, project, tag: startTag }),
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: endTag.tagSha,
      }),
    ]);

    return {
      startDate,
      endDate: endCommit.createdAt,
    };
  }

  if (startTag.tagType === 'commit' && endTag.tagType === 'tag') {
    const [{ commit: startCommit }, { date: endDate }] = await Promise.all([
      pluginApiClient.getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: startTag.tagSha,
      }),
      getCommitFromTag({ pluginApiClient, project, tag: endTag }),
    ]);

    return {
      startDate: startCommit.createdAt,
      endDate,
    };
  }

  throw new GitReleaseManagerError(
    `Failed to get tag dates for tags with type "${startTag.tagType}" and "${endTag.tagType}"`,
  );
};

async function getCommitFromTag({
  pluginApiClient,
  project,
  tag,
}: {
  pluginApiClient: GetTagDates['pluginApiClient'];
  project: GetTagDates['project'];
  tag: GetTagDates['startTag'] | NonNullable<GetTagDates['endTag']>;
}) {
  const { tag: tagResponse } = await pluginApiClient.getTag({
    owner: project.owner,
    repo: project.repo,
    tagSha: tag.tagSha,
  });
  const { commit: startCommit } = await pluginApiClient.getCommit({
    owner: project.owner,
    repo: project.repo,
    ref: tagResponse.objectSha,
  });

  return {
    date: startCommit.createdAt,
  };
}
