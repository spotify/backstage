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

import {
  Entity,
  LOCATION_ANNOTATION,
  parseLocationReference,
  SOURCE_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import fs from 'fs-extra';
import os from 'os';
import { Logger } from 'winston';

export async function getWorkingDirectory(
  config: Config,
  logger: Logger,
): Promise<string> {
  if (!config.has('backend.workingDirectory')) {
    return os.tmpdir();
  }

  const workingDirectory = config.getString('backend.workingDirectory');
  try {
    // Check if working directory exists and is writable
    await fs.access(workingDirectory, fs.constants.F_OK | fs.constants.W_OK);
    logger.info(`using working directory: ${workingDirectory}`);
  } catch (err) {
    logger.error(
      `working directory ${workingDirectory} ${
        err.code === 'ENOENT' ? 'does not exist' : 'is not writable'
      }`,
    );
    throw err;
  }
  return workingDirectory;
}

/**
 * Gets the base URL of the entity location that points to the source location
 * of the entity description within a repo. If there is not source location
 * or if it has an invalid type, undefined will be returned instead.
 *
 * For file locations this will return a `file://` URL.
 */
export function getEntityBaseUrl(entity: Entity): string | undefined {
  let location = entity.metadata.annotations?.[SOURCE_LOCATION_ANNOTATION];
  if (!location) {
    location = entity.metadata.annotations?.[LOCATION_ANNOTATION];
  }
  if (!location) {
    return undefined;
  }

  const { type, target } = parseLocationReference(location);
  if (type === 'url') {
    return target;
  } else if (type === 'file') {
    return `file://${target}`;
  }

  // Only url and file location are handled, as we otherwise don't know if
  // what the url is pointing to makes sense to use as a baseUrl
  return undefined;
}
