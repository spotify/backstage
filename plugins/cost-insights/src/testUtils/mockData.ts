/*
 * Copyright 2020 Spotify AB
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

import { DateAggregation, Entity } from '../types';

export const MockAggregatedDailyCosts: DateAggregation[] = [
  {
    date: '2020-08-07',
    amount: 3500,
  },
  {
    date: '2020-08-06',
    amount: 2500,
  },
  {
    date: '2020-08-05',
    amount: 1400,
  },
  {
    date: '2020-08-04',
    amount: 3800,
  },
  {
    date: '2020-08-09',
    amount: 1900,
  },
  {
    date: '2020-08-08',
    amount: 2400,
  },
  {
    date: '2020-08-03',
    amount: 4000,
  },
  {
    date: '2020-08-02',
    amount: 3700,
  },
  {
    date: '2020-08-01',
    amount: 2500,
  },
  {
    date: '2020-08-18',
    amount: 4300,
  },
  {
    date: '2020-08-17',
    amount: 1500,
  },
  {
    date: '2020-08-16',
    amount: 3600,
  },
  {
    date: '2020-08-15',
    amount: 2200,
  },
  {
    date: '2020-08-19',
    amount: 3900,
  },
  {
    date: '2020-08-10',
    amount: 4100,
  },
  {
    date: '2020-08-14',
    amount: 3600,
  },
  {
    date: '2020-08-13',
    amount: 2900,
  },
  {
    date: '2020-08-12',
    amount: 2700,
  },
  {
    date: '2020-08-11',
    amount: 5100,
  },
  {
    date: '2020-09-19',
    amount: 1200,
  },
  {
    date: '2020-09-18',
    amount: 6500,
  },
  {
    date: '2020-09-17',
    amount: 2500,
  },
  {
    date: '2020-09-16',
    amount: 1400,
  },
  {
    date: '2020-09-11',
    amount: 2300,
  },
  {
    date: '2020-09-10',
    amount: 1900,
  },
  {
    date: '2020-09-15',
    amount: 3100,
  },
  {
    date: '2020-09-14',
    amount: 4500,
  },
  {
    date: '2020-09-13',
    amount: 3300,
  },
  {
    date: '2020-09-12',
    amount: 2800,
  },
  {
    date: '2020-09-29',
    amount: 2600,
  },
  {
    date: '2020-09-28',
    amount: 4100,
  },
  {
    date: '2020-09-27',
    amount: 3800,
  },
  {
    date: '2020-09-22',
    amount: 3700,
  },
  {
    date: '2020-09-21',
    amount: 2700,
  },
  {
    date: '2020-09-20',
    amount: 2200,
  },
  {
    date: '2020-09-26',
    amount: 3300,
  },
  {
    date: '2020-09-25',
    amount: 4000,
  },
  {
    date: '2020-09-24',
    amount: 3800,
  },
  {
    date: '2020-09-23',
    amount: 4100,
  },
  {
    date: '2020-08-29',
    amount: 4400,
  },
  {
    date: '2020-08-28',
    amount: 5000,
  },
  {
    date: '2020-08-27',
    amount: 4900,
  },
  {
    date: '2020-08-26',
    amount: 4100,
  },
  {
    date: '2020-08-21',
    amount: 3700,
  },
  {
    date: '2020-08-20',
    amount: 2200,
  },
  {
    date: '2020-08-25',
    amount: 1700,
  },
  {
    date: '2020-08-24',
    amount: 2100,
  },
  {
    date: '2020-08-23',
    amount: 3100,
  },
  {
    date: '2020-08-22',
    amount: 1500,
  },
  {
    date: '2020-09-08',
    amount: 2900,
  },
  {
    date: '2020-09-07',
    amount: 4100,
  },
  {
    date: '2020-09-06',
    amount: 3600,
  },
  {
    date: '2020-09-05',
    amount: 3300,
  },
  {
    date: '2020-09-09',
    amount: 2800,
  },
  {
    date: '2020-08-31',
    amount: 3400,
  },
  {
    date: '2020-08-30',
    amount: 4300,
  },
  {
    date: '2020-09-04',
    amount: 6100,
  },
  {
    date: '2020-09-03',
    amount: 2500,
  },
  {
    date: '2020-09-02',
    amount: 4900,
  },
  {
    date: '2020-09-01',
    amount: 6100,
  },
  {
    date: '2020-09-30',
    amount: 5500,
  },
];

export const MockBigQueryInsights: Entity = {
  id: 'bigQuery',
  aggregation: [10_000, 30_000],
  change: {
    ratio: 3,
    amount: 20_000,
  },
  entities: {
    dataset: [
      {
        id: 'dataset-a',
        aggregation: [5_000, 10_000],
        change: {
          ratio: 1,
          amount: 5_000,
        },
        entities: {},
      },
      {
        id: 'dataset-b',
        aggregation: [5_000, 10_000],
        change: {
          ratio: 1,
          amount: 5_000,
        },
        entities: {},
      },
      {
        id: 'dataset-c',
        aggregation: [0, 10_000],
        change: {
          amount: 10_000,
        },
        entities: {},
      },
    ],
  },
};

export const MockCloudDataflowInsights: Entity = {
  id: 'cloudDataflow',
  aggregation: [100_000, 158_000],
  change: {
    ratio: 0.58,
    amount: 58_000,
  },
  entities: {
    pipeline: [
      {
        id: null,
        aggregation: [10_000, 12_000],
        change: {
          ratio: 0.2,
          amount: 2_000,
        },
        entities: {
          SKU: [
            {
              id: 'Mock SKU A',
              aggregation: [3_000, 4_000],
              change: {
                ratio: 0.333333,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU B',
              aggregation: [7_000, 8_000],
              change: {
                ratio: 0.14285714,
                amount: 1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'pipeline-a',
        aggregation: [60_000, 70_000],
        change: {
          ratio: 0.16666666666666666,
          amount: 10_000,
        },
        entities: {
          SKU: [
            {
              id: 'Mock SKU A',
              aggregation: [20_000, 15_000],
              change: {
                ratio: -0.25,
                amount: -5_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU B',
              aggregation: [30_000, 35_000],
              change: {
                ratio: -0.16666666666666666,
                amount: -5_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU C',
              aggregation: [10_000, 20_000],
              change: {
                ratio: 1,
                amount: 10_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'pipeline-b',
        aggregation: [12_000, 8_000],
        change: {
          ratio: -0.33333,
          amount: -4_000,
        },
        entities: {
          SKU: [
            {
              id: 'Mock SKU A',
              aggregation: [4_000, 4_000],
              change: {
                ratio: 0,
                amount: 0,
              },
              entities: {},
            },
            {
              id: 'Mock SKU B',
              aggregation: [8_000, 4_000],
              change: {
                ratio: -0.5,
                amount: -4_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'pipeline-c',
        aggregation: [0, 10_000],
        change: {
          amount: 10_000,
        },
        entities: {},
      },
    ],
  },
};

export const MockCloudStorageInsights: Entity = {
  id: 'cloudStorage',
  aggregation: [45_000, 45_000],
  change: {
    ratio: 0,
    amount: 0,
  },
  entities: {
    bucket: [
      {
        id: 'bucket-a',
        aggregation: [15_000, 20_000],
        change: {
          ratio: 0.333,
          amount: 5_000,
        },
        entities: {
          SKU: [
            {
              id: 'Mock SKU A',
              aggregation: [10_000, 11_000],
              change: {
                ratio: 0.1,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU B',
              aggregation: [2_000, 5_000],
              change: {
                ratio: 1.5,
                amount: 3_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU C',
              aggregation: [3_000, 4_000],
              change: {
                ratio: 0.3333,
                amount: 1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'bucket-b',
        aggregation: [30_000, 25_000],
        change: {
          ratio: -0.16666,
          amount: -5_000,
        },
        entities: {
          SKU: [
            {
              id: 'Mock SKU A',
              aggregation: [12_000, 13_000],
              change: {
                ratio: 0.08333333333333333,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU B',
              aggregation: [16_000, 12_000],
              change: {
                ratio: -0.25,
                amount: -4_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU C',
              aggregation: [2_000, 0],
              change: {
                amount: -2000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'bucket-c',
        aggregation: [0, 0],
        change: {
          amount: 0,
        },
        entities: {},
      },
    ],
  },
};

export const MockComputeEngineInsights: Entity = {
  id: 'computeEngine',
  aggregation: [80_000, 90_000],
  change: {
    ratio: 0.125,
    amount: 10_000,
  },
  entities: {
    service: [
      {
        id: 'service-a',
        aggregation: [20_000, 10_000],
        change: {
          ratio: -0.5,
          amount: -10_000,
        },
        entities: {
          SKU: [
            {
              id: 'Mock SKU A',
              aggregation: [4_000, 2_000],
              change: {
                ratio: -0.5,
                amount: -2_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU B',
              aggregation: [7_000, 6_000],
              change: {
                ratio: -0.14285714285714285,
                amount: -1_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU C',
              aggregation: [9_000, 2_000],
              change: {
                ratio: -0.7777777777777778,
                amount: -7000,
              },
              entities: {},
            },
          ],
          deployment: [
            {
              id: 'Compute Engine',
              aggregation: [7_000, 6_000],
              change: {
                ratio: -0.5,
                amount: -2_000,
              },
              entities: {},
            },
            {
              id: 'Kubernetes',
              aggregation: [4_000, 2_000],
              change: {
                ratio: -0.14285714285714285,
                amount: -1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'service-b',
        aggregation: [10_000, 20_000],
        change: {
          ratio: 1,
          amount: 10_000,
        },
        entities: {
          SKU: [
            {
              id: 'Mock SKU A',
              aggregation: [1_000, 2_000],
              change: {
                ratio: 1,
                amount: 1_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU B',
              aggregation: [4_000, 8_000],
              change: {
                ratio: 1,
                amount: 4_000,
              },
              entities: {},
            },
            {
              id: 'Mock SKU C',
              aggregation: [5_000, 10_000],
              change: {
                ratio: 1,
                amount: 5_000,
              },
              entities: {},
            },
          ],
          deployment: [
            {
              id: 'Compute Engine',
              aggregation: [7_000, 6_000],
              change: {
                ratio: -0.5,
                amount: -2_000,
              },
              entities: {},
            },
            {
              id: 'Kubernetes',
              aggregation: [4_000, 2_000],
              change: {
                ratio: -0.14285714285714285,
                amount: -1_000,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'service-c',
        aggregation: [0, 10_000],
        change: {
          amount: 10_000,
        },
        entities: {},
      },
    ],
  },
};

export const MockEventsInsights: Entity = {
  id: 'events',
  aggregation: [20_000, 10_000],
  change: {
    ratio: -0.5,
    amount: -10_000,
  },
  entities: {
    event: [
      {
        id: 'event-a',
        aggregation: [15_000, 7_000],
        change: {
          ratio: -0.53333333333,
          amount: -8_000,
        },
        entities: {
          product: [
            {
              id: 'Mock Product A',
              aggregation: [5_000, 2_000],
              change: {
                ratio: -0.6,
                amount: -3_000,
              },
              entities: {},
            },
            {
              id: 'Mock Product B',
              aggregation: [7_000, 2_500],
              change: {
                ratio: -0.64285714285,
                amount: -4_500,
              },
              entities: {},
            },
            {
              id: 'Mock Product C',
              aggregation: [3_000, 2_500],
              change: {
                ratio: -0.16666666666,
                amount: -500,
              },
              entities: {},
            },
          ],
        },
      },
      {
        id: 'event-b',
        aggregation: [5_000, 3_000],
        change: {
          ratio: -0.4,
          amount: -2_000,
        },
        entities: {
          product: [
            {
              id: 'Mock Product A',
              aggregation: [2_000, 1_000],
              change: {
                ratio: -0.5,
                amount: -1_000,
              },
              entities: {},
            },
            {
              id: 'Mock Product B',
              aggregation: [1_000, 1_500],
              change: {
                ratio: 0.5,
                amount: 500,
              },
              entities: {},
            },
            {
              id: 'Mock Product C',
              aggregation: [2_000, 500],
              change: {
                ratio: -0.75,
                amount: -1_500,
              },
              entities: {},
            },
          ],
        },
      },
    ],
  },
};
