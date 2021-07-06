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
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { Chip, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { AboutField } from './AboutField';

const useStyles = makeStyles({
  description: {
    wordBreak: 'break-word',
  },
});

type Props = {
  entity: Entity;
};

export const AboutContent = ({ entity }: Props) => {
  const classes = useStyles();
  const isSystem = entity.kind.toLocaleLowerCase('en-US') === 'system';
  const isDomain = entity.kind.toLocaleLowerCase('en-US') === 'domain';
  const isResource = entity.kind.toLocaleLowerCase('en-US') === 'resource';
  const isComponent = entity.kind.toLocaleLowerCase('en-US') === 'component';
  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const partOfComponentRelations = getEntityRelations(
    entity,
    RELATION_PART_OF,
    {
      kind: 'component',
    },
  );
  const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'domain',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  return (
    <Grid container>
      <AboutField label="Description" gridSizes={{ xs: 12 }}>
        <Typography variant="body2" paragraph className={classes.description}>
          {entity?.metadata?.description || 'No description'}
        </Typography>
      </AboutField>
      <AboutField label="Owner" gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
        <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
      </AboutField>
      {isSystem && (
        <AboutField
          label="Domain"
          value="No Domain"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          <EntityRefLinks
            entityRefs={partOfDomainRelations}
            defaultKind="domain"
          />
        </AboutField>
      )}
      {!isSystem && !isDomain && (
        <AboutField
          label="System"
          value="No System"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          <EntityRefLinks
            entityRefs={partOfSystemRelations}
            defaultKind="system"
          />
        </AboutField>
      )}
      {isComponent && partOfComponentRelations.length > 0 && (
        <AboutField
          label="Parent Component"
          value="No Parent Component"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          <EntityRefLinks
            entityRefs={partOfComponentRelations}
            defaultKind="component"
          />
        </AboutField>
      )}
      {!isSystem && !isDomain && (
        <AboutField
          label="Type"
          value={entity?.spec?.type as string}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        />
      )}
      {!isSystem && !isDomain && !isResource && (
        <AboutField
          label="Lifecycle"
          value={entity?.spec?.lifecycle as string}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        />
      )}
      <AboutField
        label="Tags"
        value="No Tags"
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      >
        {(entity?.metadata?.tags || []).map(t => (
          <Chip key={t} size="small" label={t} />
        ))}
      </AboutField>
    </Grid>
  );
};
