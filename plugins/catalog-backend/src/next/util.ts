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

import {
  Entity,
  LocationEntityV1alpha1,
  LocationSpec,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
  stringifyEntityRef,
  stringifyLocationReference,
} from '@backstage/catalog-model';
import { createHash } from 'crypto';

export function locationSpecToMetadataName(location: LocationSpec) {
  const hash = createHash('sha1')
    .update(`${location.type}:${location.target}`)
    .digest('hex');
  return `generated-${hash}`;
}

export function locationSpecToLocationEntity(
  location: LocationSpec,
  parentEntity?: Entity,
): LocationEntityV1alpha1 {
  let ownLocation: string;
  let originLocation: string;
  if (parentEntity) {
    const maybeOwnLocation =
      parentEntity.metadata.annotations?.[LOCATION_ANNOTATION];
    if (!maybeOwnLocation) {
      throw new Error(
        `Parent entity '${stringifyEntityRef(
          parentEntity,
        )}' of location '${stringifyLocationReference(
          location,
        )}' does not have a location annotation`,
      );
    }
    ownLocation = maybeOwnLocation;
    const maybeOriginLocation =
      parentEntity.metadata.annotations?.[ORIGIN_LOCATION_ANNOTATION];
    if (!maybeOriginLocation) {
      throw new Error(
        `Parent entity '${stringifyEntityRef(
          parentEntity,
        )}' of location '${stringifyLocationReference(
          location,
        )}' does not have an origin location annotation`,
      );
    }
    originLocation = maybeOriginLocation;
  } else {
    ownLocation = stringifyLocationReference(location);
    originLocation = ownLocation;
  }

  const result: LocationEntityV1alpha1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Location',
    metadata: {
      name: locationSpecToMetadataName(location),
      annotations: {
        [LOCATION_ANNOTATION]: ownLocation,
        [ORIGIN_LOCATION_ANNOTATION]: originLocation,
      },
    },
    spec: {
      type: location.type,
      target: location.target,
    },
  };

  return result;
}
