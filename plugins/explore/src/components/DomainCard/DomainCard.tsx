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
import { DomainEntity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  EntityRefLinks,
  entityRouteParams,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
} from '@material-ui/core';
import React from 'react';
import { catalogEntityRouteRef } from '../../routes';

import { Button, ItemCardHeader } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';

type DomainCardProps = {
  entity: DomainEntity;
};

export const DomainCard = ({ entity }: DomainCardProps) => {
  const catalogEntityRoute = useRouteRef(catalogEntityRouteRef);

  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  const url = catalogEntityRoute(entityRouteParams(entity));

  const owner = (
    <EntityRefLinks
      entityRefs={ownedByRelations}
      defaultKind="group"
      color="inherit"
    />
  );

  return (
    <Card>
      <CardMedia>
        <ItemCardHeader title={entity.metadata.name} subtitle={owner} />
      </CardMedia>
      <CardContent>
        {entity.metadata.tags?.length ? (
          <Box>
            {entity.metadata.tags.map(tag => (
              <Chip size="small" label={tag} key={tag} />
            ))}
          </Box>
        ) : null}
        {entity.metadata.description}
      </CardContent>
      <CardActions>
        <Button to={url} color="primary">
          Explore
        </Button>
      </CardActions>
    </Card>
  );
};
