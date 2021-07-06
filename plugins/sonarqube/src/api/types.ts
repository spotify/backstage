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

export interface ComponentWrapper {
  component: Component;
}

export interface Component {
  analysisDate: string;
}

export interface MeasuresWrapper {
  measures: Measure[];
}

export type MetricKey =
  // alert status
  | 'alert_status'

  // bugs and rating (-> reliability)
  | 'bugs'
  | 'reliability_rating'

  // vulnerabilities and rating (-> security)
  | 'vulnerabilities'
  | 'security_rating'

  // code smells and rating (-> maintainability)
  | 'code_smells'
  | 'sqale_rating'

  // security hotspots
  | 'security_hotspots_reviewed'
  | 'security_review_rating'

  // coverage
  | 'coverage'

  // duplicated lines
  | 'duplicated_lines_density';

export interface Measure {
  metric: MetricKey;
  value: string;
  component: string;
}

export type SonarUrlProcessorFunc = (identifier: string) => string;
