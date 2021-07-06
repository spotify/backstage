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
import { BitriseBuildDetailsDialog } from './BitriseBuildDetailsDialog';
import { BitriseBuildResult } from '../../api/bitriseApi.model';

jest.mock('../BitriseArtifactsComponent', () => ({
  BitriseArtifactsComponent: (_props: { build: string }) => <></>,
}));

describe('BitriseArtifactsComponent', () => {
  const renderComponent = () =>
    render(
      <BitriseBuildDetailsDialog
        build={
          {
            appSlug: 'some-app-slug',
            buildSlug: 'some-build-slug',
          } as BitriseBuildResult
        }
      />,
    );

  it('should display a button', async () => {
    const rendered = renderComponent();

    expect(await rendered.findByTestId('btn')).toBeInTheDocument();
  });

  it('should change the state when the button is clicked', async () => {
    const setOpen = jest.fn();
    const useStateMock: any = (initState: any) => [initState, setOpen];

    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const rendered = renderComponent();

    const btn = await rendered.findByTestId('btn');

    btn.click();

    expect(setOpen).toHaveBeenCalled();
  });
});
