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

import { buildPackage, Output } from '../lib/builder';
import { Command } from 'commander';

export default async (cmd: Command) => {
  let outputs = new Set<Output>();

  const { outputs: outputsStr } = cmd as { outputs?: string };
  if (outputsStr) {
    for (const output of outputsStr.split(',') as (keyof typeof Output)[]) {
      if (output in Output) {
        outputs.add(Output[output]);
      } else {
        throw new Error(`Unknown output format: ${output}`);
      }
    }
  } else {
    outputs = new Set([Output.types, Output.esm, Output.cjs]);
  }

  await buildPackage({ outputs });
};
