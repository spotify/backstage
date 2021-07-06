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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, DialogActions, DialogContent } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { MarkdownContent } from '@backstage/core-components';

export type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  url?: string;
};

const RadarDescription = (props: Props): JSX.Element => {
  const { open, onClose, title, description, url } = props;

  const handleClick = () => {
    onClose();
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <Dialog data-testid="radar-description" open={open} onClose={onClose}>
      <DialogTitle data-testid="radar-description-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent dividers>
        <MarkdownContent content={description} />
      </DialogContent>
      {url && (
        <DialogActions>
          <Button
            onClick={handleClick}
            color="primary"
            startIcon={<LinkIcon />}
            href={url}
          >
            LEARN MORE
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export { RadarDescription };
