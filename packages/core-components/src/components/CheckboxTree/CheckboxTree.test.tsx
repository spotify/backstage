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
import { CheckboxTree } from './CheckboxTree';

const CHECKBOX_TREE_ITEMS = [
  {
    label: 'Generic subcategory name 1',
    options: [
      {
        label: 'Option 1',
        value: 1,
      },
      {
        label: 'Option 2',
        value: 2,
      },
    ],
  },
];

const minProps = {
  onChange: jest.fn(),
  label: 'Default',
  subCategories: CHECKBOX_TREE_ITEMS,
};

describe('<CheckboxTree />', () => {
  it('renders without exploding', async () => {
    const { getByText, getByTestId } = render(<CheckboxTree {...minProps} />);

    expect(getByText('Generic subcategory name 1')).toBeInTheDocument();
    const checkbox = await getByTestId('expandable');

    // Simulate click on expandable arrow
    fireEvent.click(checkbox);

    // Simulate click on option
    const option = getByText('Option 1');
    expect(getByText('Option 1')).toBeInTheDocument();
    fireEvent.click(option);
    expect(minProps.onChange).toHaveBeenCalled();
  });
});
