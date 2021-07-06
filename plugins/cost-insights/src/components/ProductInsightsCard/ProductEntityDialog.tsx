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

import React, { useState } from 'react';
import { Dialog, IconButton } from '@material-ui/core';
import { default as CloseButton } from '@material-ui/icons/Close';
import { useEntityDialogStyles as useStyles } from '../../utils/styles';
import { Entity } from '../../types';
import {
  ProductEntityTable,
  ProductEntityTableOptions,
} from './ProductEntityTable';
import { findAlways } from '../../utils/assert';
import { HeaderTabs } from '@backstage/core-components';

type ProductEntityDialogProps = {
  open: boolean;
  entity: Entity;
  options?: ProductEntityTableOptions;
  onClose: () => void;
};

export const ProductEntityDialog = ({
  open,
  entity,
  options = {},
  onClose,
}: ProductEntityDialogProps) => {
  const classes = useStyles();
  const labels = Object.keys(entity.entities);
  const [selectedLabel, setSelectedLabel] = useState(
    findAlways(labels, _ => true),
  );

  const tabs = labels.map((label, index) => ({
    id: index.toString(),
    label: `Breakdown by ${label}`,
  }));

  return (
    <Dialog open={open} onClose={onClose} scroll="body" fullWidth maxWidth="lg">
      <IconButton className={classes.closeButton} onClick={onClose}>
        <CloseButton />
      </IconButton>
      <HeaderTabs
        tabs={tabs}
        onChange={index => setSelectedLabel(labels[index])}
      />
      <ProductEntityTable
        entityLabel={selectedLabel}
        entity={entity}
        options={options}
      />
    </Dialog>
  );
};
