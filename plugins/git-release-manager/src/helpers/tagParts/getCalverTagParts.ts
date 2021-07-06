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

export type CalverTagParts = {
  prefix: string;
  calver: string;
  patch: number;
};

export const calverRegexp = /(rc|version)-([0-9]{4}\.[0-9]{2}\.[0-9]{2})_([0-9]+)/;

export function getCalverTagParts(tag: string) {
  const match = tag.match(calverRegexp);

  if (match === null || match.length < 4) {
    const error: AlertError = {
      title: 'Invalid tag',
      subtitle: `Expected calver matching "${calverRegexp}", found "${tag}"`,
    };

    return {
      error,
    };
  }

  const tagParts: CalverTagParts = {
    prefix: match[1],
    calver: match[2],
    patch: parseInt(match[3], 10),
  };

  return {
    tagParts,
  };
}
