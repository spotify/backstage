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

import { AlertError } from '../../types/types';
import { calverRegexp } from './getCalverTagParts';

export type SemverTagParts = {
  prefix: string;
  major: number;
  minor: number;
  patch: number;
};

export const semverRegexp = /(rc|version)-([0-9]+)\.([0-9]+)\.([0-9]+)/;

export function getSemverTagParts(tag: string) {
  const match = tag.match(semverRegexp);

  if (match === null || match.length < 4) {
    const error: AlertError = {
      title: 'Invalid tag',
      subtitle: `Expected semver matching "${semverRegexp}", found "${tag}"`,
    };

    return {
      error,
    };
  }

  if (tag.match(calverRegexp)) {
    const error: AlertError = {
      title: 'Invalid tag',
      subtitle: `Expected semver matching "${semverRegexp}", found calver "${tag}"`,
    };

    return {
      error,
    };
  }

  const tagParts: SemverTagParts = {
    prefix: match[1],
    major: parseInt(match[2], 10),
    minor: parseInt(match[3], 10),
    patch: parseInt(match[4], 10),
  };

  return {
    tagParts,
  };
}
