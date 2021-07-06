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
import { Typography } from '@material-ui/core';
import {
  EntityTable,
  useEntity,
  useRelatedEntities,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import {
  InfoCard,
  Link,
  Progress,
  ResponseErrorPanel,
  TableColumn,
} from '@backstage/core-components';

type Props<T extends Entity> = {
  variant?: 'gridItem';
  title: string;
  columns: TableColumn<T>[];
  entityKind: string;
  relationType: string;
  emptyMessage: string;
  emptyHelpLink: string;
  asRenderableEntities: (entities: Entity[]) => T[];
};

export function RelatedEntitiesCard<T extends Entity>({
  variant = 'gridItem',
  title,
  columns,
  entityKind,
  relationType,
  emptyMessage,
  emptyHelpLink,
  asRenderableEntities,
}: Props<T>) {
  const { entity } = useEntity();
  const { entities, loading, error } = useRelatedEntities(entity, {
    type: relationType,
    kind: entityKind,
  });

  if (loading) {
    return (
      <InfoCard variant={variant} title={title}>
        <Progress />
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard variant={variant} title={title}>
        <ResponseErrorPanel error={error} />
      </InfoCard>
    );
  }

  return (
    <EntityTable
      title={title}
      variant={variant}
      emptyContent={
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body1">{emptyMessage}</Typography>
          <Typography variant="body2">
            <Link to={emptyHelpLink}>Learn how to change this.</Link>
          </Typography>
        </div>
      }
      columns={columns}
      entities={asRenderableEntities(entities || [])}
    />
  );
}
