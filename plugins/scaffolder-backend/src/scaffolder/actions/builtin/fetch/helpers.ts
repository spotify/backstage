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

import fs from 'fs-extra';
import { resolve as resolvePath, isAbsolute } from 'path';
import { UrlReader } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { JsonValue } from '@backstage/config';

export async function fetchContents({
  reader,
  integrations,
  baseUrl,
  fetchUrl = '.',
  outputPath,
}: {
  reader: UrlReader;
  integrations: ScmIntegrations;
  baseUrl?: string;
  fetchUrl?: JsonValue;
  outputPath: string;
}) {
  if (typeof fetchUrl !== 'string') {
    throw new InputError(
      `Invalid url parameter, expected string, got ${typeof fetchUrl}`,
    );
  }

  let fetchUrlIsAbsolute = false;
  try {
    // eslint-disable-next-line no-new
    new URL(fetchUrl);
    fetchUrlIsAbsolute = true;
  } catch {
    /* ignored */
  }

  // We handle both file locations and url ones
  if (!fetchUrlIsAbsolute && baseUrl?.startsWith('file://')) {
    const basePath = baseUrl.slice('file://'.length);
    if (isAbsolute(fetchUrl)) {
      throw new InputError(
        `Fetch URL may not be absolute for file locations, ${fetchUrl}`,
      );
    }
    const srcDir = resolvePath(basePath, '..', fetchUrl);
    await fs.copy(srcDir, outputPath);
  } else {
    let readUrl;

    if (fetchUrlIsAbsolute) {
      readUrl = fetchUrl;
    } else if (baseUrl) {
      const integration = integrations.byUrl(baseUrl);
      if (!integration) {
        throw new InputError(`No integration found for location ${baseUrl}`);
      }

      readUrl = integration.resolveUrl({
        url: fetchUrl,
        base: baseUrl,
      });
    } else {
      throw new InputError(
        `Failed to fetch, template location could not be determined and the fetch URL is relative, ${fetchUrl}`,
      );
    }

    const res = await reader.readTree(readUrl);
    await fs.ensureDir(outputPath);
    await res.dir({ targetDir: outputPath });
  }
}
