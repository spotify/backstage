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

import {
  Entity,
  EntityName,
  ENTITY_DEFAULT_NAMESPACE,
  serializeEntityRef,
} from '@backstage/catalog-model';

export function formatEntityRefTitle(
  entityRef: Entity | EntityName,
  opts?: { defaultKind?: string },
) {
  const defaultKind = opts?.defaultKind;
  let kind;
  let namespace;
  let name;

  if ('metadata' in entityRef) {
    kind = entityRef.kind;
    namespace = entityRef.metadata.namespace;
    name = entityRef.metadata.name;
  } else {
    kind = entityRef.kind;
    namespace = entityRef.namespace;
    name = entityRef.name;
  }

  if (namespace === ENTITY_DEFAULT_NAMESPACE) {
    namespace = undefined;
  }

  kind = kind.toLowerCase();

  return `${serializeEntityRef({
    kind: defaultKind && defaultKind.toLowerCase() === kind ? undefined : kind,
    name,
    namespace,
  })}`;
}
