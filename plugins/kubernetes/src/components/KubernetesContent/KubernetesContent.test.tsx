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

import React from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { KubernetesContent } from './KubernetesContent';
import { useKubernetesObjects } from '../../hooks';

jest.mock('../../hooks');
import * as oneDeployment from '../../__fixtures__/1-deployments.json';
import * as twoDeployments from '../../__fixtures__/2-deployments.json';

describe('KubernetesContent', () => {
  it('render empty response', async () => {
    (useKubernetesObjects as any).mockReturnValue({
      kubernetesObjects: {
        items: [],
      },
      error: undefined,
    });
    const { getByText } = render(
      wrapInTestApp(
        <KubernetesContent
          entity={
            {
              metadata: {
                name: 'some-entity',
              },
            } as any
          }
        />,
      ),
    );

    expect(getByText('Error Reporting')).toBeInTheDocument();
    expect(
      getByText('Nice! There are no errors to report!'),
    ).toBeInTheDocument();
    expect(getByText('Your Clusters')).toBeInTheDocument();
    // TODO add a prompt for the user to configure their clusters
  });
  it('render 1 cluster happy path', async () => {
    (useKubernetesObjects as any).mockReturnValue({
      kubernetesObjects: {
        items: [
          {
            cluster: { name: 'cluster-1' },
            resources: [
              {
                type: 'deployments',
                resources: oneDeployment.deployments,
              },
              {
                type: 'replicasets',
                resources: oneDeployment.replicaSets,
              },
              {
                type: 'pods',
                resources: oneDeployment.pods,
              },
            ],
            errors: [],
          },
        ],
      },
      error: undefined,
    });
    const { getByText } = render(
      wrapInTestApp(
        <KubernetesContent
          entity={
            {
              metadata: {
                name: 'some-entity',
              },
            } as any
          }
        />,
      ),
    );

    expect(
      getByText('Nice! There are no errors to report!'),
    ).toBeInTheDocument();
    expect(getByText('cluster-1')).toBeInTheDocument();
    expect(getByText('Cluster')).toBeInTheDocument();
    expect(getByText('10 pods')).toBeInTheDocument();
    expect(getByText('No pods with errors')).toBeInTheDocument();
  });
  it('render 2 clusters happy path, one with errors', async () => {
    (useKubernetesObjects as any).mockReturnValue({
      kubernetesObjects: {
        items: [
          {
            cluster: { name: 'cluster-1' },
            resources: [
              {
                type: 'deployments',
                resources: [twoDeployments.deployments[1]],
              },
              {
                type: 'replicasets',
                resources: twoDeployments.replicaSets,
              },
              {
                type: 'pods',
                resources: twoDeployments.pods,
              },
            ],
            errors: [],
          },
          {
            cluster: { name: 'cluster-a' },
            resources: [
              {
                type: 'deployments',
                resources: oneDeployment.deployments,
              },
              {
                type: 'replicasets',
                resources: oneDeployment.replicaSets,
              },
              {
                type: 'pods',
                resources: oneDeployment.pods,
              },
            ],
            errors: [],
          },
        ],
      },
      error: undefined,
    });
    const { getByText, getAllByText, queryByText } = render(
      wrapInTestApp(
        <KubernetesContent
          entity={
            {
              metadata: {
                name: 'some-entity',
              },
            } as any
          }
        />,
      ),
    );

    expect(queryByText('Nice! There are no errors to report!')).toBeNull();
    expect(getAllByText('Cluster')).toHaveLength(2);
    expect(getByText('cluster-a')).toBeInTheDocument();
    expect(getByText('10 pods')).toBeInTheDocument();
    expect(getByText('No pods with errors')).toBeInTheDocument();

    expect(getAllByText('cluster-1')).toHaveLength(6);
    expect(getByText('12 pods')).toBeInTheDocument();
    expect(getByText('2 pods with errors')).toBeInTheDocument();
  });
});
