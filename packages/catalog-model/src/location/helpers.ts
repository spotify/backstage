/*
 * Copyright 2021 Spotify AB
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

import { Entity, stringifyEntityRef } from '../entity';
import { LOCATION_ANNOTATION, SOURCE_LOCATION_ANNOTATION } from './annotation';

/**
 * Parses a string form location reference.
 *
 * Note that the return type is not `LocationSpec`, because we do not want to
 * conflate the string form with the additional properties of that type.
 *
 * @param ref A string-form location reference, e.g. 'url:https://host'
 * @returns A location reference, e.g. { type: 'url', target: 'https://host' }
 */
export function parseLocationReference(
  ref: string,
): { type: string; target: string } {
  if (typeof ref !== 'string') {
    throw new TypeError(
      `Unable to parse location reference '${ref}', unexpected argument ${typeof ref}`,
    );
  }

  const splitIndex = ref.indexOf(':');
  if (splitIndex < 0) {
    throw new TypeError(
      `Unable to parse location reference '${ref}', expected '<type>:<target>', e.g. 'url:https://host/path'`,
    );
  }

  const type = ref.substr(0, splitIndex).trim();
  const target = ref.substr(splitIndex + 1).trim();

  if (!type || !target) {
    throw new TypeError(
      `Unable to parse location reference '${ref}', expected '<type>:<target>', e.g. 'url:https://host/path'`,
    );
  }

  if (type === 'http' || type === 'https') {
    throw new TypeError(
      `Invalid location reference '${ref}', please prefix it with 'url:', e.g. 'url:${ref}'`,
    );
  }

  return { type, target };
}

/**
 * Turns a location reference into its string form.
 *
 * Note that the input type is not `LocationSpec`, because we do not want to
 * conflate the string form with the additional properties of that type.
 *
 * @param ref A location reference, e.g. { type: 'url', target: 'https://host' }
 * @returns A string-form location reference, e.g. 'url:https://host'
 */
export function stringifyLocationReference(ref: {
  type: string;
  target: string;
}): string {
  const { type, target } = ref;

  if (!type) {
    throw new TypeError(`Unable to stringify location reference, empty type`);
  } else if (!target) {
    throw new TypeError(`Unable to stringify location reference, empty target`);
  }

  return `${type}:${target}`;
}

/**
 * Returns the source code location of the Entity, to the extent that one exists.
 *
 * If the returned location type is of type 'url', the target should be readable at least
 * using the UrlReader from @backstage/backend-common. If it is not of type 'url', the caller
 * needs to have explicit handling of each location type or signal that it is not supported.
 */
export function getEntitySourceLocation(
  entity: Entity,
): { type: string; target: string } {
  const locationRef =
    entity.metadata?.annotations?.[SOURCE_LOCATION_ANNOTATION] ??
    entity.metadata?.annotations?.[LOCATION_ANNOTATION];

  if (!locationRef) {
    throw new Error(
      `Entity '${stringifyEntityRef(entity)}' is missing location`,
    );
  }

  return parseLocationReference(locationRef);
}
