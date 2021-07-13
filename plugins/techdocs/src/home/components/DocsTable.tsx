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

import ShareIcon from '@material-ui/icons/Share';
import { Entity } from '@backstage/catalog-model';
import { rootDocsRouteRef } from '../../routes';
import {
  Button,
  EmptyState,
  Link,
  SubvalueCell,
  Table,
  TableProps,
} from '@backstage/core-components';

export type DocsTableRow = {
  entity: Entity;
  resolved: {
    docsUrl: string;
  };
};

export const DocsTable = ({
  entities,
  title,
  loading,
  actions,
}: {
  entities: Entity[] | undefined;
  title?: string | undefined;
  loading?: boolean | undefined;
  actions?: TableProps<DocsTableRow>['actions'];
}) => {
  const [, copyToClipboard] = useCopyToClipboard();

  if (!entities) return null;

  const documents = entities.map(entity => {
    return {
      entity,
      resolved: {
        docsUrl: generatePath(rootDocsRouteRef.path, {
          namespace: entity.metadata.namespace ?? 'default',
          kind: entity.kind,
          name: entity.metadata.name,
        }),
      },
    };
  });

  const columns = [
    {
      title: 'Document',
      field: 'name',
      highlight: true,
      render: (row: DocsTableRow): React.ReactNode => (
        <SubvalueCell
          value={
            <Link to={row.resolved.docsUrl}>{row.entity.metadata.name}</Link>
          }
          subvalue={row.entity.metadata.description}
        />
      ),
    },
    {
      title: 'Owner',
      field: 'entity.spec.owner',
    },
    {
      title: 'Type',
      field: 'entity.spec.type',
    },
  ];

  const defaultActions: TableProps<DocsTableRow>['actions'] = [
    (row: DocsTableRow) => {
      return {
        icon: () => <ShareIcon fontSize="small" />,
        tooltip: 'Click to copy documentation link to clipboard',
        onClick: () =>
          copyToClipboard(
            `${window.location.href.split('/?')[0]}/${row.resolved.docsUrl}`,
          ),
      };
    },
  ];

  return (
    <>
      {loading || (documents && documents.length > 0) ? (
        <Table<DocsTableRow>
          isLoading={loading}
          options={{
            paging: true,
            pageSize: 20,
            search: true,
            actionsColumnIndex: -1,
          }}
          data={documents}
          columns={columns}
          actions={actions || defaultActions}
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
