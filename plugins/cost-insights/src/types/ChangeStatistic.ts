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

export interface ChangeStatistic {
  // The ratio of change from one duration to another, expressed as: (newSum - oldSum) / oldSum
  // If a ratio cannot be calculated - such as when a new or old sum is zero,
  // the ratio can be omitted and where applicable, ∞ or -∞ will display based on amount.
  ratio?: number;
  // The actual USD change between time periods (can be negative if costs decreased)
  amount: number;
}

export const EngineerThreshold = 0.5;

export enum ChangeThreshold {
  upper = 0.05,
  lower = -0.05,
}

export enum GrowthType {
  Negligible,
  Savings,
  Excess,
}
