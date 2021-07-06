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

import { V1Pod } from '@kubernetes/client-node';
import { totalRestarts } from '../utils/pod';
import { DetectedError, ErrorMapper } from './types';
import { detectErrorsInObjects } from './common';

const podErrorMappers: ErrorMapper<V1Pod>[] = [
  {
    severity: 5,
    errorExplanation: 'status-message',
    errorExists: pod => {
      return pod.status?.message !== undefined;
    },
    messageAccessor: pod => {
      return [pod.status?.message ?? ''];
    },
  },
  {
    severity: 4,
    errorExplanation: 'containers-restarting',
    errorExists: pod => {
      // TODO magic number
      return totalRestarts(pod) > 3;
    },
    messageAccessor: pod => {
      return (pod.status?.containerStatuses ?? [])
        .filter(cs => cs.restartCount > 0)
        .map(cs => `container=${cs.name} restarted ${cs.restartCount} times`);
    },
  },
  {
    severity: 5,
    errorExplanation: 'condition-message-present',
    errorExists: pod => {
      return (pod.status?.conditions ?? []).some(c => c.message !== undefined);
    },
    messageAccessor: pod => {
      return (pod.status?.conditions ?? [])
        .filter(c => c.message !== undefined)
        .map(c => c.message ?? '');
    },
  },
  {
    severity: 6,
    errorExplanation: 'container-waiting',
    errorExists: pod => {
      return (pod.status?.containerStatuses ?? []).some(
        cs => cs.state?.waiting?.message !== undefined,
      );
    },
    messageAccessor: pod => {
      return (pod.status?.containerStatuses ?? [])
        .filter(cs => cs.state?.waiting?.message !== undefined)
        .map(cs => cs.state?.waiting?.message ?? '');
    },
  },
  {
    severity: 4,
    errorExplanation: 'container-last-state-error',
    errorExists: pod => {
      return (pod.status?.containerStatuses ?? []).some(
        cs => (cs.lastState?.terminated?.reason ?? '') === 'Error',
      );
    },
    messageAccessor: pod => {
      return (pod.status?.containerStatuses ?? [])
        .filter(cs => (cs.lastState?.terminated?.reason ?? '') === 'Error')
        .map(
          cs =>
            `container=${cs.name} exited with error code (${cs.lastState?.terminated?.exitCode})`,
        );
    },
  },
];

export const detectErrorsInPods = (
  pods: V1Pod[],
  clusterName: string,
): DetectedError[] =>
  detectErrorsInObjects(pods, 'Pod', clusterName, podErrorMappers);
