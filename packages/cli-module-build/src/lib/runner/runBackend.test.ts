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

import { runBackend } from './runBackend';
import spawn from 'cross-spawn';

// Mock external dependencies
jest.mock('chokidar', () => ({
  watch: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    add: jest.fn(),
  })),
}));

jest.mock('cross-spawn', () =>
  jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    once: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    killed: false,
    exitCode: null,
    pid: 12345,
  })),
);

jest.mock('../ipc', () => ({
  IpcServer: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
  })),
  ServerDataStore: {
    bind: jest.fn(),
  },
}));

jest.mock('ctrlc-windows', () => ({
  ctrlc: jest.fn(),
}));

const mockStartEmbeddedDb = jest.fn();
const mockWatchBackendBrowserAssets = jest.fn(
  async (_options: { targetDirs: string[] }) => jest.fn(),
);

jest.mock('../backendBrowserAssets', () => ({
  watchBackendBrowserAssets: (options: { targetDirs: string[] }) =>
    mockWatchBackendBrowserAssets(options),
}));

jest.mock('./startEmbeddedDb', () => ({
  startEmbeddedDb: (...args: any[]) => mockStartEmbeddedDb(...args),
}));

describe('runBackend', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalPlatform: string;
  const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

  beforeEach(() => {
    // Use fake timers to control debounce
    jest.useFakeTimers();

    // Save original environment
    originalEnv = { ...process.env };
    process.env = { NODE_ENV: 'test' };
    originalPlatform = process.platform;

    // Mock process.stdin.on to prevent actual stdin reading
    jest.spyOn(process.stdin, 'on').mockReturnValue(process.stdin);

    // Mock process.once to prevent actual signal handling
    jest.spyOn(process, 'once').mockReturnValue(process);

    mockStartEmbeddedDb.mockReset();
    mockStartEmbeddedDb.mockResolvedValue(undefined);
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });

    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('embedded-postgres support', () => {
    it('should inject config override from startEmbeddedDb when it returns a result', async () => {
      mockStartEmbeddedDb.mockResolvedValue({
        configOverride: {
          client: 'pg',
          connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'password',
            port: 5555,
          },
        },
        close: jest.fn(),
      });

      runBackend({ entry: 'src/index' });
      await jest.advanceTimersByTimeAsync(100);

      expect(mockStartEmbeddedDb).toHaveBeenCalledWith({
        configPaths: undefined,
        targetDir: undefined,
      });
      expect(mockSpawn.mock.calls[0][1]).not.toContain('--no-node-snapshot');
      const spawnEnv = mockSpawn.mock.calls[0][2]?.env as Record<
        string,
        string
      >;
      const injected = JSON.parse(spawnEnv.APP_CONFIG_backend_database);
      expect(injected).toEqual({
        client: 'pg',
        connection: {
          host: 'localhost',
          user: 'postgres',
          password: 'password',
          port: 5555,
        },
      });
    });

    it('should forward configPaths and targetDir to startEmbeddedDb', async () => {
      runBackend({
        entry: 'src/index',
        targetDir: '/root/packages/backend',
        configPaths: ['../../config/local.yaml'],
      });
      await jest.advanceTimersByTimeAsync(100);

      expect(mockStartEmbeddedDb).toHaveBeenCalledWith({
        configPaths: ['../../config/local.yaml'],
        targetDir: '/root/packages/backend',
      });
    });

    it('should not inject config override when startEmbeddedDb returns undefined', async () => {
      mockStartEmbeddedDb.mockResolvedValue(undefined);

      runBackend({ entry: 'src/index' });
      await jest.advanceTimersByTimeAsync(100);

      const spawnEnv = mockSpawn.mock.calls[0][2]?.env as Record<
        string,
        string
      >;
      expect(spawnEnv.APP_CONFIG_backend_database).toBeUndefined();
    });
  });
});
