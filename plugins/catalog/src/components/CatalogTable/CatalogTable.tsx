/*
 * Copyright 2020 Spotify AB
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
import { RELATION_OWNED_BY, RELATION_PART_OF } from '@backstage/catalog-model';
import {
  CodeSnippet,
  Table,
  TableColumn,
  TableProps,
  WarningPanel,
} from '@backstage/core';
import {
  formatEntityRefTitle,
  getEntityRelations,
  useEntityListProvider,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import Edit from '@material-ui/icons/Edit';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { capitalize } from 'lodash';
import React from 'react';
import {
  getEntityMetadataEditUrl,
  getEntityMetadataViewUrl,
} from '../../utils';
import {
  favouriteEntityIcon,
  favouriteEntityTooltip,
} from '../FavouriteEntity/FavouriteEntity';
import * as columnFactories from './columns';
import { EntityRow } from './types';

const defaultColumns: TableColumn<EntityRow>[] = [
  columnFactories.createNameColumn(),
  columnFactories.createSystemColumn(),
  columnFactories.createOwnerColumn(),
  columnFactories.createSpecTypeColumn(),
  columnFactories.createSpecLifecycleColumn(),
  columnFactories.createMetadataDescriptionColumn(),
  columnFactories.createTagsColumn(),
];

type CatalogTableProps = {
  columns?: TableColumn<EntityRow>[];
};

export const CatalogTable = ({ columns }: CatalogTableProps) => {
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const { loading, error, entities, filters } = useEntityListProvider();

  const showTypeColumn = filters.type === undefined;
  // TODO(timbonicus): we should show filter chips for all filters instead
  const titlePreamble = capitalize(filters.user?.value ?? 'all');

  if (error) {
    return (
      <div>
        <WarningPanel
          severity="error"
          title="Could not fetch catalog entities."
        >
          <CodeSnippet language="text" text={error.toString()} />
        </WarningPanel>
      </div>
    );
  }

  const actions: TableProps<EntityRow>['actions'] = [
    ({ entity }) => {
      const url = getEntityMetadataViewUrl(entity);
      return {
        icon: () => <OpenInNew fontSize="small" />,
        tooltip: 'View',
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const url = getEntityMetadataEditUrl(entity);
      return {
        icon: () => <Edit fontSize="small" />,
        tooltip: 'Edit',
        disabled: !url,
        onClick: () => {
          if (!url) return;
          window.open(url, '_blank');
        },
      };
    },
    ({ entity }) => {
      const isStarred = isStarredEntity(entity);
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => favouriteEntityIcon(isStarred),
        tooltip: favouriteEntityTooltip(isStarred),
        onClick: () => toggleStarredEntity(entity),
      };
    },
  ];

  const rows = entities.map(entity => {
    const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'system',
    });
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

    return {
      entity,
      resolved: {
        name: formatEntityRefTitle(entity, {
          defaultKind: 'Component',
        }),
        ownedByRelationsTitle: ownedByRelations
          .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
          .join(', '),
        ownedByRelations,
        partOfSystemRelationTitle: partOfSystemRelations
          .map(r =>
            formatEntityRefTitle(r, {
              defaultKind: 'system',
            }),
          )
          .join(', '),
        partOfSystemRelations,
      },
    };
  });

  const typeColumn = (columns || defaultColumns).find(c => c.title === 'Type');
  if (typeColumn) {
    typeColumn.hidden = !showTypeColumn;
  }

  return (
    <Table<EntityRow>
      isLoading={loading}
      columns={columns || defaultColumns}
      options={{
        paging: true,
        pageSize: 20,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
        padding: 'dense',
        pageSizeOptions: [20, 50, 100],
      }}
      title={`${titlePreamble} (${entities.length})`}
      data={rows}
      actions={actions}
    />
  );
};

CatalogTable.columns = columnFactories;
