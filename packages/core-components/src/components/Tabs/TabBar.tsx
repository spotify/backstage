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

import React, { PropsWithChildren } from 'react';
import { Tabs, makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

interface StyledTabsProps {
  value: number | boolean;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const useStyles = makeStyles<BackstageTheme>(theme => ({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.tabbar.indicator,
    height: '4px',
  },
  flexContainer: {
    alignItems: 'center',
  },
  root: {
    '&:last-child': {
      marginLeft: 'auto',
    },
  },
}));

export const StyledTabs = (props: PropsWithChildren<StyledTabsProps>) => {
  const classes = useStyles(props);
  return (
    <Tabs
      classes={classes}
      {...props}
      TabIndicatorProps={{ children: <span /> }}
    />
  );
};
