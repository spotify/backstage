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
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { renderInTestApp } from '@backstage/test-utils';
import { CopyTextButton } from './CopyTextButton';
import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';
import { errorApiRef, ErrorApi } from '@backstage/core-plugin-api';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;
    update() {}
    destroy() {}
    scheduleUpdate() {}
  };
});

const props = {
  text: 'mockText',
  tooltipDelay: 2,
  tooltipText: 'mockTooltip',
};

const apiRegistry = ApiRegistry.from([
  [
    errorApiRef,
    {
      post(error) {
        throw error;
      },
      error$: jest.fn(),
    } as ErrorApi,
  ],
]);

describe('<CopyTextButton />', () => {
  it('renders without exploding', async () => {
    const { getByDisplayValue } = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <CopyTextButton {...props} />
      </ApiProvider>,
    );
    getByDisplayValue('mockText');
  });

  it('displays tooltip on click', async () => {
    jest.useFakeTimers();
    document.execCommand = jest.fn();
    const rendered = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <CopyTextButton {...props} />
      </ApiProvider>,
    );
    const button = rendered.getByTitle('mockTooltip');
    fireEvent.click(button);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.execCommand).toHaveBeenCalled();
    rendered.getByText('mockTooltip');
    jest.useRealTimers();
  });
});
