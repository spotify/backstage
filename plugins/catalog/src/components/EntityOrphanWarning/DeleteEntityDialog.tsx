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

import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

type Props = {
  open: boolean;
  onClose: () => any;
  onConfirm: () => any;
  entity: Entity;
};

export const DeleteEntityDialog = ({
  open,
  onClose,
  onConfirm,
  entity,
}: Props) => {
  const [busy, setBusy] = useState(false);
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);

  const onDelete = async () => {
    setBusy(true);
    try {
      const uid = entity.metadata.uid;
      await catalogApi.removeEntityByUid(uid!);
      onConfirm();
    } catch (err) {
      alertApi.post({ message: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="responsive-dialog-title">
        Are you sure you want to delete this entity?
      </DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          disabled={busy}
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
