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

import { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import { render, RenderResult } from '@testing-library/react';

// Components using useEffect to perform an asynchronous action (such as fetch) must be rendered within an async
// act call to properly get the final state, even with mocked responses. This utility method makes the signature a bit
// cleaner, since act doesn't return the result of the evaluated function.
// https://github.com/testing-library/react-testing-library/issues/281
// https://github.com/facebook/react/pull/14853
export async function renderWithEffects(
  nodes: ReactElement,
): Promise<RenderResult> {
  let value: RenderResult;
  await act(async () => {
    value = render(nodes);
  });
  // @ts-ignore
  return value;
}
