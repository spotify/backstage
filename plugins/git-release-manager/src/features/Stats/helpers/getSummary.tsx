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

import { ReleaseStats } from '../contexts/ReleaseStatsContext';

export function getSummary({ releaseStats }: { releaseStats: ReleaseStats }) {
  return {
    summary: Object.entries(releaseStats.releases).reduce(
      (
        acc: {
          totalReleases: number;
          totalCandidatePatches: number;
          totalVersionPatches: number;
        },
        [_baseVersion, mappedRelease],
      ) => {
        const candidatePatches =
          Object.keys(mappedRelease.candidates).length - 1;
        const versionPatches = Object.keys(mappedRelease.versions).length - 1;

        acc.totalReleases += 1;
        acc.totalCandidatePatches +=
          candidatePatches >= 0 ? candidatePatches : 0;
        acc.totalVersionPatches += versionPatches >= 0 ? versionPatches : 0;

        return acc;
      },
      {
        totalReleases: 0,
        totalCandidatePatches: 0,
        totalVersionPatches: 0,
      },
    ),
  };
}
