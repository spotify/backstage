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

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { RegisterComponentForm } from './RegisterComponentForm';

describe('RegisterComponentForm', () => {
  it('should initially render disabled buttons', async () => {
    render(<RegisterComponentForm onSubmit={jest.fn()} />);

    expect(
      await screen.findByText(/Enter the full path to the catalog-info.yaml/),
    ).toBeInTheDocument();

    expect(screen.getByText('Validate').closest('button')).toBeDisabled();
    expect(screen.getByText('Register').closest('button')).toBeDisabled();
  });

  it('should enable the submit buttons when the target url is set', async () => {
    render(<RegisterComponentForm onSubmit={jest.fn()} />);

    await act(async () => {
      await userEvent.type(
        await screen.findByLabelText('Entity file URL', { exact: false }),
        'https://example.com/blob/master/component.yaml',
      );
    });

    expect(screen.getByText('Validate').closest('button')).not.toBeDisabled();
    expect(screen.getByText('Register').closest('button')).not.toBeDisabled();
  });

  it('should show spinner while submitting', async () => {
    render(<RegisterComponentForm onSubmit={jest.fn()} submitting />);

    expect(screen.getByTestId('loading-progress')).toBeInTheDocument();
  });
});
