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

import { getMappedReleases } from './getMappedReleases';
import { mockSemverProject } from '../../../test-helpers/test-helpers';

describe('getMappedReleases', () => {
  it('should get mapped releases', () => {
    const createRelease = (tagName: string) => ({
      createdAt: '2021-01-01T10:11:12Z',
      htmlUrl: 'html_url',
      id: 1,
      name: 'name',
      tagName,
    });

    const result = getMappedReleases({
      project: mockSemverProject,
      allReleases: [createRelease('rc-1.0.0'), createRelease('rc-1.1.0')],
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "mappedReleases": Object {
          "releases": Object {
            "1.0": Object {
              "baseVersion": "1.0",
              "candidates": Array [],
              "createdAt": "2021-01-01T10:11:12Z",
              "htmlUrl": "html_url",
              "versions": Array [],
            },
            "1.1": Object {
              "baseVersion": "1.1",
              "candidates": Array [],
              "createdAt": "2021-01-01T10:11:12Z",
              "htmlUrl": "html_url",
              "versions": Array [],
            },
          },
          "unmappableTags": Array [],
          "unmatchedReleases": Array [],
          "unmatchedTags": Array [],
        },
      }
    `);
  });
});
