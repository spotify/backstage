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

import {
  AppsV1Api,
  AutoscalingV1Api,
  CoreV1Api,
  KubeConfig,
  NetworkingV1beta1Api,
  CustomObjectsApi,
} from '@kubernetes/client-node';
import { ClusterDetails } from '../types/types';

export class KubernetesClientProvider {
  // visible for testing
  getKubeConfig(clusterDetails: ClusterDetails) {
    const cluster = {
      name: clusterDetails.name,
      server: clusterDetails.url,
      skipTLSVerify: clusterDetails.skipTLSVerify,
    };

    // TODO configure
    const user = {
      name: 'backstage',
      token: clusterDetails.serviceAccountToken,
    };

    const context = {
      name: `${clusterDetails.name}`,
      user: user.name,
      cluster: cluster.name,
    };

    const kc = new KubeConfig();
    kc.loadFromOptions({
      clusters: [cluster],
      users: [user],
      contexts: [context],
      currentContext: context.name,
    });
    return kc;
  }

  getCoreClientByClusterDetails(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return kc.makeApiClient(CoreV1Api);
  }

  getAppsClientByClusterDetails(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return kc.makeApiClient(AppsV1Api);
  }

  getAutoscalingClientByClusterDetails(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return kc.makeApiClient(AutoscalingV1Api);
  }

  getNetworkingBeta1Client(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return kc.makeApiClient(NetworkingV1beta1Api);
  }

  getCustomObjectsClient(clusterDetails: ClusterDetails) {
    const kc = this.getKubeConfig(clusterDetails);

    return kc.makeApiClient(CustomObjectsApi);
  }
}
