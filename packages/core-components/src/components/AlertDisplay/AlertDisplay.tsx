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

import React, { useEffect, useState } from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { AlertMessage, useApi, alertApiRef } from '@backstage/core-plugin-api';
import pluralize from 'pluralize';

// TODO: improve on this and promote to a shared component for use by all apps.
export const AlertDisplay = () => {
  const [messages, setMessages] = useState<Array<AlertMessage>>([]);
  const alertApi = useApi(alertApiRef);

  useEffect(() => {
    const subscription = alertApi
      .alert$()
      .subscribe(message => setMessages(msgs => msgs.concat(message)));

    return () => {
      subscription.unsubscribe();
    };
  }, [alertApi]);

  if (messages.length === 0) {
    return null;
  }

  const [firstMessage] = messages;

  const handleClose = () => {
    setMessages(msgs => msgs.filter(msg => msg !== firstMessage));
  };

  return (
    <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleClose}
            data-testid="error-button-close"
          >
            <CloseIcon />
          </IconButton>
        }
        severity={firstMessage.severity}
      >
        <span>
          {firstMessage.message.toString()}
          {messages.length > 1 && (
            <em>{` (${messages.length - 1} older ${pluralize(
              'message',
              messages.length - 1,
            )})`}</em>
          )}
        </span>
      </Alert>
    </Snackbar>
  );
};
