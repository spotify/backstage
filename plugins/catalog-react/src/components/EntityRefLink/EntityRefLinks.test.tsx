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

import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { EntityRefLinks } from './EntityRefLinks';

describe('<EntityRefLinks />', () => {
  it('renders a single link', () => {
    const entityNames = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'software',
      },
    ];
    const { getByText } = render(<EntityRefLinks entityRefs={entityNames} />, {
      wrapper: MemoryRouter,
    });
    expect(getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders multiple links', () => {
    const entityNames = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'software',
      },
      {
        kind: 'API',
        namespace: 'default',
        name: 'interface',
      },
    ];
    const { getByText } = render(<EntityRefLinks entityRefs={entityNames} />, {
      wrapper: MemoryRouter,
    });
    expect(getByText(',')).toBeInTheDocument();
    expect(getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
    expect(getByText('api:interface')).toHaveAttribute(
      'href',
      '/catalog/default/api/interface',
    );
  });
});
