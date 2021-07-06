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
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AlertInsights } from './AlertInsights';
import { MockScrollProvider, MockLoadingProvider } from '../../testUtils';

function renderInContext(children: JSX.Element) {
  return render(
    <MockLoadingProvider>
      <MockScrollProvider>{children}</MockScrollProvider>
    </MockLoadingProvider>,
  );
}

describe('<AlertInsights />', () => {
  it('should display the correct header if there are active action items', () => {
    const { getByText, queryByText } = renderInContext(
      <AlertInsights
        group="black-sabbath"
        active={[
          {
            title: 'Master of Reality',
            subtitle: 'Paranoid',
          },
        ]}
        snoozed={[]}
        accepted={[]}
        dismissed={[]}
        onChange={jest.fn()}
      />,
    );
    expect(
      getByText(
        'This section outlines suggested action items your team can address to improve cloud costs.',
      ),
    ).toBeInTheDocument();
    expect(queryByText('Hidden Action Item')).not.toBeInTheDocument();
  });

  it('should display alert summary if there are hidden action items', async () => {
    const { getByText, getByRole } = renderInContext(
      <AlertInsights
        group="black-sabbath"
        active={[]}
        snoozed={[
          {
            title: 'Vol. 4',
            subtitle: 'Sabotage',
          },
        ]}
        accepted={[]}
        dismissed={[]}
        onChange={jest.fn()}
      />,
    );

    expect(
      getByText(
        "All of your team's action items are hidden. Maybe it's time to give them another look?",
      ),
    ).toBeInTheDocument();
    expect(getByText('Hidden Action Item')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'expand' }));
    await waitFor(() => getByRole('img', { name: 'snoozed' }));

    expect(getByText('Vol. 4')).toBeInTheDocument();
    expect(getByText('Sabotage')).toBeInTheDocument();
  });
});
