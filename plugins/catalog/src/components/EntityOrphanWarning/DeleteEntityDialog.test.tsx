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
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DeleteEntityDialog } from './DeleteEntityDialog';
import { ORIGIN_LOCATION_ANNOTATION } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';

import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('DeleteEntityDialog', () => {
  const alertApi: jest.Mocked<AlertApi> = {
    post: jest.fn(),
    alert$: jest.fn(),
  };

  const catalogClient: jest.Mocked<CatalogApi> = {
    removeEntityByUid: jest.fn(),
  } as any;
  const apis = ApiRegistry.with(catalogApiRef, catalogClient).with(
    alertApiRef,
    alertApi,
  );

  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      uid: '123',
      name: 'n',
      namespace: 'ns',
      annotations: {
        [ORIGIN_LOCATION_ANNOTATION]: 'url:http://example.com',
      },
    },
    spec: {},
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <ApiProvider apis={apis}>{children}</ApiProvider>
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('can cancel', async () => {
    const onClose = jest.fn();

    await renderInTestApp(
      <Wrapper>
        <DeleteEntityDialog
          open
          onClose={onClose}
          onConfirm={() => {}}
          entity={entity}
        />
      </Wrapper>,
    );

    userEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(onClose).toBeCalled();
    });
  });

  it('can delete', async () => {
    const onConfirm = jest.fn();

    await renderInTestApp(
      <Wrapper>
        <DeleteEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
    );

    userEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(catalogClient.removeEntityByUid).toBeCalledWith('123');
      expect(onConfirm).toBeCalled();
    });
  });

  it('handles error', async () => {
    const onConfirm = jest.fn();

    await renderInTestApp(
      <Wrapper>
        <DeleteEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
    );

    catalogClient.removeEntityByUid.mockRejectedValue(new Error('no no no'));
    userEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(catalogClient.removeEntityByUid).toBeCalledWith('123');
      expect(alertApi.post).toBeCalledWith({ message: 'no no no' });
    });
  });
});
