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

import { JsonObject } from '@backstage/config';
import { mergeConfigSchemas } from '@backstage/config-loader';
import { Command } from 'commander';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import openBrowser from 'react-dev-utils/openBrowser';
import { loadCliConfig } from '../../lib/config';

const DOCS_URL = 'https://config.backstage.io';

export default async (cmd: Command) => {
  const { schema: appSchemas } = await loadCliConfig({
    args: [],
    fromPackage: cmd.package,
    mockEnv: true,
  });

  const schema = mergeConfigSchemas(
    (appSchemas.serialize().schemas as JsonObject[]).map(
      _ => _.value as JSONSchema,
    ),
  );

  openBrowser(`${DOCS_URL}#schema=${JSON.stringify(schema)}`);
};
