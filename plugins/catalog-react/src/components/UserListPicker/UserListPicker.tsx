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

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { compact } from 'lodash';
import { UserListFilter, UserListFilterKind } from '../../types';
import {
  useEntityListProvider,
  useOwnUser,
  useStarredEntities,
} from '../../hooks';
import {
  Card,
  List,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  MenuItem,
  Theme,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import { reduceEntityFilters } from '../../utils';
import {
  configApiRef,
  IconComponent,
  useApi,
} from '@backstage/core-plugin-api';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .11)',
    boxShadow: 'none',
    margin: theme.spacing(1, 0, 1, 0),
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listIcon: {
    minWidth: 30,
    color: theme.palette.text.primary,
  },
  menuItem: {
    minHeight: theme.spacing(6),
  },
  groupWrapper: {
    margin: theme.spacing(1, 1, 2, 1),
  },
}));

export type ButtonGroup = {
  name: string;
  items: {
    id: 'owned' | 'starred' | 'all';
    label: string;
    icon?: IconComponent;
  }[];
};

function getFilterGroups(orgName: string | undefined): ButtonGroup[] {
  return [
    {
      name: 'Personal',
      items: [
        {
          id: 'owned',
          label: 'Owned',
          icon: SettingsIcon,
        },
        {
          id: 'starred',
          label: 'Starred',
          icon: StarIcon,
        },
      ],
    },
    {
      name: orgName ?? 'Company',
      items: [
        {
          id: 'all',
          label: 'All',
        },
      ],
    },
  ];
}

type UserListPickerProps = {
  initialFilter?: UserListFilterKind;
};

export const UserListPicker = ({ initialFilter }: UserListPickerProps) => {
  const classes = useStyles();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const filterGroups = getFilterGroups(orgName);

  const { value: user } = useOwnUser();
  const { isStarredEntity } = useStarredEntities();
  const [selectedUserFilter, setSelectedUserFilter] = useState(initialFilter);

  // Static filters; used for generating counts of potentially unselected kinds
  const ownedFilter = useMemo(
    () => new UserListFilter('owned', user, isStarredEntity),
    [user, isStarredEntity],
  );
  const starredFilter = useMemo(
    () => new UserListFilter('starred', user, isStarredEntity),
    [user, isStarredEntity],
  );

  const { filters, updateFilters, backendEntities } = useEntityListProvider();

  useEffect(() => {
    updateFilters({
      user: selectedUserFilter
        ? new UserListFilter(selectedUserFilter, user, isStarredEntity)
        : undefined,
    });
  }, [selectedUserFilter, user, isStarredEntity, updateFilters]);

  // To show proper counts for each section, apply all other frontend filters _except_ the user
  // filter that's controlled by this picker.
  const [entitiesWithoutUserFilter, setEntitiesWithoutUserFilter] = useState(
    backendEntities,
  );
  useEffect(() => {
    const filterFn = reduceEntityFilters(
      compact(Object.values({ ...filters, user: undefined })),
    );
    setEntitiesWithoutUserFilter(backendEntities.filter(filterFn));
  }, [filters, backendEntities]);

  function getFilterCount(id: UserListFilterKind) {
    switch (id) {
      case 'owned':
        return entitiesWithoutUserFilter.filter(entity =>
          ownedFilter.filterEntity(entity),
        ).length;
      case 'starred':
        return entitiesWithoutUserFilter.filter(entity =>
          starredFilter.filterEntity(entity),
        ).length;
      default:
        return entitiesWithoutUserFilter.length;
    }
  }

  return (
    <Card className={classes.root}>
      {filterGroups.map(group => (
        <Fragment key={group.name}>
          <Typography variant="subtitle2" className={classes.title}>
            {group.name}
          </Typography>
          <Card className={classes.groupWrapper}>
            <List disablePadding dense>
              {group.items.map(item => (
                <MenuItem
                  key={item.id}
                  button
                  divider
                  onClick={() => setSelectedUserFilter(item.id)}
                  selected={item.id === filters.user?.value}
                  className={classes.menuItem}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography
                      variant="body1"
                      data-testid={`user-picker-${item.id}`}
                    >
                      {item.label}
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    {getFilterCount(item.id) ?? '-'}
                  </ListItemSecondaryAction>
                </MenuItem>
              ))}
            </List>
          </Card>
        </Fragment>
      ))}
    </Card>
  );
};
