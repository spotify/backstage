/*
 * Copyright 2021 The Backstage Authors
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

import { LinearProgressWithLabel, testables } from './LinearProgressWithLabel';
import { TEST_IDS } from '../../test-helpers/test-ids';

const { ICONS } = testables;

describe('LinearProgressWithLabel', () => {
  it('should render 50% progress without CompletionEmoji', () => {
    const progress = 50;

    const { container, getByTestId } = render(
      <LinearProgressWithLabel
        progress={progress}
        responseSteps={[
          { message: 'mock_response_step_message', icon: 'success' },
        ]}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.linearProgressWithLabel).getAttribute(
        'style',
      ),
    ).toContain(`font-size: 141%`);
    expect(container.innerHTML).toContain(`${progress}%`);
    expect(container.innerHTML).not.toContain(ICONS.SUCCESS);
    expect(container.innerHTML).not.toContain(ICONS.FAILURE);
  });

  it('should render 100% progress with CompletionEmoji for success', () => {
    const progress = 100;

    const { container, getByTestId } = render(
      <LinearProgressWithLabel
        progress={progress}
        responseSteps={[
          { message: 'mock_response_step_message', icon: 'success' },
        ]}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.linearProgressWithLabel).getAttribute(
        'style',
      ),
    ).toContain(`font-size: 157%`);
    expect(container.innerHTML).toContain(`${progress}%`);
    expect(container.innerHTML).toContain(ICONS.SUCCESS);
    expect(container.innerHTML).not.toContain(ICONS.FAILURE);
  });

  it('should render 100% progress with CompletionEmoji for failure if at least one failed response step is present', () => {
    const progress = 100;

    const { container } = render(
      <LinearProgressWithLabel
        progress={progress}
        responseSteps={[
          { message: 'does not matter', icon: 'success' },
          { message: 'mock_response_step_message', icon: 'failure' },
          { message: 'does not matter', icon: 'success' },
        ]}
      />,
    );

    expect(container.innerHTML).toContain(`${progress}%`);
    expect(container.innerHTML).toContain(ICONS.FAILURE);
    expect(container.innerHTML).not.toContain(ICONS.SUCCESS);
  });

  it('should round > 100 progress to 100', () => {
    const progress = 101;

    const { container } = render(
      <LinearProgressWithLabel
        progress={progress}
        responseSteps={[{ message: 'mock_response_step_message' }]}
      />,
    );

    expect(container.innerHTML).toContain('100%');
    expect(container.innerHTML).toContain(ICONS.SUCCESS);
    expect(container.innerHTML).not.toContain(ICONS.FAILURE);
    expect(container.innerHTML).not.toContain(`${progress}%`);
  });
});
