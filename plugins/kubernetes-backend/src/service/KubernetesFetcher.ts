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
  ExtensionsV1beta1Ingress,
  NetworkingV1beta1Api,
  V1ConfigMap,
  V1Deployment,
  V1HorizontalPodAutoscaler,
  V1Pod,
  V1ReplicaSet,
} from '@kubernetes/client-node';
import { V1Service } from '@kubernetes/client-node/dist/gen/model/v1Service';
import http from 'http';
import lodash, { Dictionary } from 'lodash';
import { Logger } from 'winston';
import {
  ClusterDetails,
  FetchResponseWrapper,
  KubernetesFetcher,
  KubernetesObjectTypes,
  ObjectFetchParams,
  CustomResource,
} from '../types/types';
import {
  FetchResponse,
  KubernetesFetchError,
  KubernetesErrorTypes,
} from '@backstage/plugin-kubernetes-common';
import { KubernetesClientProvider } from './KubernetesClientProvider';

export interface Clients {
  core: CoreV1Api;
  apps: AppsV1Api;
  autoscaling: AutoscalingV1Api;
  networkingBeta1: NetworkingV1beta1Api;
}

export interface KubernetesClientBasedFetcherOptions {
  kubernetesClientProvider: KubernetesClientProvider;
  logger: Logger;
}

type FetchResult = FetchResponse | KubernetesFetchError;

const isError = (fr: FetchResult): fr is KubernetesFetchError =>
  fr.hasOwnProperty('errorType');

function fetchResultsToResponseWrapper(
  results: FetchResult[],
): FetchResponseWrapper {
  const groupBy: Dictionary<FetchResult[]> = lodash.groupBy(results, value => {
    return isError(value) ? 'errors' : 'responses';
  });

  return {
    errors: groupBy.errors ?? [],
    responses: groupBy.responses ?? [],
  } as FetchResponseWrapper; // TODO would be nice to get rid of this 'as'
}

const statusCodeToErrorType = (statusCode: number): KubernetesErrorTypes => {
  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED_ERROR';
    case 500:
      return 'SYSTEM_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
};

const captureKubernetesErrorsRethrowOthers = (e: any): KubernetesFetchError => {
  if (e.response && e.response.statusCode) {
    return {
      errorType: statusCodeToErrorType(e.response.statusCode),
      statusCode: e.response.statusCode,
      resourcePath: e.response.request.uri.pathname,
    };
  }
  throw e;
};

export class KubernetesClientBasedFetcher implements KubernetesFetcher {
  private readonly kubernetesClientProvider: KubernetesClientProvider;
  private readonly logger: Logger;

  constructor({
    kubernetesClientProvider,
    logger,
  }: KubernetesClientBasedFetcherOptions) {
    this.kubernetesClientProvider = kubernetesClientProvider;
    this.logger = logger;
  }

  fetchObjectsForService(
    params: ObjectFetchParams,
  ): Promise<FetchResponseWrapper> {
    const fetchResults = Array.from(params.objectTypesToFetch).map(type => {
      return this.fetchByObjectType(
        params.clusterDetails,
        type,
        params.labelSelector ||
          `backstage.io/kubernetes-id=${params.serviceId}`,
      ).catch(captureKubernetesErrorsRethrowOthers);
    });

    const customObjectsFetchResults = params.customResources.map(cr => {
      return this.fetchCustomResource(
        params.clusterDetails,
        cr,
        params.labelSelector ||
          `backstage.io/kubernetes-id=${params.serviceId}`,
      ).catch(captureKubernetesErrorsRethrowOthers);
    });

    return Promise.all(fetchResults.concat(customObjectsFetchResults)).then(
      fetchResultsToResponseWrapper,
    );
  }

  // TODO could probably do with a tidy up
  private fetchByObjectType(
    clusterDetails: ClusterDetails,
    type: KubernetesObjectTypes,
    labelSelector: string,
  ): Promise<FetchResponse> {
    switch (type) {
      case 'pods':
        return this.fetchPodsForService(clusterDetails, labelSelector).then(
          r => ({
            type: type,
            resources: r,
          }),
        );
      case 'configmaps':
        return this.fetchConfigMapsForService(
          clusterDetails,
          labelSelector,
        ).then(r => ({ type: type, resources: r }));
      case 'deployments':
        return this.fetchDeploymentsForService(
          clusterDetails,
          labelSelector,
        ).then(r => ({ type: type, resources: r }));
      case 'replicasets':
        return this.fetchReplicaSetsForService(
          clusterDetails,
          labelSelector,
        ).then(r => ({ type: type, resources: r }));
      case 'services':
        return this.fetchServicesForService(
          clusterDetails,
          labelSelector,
        ).then(r => ({ type: type, resources: r }));
      case 'horizontalpodautoscalers':
        return this.fetchHorizontalPodAutoscalersForService(
          clusterDetails,
          labelSelector,
        ).then(r => ({ type: type, resources: r }));
      case 'ingresses':
        return this.fetchIngressesForService(
          clusterDetails,
          labelSelector,
        ).then(r => ({ type: type, resources: r }));
      default:
        // unrecognised type
        throw new Error(`unrecognised type=${type}`);
    }
  }

  private fetchCustomResource(
    clusterDetails: ClusterDetails,
    customResource: CustomResource,
    labelSelector: string,
  ): Promise<FetchResponse> {
    const customObjects = this.kubernetesClientProvider.getCustomObjectsClient(
      clusterDetails,
    );

    return customObjects
      .listClusterCustomObject(
        customResource.group,
        customResource.apiVersion,
        customResource.plural,
        '',
        '',
        '',
        labelSelector,
      )
      .then(r => {
        return { type: 'customresources', resources: (r.body as any).items };
      });
  }

  private singleClusterFetch<T>(
    clusterDetails: ClusterDetails,
    fn: (
      client: Clients,
    ) => Promise<{ body: { items: Array<T> }; response: http.IncomingMessage }>,
  ): Promise<Array<T>> {
    const core = this.kubernetesClientProvider.getCoreClientByClusterDetails(
      clusterDetails,
    );
    const apps = this.kubernetesClientProvider.getAppsClientByClusterDetails(
      clusterDetails,
    );
    const autoscaling = this.kubernetesClientProvider.getAutoscalingClientByClusterDetails(
      clusterDetails,
    );
    const networkingBeta1 = this.kubernetesClientProvider.getNetworkingBeta1Client(
      clusterDetails,
    );

    this.logger.debug(`calling cluster=${clusterDetails.name}`);
    return fn({ core, apps, autoscaling, networkingBeta1 }).then(({ body }) => {
      return body.items;
    });
  }

  private fetchServicesForService(
    clusterDetails: ClusterDetails,
    labelSelector: string,
  ): Promise<Array<V1Service>> {
    return this.singleClusterFetch<V1Service>(clusterDetails, ({ core }) =>
      core.listServiceForAllNamespaces(false, '', '', labelSelector),
    );
  }

  private fetchPodsForService(
    clusterDetails: ClusterDetails,
    labelSelector: string,
  ): Promise<Array<V1Pod>> {
    return this.singleClusterFetch<V1Pod>(clusterDetails, ({ core }) =>
      core.listPodForAllNamespaces(false, '', '', labelSelector),
    );
  }

  private fetchConfigMapsForService(
    clusterDetails: ClusterDetails,
    labelSelector: string,
  ): Promise<Array<V1ConfigMap>> {
    return this.singleClusterFetch<V1Pod>(clusterDetails, ({ core }) =>
      core.listConfigMapForAllNamespaces(false, '', '', labelSelector),
    );
  }

  private fetchDeploymentsForService(
    clusterDetails: ClusterDetails,
    labelSelector: string,
  ): Promise<Array<V1Deployment>> {
    return this.singleClusterFetch<V1Deployment>(clusterDetails, ({ apps }) =>
      apps.listDeploymentForAllNamespaces(false, '', '', labelSelector),
    );
  }

  private fetchReplicaSetsForService(
    clusterDetails: ClusterDetails,
    labelSelector: string,
  ): Promise<Array<V1ReplicaSet>> {
    return this.singleClusterFetch<V1ReplicaSet>(clusterDetails, ({ apps }) =>
      apps.listReplicaSetForAllNamespaces(false, '', '', labelSelector),
    );
  }

  private fetchHorizontalPodAutoscalersForService(
    clusterDetails: ClusterDetails,
    labelSelector: string,
  ): Promise<Array<V1HorizontalPodAutoscaler>> {
    return this.singleClusterFetch<V1HorizontalPodAutoscaler>(
      clusterDetails,
      ({ autoscaling }) =>
        autoscaling.listHorizontalPodAutoscalerForAllNamespaces(
          false,
          '',
          '',
          labelSelector,
        ),
    );
  }

  private fetchIngressesForService(
    clusterDetails: ClusterDetails,
    labelSelector: string,
  ): Promise<Array<ExtensionsV1beta1Ingress>> {
    return this.singleClusterFetch<ExtensionsV1beta1Ingress>(
      clusterDetails,
      ({ networkingBeta1 }) =>
        networkingBeta1.listIngressForAllNamespaces(
          false,
          '',
          '',
          labelSelector,
        ),
    );
  }
}
