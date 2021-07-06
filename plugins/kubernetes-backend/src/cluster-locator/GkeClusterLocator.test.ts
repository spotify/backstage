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

import '@backstage/backend-common';
import { ConfigReader, Config } from '@backstage/config';
import { GkeClusterLocator } from './GkeClusterLocator';

const mockedListClusters = jest.fn();

describe('GkeClusterLocator', () => {
  beforeEach(() => {
    mockedListClusters.mockRestore();
  });
  describe('config-parsing', () => {
    it('should accept missing region', async () => {
      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
      });

      GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      expect(mockedListClusters).toBeCalledTimes(0);
    });
    it('should not accept missing projectId', async () => {
      const config: Config = new ConfigReader({
        type: 'gke',
      });

      expect(() =>
        GkeClusterLocator.fromConfigWithClient(config, {
          listClusters: mockedListClusters,
        } as any),
      ).toThrow("Missing required config value at 'projectId'");

      expect(mockedListClusters).toBeCalledTimes(0);
    });
  });
  describe('listClusters', () => {
    it('empty clusters returns empty cluster details', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([]);
      expect(mockedListClusters).toBeCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('1 cluster returns 1 cluster details', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          authProvider: 'google',
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          skipTLSVerify: false,
        },
      ]);
      expect(mockedListClusters).toBeCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('use region wildcard when no region provided', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          authProvider: 'google',
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          skipTLSVerify: false,
        },
      ]);
      expect(mockedListClusters).toBeCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/-',
      });
    });
    it('2 cluster returns 2 cluster details', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
            {
              name: 'some-other-cluster',
              endpoint: '6.7.8.9',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          authProvider: 'google',
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          skipTLSVerify: false,
        },
        {
          authProvider: 'google',
          name: 'some-other-cluster',
          url: 'https://6.7.8.9',
          skipTLSVerify: false,
        },
      ]);
      expect(mockedListClusters).toBeCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('Handle errors gracefully', async () => {
      mockedListClusters.mockImplementation(() => {
        throw new Error('some error');
      });

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      await expect(sut.getClusters()).rejects.toThrow(
        'There was an error retrieving clusters from GKE for projectId=some-project region=some-region : [some error]',
      );

      expect(mockedListClusters).toBeCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
  });
});
