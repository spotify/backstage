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

import { Config } from '@backstage/config';
import { ClusterDetails } from '../types/types';
import { ConfigClusterLocator } from './ConfigClusterLocator';
import { GkeClusterLocator } from './GkeClusterLocator';

export const getCombinedClusterDetails = async (
  rootConfig: Config,
): Promise<ClusterDetails[]> => {
  return Promise.all(
    rootConfig
      .getConfigArray('kubernetes.clusterLocatorMethods')
      .map(clusterLocatorMethod => {
        const type = clusterLocatorMethod.getString('type');
        switch (type) {
          case 'config':
            return ConfigClusterLocator.fromConfig(
              clusterLocatorMethod,
            ).getClusters();
          case 'gke':
            return GkeClusterLocator.fromConfig(
              clusterLocatorMethod,
            ).getClusters();
          default:
            throw new Error(
              `Unsupported kubernetes.clusterLocatorMethods: "${type}"`,
            );
        }
      }),
  )
    .then(res => {
      return res.flat();
    })
    .catch(e => {
      throw e;
    });
};
