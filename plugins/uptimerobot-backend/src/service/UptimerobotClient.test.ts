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

import { Monitor } from '../../types';
import { UptimerobotClient } from './UptimerobotClient';

describe('monitorMapper', () => {
  it('should normalize the monitor returned from the API', () => {
    const rawApiResponse: Monitor = {
      id: 123456789,
      friendly_name: 'backstage.io',
      url: 'https://backstage.io',
      type: 1,
      sub_type: '',
      keyword_type: null,
      keyword_value: '',
      http_username: '',
      http_password: '',
      port: '',
      interval: 300,
      status: 2,
      create_datetime: 1568281221,
      custom_uptime_ratio: '100.000-100.000-99.946',
      custom_uptime_ranges:
        '100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000-100.000',
      custom_down_durations: '0-0-1396',
    };

    const apiKey = 'teamA';

    const result = UptimerobotClient.monitorMapper(rawApiResponse, apiKey);
    expect(result).toMatchObject({
      id: rawApiResponse.id,
      apiKey: apiKey,
      friendlyName: rawApiResponse.friendly_name,
      url: rawApiResponse.url,
      status: rawApiResponse.status,
      customUptimeRatio: expect.arrayContaining([expect.any(Number)]),
      customUptimeRanges: expect.arrayContaining([expect.any(Number)]),
    });
  });
});
