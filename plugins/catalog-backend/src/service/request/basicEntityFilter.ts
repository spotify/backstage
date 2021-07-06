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

import { EntitiesSearchFilter, EntityFilter } from '../../database';

/**
 * Forms a full EntityFilter based on a single key-value(s) object.
 */
export function basicEntityFilter(
  items: Record<string, string | string[]>,
): EntityFilter {
  const filtersByKey: Record<string, EntitiesSearchFilter> = {};

  for (const [key, value] of Object.entries(items)) {
    const values = [value].flat();

    const f =
      key in filtersByKey
        ? filtersByKey[key]
        : (filtersByKey[key] = { key, matchValueIn: [] });

    f.matchValueIn!.push(...values);
  }

  return { anyOf: [{ allOf: Object.values(filtersByKey) }] };
}
