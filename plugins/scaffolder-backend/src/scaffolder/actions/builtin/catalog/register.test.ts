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

import { PassThrough } from 'stream';
import os from 'os';
import { getVoidLogger } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createCatalogRegisterAction } from './register';
import { Entity } from '@backstage/catalog-model';

describe('catalog:register', () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  const addLocation = jest.fn();
  const catalogClient = {
    addLocation: addLocation,
  };

  const action = createCatalogRegisterAction({
    integrations,
    catalogClient: (catalogClient as unknown) as CatalogApi,
  });

  const mockContext = {
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should reject registrations for locations that does not match any integration', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoContentsUrl: 'https://google.com/foo/bar',
        },
      }),
    ).rejects.toThrow(
      /No integration found for host https:\/\/google.com\/foo\/bar/,
    );
  });

  it('should register location in catalog', async () => {
    addLocation.mockResolvedValue({
      entities: [
        {
          metadata: {
            namespace: 'default',
            name: 'test',
          },
          kind: 'Component',
        } as Entity,
      ],
    });
    await action.handler({
      ...mockContext,
      input: {
        catalogInfoUrl: 'http://foo/var',
      },
    });
    expect(addLocation).toBeCalledWith(
      {
        type: 'url',
        target: 'http://foo/var',
      },
      {},
    );

    expect(mockContext.output).toBeCalledWith(
      'entityRef',
      'Component:default/test',
    );
    expect(mockContext.output).toBeCalledWith(
      'catalogInfoUrl',
      'http://foo/var',
    );
  });
});
