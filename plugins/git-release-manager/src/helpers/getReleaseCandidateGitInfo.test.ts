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

import { DateTime } from 'luxon';

import {
  mockCalverProject,
  mockReleaseVersionCalver,
  mockReleaseVersionSemver,
  mockSemverProject,
} from '../test-helpers/test-helpers';
import { getReleaseCandidateGitInfo } from './getReleaseCandidateGitInfo';

describe('getReleaseCandidateGitInfo', () => {
  describe('DateTime', () => {
    it('should format dates as expected', () => {
      const formattedDate = DateTime.now().toFormat('yyyy.MM.dd');

      expect(formattedDate).toMatch(/^\d{4}.\d{2}.\d{2}$/);
    });
  });

  describe('calver', () => {
    it('should return correct Git info', () => {
      expect(
        getReleaseCandidateGitInfo({
          project: mockCalverProject,
          latestRelease: mockReleaseVersionCalver,
          semverBumpLevel: 'minor',
          injectedDate: '2021.01.28',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "rcBranch": "rc/2021.01.28",
          "rcReleaseTag": "rc-2021.01.28_0",
          "releaseName": "Version 2021.01.28",
        }
      `);
    });
  });

  describe('semver', () => {
    it("should return correct Git info when there's previous releases", () => {
      expect(
        getReleaseCandidateGitInfo({
          project: mockSemverProject,
          latestRelease: mockReleaseVersionSemver,
          semverBumpLevel: 'minor',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "rcBranch": "rc/1.3.0",
          "rcReleaseTag": "rc-1.3.0",
          "releaseName": "Version 1.3.0",
        }
      `);
    });

    it("should return correct Git info when there's no previous release", () => {
      expect(
        getReleaseCandidateGitInfo({
          project: mockSemverProject,
          latestRelease: null,
          semverBumpLevel: 'minor',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "rcBranch": "rc/0.0.1",
          "rcReleaseTag": "rc-0.0.1",
          "releaseName": "Version 0.0.1",
        }
      `);
    });
  });
});
