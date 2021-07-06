/*
 * Copyright 2020 The Backstage Authors
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

import * as codeowners from 'codeowners-utils';
import { CodeOwnersEntry } from 'codeowners-utils';
import { filter, get, head, pipe, reverse } from 'lodash/fp';

export function resolveCodeOwner(
  contents: string,
  pattern = '*',
): string | undefined {
  const owners = codeowners.parse(contents);

  return pipe(
    filter((e: CodeOwnersEntry) => e.pattern === pattern),
    reverse,
    head,
    get('owners'),
    head,
    normalizeCodeOwner,
  )(owners);
}

export function normalizeCodeOwner(owner: string) {
  if (owner.match(/^@.*\/.*/)) {
    return owner.split('/')[1];
  } else if (owner.match(/^@.*/)) {
    return owner.substring(1);
  } else if (owner.match(/^.*@.*\..*$/)) {
    return owner.split('@')[0];
  }

  return owner;
}
