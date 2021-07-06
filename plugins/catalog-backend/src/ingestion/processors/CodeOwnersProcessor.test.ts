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
import { LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { CodeOwnersProcessor } from './CodeOwnersProcessor';

const mockCodeOwnersText = () => `
*       @acme/team-foo @acme/team-bar
/docs   @acme/team-bar
`;

describe('CodeOwnersProcessor', () => {
  const mockLocation = ({
    basePath = '',
    type = 'github',
  } = {}): LocationSpec => ({
    type,
    target: `https://github.com/backstage/backstage/blob/master/${basePath}catalog-info.yaml`,
  });

  const mockReadResult = ({
    error = undefined,
    data = undefined,
  }: {
    error?: string;
    data?: string;
  } = {}) => {
    if (error) {
      throw Error(error);
    }
    return data;
  };

  describe('preProcessEntity', () => {
    const setupTest = ({ kind = 'Component', spec = {} } = {}) => {
      const entity = { kind, spec };
      const read = jest
        .fn()
        .mockResolvedValue(mockReadResult({ data: mockCodeOwnersText() }));

      const config = new ConfigReader({});
      const reader = { read, readTree: jest.fn(), search: jest.fn() };
      const processor = CodeOwnersProcessor.fromConfig(config, {
        logger: getVoidLogger(),
        reader,
      });

      return { entity, processor, read };
    };

    it('should not modify existing owner', async () => {
      const { entity, processor } = setupTest({
        spec: { owner: '@acme/foo-team' },
      });

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual(entity);
    });

    it('should ingore invalid locations type', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation({ type: 'github-org' }),
      );

      expect(result).toEqual(entity);
    });

    it('should ignore invalid kinds', async () => {
      const { entity, processor } = setupTest({ kind: 'Group' });

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual(entity);
    });

    it('should set owner from codeowner', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.preProcessEntity(
        entity as any,
        mockLocation(),
      );

      expect(result).toEqual({
        ...entity,
        spec: { owner: 'team-foo' },
      });
    });
  });
});
