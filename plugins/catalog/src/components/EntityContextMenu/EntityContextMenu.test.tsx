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

import { renderInTestApp } from '@backstage/test-utils';
import SearchIcon from '@material-ui/icons/Search';
import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { EntityContextMenu } from './EntityContextMenu';

describe('ComponentContextMenu', () => {
  it('should call onUnregisterEntity on button click', async () => {
    const mockCallback = jest.fn();

    await renderInTestApp(
      <EntityContextMenu onUnregisterEntity={mockCallback} />,
    );

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const unregister = await screen.findByText('Unregister entity');
    expect(unregister).toBeInTheDocument();
    fireEvent.click(unregister);

    expect(mockCallback).toBeCalled();
  });

  it('supports extra items', async () => {
    const extra = {
      title: 'HELLO',
      Icon: SearchIcon,
      onClick: jest.fn(),
    };

    await renderInTestApp(
      <EntityContextMenu
        onUnregisterEntity={jest.fn()}
        UNSTABLE_extraContextMenuItems={[extra]}
      />,
    );

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const item = await screen.findByText('HELLO');
    expect(item).toBeInTheDocument();
    fireEvent.click(item);

    expect(extra.onClick).toBeCalled();
  });
});
