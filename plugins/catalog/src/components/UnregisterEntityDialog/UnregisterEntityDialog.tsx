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

import { Entity } from '@backstage/catalog-model';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  makeStyles,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { useCallback, useState } from 'react';
import { useUnregisterEntityDialogState } from './useUnregisterEntityDialogState';

import { alertApiRef, configApiRef, useApi } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';

const useStyles = makeStyles({
  advancedButton: {
    fontSize: '0.7em',
  },
});

type Props = {
  open: boolean;
  onConfirm: () => any;
  onClose: () => any;
  entity: Entity;
};

const Contents = ({
  entity,
  onConfirm,
}: {
  entity: Entity;
  onConfirm: () => any;
}) => {
  const alertApi = useApi(alertApiRef);
  const configApi = useApi(configApiRef);
  const classes = useStyles();
  const state = useUnregisterEntityDialogState(entity);
  const [showDelete, setShowDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const appTitle = configApi.getOptionalString('app.title') ?? 'Backstage';

  const onUnregister = useCallback(
    async function onUnregisterFn() {
      if ('unregisterLocation' in state) {
        setBusy(true);
        try {
          await state.unregisterLocation();
          onConfirm();
        } catch (err) {
          alertApi.post({ message: err.message });
        } finally {
          setBusy(false);
        }
      }
    },
    [alertApi, onConfirm, state],
  );

  const onDelete = useCallback(
    async function onDeleteFn() {
      if ('deleteEntity' in state) {
        setBusy(true);
        try {
          await state.deleteEntity();
          onConfirm();
        } catch (err) {
          alertApi.post({ message: err.message });
        } finally {
          setBusy(false);
        }
      }
    },
    [alertApi, onConfirm, state],
  );

  if (state.type === 'loading') {
    return <Progress />;
  }

  if (state.type === 'error') {
    return <ResponseErrorPanel error={state.error} />;
  }

  if (state.type === 'bootstrap') {
    return (
      <>
        <Alert severity="info">
          You cannot unregister this entity, since it originates from a
          protected Backstage configuration (location "{state.location}"). If
          you believe this is in error, please contact the {appTitle}{' '}
          integrator.
        </Alert>

        <Box marginTop={2}>
          {!showDelete && (
            <Button
              variant="text"
              size="small"
              color="primary"
              className={classes.advancedButton}
              onClick={() => setShowDelete(true)}
            >
              Advanced Options
            </Button>
          )}

          {showDelete && (
            <>
              <DialogContentText>
                You have the option to delete the entity itself from the
                catalog. Note that this should only be done if you know that the
                catalog file has been deleted at, or moved from, its origin
                location. If that is not the case, the entity will reappear
                shortly as the next refresh round is performed by the catalog.
              </DialogContentText>
              <Button
                variant="contained"
                color="secondary"
                disabled={busy}
                onClick={onDelete}
              >
                Delete Entity
              </Button>
            </>
          )}
        </Box>
      </>
    );
  }

  if (state.type === 'only-delete') {
    return (
      <>
        <DialogContentText>
          This entity does not seem to originate from a location. You therefore
          only have the option to delete it outright from the catalog.
        </DialogContentText>
        <Button
          variant="contained"
          color="secondary"
          disabled={busy}
          onClick={onDelete}
        >
          Delete Entity
        </Button>
      </>
    );
  }

  if (state.type === 'unregister') {
    return (
      <>
        <DialogContentText>
          This action will unregister the following entities:
        </DialogContentText>
        <DialogContentText component="ul">
          {state.colocatedEntities.map(e => (
            <li key={`${e.kind}:${e.namespace}/${e.name}`}>
              <EntityRefLink entityRef={e} />
            </li>
          ))}
        </DialogContentText>
        <DialogContentText>
          Located at the following location:
        </DialogContentText>
        <DialogContentText component="ul">
          <li>{state.location}</li>
        </DialogContentText>
        <DialogContentText>
          To undo, just re-register the entity in {appTitle}.
        </DialogContentText>
        <Box marginTop={2}>
          <Button
            variant="contained"
            color="secondary"
            disabled={busy}
            onClick={onUnregister}
          >
            Unregister Location
          </Button>
          {!showDelete && (
            <Box component="span" marginLeft={2}>
              <Button
                variant="text"
                size="small"
                color="primary"
                className={classes.advancedButton}
                onClick={() => setShowDelete(true)}
              >
                Advanced Options
              </Button>
            </Box>
          )}
        </Box>

        {showDelete && (
          <>
            <Box paddingTop={4} paddingBottom={4}>
              <Divider />
            </Box>
            <DialogContentText>
              You also have the option to delete the entity itself from the
              catalog. Note that this should only be done if you know that the
              catalog file has been deleted at, or moved from, its origin
              location. If that is not the case, the entity will reappear
              shortly as the next refresh round is performed by the catalog.
            </DialogContentText>
            <Button
              variant="contained"
              color="secondary"
              disabled={busy}
              onClick={onDelete}
            >
              Delete Entity
            </Button>
          </>
        )}
      </>
    );
  }

  return <Alert severity="error">Internal error: Unknown state</Alert>;
};

export const UnregisterEntityDialog = ({
  open,
  onConfirm,
  onClose,
  entity,
}: Props) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle id="responsive-dialog-title">
      Are you sure you want to unregister this entity?
    </DialogTitle>
    <DialogContent>
      <Contents entity={entity} onConfirm={onConfirm} />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);
