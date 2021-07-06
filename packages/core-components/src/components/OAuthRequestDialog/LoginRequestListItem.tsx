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

import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
  Theme,
} from '@material-ui/core';
import React, { useState } from 'react';
import { PendingAuthRequest } from '@backstage/core-plugin-api';

const useItemStyles = makeStyles<Theme>(theme => ({
  root: {
    paddingLeft: theme.spacing(3),
  },
}));

type RowProps = {
  request: PendingAuthRequest;
  busy: boolean;
  setBusy: (busy: boolean) => void;
};

const LoginRequestListItem = ({ request, busy, setBusy }: RowProps) => {
  const classes = useItemStyles();
  const [error, setError] = useState<Error>();

  const handleContinue = async () => {
    setBusy(true);
    try {
      await request.trigger();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };

  const IconComponent = request.provider.icon;

  return (
    <ListItem
      button
      disabled={busy}
      onClick={handleContinue}
      classes={{ root: classes.root }}
    >
      <ListItemAvatar>
        <IconComponent fontSize="large" />
      </ListItemAvatar>
      <ListItemText
        primary={request.provider.title}
        secondary={
          error && (
            <Typography color="error">
              {error.message || 'An unspecified error occurred'}
            </Typography>
          )
        }
      />
    </ListItem>
  );
};

export default LoginRequestListItem;
