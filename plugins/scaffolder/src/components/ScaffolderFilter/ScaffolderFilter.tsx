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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FilterGroup, useEntityFilterGroup } from '../../filter';
import { IconComponent } from '@backstage/core-plugin-api';

export type ButtonGroup = {
  name: string;
  items: {
    id: string;
    label: string;
    icon?: IconComponent;
    filterFn: (entity: Entity) => boolean;
  }[];
};

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .11)',
    boxShadow: 'none',
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
  menuTitle: {
    fontWeight: 500,
  },
}));

type OnChangeCallback = (item: { id: string; label: string }) => void;

type Props = {
  buttonGroups: ButtonGroup[];
  initiallySelected: string;
  onChange?: OnChangeCallback;
};

/**
 * The main filter group in the sidebar, toggling owned/starred/all.
 */
export const ScaffolderFilter = ({
  buttonGroups,
  onChange,
  initiallySelected,
}: Props) => {
  const classes = useStyles();
  const { currentFilter, setCurrentFilter, getFilterCount } = useFilter(
    buttonGroups,
    initiallySelected,
  );

  const onChangeRef = useRef<OnChangeCallback>();
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setCurrent = useCallback(
    (item: { id: string; label: string }) => {
      setCurrentFilter(item.id);
      onChangeRef.current?.({ id: item.id, label: item.label });
    },
    [setCurrentFilter],
  );

  // Make one initial onChange to inform the surroundings about the selected
  // item
  useEffect(() => {
    const items = buttonGroups.flatMap(g => g.items);
    const item = items.find(i => i.id === initiallySelected) || items[0];
    if (item) {
      onChangeRef.current?.({ id: item.id, label: item.label });
    }
    // intentionally only happens on startup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className={classes.root}>
      {buttonGroups.map(group => (
        <React.Fragment key={group.name}>
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
                  onClick={() => setCurrent(item)}
                  selected={item.id === currentFilter}
                  className={classes.menuItem}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography variant="body1" className={classes.menuTitle}>
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
        </React.Fragment>
      ))}
    </Card>
  );
};

function useFilter(
  buttonGroups: ButtonGroup[],
  initiallySelected: string,
): {
  currentFilter: string;
  setCurrentFilter: (filterId: string) => void;
  getFilterCount: (filterId: string) => number | undefined;
} {
  const [currentFilter, setCurrentFilter] = useState(initiallySelected);

  const filterGroup = useMemo<FilterGroup>(
    () => ({
      filters: Object.fromEntries(
        buttonGroups.flatMap(g => g.items).map(i => [i.id, i.filterFn]),
      ),
    }),
    [buttonGroups],
  );

  const { setSelectedFilters, state } = useEntityFilterGroup(
    'primary-sidebar',
    filterGroup,
    [initiallySelected],
  );

  const setCurrent = useCallback(
    (filterId: string) => {
      setCurrentFilter(filterId);
      setSelectedFilters([filterId]);
    },
    [setCurrentFilter, setSelectedFilters],
  );

  const getFilterCount = useCallback(
    (filterId: string) => {
      if (state.type !== 'ready') {
        return undefined;
      }
      return state.state.filters[filterId].matchCount;
    },
    [state],
  );

  return {
    currentFilter,
    setCurrentFilter: setCurrent,
    getFilterCount,
  };
}
