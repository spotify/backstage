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
import { IconButton, makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

interface StyledIconProps {
  ariaLabel: string;
  children: any;
  isNext?: boolean;
  onClick: any;
}

const useStyles = makeStyles<BackstageTheme, StyledIconProps>(() => ({
  root: {
    color: '#6E6E6E',
    overflow: 'visible',
    fontSize: '1.5rem',
    textAlign: 'center',
    borderRadius: '50%',
    backgroundColor: '#E6E6E6',
    marginLeft: props => (props.isNext ? 'auto' : '0'),
    marginRight: props => (props.isNext ? '0' : '10px'),
    '&:hover': {
      backgroundColor: '#E6E6E6',
      opacity: '1',
    },
  },
}));

export const StyledIcon = (props: StyledIconProps) => {
  const classes = useStyles(props);
  const { ariaLabel, onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      className={classes.root}
      size="small"
      disableRipple
      disableFocusRipple
      aria-label={ariaLabel}
    >
      {props.children}
    </IconButton>
  );
};
