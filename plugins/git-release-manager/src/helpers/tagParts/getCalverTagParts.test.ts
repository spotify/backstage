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
  mockReleaseVersionCalver,
  mockReleaseCandidateCalver,
} from '../../test-helpers/test-helpers';
import { getCalverTagParts } from './getCalverTagParts';

describe('getCalverTagParts', () => {
  describe('happy path', () => {
    it('should return tagParts for RC tag', () => {
      const result = getCalverTagParts(mockReleaseCandidateCalver.tagName);

      expect(result).toMatchInlineSnapshot(`
              Object {
                "tagParts": Object {
                  "calver": "2020.01.01",
                  "patch": 1,
                  "prefix": "rc",
                },
              }
          `);
    });

    it('should return tagParts for Version tag', () => {
      const result = getCalverTagParts(mockReleaseVersionCalver.tagName);

      expect(result).toMatchInlineSnapshot(`
              Object {
                "tagParts": Object {
                  "calver": "2020.01.01",
                  "patch": 1,
                  "prefix": "version",
                },
              }
          `);
    });
  });

  describe('invalid calver tags', () => {
    it('should return error for invalid prefix', () => {
      const result = getCalverTagParts('invalid-2020.01.01_1');

      expect(result).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected calver matching \\"/(rc|version)-([0-9]{4}\\\\.[0-9]{2}\\\\.[0-9]{2})_([0-9]+)/\\", found \\"invalid-2020.01.01_1\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });

    it('should return error for invalid calver (missing padded zero)', () => {
      const result = getCalverTagParts('rc-2020.1.01_1');

      expect(result).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected calver matching \\"/(rc|version)-([0-9]{4}\\\\.[0-9]{2}\\\\.[0-9]{2})_([0-9]+)/\\", found \\"rc-2020.1.01_1\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });

    it('should return error for invalid calver (missing day)', () => {
      const result = getCalverTagParts('rc-2020.01_1');

      expect(result).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected calver matching \\"/(rc|version)-([0-9]{4}\\\\.[0-9]{2}\\\\.[0-9]{2})_([0-9]+)/\\", found \\"rc-2020.01_1\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });

    it('should return error for invalid patch (letter instead of number)', () => {
      const result = getCalverTagParts('rc-2020.01.01_a');

      expect(result).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected calver matching \\"/(rc|version)-([0-9]{4}\\\\.[0-9]{2}\\\\.[0-9]{2})_([0-9]+)/\\", found \\"rc-2020.01.01_a\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });
  });
});
