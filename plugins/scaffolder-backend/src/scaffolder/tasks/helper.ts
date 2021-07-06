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

import { isArray } from 'lodash';

/**
 * Returns true if the input is not `false`, `undefined`, `null`, `""`, `0`, or
 * `[]`. This behavior is based on the behavior of handlebars, see
 * https://handlebarsjs.com/guide/builtin-helpers.html#if
 */
export function isTruthy(value: any): boolean {
  return isArray(value) ? value.length > 0 : !!value;
}
