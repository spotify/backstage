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

/**
 * The versioned value interface is a container for a set of values that
 * can be looked up by version. It is intended to be used as a container
 * for values that can be versioned independently of package versions.
 */
export type VersionedValue<Versions extends { [version: number]: any }> = {
  atVersion<Version extends keyof Versions>(
    version: Version,
  ): Versions[Version] | undefined;
};

/**
 * Creates a container for a map of versioned values that implements VersionedValue.
 */
export function createVersionedValueMap<
  Versions extends { [version: number]: any }
>(versions: Versions): VersionedValue<Versions> {
  Object.freeze(versions);
  return {
    atVersion(version) {
      return versions[version];
    },
  };
}
