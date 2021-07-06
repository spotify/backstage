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

import React from 'react';
import { V1HorizontalPodAutoscaler } from '@kubernetes/client-node';
import { KubernetesDrawer } from '../KubernetesDrawer/KubernetesDrawer';

export const HorizontalPodAutoscalerDrawer = ({
  hpa,
  expanded,
  children,
}: {
  hpa: V1HorizontalPodAutoscaler;
  expanded?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <KubernetesDrawer
      kind="HorizontalPodAutoscaler"
      object={hpa}
      expanded={expanded}
      renderObject={(hpaObject: V1HorizontalPodAutoscaler) => {
        return {
          targetCPUUtilizationPercentage:
            hpaObject.spec?.targetCPUUtilizationPercentage,
          currentCPUUtilizationPercentage:
            hpaObject.status?.currentCPUUtilizationPercentage,
          minReplicas: hpaObject.spec?.minReplicas,
          maxReplicas: hpaObject.spec?.maxReplicas,
          currentReplicas: hpaObject.status?.currentReplicas,
          desiredReplicas: hpaObject.status?.desiredReplicas,
        };
      }}
    >
      {children}
    </KubernetesDrawer>
  );
};
