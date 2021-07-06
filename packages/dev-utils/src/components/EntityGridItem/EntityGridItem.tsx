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
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import { Grid, GridProps, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles<BackstageTheme, { entity: Entity }>(theme => ({
  root: ({ entity }) => ({
    position: 'relative',

    '&::before': {
      content: `"${entity.metadata.name}"`,
      top: -theme.typography.fontSize + 4,
      display: 'block',
      position: 'absolute',
      color: theme.palette.textSubtle,
    },
  }),
}));

export const EntityGridItem = ({
  entity,
  classes,
  ...rest
}: Omit<GridProps, 'item' | 'container'> & { entity: Entity }): JSX.Element => {
  const itemClasses = useStyles({ entity });

  return (
    <EntityProvider entity={entity}>
      <Grid classes={{ root: itemClasses.root, ...classes }} {...rest} item />
    </EntityProvider>
  );
};
