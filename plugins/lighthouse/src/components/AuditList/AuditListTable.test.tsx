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
import { render } from '@testing-library/react';
import { wrapInTestApp, msw } from '@backstage/test-utils';
import AuditListTable from './AuditListTable';

import {
  WebsiteListResponse,
  lighthouseApiRef,
  LighthouseRestApi,
} from '../../api';
import { formatTime } from '../../utils';
import { setupServer } from 'msw/node';
import * as data from '../../__fixtures__/website-list-response.json';

import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';

const websiteListResponse = data as WebsiteListResponse;

describe('AuditListTable', () => {
  let apis: ApiRegistry;

  const server = setupServer();
  msw.setupDefaultHandlers(server);

  beforeEach(() => {
    apis = ApiRegistry.from([
      [lighthouseApiRef, new LighthouseRestApi('http://lighthouse')],
    ]);
  });

  const auditList = (websiteList: WebsiteListResponse) => {
    return (
      <ApiProvider apis={apis}>
        <AuditListTable items={websiteList.items} />
      </ApiProvider>
    );
  };
  it('renders the link to each website', () => {
    const rendered = render(wrapInTestApp(auditList(websiteListResponse)));
    const link = rendered.queryByText('https://anchor.fm');
    const website = websiteListResponse.items.find(
      w => w.url === 'https://anchor.fm',
    );
    if (!website)
      throw new Error('https://anchor.fm must be present in fixture');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/audit/${website.lastAudit.id}`);
  });

  it('renders the dates that are available for a given row', () => {
    const rendered = render(wrapInTestApp(auditList(websiteListResponse)));
    const website = websiteListResponse.items.find(
      w => w.url === 'https://anchor.fm',
    );
    if (!website)
      throw new Error('https://anchor.fm must be present in fixture');
    expect(
      rendered.queryByText(formatTime(website.lastAudit.timeCreated)),
    ).toBeInTheDocument();
  });

  it('renders the status for a given row', async () => {
    const rendered = render(wrapInTestApp(auditList(websiteListResponse)));

    const completed = await rendered.findAllByText('COMPLETED');
    expect(completed).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'COMPLETED')
        .length,
    );

    const failed = await rendered.findAllByText('FAILED');
    expect(failed).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'FAILED')
        .length,
    );

    const running = await rendered.findAllByText('FAILED');
    expect(running).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'RUNNING')
        .length,
    );
  });

  describe('sparklines', () => {
    it('correctly maps the data from the website payload', () => {
      const rendered = render(wrapInTestApp(auditList(websiteListResponse)));
      const backstageSEO = rendered.getByTitle(
        'trendline for SEO category of https://backstage.io',
      );
      expect(backstageSEO).toBeInTheDocument();
    });

    it('does not break when no data is available', () => {
      const rendered = render(wrapInTestApp(auditList(websiteListResponse)));
      const anchorSEO = rendered.queryByTitle(
        'trendline for SEO category of https://anchor.fm',
      );
      expect(anchorSEO).not.toBeInTheDocument();
    });
  });
});
