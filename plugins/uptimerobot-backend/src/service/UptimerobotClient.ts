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

import { Config } from '@backstage/config';
import { getUptimeRanges } from '../utils';
import { Groups, Monitor, NormalizedMonitor } from '../../types';
import fetch from 'cross-fetch';

export class UptimerobotClient {
  apiKeys: Map<string, string> = new Map();

  constructor(config: Config) {
    const apiKeys = config.getOptionalConfigArray('uptimerobot.apiKeys');

    if (!apiKeys?.length) {
      throw Error(
        'The UptimeRobot plugin tried to initialize but there are no API keys configured.',
      );
    }

    apiKeys.forEach(item => {
      const name = item.getString('name');
      const key = item.getString('key');
      this.apiKeys.set(name, key);
    });
  }

  async getMonitors(groups: Groups): Promise<NormalizedMonitor[]> {
    const normalizedMonitors = [];

    const groupsArray: { apiKeyName: string; monitors: string[] }[] = [];

    groups.forEach((monitors, apiKeyName) => {
      groupsArray.push({
        apiKeyName,
        monitors,
      });
    });

    const fetches: Promise<Response>[] = [];

    groupsArray.forEach(({ apiKeyName, monitors }) => {
      const apiKey = this.apiKeys.get(apiKeyName);
      if (!apiKey) {
        throw Error(`Couldn't find API key named "${apiKeyName}".`);
      }

      fetches.push(this.createFetch(apiKey, monitors));
    });

    const responses = await Promise.all(fetches);

    for (let i = 0; i < responses.length; i++) {
      const apiKeyName = groupsArray[i].apiKeyName;
      const json = await responses[i].json();
      normalizedMonitors.push(
        ...json.monitors.map((m: Monitor) =>
          UptimerobotClient.monitorMapper(m, apiKeyName),
        ),
      );
    }

    return normalizedMonitors;
  }

  createFetch(apiKey: string, monitors: string[] = []): Promise<Response> {
    const body: { [key: string]: any } = {
      format: 'json',
      custom_uptime_ratios: '1-7-30',
      custom_uptime_ranges: getUptimeRanges(),
      api_key: apiKey,
    };

    if (monitors.length > 0) body.monitors = monitors.join('-');

    return fetch(`https://api.uptimerobot.com/v2/getMonitors`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  static monitorMapper(
    {
      id,
      friendly_name,
      url,
      status,
      custom_uptime_ratio,
      custom_uptime_ranges,
    }: Monitor,
    apiKey: string,
  ): NormalizedMonitor {
    return {
      id,
      apiKey: apiKey,
      friendlyName: friendly_name,
      url,
      status,
      customUptimeRatio: custom_uptime_ratio.split('-').map(parseFloat),
      customUptimeRanges: custom_uptime_ranges.split('-').map(parseFloat),
    };
  }
}
