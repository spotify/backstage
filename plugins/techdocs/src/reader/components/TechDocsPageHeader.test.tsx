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
import React from 'react';
import { TechDocsPageHeader } from './TechDocsPageHeader';
import { act } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { rootRouteRef } from '../../routes';

describe('<TechDocsPageHeader />', () => {
  it('should render a techdocs page header', async () => {
    await act(async () => {
      const rendered = await renderInTestApp(
        <TechDocsPageHeader
          entityId={{
            kind: 'test',
            name: 'test-name',
            namespace: 'test-namespace',
          }}
          metadataRequest={{
            entity: {
              loading: false,
              value: {
                locationMetadata: {
                  type: 'github',
                  target: 'https://example.com/',
                },
                spec: {
                  owner: 'test',
                },
              },
            },
            techdocs: {
              loading: false,
              value: {
                site_name: 'test-site-name',
                site_description: 'test-site-desc',
              },
            },
          }}
        />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name/*': entityRouteRef,
            '/docs': rootRouteRef,
          },
        },
      );

      expect(rendered.container.innerHTML).toContain('header');
      expect(rendered.getAllByText('test-site-name')).toHaveLength(2);
      expect(rendered.getByText('test-site-desc')).toBeDefined();
    });
  });

  it('should render a techdocs page header even if metadata is missing', async () => {
    await act(async () => {
      const rendered = await renderInTestApp(
        <TechDocsPageHeader
          entityId={{
            kind: 'test',
            name: 'test-name',
            namespace: 'test-namespace',
          }}
          metadataRequest={{
            entity: {
              loading: false,
            },
            techdocs: {
              loading: false,
            },
          }}
        />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name/*': entityRouteRef,
            '/docs': rootRouteRef,
          },
        },
      );

      expect(rendered.container.innerHTML).toContain('header');
    });
  });

  it('should render a link back to the component page', async () => {
    await act(async () => {
      const rendered = await renderInTestApp(
        <TechDocsPageHeader
          entityId={{
            kind: 'test',
            name: 'test-name',
            namespace: 'test-namespace',
          }}
          metadataRequest={{
            entity: {
              loading: false,
            },
            techdocs: {
              loading: false,
              value: {
                site_name: 'test-site-name',
                site_description: 'test-site-desc',
              },
            },
          }}
        />,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name/*': entityRouteRef,
            '/docs': rootRouteRef,
          },
        },
      );

      expect(rendered.container.innerHTML).toContain(
        '/catalog/test-namespace/test/test-name',
      );
    });
  });
});
