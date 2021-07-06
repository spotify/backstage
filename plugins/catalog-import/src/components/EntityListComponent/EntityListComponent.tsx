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

import { Entity, EntityName } from '@backstage/catalog-model';
import {
  EntityRefLink,
  formatEntityRefTitle,
} from '@backstage/plugin-catalog-react';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ApartmentIcon from '@material-ui/icons/Apartment';
import CategoryIcon from '@material-ui/icons/Category';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExtensionIcon from '@material-ui/icons/Extension';
import GroupIcon from '@material-ui/icons/Group';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MemoryIcon from '@material-ui/icons/Memory';
import PersonIcon from '@material-ui/icons/Person';
import WorkIcon from '@material-ui/icons/Work';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function sortEntities(entities: Array<EntityName | Entity>) {
  return entities.sort((a, b) =>
    formatEntityRefTitle(a).localeCompare(formatEntityRefTitle(b)),
  );
}

function getEntityIcon(entity: { kind: string }): React.ReactElement {
  switch (entity.kind.toLocaleLowerCase('en-US')) {
    case 'api':
      return <ExtensionIcon />;

    case 'component':
      return <MemoryIcon />;

    case 'domain':
      return <ApartmentIcon />;

    case 'group':
      return <GroupIcon />;

    case 'location':
      return <LocationOnIcon />;

    case 'system':
      return <CategoryIcon />;

    case 'user':
      return <PersonIcon />;

    default:
      return <WorkIcon />;
  }
}

type Props = {
  locations: Array<{ target: string; entities: (Entity | EntityName)[] }>;
  locationListItemIcon: (target: string) => React.ReactElement;
  collapsed?: boolean;
  firstListItem?: React.ReactElement;
  onItemClick?: (target: string) => void;
  withLinks?: boolean;
};

export const EntityListComponent = ({
  locations,
  collapsed = false,
  locationListItemIcon,
  onItemClick,
  firstListItem,
  withLinks = false,
}: Props) => {
  const classes = useStyles();

  const [expandedUrls, setExpandedUrls] = useState<string[]>([]);

  const handleClick = (url: string) => {
    setExpandedUrls(urls =>
      urls.includes(url) ? urls.filter(u => u !== url) : urls.concat(url),
    );
  };

  return (
    <List>
      {firstListItem}
      {locations.map(r => (
        <React.Fragment key={r.target}>
          <ListItem
            dense
            button={Boolean(onItemClick) as any}
            onClick={() => onItemClick?.call(this, r.target)}
          >
            <ListItemIcon>{locationListItemIcon(r.target)}</ListItemIcon>

            <ListItemText
              primary={r.target}
              secondary={`Entities: ${r.entities.length}`}
            />

            {collapsed && (
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleClick(r.target)}>
                  {expandedUrls.includes(r.target) ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>

          <Collapse
            in={!collapsed || expandedUrls.includes(r.target)}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding dense>
              {sortEntities(r.entities).map(entity => (
                <ListItem
                  key={formatEntityRefTitle(entity)}
                  className={classes.nested}
                  {...(withLinks
                    ? {
                        component: EntityRefLink,
                        entityRef: entity,
                        button: withLinks as any,
                      }
                    : {})}
                >
                  <ListItemIcon>{getEntityIcon(entity)}</ListItemIcon>
                  <ListItemText primary={formatEntityRefTitle(entity)} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};
