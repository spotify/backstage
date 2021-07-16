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
import { capitalize } from 'lodash';
import ShareIcon from '@material-ui/icons/Share';
import { CodeSnippet, WarningPanel } from '@backstage/core-components';
import {
  favouriteEntityIcon,
  favouriteEntityTooltip,
} from '@backstage/plugin-catalog';
import {
  useEntityListProvider,
  useStarredEntities,
} from '@backstage/plugin-catalog-react';
import { DocsTable, DocsTableRow } from './DocsTable';

export const EntityListDocsTable = () => {
  const { loading, error, entities, filters } = useEntityListProvider();
  const { isStarredEntity, toggleStarredEntity } = useStarredEntities();
  const [, copyToClipboard] = useCopyToClipboard();

  const title = capitalize(filters.user?.value ?? 'all');

  const actions = [
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
    ({ entity }: DocsTableRow) => {
      const isStarred = isStarredEntity(entity);
      return {
        cellStyle: { paddingLeft: '1em' },
        icon: () => favouriteEntityIcon(isStarred),
        tooltip: favouriteEntityTooltip(isStarred),
        onClick: () => toggleStarredEntity(entity),
      };
    },
  ];

  if (error) {
    return (
      <div>
        <WarningPanel
          severity="error"
          title="Could not load available documentation."
        >
          <CodeSnippet language="text" text={error.toString()} />
        </WarningPanel>
      </div>
    );
  }

  return (
    <DocsTable
      title={title}
      entities={entities}
      loading={loading}
      actions={actions}
    />
  );
};
