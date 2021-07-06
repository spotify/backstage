/*
 * Copyright 2021 The Backstage Authors
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

import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';
import {
  V1HorizontalPodAutoscaler,
  V1Pod,
  V1ReplicaSet,
} from '@kubernetes/client-node';

interface CanOwn {
  metadata?: V1ObjectMeta;
}

interface CanBeOwned {
  metadata?: V1ObjectMeta;
}

export function getOwnedResources<R extends CanBeOwned>(
  potentialOwner: CanOwn,
  possiblyOwned: R[],
): R[] {
  return possiblyOwned.filter(
    p =>
      p.metadata?.ownerReferences?.some(
        o => o.uid === potentialOwner.metadata?.uid,
      ) ?? false,
  );
}

export const getOwnedPodsThroughReplicaSets = (
  potentialOwner: CanOwn,
  replicaSets: V1ReplicaSet[],
  pods: V1Pod[],
) => {
  return getOwnedResources(
    potentialOwner,
    replicaSets.filter(rs => rs.status && rs.status.replicas > 0),
  ).reduce((accum, rs) => {
    return accum.concat(getOwnedResources(rs, pods));
  }, [] as V1Pod[]);
};

export const getMatchingHpa = (
  ownerName: string | undefined,
  ownerKind: string,
  hpas: V1HorizontalPodAutoscaler[],
): V1HorizontalPodAutoscaler | undefined => {
  return hpas.find(hpa => {
    return (
      (hpa.spec?.scaleTargetRef?.kind ?? '').toLowerCase() ===
        ownerKind.toLowerCase() &&
      (hpa.spec?.scaleTargetRef?.name ?? '') ===
        (ownerName ?? 'unknown-deployment')
    );
  });
};
