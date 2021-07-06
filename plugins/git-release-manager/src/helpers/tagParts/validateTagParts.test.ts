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
  mockReleaseCandidateCalver,
  mockReleaseCandidateSemver,
  mockSemverProject,
} from '../../test-helpers/test-helpers';
import { validateTagName } from './validateTagName';

describe('validateTagName', () => {
  describe('valid tags', () => {
    it('should not return any error for valid semver project', () => {
      const result = validateTagName({
        project: mockSemverProject,
        tagName: mockReleaseCandidateSemver.tagName,
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "tagNameError": undefined,
        }
      `);
    });

    it('should not return any error for semver project without any releases (i.e. no tagName)', () => {
      const result = validateTagName({
        project: mockSemverProject,
      });

      expect(result).toMatchInlineSnapshot(`
              Object {
                "tagNameError": null,
              }
            `);
    });
  });

  describe('mismatching tags', () => {
    it('should return error for semver project and calver tag', () => {
      const result = validateTagName({
        project: mockSemverProject,
        tagName: mockReleaseCandidateCalver.tagName,
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "tagNameError": Object {
            "subtitle": "Expected semver matching \\"/(rc|version)-([0-9]+)\\\\.([0-9]+)\\\\.([0-9]+)/\\", found calver \\"rc-2020.01.01_1\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });

    it('should return error for calver project and semver tag', () => {
      const result = validateTagName({
        project: mockCalverProject,
        tagName: mockReleaseCandidateSemver.tagName,
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "tagNameError": Object {
            "subtitle": "Expected calver matching \\"/(rc|version)-([0-9]{4}\\\\.[0-9]{2}\\\\.[0-9]{2})_([0-9]+)/\\", found \\"rc-1.2.3\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });
  });

  describe('invalid tags', () => {
    it('should return error for semver project and totally invalid tag', () => {
      const result = validateTagName({
        project: mockSemverProject,
        tagName: 'this-is-so-invalid',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "tagNameError": Object {
            "subtitle": "Expected semver matching \\"/(rc|version)-([0-9]+)\\\\.([0-9]+)\\\\.([0-9]+)/\\", found \\"this-is-so-invalid\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });

    it('should return error for calver project and totally invalid tag', () => {
      const result = validateTagName({
        project: mockCalverProject,
        tagName: 'this-is-so-invalid',
      });

      expect(result).toMatchInlineSnapshot(`
        Object {
          "tagNameError": Object {
            "subtitle": "Expected calver matching \\"/(rc|version)-([0-9]{4}\\\\.[0-9]{2}\\\\.[0-9]{2})_([0-9]+)/\\", found \\"this-is-so-invalid\\"",
            "title": "Invalid tag",
          },
        }
      `);
    });
  });
});
