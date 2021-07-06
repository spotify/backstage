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
import {
  render,
  act,
  RenderResult,
  waitFor,
  fireEvent,
  screen,
} from '@testing-library/react';
import { wrapInTestApp, renderInTestApp } from '@backstage/test-utils';
import { SupportButton } from './SupportButton';

const SUPPORT_BUTTON_ID = 'support-button';
const POPOVER_ID = 'support-button-popover';

describe('<SupportButton />', () => {
  it('renders without exploding', async () => {
    let renderResult: RenderResult;

    await act(async () => {
      renderResult = render(wrapInTestApp(<SupportButton />));
    });

    await waitFor(() =>
      expect(renderResult.getByTestId(SUPPORT_BUTTON_ID)).toBeInTheDocument(),
    );
  });

  it('supports passing a title', async () => {
    await renderInTestApp(<SupportButton title="Custom title" />);
    fireEvent.click(screen.getByTestId(SUPPORT_BUTTON_ID));
    expect(screen.getByText('Custom title')).toBeInTheDocument();
  });

  it('shows popover on click', async () => {
    let renderResult: RenderResult;

    await act(async () => {
      renderResult = render(wrapInTestApp(<SupportButton />));
    });

    let button: HTMLElement;

    await waitFor(() => {
      expect(renderResult.getByTestId(SUPPORT_BUTTON_ID)).toBeInTheDocument();
      button = renderResult.getByTestId(SUPPORT_BUTTON_ID);
    });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(renderResult.getByTestId(POPOVER_ID)).toBeInTheDocument();
    });
  });
});
