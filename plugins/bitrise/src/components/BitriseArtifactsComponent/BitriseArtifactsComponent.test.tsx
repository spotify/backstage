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
import { BitriseArtifactsComponent } from './BitriseArtifactsComponent';
import { useBitriseArtifacts } from '../useBitriseArtifacts';
import { useBitriseArtifactDetails } from '../useBitriseArtifactDetails';
import { BitriseBuildResult } from '../../api/bitriseApi.model';

jest.mock('../useBitriseArtifacts', () => ({
  useBitriseArtifacts: jest.fn(),
}));

jest.mock('../useBitriseArtifactDetails', () => ({
  useBitriseArtifactDetails: jest.fn(),
}));

describe('BitriseArtifactsComponent', () => {
  const renderComponent = () =>
    render(
      <BitriseArtifactsComponent
        build={
          {
            appSlug: 'some-app-slug',
            buildSlug: 'some-build-slug',
          } as BitriseBuildResult
        }
      />,
    );

  it('should display a progress bar when in a loading state', async () => {
    (useBitriseArtifacts as jest.Mock).mockReturnValue({ loading: true });

    const rendered = renderComponent();

    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });

  it('should display an error bar when in an error state', async () => {
    (useBitriseArtifacts as jest.Mock).mockReturnValue({ error: 'Ups!' });

    const rendered = renderComponent();

    expect(await rendered.findByRole('alert')).toBeInTheDocument();
  });

  it('should display `no records` message if there are no artifacts', async () => {
    (useBitriseArtifacts as jest.Mock).mockReturnValue({ value: [] });

    const rendered = renderComponent();

    expect(await rendered.findByText('No artifacts')).toBeInTheDocument();
  });

  it('should display a table if there are artifacts', async () => {
    (useBitriseArtifacts as jest.Mock).mockReturnValue({
      value: [
        { title: 'some-title-1', slug: 'some-slug' },
        { title: 'some-title-2', slug: 'some-slug' },
      ],
    });

    (useBitriseArtifactDetails as jest.Mock).mockReturnValue({
      value: {
        public_install_page_url: 'some-url',
        expiring_download_url: 'some-url-2',
      },
    });

    const rendered = renderComponent();

    expect(await rendered.findByText('some-title-1')).toBeInTheDocument();
    expect(await rendered.findByText('some-title-2')).toBeInTheDocument();
  });
});
