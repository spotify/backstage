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
import { SubmitHandler } from 'react-hook-form';
import {
  Button,
  Card,
  CardHeader,
  makeStyles,
  Popover,
} from '@material-ui/core';
import { ShortcutForm } from './ShortcutForm';
import { FormValues, Shortcut } from './types';
import DeleteIcon from '@material-ui/icons/Delete';
import { ShortcutApi } from './api';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  card: {
    width: 400,
  },
  header: {
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

type Props = {
  shortcut: Shortcut;
  onClose: () => void;
  anchorEl?: Element;
  api: ShortcutApi;
};

export const EditShortcut = ({ shortcut, onClose, anchorEl, api }: Props) => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const open = Boolean(anchorEl);

  const handleSave: SubmitHandler<FormValues> = async ({ url, title }) => {
    const newShortcut: Shortcut = {
      ...shortcut,
      url,
      title,
    };

    try {
      await api.update(newShortcut);
      alertApi.post({
        message: `Updated shortcut '${title}'`,
        severity: 'success',
      });
    } catch (error) {
      alertApi.post({
        message: `Could not update shortcut: ${error.message}`,
        severity: 'error',
      });
    }

    onClose();
  };

  const handleRemove = async () => {
    try {
      await api.remove(shortcut.id);
      alertApi.post({
        message: `Removed shortcut '${shortcut.title}' from your sidebar`,
        severity: 'success',
      });
    } catch (error) {
      alertApi.post({
        message: `Could not delete shortcut: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title="Edit Shortcut"
          titleTypographyProps={{ variant: 'subtitle2' }}
          action={
            <Button
              className={classes.button}
              variant="text"
              size="small"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={handleRemove}
            >
              Remove
            </Button>
          }
        />
        <ShortcutForm
          formValues={{ url: shortcut.url, title: shortcut.title }}
          onClose={handleClose}
          onSave={handleSave}
        />
      </Card>
    </Popover>
  );
};
