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

import { MetricKey, SonarUrlProcessorFunc } from './types';
import { createApiRef } from '@backstage/core-plugin-api';

/**
 * Define a type to make sure that all metrics are used
 */
export type Metrics = {
  [key in MetricKey]: string | undefined;
};

export interface FindingSummary {
  lastAnalysis: string;
  metrics: Metrics;
  projectUrl: string;
  getIssuesUrl: SonarUrlProcessorFunc;
  getComponentMeasuresUrl: SonarUrlProcessorFunc;
  getSecurityHotspotsUrl: () => string;
}

export const sonarQubeApiRef = createApiRef<SonarQubeApi>({
  id: 'plugin.sonarqube.service',
  description: 'Used by the SonarQube plugin to make requests',
});

export type SonarQubeApi = {
  getFindingSummary(componentKey?: string): Promise<FindingSummary | undefined>;
};
