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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import merge from 'lodash/merge';
import { GroupMember, MicrosoftGraphClient } from './client';
import {
  readMicrosoftGraphGroups,
  readMicrosoftGraphOrganization,
  readMicrosoftGraphUsers,
  resolveRelations,
} from './read';
import { getVoidLogger } from '@backstage/backend-common';

function user(data: Partial<UserEntity>): UserEntity {
  return merge(
    {},
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: { name: 'name' },
      spec: { profile: {}, memberOf: [] },
    } as UserEntity,
    data,
  );
}

function group(data: Partial<GroupEntity>): GroupEntity {
  return merge(
    {},
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: 'name',
      },
      spec: {
        children: [],
        type: 'team',
      },
    } as GroupEntity,
    data,
  );
}

describe('read microsoft graph', () => {
  const client: jest.Mocked<MicrosoftGraphClient> = {
    getUsers: jest.fn(),
    getGroups: jest.fn(),
    getGroupMembers: jest.fn(),
    getUserPhotoWithSizeLimit: jest.fn(),
    getGroupPhotoWithSizeLimit: jest.fn(),
    getOrganization: jest.fn(),
  } as any;

  afterEach(() => jest.resetAllMocks());

  describe('readMicrosoftGraphUsers', () => {
    it('should read users', async () => {
      async function* getExampleUsers() {
        yield {
          id: 'userid',
          displayName: 'User Name',
          mail: 'user.name@example.com',
        };
      }

      client.getUsers.mockImplementation(getExampleUsers);
      client.getUserPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const { users } = await readMicrosoftGraphUsers(client, {
        userFilter: 'accountEnabled eq true',
        logger: getVoidLogger(),
      });

      expect(users).toEqual([
        user({
          metadata: {
            annotations: {
              'graph.microsoft.com/user-id': 'userid',
            },
            name: 'user.name_example.com',
          },
          spec: {
            profile: {
              displayName: 'User Name',
              email: 'user.name@example.com',
              picture: 'data:image/jpeg;base64,...',
            },
            memberOf: [],
          },
        }),
      ]);

      expect(client.getUsers).toBeCalledTimes(1);
      expect(client.getUsers).toBeCalledWith({
        filter: 'accountEnabled eq true',
      });
      expect(client.getUserPhotoWithSizeLimit).toBeCalledTimes(1);
      expect(client.getUserPhotoWithSizeLimit).toBeCalledWith('userid', 120);
    });
  });

  describe('readMicrosoftGraphOrganization', () => {
    it('should read organization', async () => {
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      const { rootGroup } = await readMicrosoftGraphOrganization(
        client,
        'tenantid',
      );

      expect(rootGroup).toEqual(
        group({
          metadata: {
            annotations: {
              'graph.microsoft.com/tenant-id': 'tenantid',
            },
            name: 'organization_name',
            description: 'Organization Name',
          },
          spec: {
            type: 'root',
            profile: {
              displayName: 'Organization Name',
            },
            children: [],
          },
        }),
      );

      expect(client.getOrganization).toBeCalledTimes(1);
      expect(client.getOrganization).toBeCalledWith('tenantid');
    });

    it('should read organization with custom transformer', async () => {
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });

      const { rootGroup } = await readMicrosoftGraphOrganization(
        client,
        'tenantid',
        { transformer: async _ => undefined },
      );

      expect(rootGroup).toEqual(undefined);

      expect(client.getOrganization).toBeCalledTimes(1);
      expect(client.getOrganization).toBeCalledWith('tenantid');
    });
  });

  describe('readMicrosoftGraphGroups', () => {
    it('should read groups', async () => {
      async function* getExampleGroups() {
        yield {
          id: 'groupid',
          displayName: 'Group Name',
          description: 'Group Description',
          mail: 'group@example.com',
        };
      }

      async function* getExampleGroupMembers(): AsyncIterable<GroupMember> {
        yield {
          '@odata.type': '#microsoft.graph.group',
          id: 'childgroupid',
        };
        yield {
          '@odata.type': '#microsoft.graph.user',
          id: 'userid',
        };
      }

      client.getGroups.mockImplementation(getExampleGroups);
      client.getGroupMembers.mockImplementation(getExampleGroupMembers);
      client.getOrganization.mockResolvedValue({
        id: 'tenantid',
        displayName: 'Organization Name',
      });
      client.getGroupPhotoWithSizeLimit.mockResolvedValue(
        'data:image/jpeg;base64,...',
      );

      const {
        groups,
        groupMember,
        groupMemberOf,
        rootGroup,
      } = await readMicrosoftGraphGroups(client, 'tenantid', {
        groupFilter: 'securityEnabled eq false',
      });

      const expectedRootGroup = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenantid',
          },
          name: 'organization_name',
          description: 'Organization Name',
        },
        spec: {
          type: 'root',
          profile: {
            displayName: 'Organization Name',
          },
          children: [],
        },
      });
      expect(groups).toEqual([
        expectedRootGroup,
        group({
          metadata: {
            annotations: {
              'graph.microsoft.com/group-id': 'groupid',
            },
            name: 'group_name',
            description: 'Group Description',
          },
          spec: {
            type: 'team',
            profile: {
              displayName: 'Group Name',
              email: 'group@example.com',
              // TODO: Loading groups photos doesn't work right now as Microsoft
              // Graph doesn't allows this yet
              /* picture: 'data:image/jpeg;base64,...',*/
            },
            children: [],
          },
        }),
      ]);
      expect(rootGroup).toEqual(expectedRootGroup);
      expect(groupMember.get('groupid')).toEqual(new Set(['childgroupid']));
      expect(groupMemberOf.get('userid')).toEqual(new Set(['groupid']));
      expect(groupMember.get('organization_name')).toEqual(new Set());

      expect(client.getGroups).toBeCalledTimes(1);
      expect(client.getGroups).toBeCalledWith({
        filter: 'securityEnabled eq false',
      });
      expect(client.getGroupMembers).toBeCalledTimes(1);
      expect(client.getGroupMembers).toBeCalledWith('groupid');
      // TODO: Loading groups photos doesn't work right now as Microsoft Graph
      // doesn't allows this yet
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledTimes(1);
      // expect(client.getGroupPhotoWithSizeLimit).toBeCalledWith('groupid', 120);
    });
  });

  describe('resolveRelations', () => {
    it('should resolve relations', async () => {
      const rootGroup = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/tenant-id': 'tenant-id-root',
          },
          name: 'root',
        },
        spec: {
          type: 'root',
          children: [],
        },
      });
      const groupA = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/group-id': 'group-id-a',
          },
          name: 'a',
        },
      });
      const groupB = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/group-id': 'group-id-b',
          },
          name: 'b',
        },
      });
      const groupC = group({
        metadata: {
          annotations: {
            'graph.microsoft.com/group-id': 'group-id-c',
          },
          name: 'c',
        },
      });
      const user1 = user({
        metadata: {
          annotations: {
            'graph.microsoft.com/user-id': 'user-id-1',
          },
          name: 'user1',
        },
      });
      const user2 = user({
        metadata: {
          annotations: {
            'graph.microsoft.com/user-id': 'user-id-2',
          },
          name: 'user2',
        },
      });
      const groups = [rootGroup, groupA, groupB, groupC];
      const users = [user1, user2];
      const groupMember = new Map<string, Set<string>>();
      groupMember.set('group-id-b', new Set(['group-id-c']));
      const groupMemberOf = new Map<string, Set<string>>();
      groupMemberOf.set('user-id-1', new Set(['group-id-a']));
      groupMemberOf.set('user-id-2', new Set(['group-id-c']));

      // We have a root groups
      // We have three groups: a, b, c. c is child of b
      // we have two users: u1, u2. u1 is member of a, u2 is member of c
      resolveRelations(rootGroup, groups, users, groupMember, groupMemberOf);

      expect(rootGroup.spec.parent).toBeUndefined();
      expect(rootGroup.spec.children).toEqual(
        expect.arrayContaining(['group:default/a', 'group:default/b']),
      );

      expect(groupA.spec.parent).toEqual('group:default/root');
      expect(groupA.spec.children).toEqual(expect.arrayContaining([]));

      expect(groupB.spec.parent).toEqual('group:default/root');
      expect(groupB.spec.children).toEqual(
        expect.arrayContaining(['group:default/c']),
      );

      expect(groupC.spec.parent).toEqual('group:default/b');
      expect(groupC.spec.children).toEqual(expect.arrayContaining([]));

      expect(user1.spec.memberOf).toEqual(
        expect.arrayContaining(['group:default/a']),
      );
      expect(user2.spec.memberOf).toEqual(
        expect.arrayContaining(['group:default/c']),
      );
    });
  });
});
