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

import {
  V1Pod,
  V1Deployment,
  V1HorizontalPodAutoscaler,
} from '@kubernetes/client-node';
import { detectErrors } from './error-detection';
import * as healthyPod from './__fixtures__/pod.json';
import * as podMissingCm from './__fixtures__/pod-missing-cm.json';
import * as crashingPod from './__fixtures__/pod-crashing.json';
import * as healthyDeploy from './__fixtures__/deploy-healthy.json';
import * as failingDeploy from './__fixtures__/deploy-bad.json';
import * as healthyHpa from './__fixtures__/hpa-healthy.json';
import * as maxedOutHpa from './__fixtures__/hpa-maxed-out.json';
import {
  FetchResponse,
  ObjectsByEntityResponse,
} from '@backstage/plugin-kubernetes-common';

const CLUSTER_NAME = 'cluster-a';

const oneItem = (value: FetchResponse): ObjectsByEntityResponse => {
  return {
    items: [
      {
        cluster: { name: CLUSTER_NAME },
        errors: [],
        resources: [value],
      },
    ],
  };
};

const onePod = (pod: V1Pod): ObjectsByEntityResponse => {
  return oneItem({
    type: 'pods',
    resources: [pod],
  });
};

const oneDeployment = (deployment: V1Deployment): ObjectsByEntityResponse => {
  return oneItem({
    type: 'deployments',
    resources: [deployment],
  });
};

const oneHpa = (hpa: V1HorizontalPodAutoscaler): ObjectsByEntityResponse => {
  return oneItem({
    type: 'horizontalpodautoscalers',
    resources: [hpa],
  });
};

describe('detectErrors', () => {
  it('should return errors from different clusters', () => {
    const result = detectErrors({
      items: [
        {
          cluster: { name: 'cluster-a' },
          errors: [],
          resources: [
            {
              type: 'pods',
              resources: [crashingPod as any],
            },
          ],
        },
        {
          cluster: { name: 'cluster-b' },
          errors: [],
          resources: [
            {
              type: 'horizontalpodautoscalers',
              resources: [maxedOutHpa as any],
            },
          ],
        },
        {
          cluster: { name: 'cluster-c' },
          errors: [],
          resources: [
            {
              type: 'deployments',
              resources: [healthyDeploy as any],
            },
          ],
        },
      ],
    });

    expect(result.size).toBe(3);

    const errorsFromClusterA = result.get('cluster-a');
    const errorsFromClusterB = result.get('cluster-b');
    const errorsFromClusterC = result.get('cluster-c');

    expect(errorsFromClusterA).toBeDefined();
    expect(errorsFromClusterA).toHaveLength(4);

    expect(errorsFromClusterB).toBeDefined();
    expect(errorsFromClusterB).toHaveLength(1);

    expect(errorsFromClusterC).toBeDefined();
    expect(errorsFromClusterC).toHaveLength(0);
  });

  it('should detect no errors in healthy pod', () => {
    const result = detectErrors(onePod(healthyPod as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('should detect errors in crashing pod', () => {
    const result = detectErrors(onePod(crashingPod as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(4);

    const [err1, err2, err3, err4] = errors ?? [];

    expect(err1).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'Pod',
      message: [
        'container=other-side-car restarted 38 times',
        'container=side-car restarted 38 times',
      ],
      names: ['dice-roller-canary-7d64cd756c-55rfq'],
      severity: 4,
    });

    expect(err2).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'Pod',
      message: [
        'containers with unready status: [side-car other-side-car]',
        'containers with unready status: [side-car other-side-car]',
      ],
      names: ['dice-roller-canary-7d64cd756c-55rfq'],
      severity: 5,
    });

    expect(err3).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'Pod',
      message: [
        'back-off 5m0s restarting failed container=other-side-car pod=dice-roller-canary-7d64cd756c-55rfq_default(65ad28e3-5d51-4b4b-9bf8-4cb069803034)',
        'back-off 5m0s restarting failed container=side-car pod=dice-roller-canary-7d64cd756c-55rfq_default(65ad28e3-5d51-4b4b-9bf8-4cb069803034)',
      ],
      names: ['dice-roller-canary-7d64cd756c-55rfq'],
      severity: 6,
    });

    expect(err4).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'Pod',
      message: [
        'container=other-side-car exited with error code (1)',
        'container=side-car exited with error code (1)',
      ],
      names: ['dice-roller-canary-7d64cd756c-55rfq'],
      severity: 4,
    });
  });
  it('should detect errors in pod with missing Config Map', () => {
    const result = detectErrors(onePod(podMissingCm as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(2);

    const [err1, err2] = errors ?? [];

    expect(err1).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'Pod',
      message: [
        'containers with unready status: [nginx]',
        'containers with unready status: [nginx]',
      ],
      names: ['dice-roller-bad-cm-855bf85464-mg6xb'],
      severity: 5,
    });

    expect(err2).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'Pod',
      message: ['configmap "some-cm" not found'],
      names: ['dice-roller-bad-cm-855bf85464-mg6xb'],
      severity: 6,
    });
  });
  it('should detect no errors in healthy deployment', () => {
    const result = detectErrors(oneDeployment(healthyDeploy as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('should detect in deployment which cant progress', () => {
    const result = detectErrors(oneDeployment(failingDeploy as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(1);

    const [err1] = errors ?? [];

    expect(err1).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'Deployment',
      message: ['Deployment does not have minimum availability.'],
      names: ['dice-roller-canary'],
      severity: 6,
    });
  });
  it('should detect no errors in healthy hpa', () => {
    const result = detectErrors(oneHpa(healthyHpa as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(0);
  });
  it('should detect in maxed out hpa', () => {
    const result = detectErrors(oneHpa(maxedOutHpa as any));

    expect(result.size).toBe(1);

    const errors = result.get(CLUSTER_NAME);

    expect(errors).toBeDefined();
    expect(errors).toHaveLength(1);

    const [err1] = errors ?? [];

    expect(err1).toStrictEqual({
      cluster: 'cluster-a',
      kind: 'HorizontalPodAutoscaler',
      message: [
        'Current number of replicas (10) is equal to the configured max number of replicas (10)',
      ],
      names: ['dice-roller'],
      severity: 8,
    });
  });
});
