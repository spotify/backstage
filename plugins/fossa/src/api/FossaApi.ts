/*
 * Copyright 2020 Spotify AB
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

import { createApiRef } from '@backstage/core';

export interface FindingSummary {
  timestamp: string;
  issueCount: number;
  dependencyCount: number;
  projectDefaultBranch: string;
  projectUrl: string;
}

export const fossaApiRef = createApiRef<FossaApi>({
  id: 'plugin.fossa.service',
  description: 'Used by the Fossa plugin to make requests',
});

export type FossaApi = {
  /**
   * Get the finding summary for a list of projects
   *
   * @param projectTitles a list of project titles in FOSSA
   */
  getFindingSummaries(
    projectTitles: Array<string>,
  ): Promise<Map<string, FindingSummary>>;

  /**
   * Get the finding summary of a single project.
   *
   * @param projectTitle the project title in FOSSA
   */
  getFindingSummary(projectTitle: string): Promise<FindingSummary | undefined>;
};
