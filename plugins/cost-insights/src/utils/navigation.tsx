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
import React from 'react';
import MoneyIcon from '@material-ui/icons/MonetizationOn';
import ActionIcon from '@material-ui/icons/Whatshot';
import Settings from '@material-ui/icons/Settings';
import AccountTree from '@material-ui/icons/AccountTree';
import Storage from '@material-ui/icons/Storage';
import Search from '@material-ui/icons/Search';
import CloudQueue from '@material-ui/icons/CloudQueue';
import School from '@material-ui/icons/School';
import ViewHeadline from '@material-ui/icons/ViewHeadline';
import { IconType } from '../types';

export enum DefaultNavigation {
  CostOverviewCard = 'cost-overview-card',
  AlertInsightsHeader = 'alert-insights-header',
}

export type NavigationItem = {
  navigation: string;
  icon: JSX.Element;
  title: string;
};

export const getDefaultNavigationItems = (alerts: number): NavigationItem[] => {
  const items = [
    {
      navigation: DefaultNavigation.CostOverviewCard,
      icon: <MoneyIcon />,
      title: 'Cost Overview',
    },
  ];
  if (alerts > 0) {
    items.push({
      navigation: DefaultNavigation.AlertInsightsHeader,
      icon: <ActionIcon />,
      title: 'Action Items',
    });
  }
  return items;
};

export function getIcon(icon?: string): JSX.Element {
  switch (icon) {
    case IconType.Compute:
      return <Settings />;
    case IconType.Data:
      return <AccountTree />;
    case IconType.Database:
      return <ViewHeadline />;
    case IconType.Storage:
      return <Storage />;
    case IconType.Search:
      return <Search />;
    case IconType.ML:
      return <School />;
    default:
      return <CloudQueue />;
  }
}
