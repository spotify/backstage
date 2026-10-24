/*
 * Copyright 2022 The Backstage Authors
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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import {
  scaffolderApiRef,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import { DryRunProvider, useDryRun } from '../DryRunContext';
import { DryRunResultsList } from './DryRunResultsList';
import { downloadBlob } from '../../../../lib/download';
import { formDecoratorsApiRef } from '../../../api';

jest.mock('../../../../lib/download', () => ({
  downloadBlob: jest.fn(),
}));

const mockDownloadBlob = downloadBlob as jest.MockedFunction<
  typeof downloadBlob
>;

function DryRunRemote({ execute }: { execute?: number }) {
  const dryRun = useDryRun();

  useEffect(() => {
    if (execute) {
      dryRun.execute({
        templateContent: '',
        values: {},
        files: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return null;
}

const mockApis = [
  [
    scaffolderApiRef,
    {
      dryRun: async () => ({
        directoryContents: [],
        log: [],
        output: {},
        steps: [],
      }),
    },
  ],
  [
    formDecoratorsApiRef,
    {
      getFormDecorators: async () => [],
    },
  ],
] as const;

describe('DryRunResultsList', () => {
  beforeEach(() => {
    mockDownloadBlob.mockClear();
  });

  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={mockApis}>
        <SecretsContextProvider>
          <DryRunProvider>
            <DryRunResultsList />
          </DryRunProvider>
        </SecretsContextProvider>
      </TestApiProvider>,
    );
    expect(rendered.baseElement.querySelector('ul')).toBeEmptyDOMElement();
  });

  it('adds new result items and deletes them', async () => {
    const { rerender } = await renderInTestApp(
      <TestApiProvider apis={mockApis}>
        <SecretsContextProvider>
          <DryRunProvider>
            <DryRunRemote execute={1} />
            <DryRunResultsList />
          </DryRunProvider>
        </SecretsContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText('Result 1')).toBeInTheDocument();
    expect(screen.queryByText('Result 2')).not.toBeInTheDocument();

    await act(async () => {
      rerender(
        <TestApiProvider apis={mockApis}>
          <SecretsContextProvider>
            <DryRunProvider>
              <DryRunRemote execute={2} />
              <DryRunResultsList />
            </DryRunProvider>
          </SecretsContextProvider>
        </TestApiProvider>,
      );
    });

    expect(screen.getByText('Result 1')).toBeInTheDocument();
    expect(screen.getByText('Result 2')).toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('delete')[0]);

    expect(screen.queryByText('Result 1')).not.toBeInTheDocument();
    expect(screen.getByText('Result 2')).toBeInTheDocument();
  });

  it('keeps multi-byte file contents intact in the downloaded zip', async () => {
    const content = '### 🔦 Context — ä';
    const apis = [
      [
        scaffolderApiRef,
        {
          dryRun: async () => ({
            directoryContents: [
              {
                path: 'foo.md',
                base64Content: Buffer.from(content, 'utf8').toString('base64'),
                executable: false,
              },
            ],
            log: [],
            output: {},
            steps: [],
          }),
        },
      ],
      [
        formDecoratorsApiRef,
        {
          getFormDecorators: async () => [],
        },
      ],
    ] as const;

    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <SecretsContextProvider>
          <DryRunProvider>
            <DryRunRemote execute={1} />
            <DryRunResultsList />
          </DryRunProvider>
        </SecretsContextProvider>
      </TestApiProvider>,
    );

    await userEvent.click(await screen.findByLabelText('download'));

    // the click handler is not awaited by the component, and there is no DOM
    // change to find once it settles, so the mock call is the only signal
    await waitFor(() => {
      expect(mockDownloadBlob).toHaveBeenCalled();
    });

    const [blob] = mockDownloadBlob.mock.calls[0];
    const { default: JSZip } = await import('jszip');
    const zip = await JSZip.loadAsync(blob);

    await expect(zip.file('foo.md')!.async('string')).resolves.toBe(content);
  });
});
