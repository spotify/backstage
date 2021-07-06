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
import { LocationSpec } from '@backstage/catalog-model';
import parseGitUrl from 'git-url-parse';
import limiterFactory from 'p-limit';
import { Logger } from 'winston';
import * as result from './results';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  CatalogProcessorParser,
} from './types';

// TODO(Rugvip): Added for backwards compatibility when moving to UrlReader, this
// can be removed in a bit
const deprecatedTypes = [
  'github',
  'github/api',
  'bitbucket/api',
  'gitlab/api',
  'azure/api',
];

type Options = {
  reader: UrlReader;
  logger: Logger;
};

export class UrlReaderProcessor implements CatalogProcessor {
  constructor(private readonly options: Options) {}

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
    parser: CatalogProcessorParser,
  ): Promise<boolean> {
    if (deprecatedTypes.includes(location.type)) {
      // TODO(Rugvip): Remove this warning a month or two into 2021, and remove support for the deprecated types.
      this.options.logger.warn(
        `Location '${location.target}' uses deprecated location type '${location.type}', use 'url' instead. ` +
          'Use "scripts/migrate-location-types.js" in the Backstage repo to migrate existing locations.',
      );
    } else if (location.type !== 'url') {
      return false;
    }

    try {
      const output = await this.doRead(location.target);
      for (const item of output) {
        for await (const parseResult of parser({
          data: item.data,
          location: { type: location.type, target: item.url },
        })) {
          emit(parseResult);
        }
      }
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;

      if (error.name === 'NotFoundError') {
        if (!optional) {
          emit(result.notFoundError(location, message));
        }
      } else {
        emit(result.generalError(location, message));
      }
    }

    return true;
  }

  private async doRead(
    location: string,
  ): Promise<{ data: Buffer; url: string }[]> {
    // Does it contain globs? I.e. does it contain asterisks or question marks
    // (no curly braces for now)
    const { filepath } = parseGitUrl(location);
    if (filepath?.match(/[*?]/)) {
      const limiter = limiterFactory(5);
      const response = await this.options.reader.search(location);
      const output = response.files.map(async file => ({
        url: file.url,
        data: await limiter(file.content),
      }));
      return Promise.all(output);
    }

    // Otherwise do a plain read, prioritizing readUrl if available
    if (this.options.reader.readUrl) {
      const data = await this.options.reader.readUrl(location);
      return [{ url: location, data: await data.buffer() }];
    }

    const data = await this.options.reader.read(location);
    return [{ url: location, data }];
  }
}
