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
} from '../../test-helpers/test-helpers';
import { getCalverTagParts } from './getCalverTagParts';
import { getSemverTagParts } from './getSemverTagParts';
import { getTagParts } from './getTagParts';

jest.mock('./getCalverTagParts', () => ({
  getCalverTagParts: jest.fn(),
}));
jest.mock('./getSemverTagParts', () => ({
  getSemverTagParts: jest.fn(),
}));

describe('getTagParts', () => {
  beforeEach(jest.resetAllMocks);

  describe('calver', () => {
    it('should call getCalverTagParts for calver projects', () => {
      getTagParts({ project: mockCalverProject, tag: 'banana' });

      expect(getCalverTagParts).toHaveBeenCalledTimes(1);
    });
  });

  describe('semver', () => {
    it('should call getSemverTagParts for calver projects', () => {
      getTagParts({ project: mockSemverProject, tag: 'banana' });

      expect(getSemverTagParts).toHaveBeenCalledTimes(1);
    });
  });
});
