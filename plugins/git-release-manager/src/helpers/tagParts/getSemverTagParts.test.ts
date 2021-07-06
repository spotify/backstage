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

import {
  mockReleaseCandidateSemver,
  mockReleaseVersionSemver,
} from '../../test-helpers/test-helpers';
import { getSemverTagParts } from './getSemverTagParts';

describe('getSemverTagParts', () => {
  describe('happy path', () => {
    it('should return tagParts for RC tag', () => {
      const semverTagParts = getSemverTagParts(
        mockReleaseCandidateSemver.tagName,
      );

      expect(semverTagParts).toMatchInlineSnapshot(`
              Object {
                "tagParts": Object {
                  "major": 1,
                  "minor": 2,
                  "patch": 3,
                  "prefix": "rc",
                },
              }
          `);
    });

    it('should return tagParts for Version tag', () => {
      const semverTagParts = getSemverTagParts(
        mockReleaseVersionSemver.tagName,
      );

      expect(semverTagParts).toMatchInlineSnapshot(`
              Object {
                "tagParts": Object {
                  "major": 1,
                  "minor": 2,
                  "patch": 3,
                  "prefix": "version",
                },
              }
          `);
    });
  });

  describe('invalid semver tags', () => {
    it('should return error for invalid prefix', () => {
      const semverTagParts = getSemverTagParts('invalid-1.2.3');

      expect(semverTagParts).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected semver matching \\"/(rc|version)-([0-9]+)\\\\.([0-9]+)\\\\.([0-9]+)/\\", found \\"invalid-1.2.3\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });

    it('should return error for invalid semver (missing patch)', () => {
      const semverTagParts = getSemverTagParts('rc-1.2');

      expect(semverTagParts).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected semver matching \\"/(rc|version)-([0-9]+)\\\\.([0-9]+)\\\\.([0-9]+)/\\", found \\"rc-1.2\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });

    it('should return error for invalid semver (founds calver)', () => {
      const semverTagParts = getSemverTagParts('rc-1337.01.01_1');

      expect(semverTagParts).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected semver matching \\"/(rc|version)-([0-9]+)\\\\.([0-9]+)\\\\.([0-9]+)/\\", found calver \\"rc-1337.01.01_1\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });
  });
});
