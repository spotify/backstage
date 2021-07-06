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

import { ComponentEntity, SystemEntity } from '@backstage/catalog-model';
import {
  createDomainColumn,
  createEntityRefColumn,
  createMetadataDescriptionColumn,
  createOwnerColumn,
  createSpecLifecycleColumn,
  createSpecTypeColumn,
  createSystemColumn,
} from './columns';
import { TableColumn } from '@backstage/core-components';

export const systemEntityColumns: TableColumn<SystemEntity>[] = [
  createEntityRefColumn({ defaultKind: 'system' }),
  createDomainColumn(),
  createOwnerColumn(),
  createMetadataDescriptionColumn(),
];

export const componentEntityColumns: TableColumn<ComponentEntity>[] = [
  createEntityRefColumn({ defaultKind: 'component' }),
  createSystemColumn(),
  createOwnerColumn(),
  createSpecTypeColumn(),
  createSpecLifecycleColumn(),
  createMetadataDescriptionColumn(),
];
