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

import { ReleaseStats } from '../features/Stats/contexts/ReleaseStatsContext';

export const mockReleaseStats: ReleaseStats = {
  releases: {
    '1.0': {
      baseVersion: '1.0',
      createdAt: '2021-01-01T10:11:12Z',
      htmlUrl: 'html_url',
      candidates: [
        {
          tagName: 'rc-1.0.1',
          tagSha: 'sha-1.0.1',
          tagType: 'tag',
        },
        {
          tagName: 'rc-1.0.0',
          tagSha: 'sha-1.0.0',
          tagType: 'tag',
        },
      ],
      versions: [],
    },
    '1.1': {
      baseVersion: '1.1',
      createdAt: '2021-01-01T10:11:12Z',
      htmlUrl: 'html_url',
      candidates: [
        {
          tagName: 'rc-1.1.2',
          tagSha: 'sha-1.1.2',
          tagType: 'tag',
        },
        {
          tagName: 'rc-1.1.1',
          tagSha: 'sha-1.1.1',
          tagType: 'tag',
        },
        {
          tagName: 'rc-1.1.0',
          tagSha: 'sha-1.1.0',
          tagType: 'tag',
        },
      ],
      versions: [
        {
          tagName: 'version-1.1.3',
          tagSha: 'sha-1.1.3',
          tagType: 'tag',
        },
        {
          tagName: 'version-1.1.2',
          tagSha: 'sha-1.1.2',
          tagType: 'tag',
        },
      ],
    },
  },
  unmappableTags: [],
  unmatchedReleases: [],
  unmatchedTags: [],
};
