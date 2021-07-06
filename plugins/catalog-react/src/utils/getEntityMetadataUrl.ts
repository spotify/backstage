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
  EDIT_URL_ANNOTATION,
  Entity,
  VIEW_URL_ANNOTATION,
} from '@backstage/catalog-model';

export function getEntityMetadataViewUrl(entity: Entity): string | undefined {
  return entity.metadata.annotations?.[VIEW_URL_ANNOTATION];
}

export function getEntityMetadataEditUrl(entity: Entity): string | undefined {
  return entity.metadata.annotations?.[EDIT_URL_ANNOTATION];
}
