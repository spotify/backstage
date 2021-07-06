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

import React, { useState } from 'react';
import { BitriseBuildResult } from '../../api/bitriseApi.model';
import { BitriseArtifactsComponent } from '../BitriseArtifactsComponent';
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloseIcon from '@material-ui/icons/Close';

type BitriseBuildDetailsDialogProps = {
  build: BitriseBuildResult;
};

const useStyles = makeStyles({
  dialogContent: {
    paddingBottom: 16,
  },
});

export const BitriseBuildDetailsDialog = ({
  build,
}: BitriseBuildDetailsDialogProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton data-testid="btn" onClick={handleOpen}>
        <CloudDownload />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Download artifacts for build #${build.id}?`}

          <IconButton aria-label="close" edge="end" onClick={handleClose}>
            <CloseIcon />
          </IconButton>

          <br />

          <Chip size="small" label={build.message} />
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <BitriseArtifactsComponent build={build} />
        </DialogContent>
      </Dialog>
    </>
  );
};
