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

import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AnalyzeResult } from '../../api';
import { StepPrepareSelectLocations } from './StepPrepareSelectLocations';

describe('<StepPrepareSelectLocations />', () => {
  const analyzeResult = {
    type: 'locations',
    locations: [
      {
        target: 'url',
        entities: [
          {
            kind: 'component',
            namespace: 'default',
            name: 'name',
          },
        ],
      },
      {
        target: 'url-2',
        entities: [
          {
            kind: 'component',
            namespace: 'default',
            name: 'name',
          },
          {
            kind: 'api',
            namespace: 'default',
            name: 'name',
          },
        ],
      },
    ],
  } as Extract<AnalyzeResult, { type: 'locations' }>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without exploding', async () => {
    const { getByRole } = render(
      <StepPrepareSelectLocations
        analyzeResult={analyzeResult}
        onPrepare={() => undefined}
        onGoBack={() => undefined}
      />,
    );

    expect(getByRole('button', { name: /Review/i })).toBeDisabled();
  });

  it('should select and deselect all', async () => {
    const { getByRole, getAllByRole } = render(
      <StepPrepareSelectLocations
        analyzeResult={analyzeResult}
        onPrepare={() => undefined}
        onGoBack={() => undefined}
      />,
    );

    const checkboxes = getAllByRole('checkbox');
    checkboxes.forEach(c => expect(c).not.toBeChecked());
    expect(getByRole('button', { name: /Review/i })).toBeDisabled();

    await act(async () => {
      userEvent.click(getByRole('button', { name: /Select All/i }));
    });

    checkboxes.forEach(c => expect(c).toBeChecked());
    expect(getByRole('button', { name: /Review/i })).not.toBeDisabled();

    await act(async () => {
      userEvent.click(getByRole('button', { name: /Select All/i }));
    });

    checkboxes.forEach(c => expect(c).not.toBeChecked());
    expect(getByRole('button', { name: /Review/i })).toBeDisabled();
  });

  it('should preselect prepared locations', async () => {
    const { getAllByRole } = render(
      <StepPrepareSelectLocations
        analyzeResult={analyzeResult}
        prepareResult={{
          ...analyzeResult,
          locations: [...analyzeResult.locations.slice(0, 1)],
        }}
        onPrepare={() => undefined}
        onGoBack={() => undefined}
      />,
    );

    const checkboxes = getAllByRole('checkbox');

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('should select items', async () => {
    const { getAllByRole } = render(
      <StepPrepareSelectLocations
        analyzeResult={analyzeResult}
        onPrepare={() => undefined}
        onGoBack={() => undefined}
      />,
    );

    const checkboxes = getAllByRole('checkbox');
    checkboxes.forEach(c => expect(c).not.toBeChecked());

    await act(async () => {
      userEvent.click(checkboxes[1]);
    });

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();

    await act(async () => {
      userEvent.click(checkboxes[1]);
    });

    checkboxes.forEach(c => expect(c).not.toBeChecked());
  });

  it('should go back', async () => {
    const onGoBack = jest.fn();

    const { getByRole } = render(
      <StepPrepareSelectLocations
        analyzeResult={analyzeResult}
        onPrepare={() => undefined}
        onGoBack={onGoBack}
      />,
    );

    await act(async () => {
      userEvent.click(getByRole('button', { name: /Back/i }));
    });

    expect(onGoBack).toBeCalledTimes(1);
  });

  it('should submit', async () => {
    const onPrepare = jest.fn();

    const { getAllByRole, getByRole } = render(
      <StepPrepareSelectLocations
        analyzeResult={analyzeResult}
        onPrepare={onPrepare}
        onGoBack={() => undefined}
      />,
    );

    const checkboxes = getAllByRole('checkbox');

    await act(async () => {
      userEvent.click(checkboxes[1]);
    });

    await act(async () => {
      userEvent.click(getByRole('button', { name: /Review/i }));
    });

    expect(onPrepare).toBeCalledTimes(1);
    expect(onPrepare.mock.calls[0][0]).toMatchObject({
      type: 'locations',
      locations: [
        {
          target: 'url',
          entities: [
            {
              kind: 'component',
              namespace: 'default',
              name: 'name',
            },
          ],
        },
      ],
    } as Extract<AnalyzeResult, { type: 'locations' }>);
  });
});
