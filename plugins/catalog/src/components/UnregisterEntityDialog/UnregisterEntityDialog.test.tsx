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

jest.mock('./useUnregisterEntityDialogState');

import userEvent from '@testing-library/user-event';
import React from 'react';
import { UnregisterEntityDialog } from './UnregisterEntityDialog';
import { ORIGIN_LOCATION_ANNOTATION } from '@backstage/catalog-model';
import { CatalogClient } from '@backstage/catalog-client';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { screen, waitFor } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import * as state from './useUnregisterEntityDialogState';

import {
  AlertApi,
  alertApiRef,
  DiscoveryApi,
} from '@backstage/core-plugin-api';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('UnregisterEntityDialog', () => {
  const discoveryApi: DiscoveryApi = {
    async getBaseUrl(pluginId) {
      return `http://example.com/${pluginId}`;
    },
  };
  const alertApi: AlertApi = {
    post() {
      return undefined;
    },
    alert$() {
      throw new Error('not implemented');
    },
  };

  const apis = ApiRegistry.with(
    catalogApiRef,
    new CatalogClient({ discoveryApi }),
  ).with(alertApiRef, alertApi);

  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
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

  const stateSpy = jest.spyOn(state, 'useUnregisterEntityDialogState');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('can cancel', async () => {
    const onClose = jest.fn();
    stateSpy.mockImplementation(() => ({ type: 'loading' }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
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

  it('handles the loading state', async () => {
    stateSpy.mockImplementation(() => ({ type: 'loading' }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={() => {}}
          entity={entity}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });
  });

  it('handles the error state', async () => {
    stateSpy.mockImplementation(() => ({
      type: 'error',
      error: new TypeError('eek!'),
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={() => {}}
          entity={entity}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getAllByText('eek!').length).toBeGreaterThan(0);
      expect(screen.getAllByText('TypeError').length).toBeGreaterThan(0);
    });
  });

  it('handles the bootstrap state', async () => {
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'bootstrap',
      location: 'bootstrap:bootstrap',
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/You cannot unregister/)).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Advanced Options'));

    await waitFor(() => {
      expect(screen.getByText(/option to delete/)).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Delete Entity'));

    await waitFor(() => {
      expect(deleteEntity).toBeCalled();
      expect(onConfirm).toBeCalled();
    });
  });

  it('handles the only-delete state', async () => {
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'only-delete',
      location: 'url:http://example.com',
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/You therefore only have the option to delete it/),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Delete Entity'));

    await waitFor(() => {
      expect(deleteEntity).toBeCalled();
      expect(onConfirm).toBeCalled();
    });
  });

  it('handles the unregister state, choosing to unregister', async () => {
    const unregisterLocation = jest.fn();
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'unregister',
      location: 'url:http://example.com',
      colocatedEntities: [
        { kind: 'k1', namespace: 'ns1', name: 'n1' },
        { kind: 'k2', namespace: 'ns2', name: 'n2' },
      ],
      unregisterLocation,
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/will unregister the following entities/),
      ).toBeInTheDocument();
      expect(screen.getByText(/k1:ns1\/n1/)).toBeInTheDocument();
      expect(screen.getByText(/k2:ns2\/n2/)).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Unregister Location'));

    await waitFor(() => {
      expect(unregisterLocation).toBeCalled();
      expect(onConfirm).toBeCalled();
    });
  });

  it('handles the unregister state, choosing to delete', async () => {
    const unregisterLocation = jest.fn();
    const deleteEntity = jest.fn();
    const onConfirm = jest.fn();

    stateSpy.mockImplementation(() => ({
      type: 'unregister',
      location: 'url:http://example.com',
      colocatedEntities: [
        { kind: 'k1', namespace: 'ns1', name: 'n1' },
        { kind: 'k2', namespace: 'ns2', name: 'n2' },
      ],
      unregisterLocation,
      deleteEntity,
    }));

    await renderInTestApp(
      <Wrapper>
        <UnregisterEntityDialog
          open
          onClose={() => {}}
          onConfirm={onConfirm}
          entity={entity}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/will unregister the following entities/),
      ).toBeInTheDocument();
      expect(screen.getByText(/k1:ns1\/n1/)).toBeInTheDocument();
      expect(screen.getByText(/k2:ns2\/n2/)).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Advanced Options'));

    await waitFor(() => {
      expect(
        screen.getByText(/You also have the option to delete/),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByText('Delete Entity'));

    await waitFor(() => {
      expect(deleteEntity).toBeCalled();
      expect(onConfirm).toBeCalled();
    });
  });
});
