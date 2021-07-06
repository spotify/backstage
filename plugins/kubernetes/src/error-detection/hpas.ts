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

import { V1HorizontalPodAutoscaler } from '@kubernetes/client-node';
import { DetectedError, ErrorMapper } from './types';
import { detectErrorsInObjects } from './common';

const hpaErrorMappers: ErrorMapper<V1HorizontalPodAutoscaler>[] = [
  {
    // this is probably important
    severity: 8,
    errorExplanation: 'hpa-max-current-replicas',
    errorExists: hpa => {
      return (hpa.spec?.maxReplicas ?? -1) === hpa.status?.currentReplicas;
    },
    messageAccessor: hpa => {
      return [
        `Current number of replicas (${
          hpa.status?.currentReplicas
        }) is equal to the configured max number of replicas (${
          hpa.spec?.maxReplicas ?? -1
        })`,
      ];
    },
  },
];

export const detectErrorsInHpa = (
  hpas: V1HorizontalPodAutoscaler[],
  clusterName: string,
): DetectedError[] =>
  detectErrorsInObjects(
    hpas,
    'HorizontalPodAutoscaler',
    clusterName,
    hpaErrorMappers,
  );
