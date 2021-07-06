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

// Higher is more sever, but it's relative
import {
  V1Deployment,
  V1HorizontalPodAutoscaler,
  V1Pod,
} from '@kubernetes/client-node';

export type ErrorSeverity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ErrorDetectable = V1Pod | V1Deployment | V1HorizontalPodAutoscaler;

export type ErrorDetectableKind =
  | 'Pod'
  | 'Deployment'
  | 'HorizontalPodAutoscaler';

export type DetectedErrorsByCluster = Map<string, DetectedError[]>;

export interface DetectedError {
  severity: ErrorSeverity;
  cluster: string;
  kind: ErrorDetectableKind;
  names: string[];
  message: string[];
}

export interface ErrorMapper<T extends ErrorDetectable> {
  severity: ErrorSeverity;
  errorExplanation: string;
  errorExists: (object: T) => boolean;
  messageAccessor: (object: T) => string[];
}
