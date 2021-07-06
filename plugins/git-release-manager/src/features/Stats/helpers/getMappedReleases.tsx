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
import { GetAllReleasesResult } from '../../../api/GitReleaseClient';
import { Project } from '../../../contexts/ProjectContext';
import { ReleaseStats } from '../contexts/ReleaseStatsContext';
import { semverRegexp } from '../../../helpers/tagParts/getSemverTagParts';

export function getMappedReleases({
  allReleases,
  project,
}: {
  allReleases: GetAllReleasesResult['releases'];
  project: Project;
}) {
  return {
    mappedReleases: allReleases.reduce(
      (acc: ReleaseStats, release) => {
        const match =
          project.versioningStrategy === 'semver'
            ? release.tagName.match(semverRegexp)
            : release.tagName.match(calverRegexp);

        if (!match) {
          acc.unmatchedReleases.push(release.tagName);
          return acc;
        }

        const baseVersion =
          project.versioningStrategy === 'semver'
            ? `${match[2]}.${match[3]}`
            : match[2];

        if (!acc.releases[baseVersion]) {
          acc.releases[baseVersion] = {
            baseVersion,
            createdAt: release.createdAt,
            htmlUrl: release.htmlUrl,
            candidates: [],
            versions: [],
          };

          return acc;
        }

        return acc;
      },
      {
        releases: {},
        unmappableTags: [],
        unmatchedReleases: [],
        unmatchedTags: [],
      },
    ),
  };
}
