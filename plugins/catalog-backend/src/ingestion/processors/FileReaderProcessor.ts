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

import { LocationSpec } from '@backstage/catalog-model';
import fs from 'fs-extra';
import g from 'glob';
import path from 'path';
import { promisify } from 'util';
import * as result from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import { parseEntityYaml } from './util/parse';

const glob = promisify(g);

export class FileReaderProcessor implements CatalogProcessor {
  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'file') {
      return false;
    }

    try {
      const fileMatches = await glob(location.target);

      if (fileMatches.length > 0) {
        for (const fileMatch of fileMatches) {
          const data = await fs.readFile(fileMatch);

          // The normalize converts to native slashes; the glob library returns
          // forward slashes even on windows
          for (const parseResult of parseEntityYaml(data, {
            type: 'file',
            target: path.normalize(fileMatch),
          })) {
            emit(parseResult);
          }
        }
      } else if (!optional) {
        const message = `${location.type} ${location.target} does not exist`;
        emit(result.notFoundError(location, message));
      }
    } catch (e) {
      const message = `${location.type} ${location.target} could not be read, ${e}`;
      emit(result.generalError(location, message));
    }

    return true;
  }
}
