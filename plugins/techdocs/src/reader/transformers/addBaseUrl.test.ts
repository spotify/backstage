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

import { createTestShadowDom } from '../../test-utils';
import { addBaseUrl } from '../transformers';
import { TechDocsStorageApi } from '../../api';

const DOC_STORAGE_URL = 'https://example-host.storage.googleapis.com';

const techdocsStorageApi: TechDocsStorageApi = {
  getBaseUrl: jest.fn(() => Promise.resolve(DOC_STORAGE_URL)),
  getEntityDocs: () => new Promise(resolve => resolve('yes!')),
  syncEntityDocs: () => new Promise(resolve => resolve(true)),
  getApiOrigin: jest.fn(),
  getBuilder: jest.fn(),
  getStorageUrl: jest.fn(),
};

const fixture = `
  <html>
    <head>
      <link type="stylesheet" href="astyle.css" />
    </head>
    <body>
      <img src="test.jpg" />
      <script type="javascript" src="script.js"></script>
      <a href="afile.pdf" download>Download Now</a>
    </body>
  </html>
`;

const mockEntityId = {
  kind: '',
  namespace: '',
  name: '',
};
describe('addBaseUrl', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('contains relative paths', () => {
    createTestShadowDom(fixture, {
      preTransformers: [
        addBaseUrl({
          techdocsStorageApi,
          entityId: mockEntityId,
          path: '',
        }),
      ],
      postTransformers: [],
    });

    expect(techdocsStorageApi.getBaseUrl).toHaveBeenNthCalledWith(
      1,
      'test.jpg',
      mockEntityId,
      '',
    );
    expect(techdocsStorageApi.getBaseUrl).toHaveBeenNthCalledWith(
      2,
      'script.js',
      mockEntityId,
      '',
    );
    expect(techdocsStorageApi.getBaseUrl).toHaveBeenNthCalledWith(
      3,
      'astyle.css',
      mockEntityId,
      '',
    );
    expect(techdocsStorageApi.getBaseUrl).toHaveBeenNthCalledWith(
      4,
      'afile.pdf',
      mockEntityId,
      '',
    );
  });

  it('transforms svg img src to data uri', async () => {
    const svgContent = '<svg></svg>';
    const expectedSrc = `data:image/svg+xml;base64,${Buffer.from(
      svgContent,
    ).toString('base64')}`;

    (global.fetch as jest.Mock).mockReturnValue({
      text: jest.fn().mockResolvedValue(svgContent),
    });

    const root = createTestShadowDom('<img id="x" src="test.svg" />', {
      preTransformers: [
        addBaseUrl({
          techdocsStorageApi,
          entityId: mockEntityId,
          path: '',
        }),
      ],
      postTransformers: [],
    });

    await new Promise<void>(done => {
      process.nextTick(() => {
        const actualSrc = root.getElementById('x')?.getAttribute('src');
        expect(expectedSrc).toEqual(actualSrc);
        done();
      });
    });
  });
});
