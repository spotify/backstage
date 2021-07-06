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

import { ComponentIdValidators } from './validate';

describe('ComponentIdValidators', () => {
  describe('httpsValidator validator', () => {
    const errorMessage = 'Must start with https://.';
    test.each([
      [true, 'https://example.com'],
      [errorMessage, 'http://example.com'],
      [errorMessage, 'example.com'],
      [errorMessage, 'www.example.com'],
      [errorMessage, ''],
      [errorMessage, undefined],
    ])('should return %p for %s', (expected: string | boolean, arg: any) => {
      expect(ComponentIdValidators.httpsValidator(arg)).toBe(expected);
    });
  });
  describe('yamlValidator', () => {
    const errorMessage = "Must contain '.yaml'.";
    test.each([
      [true, '.yaml'],
      [true, 'http://example.com/blob/master/service.yaml'],
      [true, 'https://example.yaml'],
      [true, 'https://example.com?path=abc.yaml&c=1'],
      [errorMessage, 'https://example.com?path=abc_yaml&c=1'],
      [errorMessage, '.yml'],
      [errorMessage, 'http://example.com/blob/master/service'],
      [errorMessage, undefined],
    ])('should return %p for %s', (expected: string | boolean, arg: any) => {
      expect(ComponentIdValidators.yamlValidator(arg)).toBe(expected);
    });
  });
});
