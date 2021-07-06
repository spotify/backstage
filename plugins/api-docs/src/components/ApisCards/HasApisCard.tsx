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

import { ApiEntity, RELATION_HAS_PART } from '@backstage/catalog-model';
import { Typography } from '@material-ui/core';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { createSpecApiTypeColumn } from './presets';
import {
  CodeSnippet,
  InfoCard,
  Link,
  Progress,
  TableColumn,
  WarningPanel,
} from '@backstage/core-components';

type Props = {
  variant?: 'gridItem';
};

const columns: TableColumn<ApiEntity>[] = [
  EntityTable.columns.createEntityRefColumn({ defaultKind: 'API' }),
  EntityTable.columns.createOwnerColumn(),
  EntityTable.columns.createSpecLifecycleColumn(),
  createSpecApiTypeColumn(),
  EntityTable.columns.createMetadataDescriptionColumn(),
];

export const HasApisCard = ({ variant = 'gridItem' }: Props) => {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: RELATION_HAS_PART,
    kind: 'API',
  });

  if (loading) {
    return (
      <InfoCard variant={variant} title="APIs">
        <Progress />
      </InfoCard>
    );
  }

  if (error || !entities) {
    return (
      <InfoCard variant={variant} title="APIs">
        <WarningPanel
          severity="error"
          title="Could not load APIs"
          message={<CodeSnippet text={`${error}`} language="text" />}
        />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title="APIs"
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">
            This {entity.kind.toLocaleLowerCase('en-US')} does not contain any
            APIs.
          </Typography>
          <Typography variant="body2">
            <Link to="https://backstage.io/docs/features/software-catalog/descriptor-format#kind-api">
              Learn how to change this.
            </Link>
          </Typography>
        </div>
      }
      columns={columns}
      entities={entities as ApiEntity[]}
    />
  );
};
