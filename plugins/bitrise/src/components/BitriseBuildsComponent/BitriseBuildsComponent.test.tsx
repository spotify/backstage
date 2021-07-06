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
import { BitriseBuildsComponent } from './BitriseBuildsComponent';

let entityValue: {
  entity: { metadata: { annotations?: { [key: string]: string } } };
};

jest.mock('../BitriseArtifactsComponent', () => ({
  BitriseArtifactsComponent: (_props: { build: string }) => <></>,
}));

jest.mock('../../hooks/useBitriseBuildWorkflows', () => ({
  useBitriseBuildWorkflows: () => [],
}));

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entityValue;
  },
}));

jest.mock('../BitriseBuildsTableComponent', () => ({
  BitriseBuildsTable: (_props: {
    appName: string;
    workflow: string;
    error: string;
  }) => <>mock builds table</>,
}));

describe('BitriseArtifactsComponent', () => {
  entityValue = { entity: { metadata: {} } };

  const renderComponent = () => render(<BitriseBuildsComponent />);

  it('should display an empty state if an app annotation is missing', async () => {
    const rendered = renderComponent();

    expect(await rendered.findByText('Missing Annotation')).toBeInTheDocument();
  });
});
