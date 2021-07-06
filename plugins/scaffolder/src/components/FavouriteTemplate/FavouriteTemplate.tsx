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

import React, { ComponentProps, useMemo } from 'react';
import { useStarredEntities } from '@backstage/plugin-catalog-react';
import { IconButton, makeStyles, Tooltip, withStyles } from '@material-ui/core';
import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import { Entity } from '@backstage/catalog-model';

type Props = ComponentProps<typeof IconButton> & { entity: Entity };

const YellowStar = withStyles({
  root: {
    color: '#f3ba37',
  },
})(Star);

const WhiteBorderStar = withStyles({
  root: {
    color: '#ffffff',
  },
})(StarBorder);

const useStyles = makeStyles(theme => ({
  starButton: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    padding: '0.25rem',
  },
}));

export const favouriteTemplateTooltip = (isStarred: boolean) =>
  isStarred ? 'Remove from favorites' : 'Add to favorites';

export const favouriteTemplateIcon = (isStarred: boolean) =>
  isStarred ? <YellowStar /> : <WhiteBorderStar />;

/**
 * IconButton for showing if a current entity is starred and adding/removing it from the favourite entities
 * @param props MaterialUI IconButton props extended by required `entity` prop
 */
export const FavouriteTemplate = (props: Props) => {
  const classes = useStyles();
  const { toggleStarredEntity, isStarredEntity } = useStarredEntities();
  const isStarred = useMemo(() => isStarredEntity(props.entity), [
    isStarredEntity,
    props.entity,
  ]);
  return (
    <IconButton
      color="inherit"
      className={classes.starButton}
      {...props}
      onClick={() => toggleStarredEntity(props.entity)}
    >
      <Tooltip title={favouriteTemplateTooltip(isStarred)}>
        {favouriteTemplateIcon(isStarred)}
      </Tooltip>
    </IconButton>
  );
};
