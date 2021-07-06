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

import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { PinButton } from './PinButton';
import { SidebarPinStateContext } from '@backstage/core-components';

describe('<PinButton />', () => {
  it('toggles the pin sidebar button', async () => {
    const mockToggleFn = jest.fn();
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <SidebarPinStateContext.Provider
          value={{ isPinned: false, toggleSidebarPinState: mockToggleFn }}
        >
          <PinButton />
        </SidebarPinStateContext.Provider>,
      ),
    );
    expect(rendered.getByText('Pin Sidebar')).toBeInTheDocument();

    const pinButton = rendered.getByLabelText('Pin Sidebar Switch');
    fireEvent.click(pinButton);
    expect(mockToggleFn).toHaveBeenCalled();
  });
});
