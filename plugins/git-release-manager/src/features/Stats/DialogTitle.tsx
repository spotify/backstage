/*
 * Copyright 2021 The Backstage Authors
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
import {
  createStyles,
  IconButton,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import { Stats } from './Stats';

interface DialogTitleProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  setShowStats: React.ComponentProps<typeof Stats>['setShowStats'];
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, setShowStats, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={() => setShowStats(false)}
      >
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
});
