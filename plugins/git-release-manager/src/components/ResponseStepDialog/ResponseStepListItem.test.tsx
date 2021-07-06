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

import { ResponseStepListItem } from './ResponseStepListItem';
import { TEST_IDS } from '../../test-helpers/test-ids';

describe('ResponseStepListItem', () => {
  it('should render', () => {
    const { getByTestId } = render(
      <ResponseStepListItem
        index={0}
        responseStep={{ message: 'mock_response_step_message' }}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.responseStepListItem),
    ).toBeInTheDocument();
  });

  it('should render success icon', () => {
    const { getByTestId } = render(
      <ResponseStepListItem
        index={0}
        responseStep={{
          message: 'mock_response_step_message',
          icon: 'success',
        }}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.responseStepListItemIconSuccess),
    ).toBeInTheDocument();
  });

  it('should render failure icon', () => {
    const { getByTestId } = render(
      <ResponseStepListItem
        index={0}
        responseStep={{
          message: 'mock_response_step_message',
          icon: 'failure',
        }}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.responseStepListItemIconFailure),
    ).toBeInTheDocument();
  });

  it('should render link icon', () => {
    const { getByTestId } = render(
      <ResponseStepListItem
        index={0}
        responseStep={{
          message: 'mock_response_step_message',
          link: 'http://example.com',
        }}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.responseStepListItemIconLink),
    ).toBeInTheDocument();
  });

  it('should render default icon', () => {
    const { getByTestId } = render(
      <ResponseStepListItem
        index={0}
        responseStep={{ message: 'mock_response_step_message' }}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.responseStepListItemIconDefault),
    ).toBeInTheDocument();
  });
});
