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

import { Entity, ComponentEntity } from '@backstage/catalog-model';

function strCmp(a: string | undefined, b: string | undefined): boolean {
  return Boolean(a && a?.toLowerCase() === b?.toLowerCase());
}

export function isKind(kind: string) {
  return (entity: Entity) => strCmp(entity?.kind, kind);
}

export function isComponentType(type: string) {
  return (entity: Entity) => {
    if (!strCmp(entity?.kind, 'component')) {
      return false;
    }
    const componentEntity = entity as ComponentEntity;
    return strCmp(componentEntity.spec.type, type);
  };
}

export function isNamespace(namespace: string) {
  return (entity: Entity) => strCmp(entity?.metadata?.namespace, namespace);
}
