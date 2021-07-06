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
import {
  entityRoute,
  entityRouteParams,
} from '@backstage/plugin-catalog-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Link,
  List,
  ListItem,
} from '@material-ui/core';
import React, { useState } from 'react';
import { generatePath, resolvePath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { RouteRef } from '@backstage/core-plugin-api';
import { StructuredMetadataTable } from '@backstage/core-components';

type Props = {
  onClose: () => void;
  classes?: Record<string, string>;
  entities: Entity[];
  dryRun?: boolean;
  catalogRouteRef: RouteRef;
};

const getEntityCatalogPath = ({
  entity,
  catalogRouteRef,
}: {
  entity: Entity;
  catalogRouteRef: RouteRef;
}) => {
  const relativeEntityPathInsideCatalog = generatePath(
    entityRoute.path,
    entityRouteParams(entity),
  );

  const resolvedAbsolutePath = resolvePath(
    relativeEntityPathInsideCatalog,
    catalogRouteRef.path,
  )?.pathname;

  return resolvedAbsolutePath;
};

export const RegisterComponentResultDialog = ({
  onClose,
  classes,
  entities,
  dryRun,
  catalogRouteRef,
}: Props) => {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} classes={classes}>
      <DialogTitle>
        {dryRun ? 'Validation Result' : 'Registration Result'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {dryRun
            ? 'The following entities would be created:'
            : 'The following entities have been successfully created:'}
        </DialogContentText>
        <List>
          {entities.map((entity: any, index: number) => {
            const entityPath = getEntityCatalogPath({
              entity,
              catalogRouteRef,
            });
            return (
              <React.Fragment
                key={`${entity.metadata.namespace}-${entity.metadata.name}`}
              >
                <ListItem>
                  <StructuredMetadataTable
                    dense
                    metadata={{
                      name: entity.metadata.name,
                      type: entity.spec.type,
                      link: dryRun ? (
                        entityPath
                      ) : (
                        <Link component={RouterLink} to={entityPath}>
                          {entityPath}
                        </Link>
                      ),
                    }}
                  />
                </ListItem>
                {index < entities.length - 1 && <Divider component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        {dryRun && (
          <Button onClick={handleClose} color="default">
            Close
          </Button>
        )}
        {!dryRun && (
          <Button
            component={RouterLink}
            to={`/${catalogRouteRef.path}`}
            color="default"
          >
            To Catalog
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
