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
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ShortcutForm } from './ShortcutForm';
import { renderInTestApp } from '@backstage/test-utils';

describe('ShortcutForm', () => {
  const props = {
    onSave: jest.fn(),
    onClose: jest.fn(),
  };

  it('displays validation messages', async () => {
    await renderInTestApp(<ShortcutForm {...props} />);

    const urlInput = screen.getByPlaceholderText('Enter a URL');
    const titleInput = screen.getByPlaceholderText('Enter a display name');
    fireEvent.change(urlInput, { target: { value: 'url' } });
    fireEvent.change(titleInput, { target: { value: 't' } });

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(
        screen.getByText('Must be a relative URL (starts with a /)'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Must be at least 2 characters'),
      ).toBeInTheDocument();
    });
  });

  it('calls the save handler', async () => {
    await renderInTestApp(
      <ShortcutForm
        {...props}
        formValues={{ url: '/some-url', title: 'some title' }}
      />,
    );

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(props.onSave).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'some title', url: '/some-url' }),
        expect.anything(),
      );
    });
  });

  it('calls the close handler', async () => {
    await renderInTestApp(<ShortcutForm {...props} />);

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(props.onClose).toHaveBeenCalled();
    });
  });
});
