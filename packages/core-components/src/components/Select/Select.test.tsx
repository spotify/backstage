/*
 * Copyright 2020 Spotify AB
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

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { SelectComponent as Select } from './Select';

const SELECT_ITEMS = [
  {
    label: 'test 1',
    value: 'test_1',
  },
  {
    label: 'test 2',
    value: 'test_2',
  },
];

const minProps = {
  onChange: jest.fn(),
  label: 'Default',
  placeholder: 'All results',
  items: SELECT_ITEMS,
};

describe('<Select />', () => {
  it('renders without exploding', async () => {
    const { getByText, getByTestId } = render(<Select {...minProps} />);

    expect(getByText('Default')).toBeInTheDocument();
    const input = await getByTestId('select');
    expect(input.textContent).toBe('All results');

    // Simulate click on input
    fireEvent.click(input);

    expect(getByText('test 1')).toBeInTheDocument();
    const option = getByText('test 1');

    // Simulate click on option
    fireEvent.click(option);
    expect(input.textContent).toBe('test 1');
  });
});
