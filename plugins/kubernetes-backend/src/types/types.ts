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

import type {
  FetchResponse,
  KubernetesFetchError,
} from '@backstage/plugin-kubernetes-common';

export interface CustomResource {
  group: string;
  apiVersion: string;
  plural: string;
}

export interface ObjectFetchParams {
  serviceId: string;
  clusterDetails: ClusterDetails;
  objectTypesToFetch: Set<KubernetesObjectTypes>;
  labelSelector: string;
  customResources: CustomResource[];
}

// Fetches information from a kubernetes cluster using the cluster details object
// to target a specific cluster
export interface KubernetesFetcher {
  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper>;
}

export interface FetchResponseWrapper {
  errors: KubernetesFetchError[];
  responses: FetchResponse[];
}

// TODO fairly sure there's a easier way to do this

export type KubernetesObjectTypes =
  | 'pods'
  | 'services'
  | 'configmaps'
  | 'deployments'
  | 'replicasets'
  | 'horizontalpodautoscalers'
  | 'ingresses'
  | 'customresources';

// Used to load cluster details from different sources
export interface KubernetesClustersSupplier {
  getClusters(): Promise<ClusterDetails[]>;
}

// Used to locate which cluster(s) a service is running on
export interface KubernetesServiceLocator {
  getClustersByServiceId(serviceId: string): Promise<ClusterDetails[]>;
}

export type ServiceLocatorMethod = 'multiTenant' | 'http'; // TODO implement http

export interface ClusterDetails {
  name: string;
  url: string;
  authProvider: string;
  serviceAccountToken?: string | undefined;
  skipTLSVerify?: boolean;
}
