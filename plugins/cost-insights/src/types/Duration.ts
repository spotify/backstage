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

/**
 * Time periods for cost comparison; slight abuse of ISO 8601 periods. We take P3M to mean
 * 'last completed quarter', and P30D/P90D to be '[month|quarter] relative to today'. So if
 * it's September 15, P3M represents costs for Q2 and P30D represents August 16 -
 * September 15.
 */
export enum Duration {
  P7D = 'P7D',
  P30D = 'P30D',
  P90D = 'P90D',
  P3M = 'P3M',
}

export const DEFAULT_DATE_FORMAT = 'yyyy-LL-dd';
