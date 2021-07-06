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

import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useState } from 'react';
import { todoApiRef } from '../../api';
import { TodoItem, TodoListOptions } from '../../api/types';

import {
  Table,
  TableColumn,
  OverflowTooltip,
  Link,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const PAGE_SIZE = 10;

const columns: TableColumn<TodoItem>[] = [
  {
    title: 'Tag',
    field: 'tag',
    filtering: false,
  },
  {
    title: 'Text',
    field: 'text',
    width: '100%',
    highlight: true,
    render: ({ text }) => <OverflowTooltip text={text} />,
  },
  {
    title: 'File',
    field: 'repoFilePath',
    width: '80%',
    render: ({ viewUrl, repoFilePath }) =>
      viewUrl ? (
        <Link to={viewUrl} target="_blank">
          <OverflowTooltip text={repoFilePath} />
        </Link>
      ) : (
        <OverflowTooltip text={repoFilePath} />
      ),
  },
  {
    title: 'Author',
    field: 'author',
    width: '20%',
    render: ({ author }) => <OverflowTooltip text={author} />,
  },
];

export const TodoList = () => {
  const { entity } = useEntity();
  const todoApi = useApi(todoApiRef);
  const [error, setError] = useState<Error>();

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Table<TodoItem>
      title="TODOs"
      options={{
        search: false,
        pageSize: PAGE_SIZE,
        padding: 'dense',
        sorting: true,
        draggable: false,
        paging: true,
        filtering: true,
        debounceInterval: 500,
        filterCellStyle: { padding: '0 16px 0 20px' },
      }}
      columns={columns}
      data={async query => {
        try {
          const page = query?.page ?? 0;
          const pageSize = query?.pageSize ?? PAGE_SIZE;
          const result = await todoApi.listTodos({
            entity,
            offset: page * pageSize,
            limit: pageSize,
            orderBy:
              query?.orderBy &&
              ({
                field: query.orderBy.field,
                direction: query.orderDirection,
              } as TodoListOptions['orderBy']),
            filters: query?.filters?.map(filter => ({
              field: filter.column.field!,
              value: `*${filter.value}*`,
            })) as TodoListOptions['filters'],
          });
          return {
            data: result.items,
            totalCount: result.totalCount,
            page: Math.floor(result.offset / result.limit),
          };
        } catch (loadingError) {
          setError(loadingError);
          return { data: [], totalCount: 0, page: 0 };
        }
      }}
    />
  );
};
