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
import * as services from './__fixtures__/2-services.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { ServiceDrawer } from './ServiceDrawer';

describe('ServiceDrawer', () => {
  it('should render deployment drawer', async () => {
    const { getByText, getAllByText } = render(
      wrapInTestApp(
        <ServiceDrawer service={(services as any).services[0]} expanded />,
      ),
    );

    expect(getAllByText('awesome-service-grpc')).toHaveLength(2);
    expect(getAllByText('Service')).toHaveLength(2);
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('Cluster IP')).toBeInTheDocument();
    expect(getByText('Ports')).toBeInTheDocument();
    expect(getByText('Target Port: 1997')).toBeInTheDocument();
    expect(getByText('App: awesome-service')).toBeInTheDocument();
  });
});
