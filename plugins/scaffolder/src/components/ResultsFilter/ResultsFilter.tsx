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
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { filterGroupsContext } from '../../filter/context';

const useStyles = makeStyles<Theme>(theme => ({
  filterBox: {
    display: 'flex',
    margin: theme.spacing(2, 0, 0, 0),
  },
  filterBoxTitle: {
    margin: theme.spacing(1, 0, 0, 1),
    fontWeight: 'bold',
    flex: 1,
  },
  title: {
    margin: theme.spacing(1, 0, 0, 1),
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkbox: {
    padding: theme.spacing(0, 1, 0, 1),
  },
}));

type Props = {
  availableCategories: string[];
};

/**
 * The additional results filter in the sidebar.
 */
export const ResultsFilter = ({ availableCategories }: Props) => {
  const classes = useStyles();

  const context = useContext(filterGroupsContext);
  if (!context) {
    throw new Error(`Must be used inside an EntityFilterGroupsProvider`);
  }

  const { selectedCategories, setSelectedCategories } = context;

  return (
    <>
      <div className={classes.filterBox}>
        <Typography variant="subtitle2" className={classes.filterBoxTitle}>
          Refine Results
        </Typography>{' '}
        <Button onClick={() => setSelectedCategories([])}>Clear</Button>
      </div>
      <Divider />
      <Typography variant="subtitle2" className={classes.title}>
        Categories
      </Typography>
      <List disablePadding dense>
        {availableCategories.map(category => {
          const labelId = `checkbox-list-label-${category}`;
          return (
            <ListItem
              key={category}
              dense
              button
              onClick={() =>
                setSelectedCategories(
                  selectedCategories.includes(category)
                    ? selectedCategories.filter(
                        selectedCategory => selectedCategory !== category,
                      )
                    : [...selectedCategories, category],
                )
              }
            >
              <Checkbox
                edge="start"
                color="primary"
                checked={selectedCategories.includes(category)}
                tabIndex={-1}
                disableRipple
                className={classes.checkbox}
                inputProps={{ 'aria-labelledby': labelId }}
              />
              <ListItemText
                id={labelId}
                primary={
                  category.charAt(0).toLocaleUpperCase('en-US') +
                  category.slice(1)
                }
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
