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

import {
  Content,
  ContentHeader,
  SupportButton,
  useApi,
  useRouteRef,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use';
import { createComponentRouteRef } from '../../routes';
import { ApiExplorerTable } from '../ApiExplorerTable';
import { ApiExplorerLayout } from './ApiExplorerLayout';

export const ApiExplorerPage = () => {
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value: catalogResponse } = useAsync(() => {
    return catalogApi.getEntities({
      filter: { kind: 'API' },
      fields: [
        'apiVersion',
        'kind',
        'metadata',
        'relations',
        'spec.lifecycle',
        'spec.owner',
        'spec.type',
        'spec.system',
      ],
    });
  }, [catalogApi]);

  return (
    <ApiExplorerLayout>
      <Content>
        <ContentHeader title="">
          {createComponentLink && (
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={createComponentLink()}
            >
              Register Existing API
            </Button>
          )}
          <SupportButton>All your APIs</SupportButton>
        </ContentHeader>
        <ApiExplorerTable
          entities={catalogResponse?.items ?? []}
          loading={loading}
          error={error}
        />
      </Content>
    </ApiExplorerLayout>
  );
};
