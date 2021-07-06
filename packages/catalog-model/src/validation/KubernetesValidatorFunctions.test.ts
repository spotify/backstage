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

import { KubernetesValidatorFunctions } from './KubernetesValidatorFunctions';

describe('KubernetesValidatorFunctions', () => {
  it.each([
    [7, false],
    [null, false],
    ['', false],
    ['a', true],
    ['AZ09', true],
    ['a'.repeat(63), true],
    ['a'.repeat(64), false],
    ['a-b', false],
    ['a_b', false],
    ['a.b', false],
    ['a/a', true],
    ['a/aAb5C', true],
    ['a-b.c/v1', true],
    ['a--b.c/v1', false],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(
        61,
      )}/v1`,
      true,
    ],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(
        62,
      )}/v1`,
      false,
    ],
    [`a/${'a'.repeat(63)}`, true],
    [`a/${'a'.repeat(64)}`, false],
  ])(`isValidApiVersion %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidApiVersion(value)).toBe(matches);
  });

  it.each([
    [7, false],
    [null, false],
    ['', false],
    ['a', true],
    ['AZ09', true],
    ['9AZ', false],
    ['a'.repeat(63), true],
    ['a'.repeat(64), false],
    ['a-b', false],
  ])(`isValidKind %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidKind(value)).toBe(matches);
  });

  it.each([
    [7, false],
    [null, false],
    ['', false],
    ['a', true],
    ['AZ09', true],
    ['a'.repeat(63), true],
    ['a'.repeat(64), false],
    ['a/b', false],
    ['a-b', true],
    ['-a-b', false],
    ['a-b-', false],
    ['a--b', true],
    ['a_b', true],
    ['a.b', true],
    ['a..b', true],
  ])(`isValidObjectName %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidObjectName(value)).toBe(matches);
  });

  it.each([
    [7, false],
    [null, false],
    ['', false],
    ['a', true],
    ['AZ09', false],
    ['a'.repeat(63), true],
    ['a'.repeat(64), false],
    ['a/b', false],
    ['a-b', true],
    ['-a-b', false],
    ['a-b-', false],
    ['a--b', false],
    ['a_b', false],
    ['a.b', false],
  ])(`isValidNamespace %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidNamespace(value)).toBe(matches);
  });

  it.each([
    [7, false],
    [null, false],
    ['', false],
    ['a', true],
    ['AZ09', true],
    ['a'.repeat(63), true],
    ['a'.repeat(64), false],
    ['a/b', true],
    ['a-b', true],
    ['-a-b', false],
    ['a-b-', false],
    ['a--b', true],
    ['a_b', true],
    ['a.b', true],
    ['a..b', true],
    ['a/a', true],
    ['a-b.c/a', true],
    ['a--b.c/a', false],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(
        61,
      )}/a`,
      true,
    ],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(
        62,
      )}/a`,
      false,
    ],
    [`a/${'a'.repeat(63)}`, true],
    [`a/${'a'.repeat(64)}`, false],
  ])(`isValidLabelKey %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidLabelKey(value)).toBe(matches);
  });

  it.each([
    [7, false],
    [null, false],
    ['', true],
    ['a', true],
    ['AZ09', true],
    ['a'.repeat(63), true],
    ['a'.repeat(64), false],
    ['a/b', false],
    ['a-b', true],
    ['-a-b', false],
    ['a-b-', false],
    ['a--b', true],
    ['a_b', true],
    ['a.b', true],
    ['a..b', true],
  ])(`isValidLabelValue %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidLabelValue(value)).toBe(matches);
  });

  it.each([
    [7, false],
    [null, false],
    ['', false],
    ['a', true],
    ['AZ09', true],
    ['a'.repeat(63), true],
    ['a'.repeat(64), false],
    ['a/b', true],
    ['a-b', true],
    ['-a-b', false],
    ['a-b-', false],
    ['a--b', true],
    ['a_b', true],
    ['a.b', true],
    ['a..b', true],
    ['a/a', true],
    ['a-b.c/a', true],
    ['a--b.c/a', false],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(
        61,
      )}/a`,
      true,
    ],
    [
      `${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(
        62,
      )}/a`,
      false,
    ],
    [`a/${'a'.repeat(63)}`, true],
    [`a/${'a'.repeat(64)}`, false],
  ])(`isValidAnnotationKey %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidAnnotationKey(value)).toBe(
      matches,
    );
  });

  it.each([
    [7, false],
    [null, false],
    ['', true],
    ['a', true],
    ['/'.repeat(6000), true],
  ])(`isValidAnnotationValue %p ? %p`, (value, matches) => {
    expect(KubernetesValidatorFunctions.isValidAnnotationValue(value)).toBe(
      matches,
    );
  });
});
