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

import { useEntity } from '@backstage/plugin-catalog-react';

import { ILERT_INTEGRATION_KEY_ANNOTATION } from '../constants';

export function useILertEntity() {
  const { entity } = useEntity();
  const integrationKey =
    entity.metadata.annotations?.[ILERT_INTEGRATION_KEY_ANNOTATION] || '';
  const name = entity.metadata.name;
  const identifier = `${entity.kind}:${
    entity.metadata.namespace || 'default'
  }/${entity.metadata.name}`;

  return { integrationKey, name, identifier };
}
