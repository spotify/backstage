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

import {
  clearStylesheetEventListeners,
  createTestShadowDom,
  executeStylesheetEventListeners,
  mockStylesheetEventListener,
} from '../../test-utils';
import { onCssReady } from './onCssReady';

const docStorageUrl: string =
  'https://techdocs-mock-sites.storage.googleapis.com';

const fixture = `
  <link rel="stylesheet" href="${docStorageUrl}/test.css" />
  <link rel="stylesheet" href="http://example.com/test.css" />
`;

describe('onCssReady', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockStylesheetEventListener(100);
  });

  afterEach(() => {
    clearStylesheetEventListeners();
  });

  it('does not call onLoading and onLoaded without the onCssReady transformer', async () => {
    const onLoading = jest.fn();
    const onLoaded = jest.fn();

    await createTestShadowDom(fixture, {
      preTransformers: [],
      postTransformers: [],
    });

    expect(onLoading).not.toHaveBeenCalled();
    executeStylesheetEventListeners();
    expect(onLoaded).not.toHaveBeenCalled();
  });

  it('calls the onLoading and onLoaded correctly', async () => {
    const onLoading = jest.fn();
    const onLoaded = jest.fn();

    await createTestShadowDom(fixture, {
      preTransformers: [],
      postTransformers: [
        onCssReady({
          docStorageUrl,
          onLoading,
          onLoaded,
        }),
      ],
    });

    expect(onLoading).toHaveBeenCalledTimes(1);
    expect(onLoading).toHaveBeenCalledWith(expect.any(Element));
    expect(onLoaded).not.toHaveBeenCalled();

    executeStylesheetEventListeners();

    expect(onLoaded).toHaveBeenCalledTimes(1);
    expect(onLoaded).toHaveBeenCalledWith(expect.any(Element));
  });
});
