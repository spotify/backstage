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

import { getVoidLogger } from '@backstage/backend-common';
import waitForExpect from 'wait-for-expect';
import { DefaultProcessingDatabase } from './database/DefaultProcessingDatabase';
import { DefaultCatalogProcessingEngine } from './DefaultCatalogProcessingEngine';
import { CatalogProcessingOrchestrator } from './processing/types';
import { Stitcher } from './stitching/Stitcher';

describe('DefaultCatalogProcessingEngine', () => {
  const db = ({
    transaction: jest.fn(),
    getProcessableEntities: jest.fn(),
    updateProcessedEntity: jest.fn(),
  } as unknown) as jest.Mocked<DefaultProcessingDatabase>;
  const orchestrator: jest.Mocked<CatalogProcessingOrchestrator> = {
    process: jest.fn(),
  };
  const stitcher = ({
    stitch: jest.fn(),
  } as unknown) as jest.Mocked<Stitcher>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should process stuff', async () => {
    orchestrator.process.mockResolvedValue({
      ok: true,
      completedEntity: {
        apiVersion: '1',
        kind: 'Location',
        metadata: { name: 'test' },
      },
      relations: [],
      errors: [],
      deferredEntities: [],
      state: new Map(),
    });
    const engine = new DefaultCatalogProcessingEngine(
      getVoidLogger(),
      [],
      db,
      orchestrator,
      stitcher,
    );

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    db.getProcessableEntities
      .mockImplementation(async () => {
        await engine.stop();
        return { items: [] };
      })
      .mockResolvedValueOnce({
        items: [
          {
            entityRef: 'foo',
            id: '1',
            unprocessedEntity: {
              apiVersion: '1',
              kind: 'Location',
              metadata: { name: 'test' },
            },
            state: new Map(),
            nextUpdateAt: '',
            lastDiscoveryAt: '',
          },
        ],
      });

    await engine.start();
    await waitForExpect(() => {
      expect(orchestrator.process).toBeCalledTimes(1);
      expect(orchestrator.process).toBeCalledWith({
        entity: {
          apiVersion: '1',
          kind: 'Location',
          metadata: { name: 'test' },
        },
        state: expect.anything(),
      });
    });
    await engine.stop();
  });

  it('should process stuff even if the first attempt fail', async () => {
    orchestrator.process.mockResolvedValue({
      ok: true,
      completedEntity: {
        apiVersion: '1',
        kind: 'Location',
        metadata: { name: 'test' },
      },
      relations: [],
      errors: [],
      deferredEntities: [],
      state: new Map(),
    });
    const engine = new DefaultCatalogProcessingEngine(
      getVoidLogger(),
      [],
      db,
      orchestrator,
      stitcher,
    );

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    db.getProcessableEntities
      .mockImplementation(async () => {
        await engine.stop();
        return { items: [] };
      })
      .mockRejectedValueOnce(new Error('I FAILED'))
      .mockResolvedValueOnce({
        items: [
          {
            entityRef: 'foo',
            id: '1',
            unprocessedEntity: {
              apiVersion: '1',
              kind: 'Location',
              metadata: { name: 'test' },
            },
            state: new Map(),
            nextUpdateAt: '',
            lastDiscoveryAt: '',
          },
        ],
      });

    await engine.start();
    await waitForExpect(() => {
      expect(orchestrator.process).toBeCalledTimes(1);
      expect(orchestrator.process).toBeCalledWith({
        entity: {
          apiVersion: '1',
          kind: 'Location',
          metadata: { name: 'test' },
        },
        state: expect.anything(),
      });
    });
    await engine.stop();
  });
});
