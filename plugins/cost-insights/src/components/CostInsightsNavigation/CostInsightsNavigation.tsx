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

import React, { useEffect, useState } from 'react';
import {
  Collapse,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
} from '@material-ui/core';
import { useNavigationStyles as useStyles } from '../../utils/styles';
import { useConfig, useScroll } from '../../hooks';
import { findAlways } from '../../utils/assert';
import {
  DefaultNavigation,
  NavigationItem,
  getDefaultNavigationItems,
} from '../../utils/navigation';
import { Maybe, Product } from '../../types';

type CostInsightsNavigationProps = {
  alerts: number;
  products: Maybe<Product[]>;
};

const NavigationMenuItem = ({ navigation, icon, title }: NavigationItem) => {
  const classes = useStyles();
  const [, setScroll] = useScroll();
  return (
    <MenuItem
      button
      data-testid={`menu-item-${navigation}`}
      className={classes.menuItem}
      onClick={() => setScroll(navigation)}
    >
      <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
      <ListItemText
        primary={<Typography className={classes.title}>{title}</Typography>}
      />
    </MenuItem>
  );
};

export const CostInsightsNavigation = React.memo(
  ({ alerts, products }: CostInsightsNavigationProps) => {
    const classes = useStyles();
    const { icons } = useConfig();
    const [isOpen, setOpen] = useState(false);

    const defaultNavigationItems = getDefaultNavigationItems(alerts);
    const productNavigationItems: NavigationItem[] =
      products?.map(product => ({
        title: product.name,
        navigation: product.kind,
        icon: findAlways(icons, i => i.kind === product.kind).component,
      })) ?? [];

    useEffect(
      function toggleProductMenuItems() {
        if (products?.length) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      },
      [products],
    );

    return (
      <MenuList className={classes.menuList}>
        {defaultNavigationItems.map(item => (
          <NavigationMenuItem
            key={`navigation-menu-item-${item.navigation}`}
            navigation={item.navigation}
            title={item.title}
            icon={
              item.navigation === DefaultNavigation.AlertInsightsHeader ? (
                <Badge badgeContent={alerts} color="secondary">
                  {React.cloneElement(item.icon, {
                    className: classes.navigationIcon,
                  })}
                </Badge>
              ) : (
                React.cloneElement(item.icon, {
                  className: classes.navigationIcon,
                })
              )
            }
          />
        ))}
        <Collapse in={isOpen} timeout={850}>
          {productNavigationItems.map((item: NavigationItem) => (
            <NavigationMenuItem
              key={`navigation-menu-item-${item.navigation}`}
              navigation={item.navigation}
              icon={React.cloneElement(item.icon, {
                className: classes.navigationIcon,
              })}
              title={item.title}
            />
          ))}
        </Collapse>
      </MenuList>
    );
  },
);
