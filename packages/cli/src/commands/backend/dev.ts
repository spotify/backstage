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

import fs from 'fs-extra';
import { Command } from 'commander';
import { paths } from '../../lib/paths';
import { serveBackend } from '../../lib/bundler/backend';

export default async (cmd: Command) => {
  // Cleaning dist/ before we start the dev process helps work around an issue
  // where we end up with the entrypoint executing multiple times, causing
  // a port bind conflict among other things.
  await fs.remove(paths.resolveTarget('dist'));

  const waitForExit = await serveBackend({
    entry: 'src/index',
    checksEnabled: cmd.check,
    inspectEnabled: cmd.inspect,
  });

  await waitForExit();
};
