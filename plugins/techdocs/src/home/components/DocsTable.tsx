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
import { useCopyToClipboard } from 'react-use';
import { generatePath } from 'react-router-dom';

import { IconButton, Tooltip } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import { Entity } from '@backstage/catalog-model';
import { rootDocsRouteRef } from '../../routes';
import {
  Table,
  EmptyState,
  Button,
  SubvalueCell,
  Link,
} from '@backstage/core-components';

export const DocsTable = ({
  entities,
  title,
}: {
  entities: Entity[] | undefined;
  title?: string | undefined;
}) => {
  const [, copyToClipboard] = useCopyToClipboard();

  if (!entities) return null;

  const documents = entities.map(entity => {
    return {
      name: entity.metadata.name,
      description: entity.metadata.description,
      owner: entity?.spec?.owner,
      type: entity?.spec?.type,
      docsUrl: generatePath(rootDocsRouteRef.path, {
        namespace: entity.metadata.namespace ?? 'default',
        kind: entity.kind,
        name: entity.metadata.name,
      }),
    };
  });

  const columns = [
    {
      title: 'Document',
      field: 'name',
      highlight: true,
      render: (row: any): React.ReactNode => (
        <SubvalueCell
          value={<Link to={row.docsUrl}>{row.name}</Link>}
          subvalue={row.description}
        />
      ),
    },
    {
      title: 'Owner',
      field: 'owner',
    },
    {
      title: 'Type',
      field: 'type',
    },
    {
      title: 'Actions',
      width: '10%',
      render: (row: any) => (
        <Tooltip title="Click to copy documentation link to clipboard">
          <IconButton
            onClick={() =>
              copyToClipboard(`${window.location.href}/${row.docsUrl}`)
            }
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      {documents && documents.length > 0 ? (
        <Table
          options={{
            paging: true,
            pageSize: 20,
            search: true,
          }}
          data={documents}
          columns={columns}
          title={
            title
              ? `${title} (${documents.length})`
              : `All (${documents.length})`
          }
        />
      ) : (
        <EmptyState
          missing="data"
          title="No documents to show"
          description="Create your own document. Check out our Getting Started Information"
          action={
            <Button
              color="primary"
              to="https://backstage.io/docs/features/techdocs/getting-started"
              variant="contained"
            >
              DOCS
            </Button>
          }
        />
      )}
    </>
  );
};
