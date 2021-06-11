/*
 * Copyright 2021 Spotify AB
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

import { render } from '@testing-library/react';
import React from 'react';
import { MockEntityListContextProvider } from '../../testUtils/providers';
import { EntityKindFilter } from '../../types';
import { EntityKindPicker } from './EntityKindPicker';

describe('<EntityKindPicker/>', () => {
  it('sets the selected kind filter', async () => {
    const updateFilters = jest.fn();
    render(
      <MockEntityListContextProvider
        value={{
          updateFilters,
        }}
      >
        <EntityKindPicker initialFilter="component" hidden />
      </MockEntityListContextProvider>,
    );

    expect(updateFilters).toHaveBeenLastCalledWith({
      kind: new EntityKindFilter('component'),
    });
  });
});
