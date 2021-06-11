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
import { makeStyles } from '@material-ui/core';
import MicDropSvgUrl from './mic-drop.svg';

const useStyles = makeStyles(theme => ({
  micDrop: {
    maxWidth: '60%',
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      maxWidth: '96%',
      position: 'relative',
      bottom: 'unset',
      right: 'unset',
      margin: `${theme.spacing(10)}px auto ${theme.spacing(4)}px`,
    },
  },
}));

export const MicDrop = () => {
  const classes = useStyles();
  return (
    <img
      src={MicDropSvgUrl}
      className={classes.micDrop}
      alt="Girl dropping mic from her hands"
    />
  );
};
