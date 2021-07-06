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
import { Entity } from '@backstage/catalog-model';
import { QueryResponse } from '../api';

export const entityStub: { entity: Entity } = {
  entity: {
    metadata: {
      namespace: 'default',
      annotations: {},
      name: 'sample-service',
      description: 'Sample service',
      uid: 'g0h33dd9-56h7-835b-b63v-7x5da3j64851',
      generation: 1,
    },
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    spec: {
      type: 'service',
      lifecycle: 'experimental',
    },
    relations: [],
  },
};

export const responseStub: QueryResponse = {
  repository: {
    deployments: {
      nodes: [
        {
          state: 'active',
          environment: 'prd',
          updatedAt: '2021-03-25T12:08:45Z',
          commit: {
            commitUrl: 'https://exampleapi.com/123456789',
            abbreviatedOid: '12345',
          },
          statuses: {
            nodes: [{ logUrl: 'taskrun/example-run' }],
          },
          creator: {
            login: 'robot-user-001',
          },
          repository: {
            nameWithOwner: 'org/owner',
          },
          payload: '{"target":"moon"}',
        },
        {
          state: 'pending',
          environment: 'lab',
          updatedAt: '2021-03-25T12:08:47Z',
          commit: {
            commitUrl: 'https://exampleapi.com/543212345',
            abbreviatedOid: '54321',
          },
          statuses: {
            nodes: [{ logUrl: 'taskrun/example-run' }],
          },
          creator: {
            login: 'robot-user-001',
          },
          repository: {
            nameWithOwner: 'org/owner',
          },
          payload: '{"target":"sun"}',
        },
      ],
    },
  },
};

export const refreshedResponseStub: QueryResponse = {
  repository: {
    deployments: {
      nodes: [
        {
          state: 'active',
          environment: 'prd',
          updatedAt: '2021-03-25T12:08:45Z',
          commit: {
            commitUrl: 'https://exampleapi.com/123456789',
            abbreviatedOid: '12345',
          },
          statuses: {
            nodes: [{ logUrl: 'taskrun/example-run' }],
          },
          creator: {
            login: 'robot-user-001',
          },
          repository: {
            nameWithOwner: 'org/owner',
          },
          payload: '{"target":"moon"}',
        },
        {
          state: 'failure',
          environment: 'lab',
          updatedAt: '2021-03-25T12:09:47Z',
          commit: {
            commitUrl: 'https://exampleapi.com/543212345',
            abbreviatedOid: '54321',
          },
          statuses: {
            nodes: [{ logUrl: 'taskrun/example-run' }],
          },
          creator: {
            login: 'robot-user-001',
          },
          repository: {
            nameWithOwner: 'org/owner',
          },
          payload: '{"target":"sun"}',
        },
      ],
    },
  },
};

export const noDataResponseStub: QueryResponse = {};
