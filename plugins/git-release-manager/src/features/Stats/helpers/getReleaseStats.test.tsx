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

import { getReleaseStats } from './getReleaseStats';
import { mockSemverProject } from '../../../test-helpers/test-helpers';

describe('getReleaseStats', () => {
  it('should get releases with tags', () => {
    const result = getReleaseStats({
      project: mockSemverProject,
      mappedReleases: {
        releases: {
          '1.0': {
            baseVersion: '1.0',
            createdAt: '2021-01-01T10:11:12Z',
            htmlUrl: 'html_url',
            candidates: [],
            versions: [],
          },
          '1.1': {
            baseVersion: '1.1',
            createdAt: '2021-01-01T10:11:12Z',
            htmlUrl: 'html_url',
            candidates: [],

            versions: [],
          },
        },
        unmappableTags: [],
        unmatchedReleases: [],
        unmatchedTags: [],
      },
      allTags: [
        { tagType: 'tag' as const, tagSha: 'sha', tagName: 'rc-1.0.0' },
        { tagType: 'tag' as const, tagSha: 'sha', tagName: 'rc-1.0.1' },
        { tagType: 'tag' as const, tagSha: 'sha', tagName: 'rc-1.0.2' },
        { tagType: 'tag' as const, tagSha: 'sha', tagName: 'version-1.0.2' },
        { tagType: 'tag' as const, tagSha: 'sha', tagName: 'rc-1.1.1' },

        { tagType: 'tag' as const, tagSha: 'unmatchable', tagName: 'rc-1/2/3' },
        {
          tagType: 'tag' as const,
          tagSha: 'unmappable',
          tagName: 'rc-123.123.123',
        },
      ],
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "releaseStats": Object {
          "releases": Object {
            "1.0": Object {
              "baseVersion": "1.0",
              "candidates": Array [
                Object {
                  "tagName": "rc-1.0.0",
                  "tagSha": "sha",
                  "tagType": "tag",
                },
                Object {
                  "tagName": "rc-1.0.1",
                  "tagSha": "sha",
                  "tagType": "tag",
                },
                Object {
                  "tagName": "rc-1.0.2",
                  "tagSha": "sha",
                  "tagType": "tag",
                },
              ],
              "createdAt": "2021-01-01T10:11:12Z",
              "htmlUrl": "html_url",
              "versions": Array [
                Object {
                  "tagName": "version-1.0.2",
                  "tagSha": "sha",
                  "tagType": "tag",
                },
              ],
            },
            "1.1": Object {
              "baseVersion": "1.1",
              "candidates": Array [
                Object {
                  "tagName": "rc-1.1.1",
                  "tagSha": "sha",
                  "tagType": "tag",
                },
              ],
              "createdAt": "2021-01-01T10:11:12Z",
              "htmlUrl": "html_url",
              "versions": Array [],
            },
          },
          "unmappableTags": Array [
            "rc-123.123.123",
          ],
          "unmatchedReleases": Array [],
          "unmatchedTags": Array [
            "rc-1/2/3",
          ],
        },
      }
    `);
  });
});
