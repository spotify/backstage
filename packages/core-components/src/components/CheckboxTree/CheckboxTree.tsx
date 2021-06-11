/*
 * Copyright 2020 Spotify AB
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
/* eslint-disable guard-for-in */
import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import produce from 'immer';
import { isEqual } from 'lodash';
import React, { useEffect, useReducer } from 'react';
import { usePrevious } from 'react-use';

type IndexedObject<T> = {
  [key: string]: T;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minWidth: 10,
      maxWidth: 360,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&:active': {
        animation: 'none',
        transform: 'none',
      },
    },
    nested: {
      paddingLeft: theme.spacing(5),
      height: '32px',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    listItemIcon: {
      minWidth: 10,
    },
    listItem: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    text: {
      '& span, & svg': {
        fontWeight: 'normal',
        fontSize: 14,
      },
    },
  }),
);

/* SUB_CATEGORY */

type SubCategory = {
  label: string;
  isChecked?: boolean;
  isOpen?: boolean;
  options?: Option[];
};

type SubCategoryWithIndexedOptions = {
  label: string;
  isChecked?: boolean;
  isOpen?: boolean;
  options: IndexedObject<Option>;
};

/* OPTION */

type Option = {
  label: string;
  value: string | number;
  isChecked?: boolean;
};

type Selection = { category?: string; selectedChildren?: string[] }[];

export type CheckboxTreeProps = {
  subCategories: SubCategory[];
  label: string;
  triggerReset?: boolean;
  selected?: Selection;
  onChange: (arg: Selection) => any;
};

/* REDUCER */

type checkOptionPayload = {
  subCategoryLabel: string;
  optionLabel: string;
};

type Action =
  | { type: 'checkOption'; payload: checkOptionPayload }
  | { type: 'checkCategory'; payload: string }
  | { type: 'toggleCategory'; payload: string }
  | {
      type: 'updateCategories';
      payload: IndexedObject<SubCategoryWithIndexedOptions>;
    }
  | { type: 'updateSelected'; payload: Selection }
  | { type: 'triggerReset' };

const reducer = (
  state: IndexedObject<SubCategoryWithIndexedOptions>,
  action: Action,
) => {
  switch (action.type) {
    case 'checkOption': {
      return produce(state, newState => {
        const category = newState[action.payload.subCategoryLabel];
        const option = category.options[action.payload.optionLabel];
        option.isChecked = !option.isChecked;
        category.isChecked = Object.values(category.options).every(
          o => o.isChecked,
        );
      });
    }
    case 'checkCategory': {
      return produce(state, newState => {
        const category = newState[action.payload];
        const options = category.options;
        category.isChecked = !category.isChecked;
        for (const option in options) {
          options[option].isChecked = category.isChecked;
        }
      });
    }
    case 'toggleCategory':
      return produce(state, newState => {
        const category = newState[action.payload];
        category.isOpen = !category.isOpen;
      });
    case 'triggerReset': {
      return produce(state, newState => {
        for (const category in newState) {
          newState[category].isChecked = false;
          for (const option in newState[category].options) {
            newState[category].options[option].isChecked =
              newState[category].isChecked;
          }
        }
      });
    }
    case 'updateCategories': {
      return produce(state, newState => {
        for (const category in newState) {
          delete newState[category];
        }

        for (const category in action.payload) {
          newState[category] = action.payload[category];

          if (state[category]) {
            newState[category].isChecked = state[category].isChecked;
            newState[category].isOpen = state[category].isOpen;
          }
        }
      });
    }
    case 'updateSelected': {
      return produce(state, newState => {
        for (const category in newState) {
          const selection = action.payload.find(s => s.category === category);

          if (selection) {
            newState[category].isChecked = true;

            for (const option in newState[category].options) {
              newState[category].options[option].isChecked =
                selection.selectedChildren?.includes(option) || false;
            }
          }
        }
      });
    }
    default:
      return state;
  }
};

const indexer = (
  arr: SubCategory[],
): IndexedObject<SubCategoryWithIndexedOptions> =>
  arr.reduce((accumulator, el) => {
    if (el.options) {
      return {
        ...accumulator,
        [el.label]: {
          label: el.label,
          isChecked: el.isChecked || false,
          isOpen: false,
          options: indexer(el.options),
        },
      };
    }
    return {
      ...accumulator,
      [el.label]: { ...el, isChecked: el.isChecked || false },
    };
  }, {});

export const CheckboxTree = ({
  subCategories,
  label,
  selected,
  onChange,
  triggerReset,
}: CheckboxTreeProps) => {
  const classes = useStyles();

  const [state, dispatch] = useReducer(reducer, indexer(subCategories));

  const handleOpen = (event: any, value: any) => {
    event.stopPropagation();
    dispatch({ type: 'toggleCategory', payload: value });
  };

  const previousSubCategories = usePrevious(subCategories);

  useEffect(() => {
    const values = Object.values(state).map(category => ({
      category: category.isChecked ? category.label : undefined,
      selectedChildren: Object.values(category.options)
        .filter(option => option.isChecked)
        .map(option => option.label),
    }));
    onChange(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    dispatch({ type: 'triggerReset' });
  }, [triggerReset]);

  useEffect(() => {
    if (selected) {
      dispatch({ type: 'updateSelected', payload: selected });
    }
  }, [selected]);

  useEffect(() => {
    if (!isEqual(subCategories, previousSubCategories)) {
      dispatch({
        type: 'updateCategories',
        payload: indexer(subCategories),
      });
    }
  }, [subCategories, previousSubCategories]);

  return (
    <div>
      <Typography variant="button">{label}</Typography>
      <List className={classes.root}>
        {Object.values(state).map(item => (
          <div key={item.label}>
            <ListItem
              className={classes.listItem}
              dense
              button
              onClick={() =>
                dispatch({
                  type: 'checkCategory',
                  payload: item.label,
                })
              }
            >
              <ListItemIcon className={classes.listItemIcon}>
                <Checkbox
                  color="primary"
                  edge="start"
                  checked={item.isChecked}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText className={classes.text} primary={item.label} />
              {Object.values(item.options).length ? (
                <>
                  {item.isOpen ? (
                    <ExpandLess
                      data-testid="expandable"
                      onClick={event => handleOpen(event, item.label)}
                    />
                  ) : (
                    <ExpandMore
                      data-testid="expandable"
                      onClick={event => handleOpen(event, item.label)}
                    />
                  )}
                </>
              ) : null}
            </ListItem>
            <Collapse in={item.isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.values(item.options).map(option => (
                  <ListItem
                    button
                    key={option.label}
                    className={classes.nested}
                    onClick={() =>
                      dispatch({
                        type: 'checkOption',
                        payload: {
                          subCategoryLabel: item.label,
                          optionLabel: option.label,
                        },
                      })
                    }
                  >
                    <ListItemIcon className={classes.listItemIcon}>
                      <Checkbox
                        color="primary"
                        edge="start"
                        checked={option.isChecked}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.text}
                      primary={option.label}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </div>
  );
};
