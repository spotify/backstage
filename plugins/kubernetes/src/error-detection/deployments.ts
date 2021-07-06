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

import { DetectedError, ErrorMapper } from './types';
import { V1Deployment } from '@kubernetes/client-node';
import { detectErrorsInObjects } from './common';

const deploymentErrorMappers: ErrorMapper<V1Deployment>[] = [
  {
    // this is probably important
    severity: 6,
    errorExplanation: 'condition-message-present',
    errorExists: deployment => {
      return (deployment.status?.conditions ?? [])
        .filter(c => c.status === 'False')
        .some(c => c.message !== undefined);
    },
    messageAccessor: deployment => {
      return (deployment.status?.conditions ?? [])
        .filter(c => c.status === 'False')
        .filter(c => c.message !== undefined)
        .map(c => c.message ?? '');
    },
  },
];

export const detectErrorsInDeployments = (
  deployments: V1Deployment[],
  clusterName: string,
): DetectedError[] =>
  detectErrorsInObjects(
    deployments,
    'Deployment',
    clusterName,
    deploymentErrorMappers,
  );
