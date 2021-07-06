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
import { Button, Dialog, Theme, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';

import { DialogBody } from './DialogBody';
import { DialogTitle } from './DialogTitle';
import { Transition } from '../../components/Transition';

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface StatsProps {
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Stats({ setShowStats }: StatsProps) {
  return (
    <Dialog open maxWidth="md" fullWidth TransitionComponent={Transition}>
      <DialogTitle setShowStats={setShowStats}>Stats</DialogTitle>

      <DialogContent>
        <DialogBody />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setShowStats(false)}
          variant="contained"
          size="large"
          color="primary"
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
