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

/**
 * The sortSelector is a utility that makes a sort function by selecting the value to sort on with a lambda.
 */
export default function sortSelector<T>(
  selector: (x: T) => any,
): (a: T, b: T) => -1 | 1 | 0 {
  return (a: T, b: T) => {
    const aV = selector(a);
    const bV = selector(b);
    if (aV < bV) {
      return -1;
    } else if (aV > bV) {
      return 1;
    }
    return 0;
  };
}
