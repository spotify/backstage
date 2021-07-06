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

import { calverRegexp } from '../../../helpers/tagParts/getCalverTagParts';
import { GetAllTagsResult } from '../../../api/GitReleaseClient';
import { Project } from '../../../contexts/ProjectContext';
import { ReleaseStats } from '../contexts/ReleaseStatsContext';
import { semverRegexp } from '../../../helpers/tagParts/getSemverTagParts';

export function getReleaseStats({
  allTags,
  project,
  mappedReleases,
}: {
  allTags: GetAllTagsResult['tags'];
  project: Project;
  mappedReleases: ReleaseStats;
}) {
  const releaseStats = allTags.reduce(
    (acc: ReleaseStats, tag) => {
      const match =
        project.versioningStrategy === 'semver'
          ? tag.tagName.match(semverRegexp)
          : tag.tagName.match(calverRegexp);

      if (!match) {
        acc.unmatchedTags.push(tag.tagName);
        return acc;
      }

      const prefix = match[1] as 'rc' | 'version';
      const baseVersion =
        project.versioningStrategy === 'semver'
          ? `${match[2]}.${match[3]}` // major.minor
          : match[2]; // yyyy.MM.dd

      const release = acc.releases[baseVersion];

      if (!release) {
        acc.unmappableTags.push(tag.tagName);
        return acc;
      }

      const dest = release[prefix === 'rc' ? 'candidates' : 'versions'];
      dest.push(tag);

      return acc;
    },
    {
      ...mappedReleases,
    },
  );

  return {
    releaseStats,
  };
}
