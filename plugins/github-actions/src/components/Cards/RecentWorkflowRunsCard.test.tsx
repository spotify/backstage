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

import { EntityProvider } from '@backstage/plugin-catalog-react';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { useWorkflowRuns } from '../useWorkflowRuns';
import type { Props as RecentWorkflowRunsCardProps } from './RecentWorkflowRunsCard';
import { RecentWorkflowRunsCard } from './RecentWorkflowRunsCard';

import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import {
  errorApiRef,
  configApiRef,
  ConfigApi,
} from '@backstage/core-plugin-api';

jest.mock('../useWorkflowRuns', () => ({
  useWorkflowRuns: jest.fn(),
}));

const mockErrorApi: jest.Mocked<typeof errorApiRef.T> = {
  post: jest.fn(),
  error$: jest.fn(),
};

const configApi: ConfigApi = new ConfigReader({});

describe('<RecentWorkflowRunsCard />', () => {
  const entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'software',
      annotations: {
        'github.com/project-slug': 'theorg/the-service',
      },
    },
    spec: {
      owner: 'guest',
      type: 'service',
      lifecycle: 'production',
    },
  };

  const workflowRuns = [1, 2, 3, 4, 5].map(n => ({
    id: `run-id-${n}`,
    message: `Commit message for workflow ${n}`,
    source: { branchName: `branch-${n}` },
    status: 'completed',
  }));

  beforeEach(() => {
    (useWorkflowRuns as jest.Mock).mockReturnValue([{ runs: workflowRuns }]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderSubject = (props: RecentWorkflowRunsCardProps = { entity }) =>
    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <ApiProvider
            apis={ApiRegistry.with(errorApiRef, mockErrorApi).with(
              configApiRef,
              configApi,
            )}
          >
            <EntityProvider entity={props.entity!}>
              <RecentWorkflowRunsCard {...props} />
            </EntityProvider>
          </ApiProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );

  it('renders a table with a row for each workflow', async () => {
    const subject = renderSubject();

    workflowRuns.forEach(run => {
      expect(subject.getByText(run.message)).toBeInTheDocument();
    });
  });

  it('renders a workflow row correctly', async () => {
    const subject = renderSubject();
    const [run] = workflowRuns;
    expect(subject.getByText(run.message).closest('a')).toHaveAttribute(
      'href',
      `/ci-cd/${run.id}`,
    );
    expect(subject.getByText(run.source.branchName)).toBeInTheDocument();
  });

  it('requests only the required number of workflow runs', async () => {
    const limit = 3;
    renderSubject({ entity, limit });
    expect(useWorkflowRuns).toHaveBeenCalledWith(
      expect.objectContaining({ initialPageSize: limit }),
    );
  });

  it('uses the github repo and owner from the entity annotation', async () => {
    renderSubject();
    expect(useWorkflowRuns).toHaveBeenCalledWith(
      expect.objectContaining({ owner: 'theorg', repo: 'the-service' }),
    );
  });

  it('filters workflows by branch if one is specified', async () => {
    const branch = 'master';
    renderSubject({ entity, branch });
    expect(useWorkflowRuns).toHaveBeenCalledWith(
      expect.objectContaining({ branch }),
    );
  });

  describe('where there is an error fetching workflows', () => {
    const error = 'error getting workflows';
    beforeEach(() => {
      (useWorkflowRuns as jest.Mock).mockReturnValue([{ runs: [], error }]);
    });

    it('sends the error to the errorApi', async () => {
      renderSubject();
      expect(mockErrorApi.post).toHaveBeenCalledWith(error);
    });
  });
});
