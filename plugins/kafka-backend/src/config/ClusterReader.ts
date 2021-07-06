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
import { ClusterDetails, SslConfig, SaslConfig } from '../types/types';

export function getClusterDetails(config: Config[]): ClusterDetails[] {
  return config.map(clusterConfig => {
    const clusterDetails = {
      name: clusterConfig.getString('name'),
      brokers: clusterConfig.getStringArray('brokers'),
    };
    const ssl = clusterConfig.getOptional('ssl') as SslConfig;
    const sasl = clusterConfig.getOptional('sasl') as SaslConfig;

    return {
      ...clusterDetails,
      ...(ssl ? { ssl } : {}),
      ...(sasl ? { sasl } : {}),
    };
  });
}
