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
import { useLocation } from 'react-router';
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
import { ShortcutApi } from './api';
import {
  alertApiRef,
  analyticsApiRef,
  useAnalytics,
  useApi,
} from '@backstage/core-plugin-api';

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
  onClose: () => void;
  anchorEl?: Element;
  api: ShortcutApi;
};

export const AddShortcut = ({ onClose, anchorEl, api }: Props) => {
  const classes = useStyles();
  const alertApi = useApi(alertApiRef);
  const analytics = useAnalytics(analyticsApiRef);
  const { pathname } = useLocation();
  const [formValues, setFormValues] = useState<FormValues>();
  const open = Boolean(anchorEl);

  const handleSave: SubmitHandler<FormValues> = async ({ url, title }) => {
    const shortcut: Omit<Shortcut, 'id'> = { url, title };

    try {
      await api.add(shortcut);
      analytics.captureEvent('add', url);
      alertApi.post({
        message: `Added shortcut '${title}' to your sidebar`,
        severity: 'success',
      });
    } catch (error) {
      alertApi.post({
        message: `Could not add shortcut: ${error.message}`,
        severity: 'error',
      });
    }

    onClose();
  };

  const handlePaste = () => {
    setFormValues({ url: pathname, title: document.title });
  };

  const handleClose = () => {
    setFormValues(undefined);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onExit={handleClose}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          title="Add Shortcut"
          titleTypographyProps={{ variant: 'subtitle2' }}
          action={
            <Button
              className={classes.button}
              variant="text"
              size="small"
              color="primary"
              onClick={handlePaste}
            >
              Use current page
            </Button>
          }
        />
        <ShortcutForm
          onClose={handleClose}
          onSave={handleSave}
          formValues={formValues}
        />
      </Card>
    </Popover>
  );
};
