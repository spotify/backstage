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
import {
  catalogApiRef,
  isOwnerOf,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { BackstageTheme, genPageTheme } from '@backstage/theme';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';

import {
  InfoCard,
  InfoCardVariants,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

type EntitiesKinds = 'Component' | 'API';
type EntitiesTypes =
  | 'service'
  | 'website'
  | 'library'
  | 'documentation'
  | 'api'
  | 'tool';

const createPageTheme = (
  theme: BackstageTheme,
  shapeKey: string,
  colorsKey: string,
) => {
  const { colors } = theme.getPageTheme({ themeId: colorsKey });
  const { shape } = theme.getPageTheme({ themeId: shapeKey });
  return genPageTheme(colors, shape).backgroundImage;
};

const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      padding: theme.spacing(2),
      color: '#fff',
      transition: `${theme.transitions.duration.standard}ms`,
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
    },
    bold: {
      fontWeight: theme.typography.fontWeightBold,
    },
    service: {
      background: createPageTheme(theme, 'home', 'service'),
    },
    website: {
      background: createPageTheme(theme, 'home', 'website'),
    },
    library: {
      background: createPageTheme(theme, 'home', 'library'),
    },
    documentation: {
      background: createPageTheme(theme, 'home', 'documentation'),
    },
    api: {
      background: createPageTheme(theme, 'home', 'home'),
    },
    tool: {
      background: createPageTheme(theme, 'home', 'tool'),
    },
  }),
);

const listEntitiesBy = (
  entities: Array<Entity>,
  kind: EntitiesKinds,
  type?: EntitiesTypes,
) =>
  entities.filter(
    e => e.kind === kind && (type ? e?.spec?.type === type : true),
  );

const countEntitiesBy = (
  entities: Array<Entity>,
  kind: EntitiesKinds,
  type?: EntitiesTypes,
) => listEntitiesBy(entities, kind, type).length;

const EntityCountTile = ({
  counter,
  className,
  entities,
  name,
}: {
  counter: number;
  className: EntitiesTypes;
  entities: Entity[];
  name: string;
}) => {
  let entityNames;
  const classes = useStyles();

  if (entities.length < 20) {
    entityNames = entities.map(e => e.metadata.name).join(', ');
  } else {
    entityNames = `${entities
      .map(e => e.metadata.name)
      .slice(0, 20)
      .join(', ')}, ...`;
  }

  return (
    <Tooltip title={entityNames} arrow>
      <Box
        className={`${classes.card} ${classes[className]}`}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography className={classes.bold} variant="h6">
          {counter}
        </Typography>
        <Typography className={classes.bold} variant="h6">
          {name}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export const OwnershipCard = ({
  variant,
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const {
    loading,
    error,
    value: componentsWithCounters,
  } = useAsync(async () => {
    const kinds = ['Component', 'API'];
    const entitiesList = await catalogApi.getEntities({
      filter: {
        kind: kinds,
      },
      fields: [
        'kind',
        'metadata.name',
        'metadata.namespace',
        'spec.type',
        'relations',
      ],
    });

    const ownedEntitiesList = entitiesList.items.filter(component =>
      isOwnerOf(entity, component),
    );

    return [
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'service'),
        className: 'service',
        entities: listEntitiesBy(ownedEntitiesList, 'Component', 'service'),
        name: 'Services',
      },
      {
        counter: countEntitiesBy(
          ownedEntitiesList,
          'Component',
          'documentation',
        ),
        className: 'documentation',
        entities: listEntitiesBy(
          ownedEntitiesList,
          'Component',
          'documentation',
        ),
        name: 'Documentation',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'API'),
        className: 'api',
        entities: listEntitiesBy(ownedEntitiesList, 'API'),
        name: 'APIs',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'library'),
        className: 'library',
        entities: listEntitiesBy(ownedEntitiesList, 'Component', 'library'),
        name: 'Libraries',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'website'),
        className: 'website',
        entities: listEntitiesBy(ownedEntitiesList, 'Component', 'website'),
        name: 'Websites',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'tool'),
        className: 'tool',
        entities: listEntitiesBy(ownedEntitiesList, 'Component', 'tool'),
        name: 'Tools',
      },
    ] as Array<{
      counter: number;
      className: EntitiesTypes;
      entities: Entity[];
      name: string;
    }>;
  }, [catalogApi, entity]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <InfoCard title="Ownership" variant={variant}>
      <Grid container>
        {componentsWithCounters?.map(c => (
          <Grid item xs={6} md={6} lg={4} key={c.name}>
            <EntityCountTile
              counter={c.counter}
              className={c.className}
              entities={c.entities}
              name={c.name}
            />
          </Grid>
        ))}
      </Grid>
    </InfoCard>
  );
};
