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

import React, { ComponentProps } from 'react';
import { useStarredEntities } from '@backstage/plugin-catalog-react';
import { IconButton, Tooltip, withStyles } from '@material-ui/core';
import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import { Entity } from '@backstage/catalog-model';

type Props = ComponentProps<typeof IconButton> & { entity: Entity };

const YellowStar = withStyles({
  root: {
    color: '#f3ba37',
  },
})(Star);

export const favouriteEntityTooltip = (isStarred: boolean) =>
  isStarred ? 'Remove from favorites' : 'Add to favorites';

export const favouriteEntityIcon = (isStarred: boolean) =>
  isStarred ? <YellowStar /> : <StarBorder />;

/**
 * IconButton for showing if a current entity is starred and adding/removing it from the favourite entities
 * @param props MaterialUI IconButton props extended by required `entity` prop
 */
export const FavouriteEntity = (props: Props) => {
  const { toggleStarredEntity, isStarredEntity } = useStarredEntities();
  const isStarred = isStarredEntity(props.entity);
  return (
    <IconButton
      color="inherit"
      {...props}
      onClick={() => toggleStarredEntity(props.entity)}
    >
      <Tooltip title={favouriteEntityTooltip(isStarred)}>
        {favouriteEntityIcon(isStarred)}
      </Tooltip>
    </IconButton>
  );
};
