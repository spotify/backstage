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

import { DetectedError, DetectedErrorsByCluster } from './types';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import { groupResponses } from '../utils/response';
import { detectErrorsInPods } from './pods';
import { detectErrorsInDeployments } from './deployments';
import { detectErrorsInHpa } from './hpas';

// For each cluster try to find errors in each of the object types provided
// returning a map of cluster names to errors in that cluster
export const detectErrors = (
  objects: ObjectsByEntityResponse,
): DetectedErrorsByCluster => {
  const errors: DetectedErrorsByCluster = new Map<string, DetectedError[]>();

  for (const clusterResponse of objects.items) {
    let clusterErrors: DetectedError[] = [];

    const groupedResponses = groupResponses(clusterResponse.resources);

    clusterErrors = clusterErrors.concat(
      detectErrorsInPods(groupedResponses.pods, clusterResponse.cluster.name),
    );

    clusterErrors = clusterErrors.concat(
      detectErrorsInDeployments(
        groupedResponses.deployments,
        clusterResponse.cluster.name,
      ),
    );

    clusterErrors = clusterErrors.concat(
      detectErrorsInHpa(
        groupedResponses.horizontalPodAutoscalers,
        clusterResponse.cluster.name,
      ),
    );

    errors.set(clusterResponse.cluster.name, clusterErrors);
  }

  return errors;
};
