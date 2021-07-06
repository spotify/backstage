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
import { render } from '@testing-library/react';
import { ActionItems } from './ActionItems';
import { MockScrollProvider } from '../../testUtils';

function renderInContext(children: JSX.Element) {
  return render(<MockScrollProvider>{children}</MockScrollProvider>);
}

describe('<ActionItems/>', () => {
  it('should not display status buttons if there are no active alerts', () => {
    const { queryByRole } = renderInContext(
      <ActionItems active={[]} snoozed={[]} accepted={[]} dismissed={[]} />,
    );
    expect(queryByRole('button', { name: 'snoozed' })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: 'accepted' })).not.toBeInTheDocument();
    expect(
      queryByRole('button', { name: 'dismissed' }),
    ).not.toBeInTheDocument();
  });

  it('should display status buttons with correct badge number', () => {
    const { getByText, getByRole, getAllByText } = renderInContext(
      <ActionItems
        active={[
          {
            title: 'active-alert-title',
            subtitle: 'active-alert-subtitle',
          },
        ]}
        snoozed={[
          {
            title: 'test-title',
            subtitle: 'test-subtitle',
          },
        ]}
        accepted={[
          {
            title: 'test-title',
            subtitle: 'test-subtitle',
          },
          {
            title: 'test-title',
            subtitle: 'test-subtitle',
          },
        ]}
        dismissed={[
          {
            title: 'test-title',
            subtitle: 'test-subtitle',
          },
          {
            title: 'test-title',
            subtitle: 'test-subtitle',
          },
          {
            title: 'test-title',
            subtitle: 'test-subtitle',
          },
        ]}
      />,
    );
    expect(getAllByText('1')).toHaveLength(2); // should be a badge of 1 and action item number of 1
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByRole('button', { name: 'snoozed' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'accepted' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'dismissed' })).toBeInTheDocument();
  });
});
