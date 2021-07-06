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

import lodash from 'lodash';

/**
 * Contains various helper validation and normalization functions that can be
 * composed to form a Validator.
 */
export class CommonValidatorFunctions {
  /**
   * Checks that the value is on the form <suffix> or <prefix><separator><suffix>, and validates
   * those parts separately.
   *
   * @param value The value to check
   * @param separator The separator between parts
   * @param isValidPrefix Checks that the part before the separator is valid, if present
   * @param isValidSuffix Checks that the part after the separator (or the entire value if there is no separator) is valid
   */
  static isValidPrefixAndOrSuffix(
    value: unknown,
    separator: string,
    isValidPrefix: (value: string) => boolean,
    isValidSuffix: (value: string) => boolean,
  ): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const parts = value.split(separator);
    if (parts.length === 1) {
      return isValidSuffix(parts[0]);
    } else if (parts.length === 2) {
      return isValidPrefix(parts[0]) && isValidSuffix(parts[1]);
    }

    return false;
  }

  /**
   * Checks that the value can be safely transferred as JSON.
   *
   * @param value The value to check
   */
  static isJsonSafe(value: unknown): boolean {
    try {
      return lodash.isEqual(value, JSON.parse(JSON.stringify(value)));
    } catch {
      return false;
    }
  }

  /**
   * Checks that the value is a valid DNS subdomain name.
   *
   * @param value The value to check
   * @see https://tools.ietf.org/html/rfc1123
   */
  static isValidDnsSubdomain(value: unknown): boolean {
    return (
      typeof value === 'string' &&
      value.length >= 1 &&
      value.length <= 253 &&
      value.split('.').every(CommonValidatorFunctions.isValidDnsLabel)
    );
  }

  /**
   * Checks that the value is a valid DNS label.
   *
   * @param value The value to check
   * @see https://tools.ietf.org/html/rfc1123
   */
  static isValidDnsLabel(value: unknown): boolean {
    return (
      typeof value === 'string' &&
      value.length >= 1 &&
      value.length <= 63 &&
      /^[a-z0-9]+(\-[a-z0-9]+)*$/.test(value)
    );
  }

  /**
   * Checks that the value is a valid URL.
   *
   * @param value The value to check
   */
  static isValidUrl(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    try {
      // eslint-disable-next-line no-new
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks that the value is a non empty string value.
   *
   * @param value The value to check
   */
  static isValidString(value: unknown): boolean {
    return typeof value === 'string' && value?.trim()?.length >= 1;
  }
}
