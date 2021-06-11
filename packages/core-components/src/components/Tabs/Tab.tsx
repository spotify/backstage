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

import React from 'react';
import { Tab, makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

interface StyledTabProps {
  label?: string;
  icon?: any; // TODO: define type for material-ui icons
  isFirstNav?: boolean;
  isFirstIndex?: boolean;
  value?: any;
}

const tabMarginLeft = (isFirstNav: boolean, isFirstIndex: boolean) => {
  if (isFirstIndex) {
    if (isFirstNav) {
      return '20px';
    }
    return '0';
  }
  return '40px';
};

const useStyles = makeStyles<BackstageTheme, StyledTabProps>(theme => ({
  root: {
    textTransform: 'none',
    height: '64px',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(13),
    color: theme.palette.textSubtle,
    marginLeft: props =>
      tabMarginLeft(props.isFirstNav as boolean, props.isFirstIndex as boolean),
    width: '130px',
    minWidth: '130px',
    '&:hover': {
      outline: 'none',
      backgroundColor: 'transparent',
      color: theme.palette.textSubtle,
    },
  },
}));

export const StyledTab = (props: StyledTabProps) => {
  const classes = useStyles(props);
  const { isFirstNav, isFirstIndex, ...rest } = props;
  return <Tab className={classes.root} disableRipple {...rest} />;
};
