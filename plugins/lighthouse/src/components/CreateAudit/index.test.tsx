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

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const mockNavigate = jest.fn();
  return {
    ...actual,
    useNavigate: jest.fn(() => mockNavigate),
  };
});

import { msw, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { Audit, lighthouseApiRef, LighthouseRestApi } from '../../api';
import * as data from '../../__fixtures__/create-audit-response.json';
import CreateAudit from './index';

import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { ErrorApi, errorApiRef } from '@backstage/core-plugin-api';

const { useNavigate }: { useNavigate: jest.Mock } = jest.requireMock(
  'react-router-dom',
);
const createAuditResponse = data as Audit;

// TODO add act() to these tests without breaking them!
describe('CreateAudit', () => {
  let apis: ApiRegistry;
  let errorApi: ErrorApi;
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  beforeEach(() => {
    errorApi = { post: jest.fn(), error$: jest.fn() };
    apis = ApiRegistry.from([
      [lighthouseApiRef, new LighthouseRestApi('http://lighthouse')],
      [errorApiRef, errorApi],
    ]);
  });

  it('renders the form', () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <CreateAudit />
        </ApiProvider>,
      ),
    );
    expect(rendered.getByLabelText(/URL/)).toBeEnabled();
    expect(rendered.getByLabelText(/URL/)).toHaveAttribute('value', '');
    expect(rendered.getByText(/Create Audit/)).toBeEnabled();
  });

  describe('when the location contains a url', () => {
    it('prefills the url into the form', () => {
      const url = 'https://spotify.com';
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <CreateAudit />
          </ApiProvider>,
          {
            routeEntries: [`/create-audit?url=${encodeURIComponent(url)}`],
          },
        ),
      );
      expect(rendered.getByLabelText(/URL/)).toHaveAttribute('value', url);
    });
  });

  describe('when waiting on the request', () => {
    it('disables the form fields', () => {
      server.use(rest.get('*', (_req, res, ctx) => res(ctx.delay(20000))));

      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <CreateAudit />
          </ApiProvider>,
        ),
      );

      fireEvent.change(rendered.getByLabelText(/URL/), {
        target: { value: 'https://spotify.com' },
      });
      fireEvent.click(rendered.getByText(/Create Audit/));

      expect(rendered.getByLabelText(/URL/)).toBeDisabled();
      expect(rendered.getByText(/Create Audit/).parentElement).toBeDisabled();
    });
  });

  describe('when the audit is successfully created', () => {
    it('triggers a location change to the table', async () => {
      useNavigate.mockClear();
      server.use(
        rest.post('http://lighthouse/v1/audits', (_req, res, ctx) =>
          res(ctx.json(createAuditResponse)),
        ),
      );

      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <CreateAudit />
          </ApiProvider>,
        ),
      );

      fireEvent.change(rendered.getByLabelText(/URL/), {
        target: { value: 'https://spotify.com' },
      });
      fireEvent.click(rendered.getByText(/Create Audit/));

      await waitFor(() => expect(rendered.getByLabelText(/URL/)).toBeEnabled());

      expect(useNavigate()).toHaveBeenCalledWith('..');
    });
  });

  describe('when the audits fail', () => {
    it('should render an error', async () => {
      server.use(
        rest.post('http://lighthouse/v1/audits', (_req, res, ctx) =>
          res(ctx.status(500, 'failed to post')),
        ),
      );
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <CreateAudit />
          </ApiProvider>,
        ),
      );

      fireEvent.change(rendered.getByLabelText(/URL/), {
        target: { value: 'https://spotify.com' },
      });
      fireEvent.click(rendered.getByText(/Create Audit/));

      await waitFor(() => expect(rendered.getByLabelText(/URL/)).toBeEnabled());

      expect(errorApi.post).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
