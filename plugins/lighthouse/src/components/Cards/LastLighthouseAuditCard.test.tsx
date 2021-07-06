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

import { Entity } from '@backstage/catalog-model';
import { EntityContext } from '@backstage/plugin-catalog-react';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  AuditCompleted,
  LighthouseCategoryId,
  WebsiteListResponse,
} from '../../api';
import { useWebsiteForEntity } from '../../hooks/useWebsiteForEntity';
import * as data from '../../__fixtures__/website-list-response.json';
import { LastLighthouseAuditCard } from './LastLighthouseAuditCard';

jest.mock('../../hooks/useWebsiteForEntity', () => ({
  useWebsiteForEntity: jest.fn(),
}));

const websiteListResponse = data as WebsiteListResponse;
let entityWebsite = websiteListResponse.items[2];

describe('<LastLighthouseAuditCard />', () => {
  const asPercentage = (fraction: number) => `${Math.round(fraction * 100)}%`;

  beforeEach(() => {
    (useWebsiteForEntity as jest.Mock).mockReturnValue({
      value: entityWebsite,
      loading: false,
      error: null,
    });
  });

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'software',
      annotations: {
        'lighthouse.com/website-url': entityWebsite.url,
      },
    },
    spec: {
      owner: 'guest',
      type: 'Website',
      lifecycle: 'development',
    },
  };

  const subject = (value = {}) =>
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <EntityContext.Provider
            value={{ entity: entity, loading: false, ...value }}
          >
            <LastLighthouseAuditCard />
          </EntityContext.Provider>
        </MemoryRouter>
      </ThemeProvider>,
    );

  describe('where the last audit completed successfully', () => {
    const audit = entityWebsite.lastAudit as AuditCompleted;

    it('renders the performance data for the audit', async () => {
      const { findByText } = subject();
      expect(await findByText(audit.url)).toBeInTheDocument();
      expect(await findByText(audit.status)).toBeInTheDocument();
      for (const category of Object.keys(audit.categories)) {
        const { score } = audit.categories[category as LighthouseCategoryId];
        expect(await findByText(asPercentage(score))).toBeInTheDocument();
      }
    });

    describe('where a category score is not a number', () => {
      beforeEach(() => {
        entityWebsite = { ...entityWebsite };
        (entityWebsite.lastAudit as AuditCompleted).categories.accessibility.score = NaN;
      });

      afterEach(() => {
        entityWebsite = websiteListResponse.items[2];
      });

      it('renders the performance data for the audit', async () => {
        const { findByText } = subject();
        expect(await findByText('N/A')).toBeInTheDocument();
      });
    });
  });

  describe('where the last audit is in running', () => {
    const audit = websiteListResponse.items[0].lastAudit as AuditCompleted;

    beforeEach(() => {
      (useWebsiteForEntity as jest.Mock).mockReturnValue({
        value: websiteListResponse.items[0],
        loading: false,
        error: null,
      });
    });

    it('renders the url and status of the audit', async () => {
      const { findByText } = subject();
      expect(await findByText(audit.url)).toBeInTheDocument();
      expect(await findByText(audit.status)).toBeInTheDocument();
    });
  });

  describe('where the data is loading', () => {
    beforeEach(() => {
      (useWebsiteForEntity as jest.Mock).mockReturnValue({
        value: null,
        loading: true,
        error: null,
      });
    });

    it('renders a Progress element', async () => {
      const { findByTestId } = subject();
      expect(await findByTestId('progress')).toBeInTheDocument();
    });
  });

  describe('where there is an error loading data', () => {
    beforeEach(() => {
      (useWebsiteForEntity as jest.Mock).mockReturnValue({
        value: null,
        loading: false,
        error: 'error',
      });
    });

    it('renders nothing', async () => {
      const { queryByTestId } = subject();
      expect(await queryByTestId('AuditListTable')).toBeNull();
    });
  });
  //
  describe('where there is no data', () => {
    beforeEach(() => {
      (useWebsiteForEntity as jest.Mock).mockReturnValue({
        value: null,
        loading: false,
        error: null,
      });
    });

    it('renders nothing', async () => {
      const { queryByTestId } = subject();
      expect(await queryByTestId('AuditListTable')).toBeNull();
    });
  });
});
