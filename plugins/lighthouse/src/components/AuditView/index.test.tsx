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

/* eslint-disable jest/no-disabled-tests */

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const mockNavigation = jest.fn();
  return {
    ...actual,
    useParams: jest.fn(() => ({})),
    useNavigate: jest.fn(() => mockNavigation),
  };
});

import { msw, wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Audit, lighthouseApiRef, LighthouseRestApi, Website } from '../../api';
import { formatTime } from '../../utils';
import * as data from '../../__fixtures__/website-response.json';
import AuditView from './index';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const { useParams }: { useParams: jest.Mock } = jest.requireMock(
  'react-router-dom',
);
const websiteResponse = data as Website;

describe('AuditView', () => {
  let apis: ApiRegistry;
  let id: string;

  const server = setupServer();
  msw.setupDefaultHandlers(server);

  beforeEach(() => {
    server.use(
      rest.get('https://lighthouse/*', async (_req, res, ctx) =>
        res(ctx.json(websiteResponse)),
      ),
    );

    apis = ApiRegistry.from([
      [lighthouseApiRef, new LighthouseRestApi('https://lighthouse')],
    ]);
    id = websiteResponse.audits.find(a => a.status === 'COMPLETED')
      ?.id as string;
    useParams.mockReturnValue({ id });
  });

  it('renders the iframe for the selected audit', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <AuditView />
        </ApiProvider>,
      ),
    );

    const iframe = await rendered.findByTitle(
      'Lighthouse audit for https://spotify.com',
    );
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', `https://lighthouse/v1/audits/${id}`);
  });

  describe('sidebar', () => {
    it('renders a list of all audits for the website', async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      websiteResponse.audits.forEach(a => {
        expect(
          rendered.queryByText(formatTime(a.timeCreated)),
        ).toBeInTheDocument();
      });
    });

    it('sets the current audit as active', async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      const audit = websiteResponse.audits.find(a => a.id === id) as Audit;
      const auditElement = rendered.getByText(formatTime(audit.timeCreated));
      expect(auditElement.parentElement?.parentElement?.className).toContain(
        'selected',
      );

      const notSelectedAudit = websiteResponse.audits.find(
        a => a.id !== id,
      ) as Audit;
      const notSelectedAuditElement = rendered.getByText(
        formatTime(notSelectedAudit.timeCreated),
      );
      expect(
        notSelectedAuditElement.parentElement?.parentElement?.className,
      ).not.toContain('selected');
    });

    it('navigates to the next report when an audit is clicked', async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      websiteResponse.audits.forEach(a => {
        expect(
          rendered.getByText(formatTime(a.timeCreated)).parentElement
            ?.parentElement,
        ).toHaveAttribute('href', `/audit/${a.id}`);
      });
    });
  });

  describe('when the request for the website by id is pending', () => {
    it('shows the loading', async () => {
      server.use(rest.get('*', (_req, res, ctx) => res(ctx.delay(20000))));
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );
      expect(await rendered.findByTestId('progress')).toBeInTheDocument();
    });
  });

  describe('when the request for the website by id fails', () => {
    it('shows an error', async () => {
      server.use(
        rest.get('*', (_req, res, ctx) =>
          res(ctx.status(500), ctx.body('failed to fetch')),
        ),
      );
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );
      expect(await rendered.findByText(/failed to fetch/)).toBeInTheDocument();
    });
  });

  describe.skip('when a loading audit is accessed', () => {
    it('shows a loading view', async () => {
      id = websiteResponse.audits.find(a => a.status === 'RUNNING')
        ?.id as string;
      useParams.mockReturnValueOnce({ id });

      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      expect(rendered.queryByTestId('progress')).toBeInTheDocument();
    });
  });

  describe.skip('when a failed audit is accessed', () => {
    it('shows an error message', async () => {
      id = websiteResponse.audits.find(a => a.status === 'FAILED')
        ?.id as string;
      useParams.mockReturnValueOnce({ id });

      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      expect(rendered.queryByText(/This audit failed/)).toBeInTheDocument();
    });
  });
});
