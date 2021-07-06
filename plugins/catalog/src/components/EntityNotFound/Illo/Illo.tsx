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
import { makeStyles } from '@material-ui/core';
import IlloSvgUrl from './illo.svg';

const useStyles = makeStyles(theme => ({
  illo: {
    maxWidth: '60%',
    top: 100,
    right: 20,
    position: 'absolute',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '96%',
      position: 'relative',
      top: 'unset',
      right: 'unset',
      margin: `${theme.spacing(10)}px auto ${theme.spacing(4)}px`,
    },
  },
}));

export const Illo = () => {
  const classes = useStyles();
  return (
    <img
      src={IlloSvgUrl}
      className={classes.illo}
      alt="Illustration on entity not found page"
    />
  );
};
