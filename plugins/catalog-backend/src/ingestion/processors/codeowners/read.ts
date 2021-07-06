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

import { UrlReader } from '@backstage/backend-common';
import { NotFoundError } from '@backstage/errors';
import { ScmIntegration } from '@backstage/integration';
import 'core-js/features/promise'; // NOTE: This can be removed when ES2021 is implemented
import { resolveCodeOwner } from './resolve';
import { scmCodeOwnersPaths } from './scm';

export async function readCodeOwners(
  reader: UrlReader,
  sourceUrl: string,
  codeownersPaths: string[],
): Promise<string | undefined> {
  const readOwnerLocation = async (path: string): Promise<string> => {
    const url = `${sourceUrl}${path}`;

    if (reader.readUrl) {
      const data = await reader.readUrl(url);
      const buffer = await data.buffer();
      return buffer.toString();
    }
    const data = await reader.read(url);
    return data.toString();
  };

  const candidates = codeownersPaths.map(readOwnerLocation);

  return Promise.any(candidates).catch((aggregateError: AggregateError) => {
    const hardError = aggregateError.errors.find(
      error => !(error instanceof NotFoundError),
    );

    if (hardError) {
      throw hardError;
    }

    return undefined;
  });
}

export async function findCodeOwnerByTarget(
  reader: UrlReader,
  targetUrl: string,
  scmIntegration: ScmIntegration,
): Promise<string | undefined> {
  const codeownersPaths = scmCodeOwnersPaths[scmIntegration?.type ?? ''];

  const sourceUrl = scmIntegration?.resolveUrl({
    url: '/',
    base: targetUrl,
  });

  if (!sourceUrl || !codeownersPaths) {
    return undefined;
  }

  const contents = await readCodeOwners(reader, sourceUrl, codeownersPaths);

  if (!contents) {
    return undefined;
  }

  const owner = resolveCodeOwner(contents);

  return owner;
}
