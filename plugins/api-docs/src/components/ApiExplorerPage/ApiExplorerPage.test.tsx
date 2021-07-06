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

import { Entity, RELATION_MEMBER_OF } from '@backstage/catalog-model';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { MockStorageApi, wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import React from 'react';
import { apiDocsConfigRef } from '../../config';
import { ApiExplorerPage } from './ApiExplorerPage';

import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import {
  storageApiRef,
  ConfigApi,
  configApiRef,
} from '@backstage/core-plugin-api';

describe('ApiCatalogPage', () => {
  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'API',
            metadata: {
              name: 'Entity1',
            },
            spec: { type: 'openapi' },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'API',
            metadata: {
              name: 'Entity2',
            },
            spec: { type: 'openapi' },
          },
        ] as Entity[],
      }),
    getLocationByEntity: () =>
      Promise.resolve({ id: 'id', type: 'github', target: 'url' }),
    getEntityByName: async entityName => {
      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: { name: entityName.name },
        relations: [
          {
            type: RELATION_MEMBER_OF,
            target: { namespace: 'default', kind: 'Group', name: 'tools' },
          },
        ],
      };
    },
  };

  const configApi: ConfigApi = new ConfigReader({
    organization: {
      name: 'My Company',
    },
  });

  const apiDocsConfig = {
    getApiDefinitionWidget: () => undefined,
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [catalogApiRef, catalogApi],
            [configApiRef, configApi],
            [storageApiRef, MockStorageApi.create()],
            [apiDocsConfigRef, apiDocsConfig],
          ])}
        >
          {children}
        </ApiProvider>,
      ),
    );

  // this test right now causes some red lines in the log output when running tests
  // related to some theme issues in mui-table
  // https://github.com/mbrn/material-table/issues/1293
  it('should render', async () => {
    const { findByText } = renderWrapped(<ApiExplorerPage />);
    expect(await findByText(/My Company API Explorer/)).toBeInTheDocument();
  });
});
