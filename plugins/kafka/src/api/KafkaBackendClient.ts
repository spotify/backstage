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

import { KafkaApi, ConsumerGroupOffsetsResponse } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export class KafkaBackendClient implements KafkaApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  private async internalGet(path: string): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('kafka')}${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    return await response.json();
  }

  async getConsumerGroupOffsets(
    clusterId: string,
    consumerGroup: string,
  ): Promise<ConsumerGroupOffsetsResponse> {
    return await this.internalGet(
      `/consumers/${clusterId}/${consumerGroup}/offsets`,
    );
  }
}
