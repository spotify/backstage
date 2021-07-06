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

import { getVoidLogger } from '@backstage/backend-common';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';

describe('KubernetesFetcher', () => {
  let clientMock: any;
  let kubernetesClientProvider: any;
  let sut: KubernetesClientBasedFetcher;

  beforeEach(() => {
    jest.resetAllMocks();
    clientMock = {
      listPodForAllNamespaces: jest.fn(),
      listServiceForAllNamespaces: jest.fn(),
    };

    kubernetesClientProvider = {
      getCoreClientByClusterDetails: jest.fn(() => clientMock),
      getAppsClientByClusterDetails: jest.fn(() => clientMock),
      getAutoscalingClientByClusterDetails: jest.fn(() => clientMock),
      getNetworkingBeta1Client: jest.fn(() => clientMock),
      getCustomObjectsClient: jest.fn(() => clientMock),
    };

    sut = new KubernetesClientBasedFetcher({
      kubernetesClientProvider,
      logger: getVoidLogger(),
    });
  });

  const testErrorResponse = async (errorResponse: any, expectedResult: any) => {
    clientMock.listPodForAllNamespaces.mockResolvedValueOnce({
      body: {
        items: [
          {
            metadata: {
              name: 'pod-name',
            },
          },
        ],
      },
    });

    clientMock.listServiceForAllNamespaces.mockRejectedValue(errorResponse);

    const result = await sut.fetchObjectsForService({
      serviceId: 'some-service',
      clusterDetails: {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
      },
      objectTypesToFetch: new Set(['pods', 'services']),
      labelSelector: '',
      customResources: [],
    });

    expect(result).toStrictEqual({
      errors: [expectedResult],
      responses: [
        {
          type: 'pods',
          resources: [
            {
              metadata: {
                name: 'pod-name',
              },
            },
          ],
        },
      ],
    });

    expect(clientMock.listPodForAllNamespaces.mock.calls.length).toBe(1);
    expect(clientMock.listServiceForAllNamespaces.mock.calls.length).toBe(1);

    expect(
      kubernetesClientProvider.getAppsClientByClusterDetails.mock.calls.length,
    ).toBe(2);
    expect(
      kubernetesClientProvider.getCoreClientByClusterDetails.mock.calls.length,
    ).toBe(2);
  };

  it('should return pods, services', async () => {
    clientMock.listPodForAllNamespaces.mockResolvedValueOnce({
      body: {
        items: [
          {
            metadata: {
              name: 'pod-name',
            },
          },
        ],
      },
    });

    clientMock.listServiceForAllNamespaces.mockResolvedValueOnce({
      body: {
        items: [
          {
            metadata: {
              name: 'service-name',
            },
          },
        ],
      },
    });

    const result = await sut.fetchObjectsForService({
      serviceId: 'some-service',
      clusterDetails: {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
      },
      objectTypesToFetch: new Set(['pods', 'services']),
      labelSelector: '',
      customResources: [],
    });

    expect(result).toStrictEqual({
      errors: [],
      responses: [
        {
          type: 'pods',
          resources: [
            {
              metadata: {
                name: 'pod-name',
              },
            },
          ],
        },
        {
          type: 'services',
          resources: [
            {
              metadata: {
                name: 'service-name',
              },
            },
          ],
        },
      ],
    });

    expect(clientMock.listPodForAllNamespaces.mock.calls.length).toBe(1);
    expect(clientMock.listServiceForAllNamespaces.mock.calls.length).toBe(1);

    expect(
      kubernetesClientProvider.getAppsClientByClusterDetails.mock.calls.length,
    ).toBe(2);
    expect(
      kubernetesClientProvider.getCoreClientByClusterDetails.mock.calls.length,
    ).toBe(2);
  });
  it('should throw error on unknown type', () => {
    expect(() =>
      sut.fetchObjectsForService({
        serviceId: 'some-service',
        clusterDetails: {
          name: 'cluster1',
          url: 'http://localhost:9999',
          serviceAccountToken: 'token',
          authProvider: 'serviceAccount',
        },
        objectTypesToFetch: new Set<any>(['foo']),
        labelSelector: '',
        customResources: [],
      }),
    ).toThrow('unrecognised type=foo');

    expect(clientMock.listPodForAllNamespaces.mock.calls.length).toBe(0);
    expect(clientMock.listServiceForAllNamespaces.mock.calls.length).toBe(0);

    expect(
      kubernetesClientProvider.getAppsClientByClusterDetails.mock.calls.length,
    ).toBe(0);
    expect(
      kubernetesClientProvider.getCoreClientByClusterDetails.mock.calls.length,
    ).toBe(0);
  });
  // they're in testErrorResponse
  // eslint-disable-next-line jest/expect-expect
  it('should return pods, bad request error', async () => {
    await testErrorResponse(
      {
        response: {
          statusCode: 400,
          request: {
            uri: {
              pathname: '/some/path',
            },
          },
        },
      },
      {
        errorType: 'BAD_REQUEST',
        resourcePath: '/some/path',
        statusCode: 400,
      },
    );
  });
  // they're in testErrorResponse
  // eslint-disable-next-line jest/expect-expect
  it('should return pods, unauthorized error', async () => {
    await testErrorResponse(
      {
        response: {
          statusCode: 401,
          request: {
            uri: {
              pathname: '/some/path',
            },
          },
        },
      },
      {
        errorType: 'UNAUTHORIZED_ERROR',
        resourcePath: '/some/path',
        statusCode: 401,
      },
    );
  });
  // they're in testErrorResponse
  // eslint-disable-next-line jest/expect-expect
  it('should return pods, system error', async () => {
    await testErrorResponse(
      {
        response: {
          statusCode: 500,
          request: {
            uri: {
              pathname: '/some/path',
            },
          },
        },
      },
      {
        errorType: 'SYSTEM_ERROR',
        resourcePath: '/some/path',
        statusCode: 500,
      },
    );
  });
  // they're in testErrorResponse
  // eslint-disable-next-line jest/expect-expect
  it('should return pods, unknown error', async () => {
    await testErrorResponse(
      {
        response: {
          statusCode: 900,
          request: {
            uri: {
              pathname: '/some/path',
            },
          },
        },
      },
      {
        errorType: 'UNKNOWN_ERROR',
        resourcePath: '/some/path',
        statusCode: 900,
      },
    );
  });
  it('should always add a labelSelector query', async () => {
    clientMock.listPodForAllNamespaces.mockResolvedValueOnce({
      body: {
        items: [
          {
            metadata: {
              name: 'pod-name',
            },
          },
        ],
      },
    });

    clientMock.listServiceForAllNamespaces.mockResolvedValueOnce({
      body: {
        items: [
          {
            metadata: {
              name: 'service-name',
            },
          },
        ],
      },
    });

    await sut.fetchObjectsForService({
      serviceId: 'some-service',
      clusterDetails: {
        name: 'cluster1',
        url: 'http://localhost:9999',
        serviceAccountToken: 'token',
        authProvider: 'serviceAccount',
      },
      objectTypesToFetch: new Set(['pods', 'services']),
      labelSelector: '',
      customResources: [],
    });

    const mockCall = clientMock.listPodForAllNamespaces.mock.calls[0];
    const actualSelector = mockCall[mockCall.length - 1];
    const expectedSelector = 'backstage.io/kubernetes-id=some-service';
    expect(actualSelector).toBe(expectedSelector);
  });
});
