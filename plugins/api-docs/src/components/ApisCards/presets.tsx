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

import { ApiEntity } from '@backstage/catalog-model';
import { EntityTable } from '@backstage/plugin-catalog-react';
import React from 'react';
import { ApiTypeTitle } from '../ApiDefinitionCard';
import { TableColumn } from '@backstage/core-components';

export function createSpecApiTypeColumn(): TableColumn<ApiEntity> {
  return {
    title: 'Type',
    field: 'spec.type',
    render: entity => <ApiTypeTitle apiEntity={entity} />,
  };
}

// TODO: This could be moved to plugin-catalog-react if we wouldn't have a
// special createSpecApiTypeColumn. But this is required to use ApiTypeTitle to
// resolve the display name of an entity. Is the display name really worth it?

export const apiEntityColumns: TableColumn<ApiEntity>[] = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: 'API' }),
  EntityTable.columns.createSystemColumn(),
  EntityTable.columns.createOwnerColumn(),
  EntityTable.columns.createSpecLifecycleColumn(),
  createSpecApiTypeColumn(),
  EntityTable.columns.createMetadataDescriptionColumn(),
];
