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

import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { checkoutGitRepository } from '../../helpers';
import { CommonGitPreparer } from './commonGit';

function normalizePath(path: string) {
  return path
    .replace(/^[a-z]:/i, '')
    .split('\\')
    .join('/');
}

jest.mock('../../helpers', () => ({
  ...jest.requireActual<{}>('../../helpers'),
  checkoutGitRepository: jest.fn(() => '/tmp/backstage-repo/org/name/branch'),
  getLastCommitTimestamp: jest.fn(() => 12345678),
}));

const createMockEntity = (annotations = {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      annotations: {
        ...annotations,
      },
    },
  };
};

const mockConfig = new ConfigReader({});

const logger = getVoidLogger();

describe('commonGit preparer', () => {
  it('should prepare temp docs path from github repo', async () => {
    const preparer = new CommonGitPreparer(mockConfig, logger);

    const mockEntity = createMockEntity({
      'backstage.io/techdocs-ref':
        'github:https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component',
    });

    const { preparedDir } = await preparer.prepare(mockEntity);
    expect(checkoutGitRepository).toHaveBeenCalledTimes(1);
    expect(normalizePath(preparedDir)).toEqual(
      '/tmp/backstage-repo/org/name/branch/plugins/techdocs-backend/examples/documented-component',
    );
  });

  it('should prepare temp docs path from gitlab repo', async () => {
    const preparer = new CommonGitPreparer(mockConfig, logger);

    const mockEntity = createMockEntity({
      'backstage.io/techdocs-ref':
        'gitlab:https://gitlab.com/xesjkeee/go-logger/blob/master/catalog-info.yaml',
    });

    const { preparedDir } = await preparer.prepare(mockEntity);
    expect(checkoutGitRepository).toHaveBeenCalledTimes(2);
    expect(normalizePath(preparedDir)).toEqual(
      '/tmp/backstage-repo/org/name/branch/catalog-info.yaml',
    );
  });

  it('should prepare temp docs path from azure repo', async () => {
    const preparer = new CommonGitPreparer(mockConfig, logger);

    const mockEntity = createMockEntity({
      'backstage.io/techdocs-ref':
        'azure/api:https://dev.azure.com/backstage-org/backstage-project/_git/template-repo?path=%2Ftemplate.yaml',
    });

    const { preparedDir } = await preparer.prepare(mockEntity);
    expect(checkoutGitRepository).toHaveBeenCalledTimes(3);
    expect(normalizePath(preparedDir)).toEqual(
      '/tmp/backstage-repo/org/name/branch/template.yaml',
    );
  });
});
