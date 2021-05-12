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

import { CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { Logger } from 'winston';

export type StatusNumber = 0 | 1 | 2 | 8 | 9;

export interface Monitor {
  id: number;
  friendly_name: string;
  url: string;
  status: StatusNumber;
  custom_uptime_ranges: string;
  custom_uptime_ratio: string;
  [key: string]: unknown;
}

export interface NormalizedMonitor {
  id: number;
  apiKey: string;
  friendlyName: string;
  url: string;
  status: StatusNumber;
  customUptimeRanges: number[];
  customUptimeRatio: number[];
}

export interface RouterOptions {
  catalogClient: CatalogClient;
  config: Config;
  logger: Logger;
}

export type Groups = Map<string, string[]>;
