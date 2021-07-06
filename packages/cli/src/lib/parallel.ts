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

export const PARALLEL_ENV_VAR = 'BACKSTAGE_CLI_BUILD_PARALLEL';

export type ParallelOption = boolean | number | undefined;

export function isParallelDefault(parallel: ParallelOption) {
  return parallel === undefined || parallel === true;
}

export function parseParallel(
  parallel: boolean | string | number | undefined,
): ParallelOption {
  if (parallel === undefined || parallel === null) {
    return true;
  } else if (typeof parallel === 'boolean') {
    return parallel;
  } else if (typeof parallel === 'number' && Number.isInteger(parallel)) {
    return parallel;
  } else if (typeof parallel === 'string') {
    if (parallel === 'true') {
      return true;
    } else if (parallel === 'false') {
      return false;
    } else if (Number.isInteger(parseFloat(parallel.toString()))) {
      return Number(parallel);
    }
  }

  throw Error(
    `Parallel option value '${parallel}' is not a boolean or integer`,
  );
}
