/*
 * Copyright 2021 Spotify AB
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
jest.mock('./helpers');

import { getVoidLogger, UrlReader } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import mock from 'mock-fs';
import os from 'os';
import { resolve as resolvePath } from 'path';
import { PassThrough } from 'stream';
import { Templaters } from '../../../stages/templater';
import { createFetchCookiecutterAction } from './cookiecutter';
import { fetchContents } from './helpers';

describe('fetch:cookiecutter', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        azure: [
          { host: 'dev.azure.com', token: 'tokenlols' },
          { host: 'myazurehostnotoken.com' },
        ],
      },
    }),
  );

  const templaters = new Templaters();
  const cookiecutterTemplater = { run: jest.fn() };
  const mockTmpDir = os.tmpdir();
  const mockContext = {
    input: {
      url: 'https://google.com/cookie/cutter',
      targetPath: 'something',
      values: {
        help: 'me',
      },
    },
    baseUrl: 'somebase',
    workspacePath: mockTmpDir,
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn().mockResolvedValue(mockTmpDir),
  };

  const mockReader: UrlReader = {
    read: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  const action = createFetchCookiecutterAction({
    integrations,
    templaters,
    reader: mockReader,
  });

  templaters.register('cookiecutter', cookiecutterTemplater);

  beforeEach(() => {
    mock({ [`${mockContext.workspacePath}/result`]: {} });
    jest.restoreAllMocks();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should call fetchContents with the correct values', async () => {
    await action.handler(mockContext);

    expect(fetchContents).toHaveBeenCalledWith({
      reader: mockReader,
      integrations,
      baseUrl: mockContext.baseUrl,
      fetchUrl: mockContext.input.url,
      outputPath: resolvePath(
        mockContext.workspacePath,
        `template/{{cookiecutter and 'contents'}}`,
      ),
    });
  });

  it('should execute the cookiecutter templater with the correct values', async () => {
    await action.handler(mockContext);

    expect(cookiecutterTemplater.run).toHaveBeenCalledWith({
      workspacePath: mockTmpDir,
      logStream: mockContext.logStream,
      values: mockContext.input.values,
    });
  });

  it('should execute the cookiecutter templater with optional inputs if they are present and valid', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        copyWithoutRender: ['goreleaser.yml'],
        extensions: [
          'jinja2_custom_filters_extension.string_filters_extension.StringFilterExtension',
        ],
        imageName: 'foo/cookiecutter-image-with-extensions',
      },
    });

    expect(cookiecutterTemplater.run).toHaveBeenCalledWith({
      workspacePath: mockTmpDir,
      logStream: mockContext.logStream,
      values: {
        ...mockContext.input.values,
        _copy_without_render: ['goreleaser.yml'],
        _extensions: [
          'jinja2_custom_filters_extension.string_filters_extension.StringFilterExtension',
        ],
        imageName: 'foo/cookiecutter-image-with-extensions',
      },
    });
  });

  it('should throw if copyWithoutRender is not an Array', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          copyWithoutRender: 'xyz',
        },
      }),
    ).rejects.toThrow(/copyWithoutRender must be an Array/);
  });

  it('should throw if extensions is not an Array', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          extensions: 'xyz',
        },
      }),
    ).rejects.toThrow(/extensions must be an Array/);
  });

  it('should throw if there is no cookiecutter templater initialized', async () => {
    const templatersWithoutCookiecutter = new Templaters();

    const newAction = createFetchCookiecutterAction({
      integrations,
      templaters: templatersWithoutCookiecutter,
      reader: mockReader,
    });

    await expect(newAction.handler(mockContext)).rejects.toThrow(
      /No templater registered/,
    );
  });

  it('should throw if the target directory is outside of the workspace path', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          targetPath: '/foo',
        },
      }),
    ).rejects.toThrow(
      /targetPath may not specify a path outside the working directory/,
    );
  });
});
