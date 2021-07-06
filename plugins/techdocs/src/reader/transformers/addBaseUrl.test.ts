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

import { waitFor } from '@testing-library/react';
import { createTestShadowDom } from '../../test-utils';
import { addBaseUrl } from '../transformers';
import { TechDocsStorageApi } from '../../api';

const DOC_STORAGE_URL = 'https://example-host.storage.googleapis.com';
const API_ORIGIN_URL = 'https://backstage.example.com/api/techdocs';

const techdocsStorageApi: TechDocsStorageApi = {
  getBaseUrl: jest.fn(o =>
    Promise.resolve(new URL(o, DOC_STORAGE_URL).toString()),
  ),
  getEntityDocs: () => new Promise(resolve => resolve('yes!')),
  syncEntityDocs: () => new Promise(resolve => resolve('updated')),
  getApiOrigin: jest.fn(() => new Promise(resolve => resolve(API_ORIGIN_URL))),
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

  it('inlines svg img src to data uri', async () => {
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

    await waitFor(() => {
      const actualSrc = root.getElementById('x')?.getAttribute('src');
      expect(expectedSrc).toEqual(actualSrc);
    });
  });

  it('inlines absolute url svgs pointed at our backend', async () => {
    const svgContent = '<svg></svg>';
    const expectedSrc = `data:image/svg+xml;base64,${Buffer.from(
      svgContent,
    ).toString('base64')}`;

    (global.fetch as jest.Mock).mockReturnValue({
      text: jest.fn().mockResolvedValue(svgContent),
    });

    const root = createTestShadowDom(
      `<img id="x" src="${API_ORIGIN_URL}/test.svg" />`,
      {
        preTransformers: [
          addBaseUrl({
            techdocsStorageApi,
            entityId: mockEntityId,
            path: '',
          }),
        ],
        postTransformers: [],
      },
    );

    await waitFor(() => {
      const actualSrc = root.getElementById('x')?.getAttribute('src');
      expect(expectedSrc).toEqual(actualSrc);
      expect(global.fetch).toHaveBeenCalledWith(`${API_ORIGIN_URL}/test.svg`, {
        credentials: 'include',
      });
    });
  });

  it('does not inline external svgs', async () => {
    const expectedSrc = 'https://example.com/test.svg';
    const root = createTestShadowDom(`<img id="x" src="${expectedSrc}" />`, {
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
        const actualElem = root.getElementById('x');
        expect(actualElem?.getAttribute('src')).toEqual(expectedSrc);
        expect(actualElem?.getAttribute('alt')).toEqual(null);
        done();
      });
    });
  });
});
