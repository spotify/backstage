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

import { mockSemverProject } from '../test-helpers/test-helpers';
import { isProjectValid } from './isProjectValid';

describe('isProjectValid', () => {
  it('should return true for valid project', () => {
    const result = isProjectValid(mockSemverProject);

    expect(result).toEqual(true);
  });

  it('should return false for invalid project (undefined argument)', () => {
    const result = isProjectValid(undefined);

    expect(result).toEqual(false);
  });

  it('should return false for invalid project (empty object argument)', () => {
    const result = isProjectValid({});

    expect(result).toEqual(false);
  });

  it('should return false for invalid project (invalid versioningStrategy argument)', () => {
    const result = isProjectValid({
      ...mockSemverProject,
      versioningStrategy: 'banana',
    });

    expect(result).toEqual(false);
  });
});
