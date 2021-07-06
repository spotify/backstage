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

import React, { useEffect, useRef, useState } from 'react';
import {
  capitalize,
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  IconButton,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { default as CloseIcon } from '@material-ui/icons/Close';
import { useAlertDialogStyles as useStyles } from '../../utils/styles';
import { Alert, AlertStatus, Maybe } from '../../types';
import { choose, formOf } from '../../utils/alerts';

const DEFAULT_FORM_ID = 'alert-form';

type AlertDialogProps = {
  open: boolean;
  group: string;
  alert: Maybe<Alert>;
  status: Maybe<AlertStatus>;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export const AlertDialog = ({
  open,
  group,
  alert,
  status,
  onClose,
  onSubmit,
}: AlertDialogProps) => {
  const classes = useStyles();
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const formRef = useRef<Maybe<HTMLFormElement>>(null);

  useEffect(() => {
    setSubmitDisabled(open);
  }, [open]);

  function disableSubmit(isDisabled: boolean) {
    setSubmitDisabled(isDisabled);
  }

  function onDialogClose() {
    onClose();
    setSubmitDisabled(true);
  }

  const [action, actioned] = choose(
    status,
    [
      ['snooze', 'snoozed'],
      ['accept', 'accepted'],
      ['dismiss', 'dismissed'],
    ],
    ['', ''],
  );

  const TransitionProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    onEntered() {
      if (formRef.current) {
        formRef.current.id = DEFAULT_FORM_ID;
      }
    },
  };

  const Form = formOf(alert, status);

  return (
    <Dialog
      open={open}
      onClose={onDialogClose}
      scroll="body"
      maxWidth="lg"
      TransitionProps={TransitionProps}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          className={classes.icon}
          disableRipple
          aria-label="Close"
          onClick={onDialogClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent className={classes.content}>
        <Box mb={1.5}>
          <Typography variant="h5">
            <b>{capitalize(action)} this action item?</b>
          </Typography>
          <Typography variant="h6" color="textSecondary">
            <b>
              This action item will be {actioned} for all of {group}.
            </b>
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          bgcolor="alertBackground"
          p={2}
          mb={1.5}
          borderRadius={4}
        >
          <Typography>
            <b>{alert?.title}</b>
          </Typography>
          <Typography color="textSecondary">{alert?.subtitle}</Typography>
        </Box>
        {Form && (
          <Form
            ref={formRef}
            alert={alert}
            onSubmit={onSubmit}
            disableSubmit={disableSubmit}
          />
        )}
      </DialogContent>
      <Divider />
      <DialogActions className={classes.actions} disableSpacing>
        {Form ? (
          <Button
            type="submit"
            color="primary"
            variant="contained"
            aria-label={action}
            form={DEFAULT_FORM_ID}
            disabled={isSubmitDisabled}
          >
            {capitalize(action)}
          </Button>
        ) : (
          <Button
            type="button"
            color="primary"
            variant="contained"
            aria-label={action}
            onClick={() => onSubmit(null)}
          >
            {capitalize(action)}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
