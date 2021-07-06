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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  makeStyles,
  Theme,
  Button,
} from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { useObservable } from 'react-use';
import LoginRequestListItem from './LoginRequestListItem';
import { useApi, oauthRequestApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles<Theme>(theme => ({
  dialog: {
    paddingTop: theme.spacing(1),
  },
  title: {
    minWidth: 0,
  },
  contentList: {
    padding: 0,
  },
}));

export const OAuthRequestDialog = () => {
  const classes = useStyles();
  const [busy, setBusy] = useState(false);
  const oauthRequestApi = useApi(oauthRequestApiRef);
  const requests = useObservable(
    useMemo(() => oauthRequestApi.authRequest$(), [oauthRequestApi]),
    [],
  );

  const handleRejectAll = () => {
    requests.forEach(request => request.reject());
  };

  return (
    <Dialog
      open={Boolean(requests.length)}
      fullWidth
      maxWidth="xs"
      classes={{ paper: classes.dialog }}
    >
      <DialogTitle classes={{ root: classes.title }}>
        Login Required
      </DialogTitle>

      <DialogContent classes={{ root: classes.contentList }}>
        <List>
          {requests.map(request => (
            <LoginRequestListItem
              key={request.provider.title}
              request={request}
              busy={busy}
              setBusy={setBusy}
            />
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleRejectAll}>Reject All</Button>
      </DialogActions>
    </Dialog>
  );
};
