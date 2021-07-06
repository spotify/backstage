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

import { Entity } from '@backstage/catalog-model';
import React from 'react';
import { useTopActiveItems } from '../../hooks/useTopActiveItems';
import { RollbarTopItemsTable } from '../RollbarTopItemsTable/RollbarTopItemsTable';

type Props = {
  entity: Entity;
};

export const RollbarProject = ({ entity }: Props) => {
  const { items, organization, project, loading, error } = useTopActiveItems(
    entity,
  );

  return (
    <RollbarTopItemsTable
      organization={organization}
      project={project}
      items={items || []}
      loading={loading}
      error={error}
    />
  );
};
