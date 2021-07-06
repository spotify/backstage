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
  mockCalverProject,
  mockSemverProject,
} from '../test-helpers/test-helpers';
import { getBumpedTag } from './getBumpedTag';

describe('getBumpedTag', () => {
  describe('calver', () => {
    it('should increment patch by 1', () => {
      const result = getBumpedTag({
        project: mockCalverProject,
        tag: 'rc-2020.01.01_1',
        bumpLevel: 'patch',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "bumpedTag": "rc-2020.01.01_2",
          "error": undefined,
          "tagParts": Object {
            "calver": "2020.01.01",
            "patch": 2,
            "prefix": "rc",
          },
        }
      `);
    });

    it('should increment patch by 1 regardless of semver-specific arg "bumpLevel"', () => {
      const result = getBumpedTag({
        project: mockCalverProject,
        tag: 'rc-2020.01.01_1',
        bumpLevel: 'major',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "bumpedTag": "rc-2020.01.01_2",
          "error": undefined,
          "tagParts": Object {
            "calver": "2020.01.01",
            "patch": 2,
            "prefix": "rc",
          },
        }
      `);
    });
  });

  describe('semver', () => {
    it('should increment patch by 1', () => {
      const result = getBumpedTag({
        project: mockSemverProject,
        tag: 'rc-1.2.3',
        bumpLevel: 'patch',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "bumpedTag": "rc-1.2.4",
          "error": undefined,
          "tagParts": Object {
            "major": 1,
            "minor": 2,
            "patch": 4,
            "prefix": "rc",
          },
        }
      `);
    });

    it('should increment minor by 1', () => {
      const result = getBumpedTag({
        project: mockSemverProject,
        tag: 'rc-1.2.3',
        bumpLevel: 'minor',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "bumpedTag": "rc-1.3.0",
          "error": undefined,
          "tagParts": Object {
            "major": 1,
            "minor": 3,
            "patch": 0,
            "prefix": "rc",
          },
        }
      `);
    });

    it('should increment major by 1', () => {
      const result = getBumpedTag({
        project: mockSemverProject,
        tag: 'rc-1.2.3',
        bumpLevel: 'major',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "bumpedTag": "rc-2.0.0",
          "error": undefined,
          "tagParts": Object {
            "major": 2,
            "minor": 0,
            "patch": 0,
            "prefix": "rc",
          },
        }
      `);
    });
  });

  describe('errors', () => {
    it('should propagate errors for invalid tags', () => {
      const result = getBumpedTag({
        project: mockCalverProject,
        tag: '😬',
        bumpLevel: 'patch',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "error": Object {
            "subtitle": "Expected calver matching \\"/(rc|version)-([0-9]{4}\\\\.[0-9]{2}\\\\.[0-9]{2})_([0-9]+)/\\", found \\"😬\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });
  });
});
