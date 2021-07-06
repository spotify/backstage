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
  LocationSpec,
  stringifyLocationReference,
} from '@backstage/catalog-model';
import lodash from 'lodash';
import yaml from 'yaml';
import * as result from '../results';
import { CatalogProcessorParser, CatalogProcessorResult } from '../types';

export function* parseEntityYaml(
  data: Buffer,
  location: LocationSpec,
): Iterable<CatalogProcessorResult> {
  let documents: yaml.Document.Parsed[];
  try {
    documents = yaml.parseAllDocuments(data.toString('utf8')).filter(d => d);
  } catch (e) {
    const loc = stringifyLocationReference(location);
    const message = `Failed to parse YAML at ${loc}, ${e}`;
    yield result.generalError(location, message);
    return;
  }

  for (const document of documents) {
    if (document.errors?.length) {
      const loc = stringifyLocationReference(location);
      const message = `YAML error at ${loc}, ${document.errors[0]}`;
      yield result.generalError(location, message);
    } else {
      const json = document.toJSON();
      if (lodash.isPlainObject(json)) {
        yield result.entity(location, json as Entity);
      } else if (json === null) {
        // Ignore null values, these happen if there is an empty document in the
        // YAML file, for example if --- is added to the end of the file.
      } else {
        const message = `Expected object at root, got ${typeof json}`;
        yield result.generalError(location, message);
      }
    }
  }
}

export const defaultEntityDataParser: CatalogProcessorParser = async function* defaultEntityDataParser({
  data,
  location,
}) {
  for (const e of parseEntityYaml(data, location)) {
    yield e;
  }
};
