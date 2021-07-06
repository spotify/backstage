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
import { wrapInTestApp } from '@backstage/test-utils';
import { ErrorPanel } from './ErrorPanel';

describe('ErrorPanel', () => {
  it('render with error message', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <ErrorPanel
          entityName="THIS_ENTITY"
          errorMessage="SOME_ERROR_MESSAGE"
        />,
      ),
    );

    // title
    expect(
      getByText(
        'There was a problem retrieving some Kubernetes resources for the entity: THIS_ENTITY. This could mean that the Error Reporting card is not completely accurate.',
      ),
    ).toBeInTheDocument();

    // message
    expect(getByText('Errors: SOME_ERROR_MESSAGE')).toBeInTheDocument();
  });
  it('render with cluster errors', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <ErrorPanel
          entityName="THIS_ENTITY"
          clustersWithErrors={[
            {
              cluster: {
                name: 'THIS_CLUSTER',
              },
              resources: [],
              errors: [
                {
                  errorType: 'SYSTEM_ERROR',
                  statusCode: 500,
                  resourcePath: 'some/resource',
                },
              ],
            },
          ]}
        />,
      ),
    );

    // title
    expect(
      getByText(
        'There was a problem retrieving some Kubernetes resources for the entity: THIS_ENTITY. This could mean that the Error Reporting card is not completely accurate.',
      ),
    ).toBeInTheDocument();

    // message
    expect(getByText('Errors:')).toBeInTheDocument();
    expect(getByText('Cluster: THIS_CLUSTER')).toBeInTheDocument();
    expect(
      getByText(
        "Error fetching Kubernetes resource: 'some/resource', error: SYSTEM_ERROR, status code: 500",
      ),
    ).toBeInTheDocument();
  });
});
