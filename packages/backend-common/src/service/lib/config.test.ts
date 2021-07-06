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

import { ConfigReader } from '@backstage/config';
import { readCspOptions } from './config';

describe('config', () => {
  describe('readCspOptions', () => {
    it('reads valid values', () => {
      const config = new ConfigReader({ csp: { key: ['value'] } });
      expect(readCspOptions(config)).toEqual(
        expect.objectContaining({
          key: ['value'],
        }),
      );
    });

    it('accepts false', () => {
      const config = new ConfigReader({ csp: { key: false } });
      expect(readCspOptions(config)).toEqual(
        expect.objectContaining({
          key: false,
        }),
      );
    });

    it('rejects invalid value types', () => {
      const config = new ConfigReader({ csp: { key: [4] } });
      expect(() => readCspOptions(config)).toThrow(/wanted string-array/);
    });
  });
});
