/*
 * Copyright 2024 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { createHandleAutocompleteRequest } from './autocomplete';

const mockGetClient = require('../util').getClient;

jest.mock('../util', () => ({
  getClient: jest.fn(),
}));

describe('handleAutocompleteRequest', () => {
  const mockIntegrations = {} as ScmIntegrationRegistry;
  const mockClient = {
    Branches: { all: jest.fn() },
    Groups: {
      all: jest.fn(),
      allProjects: jest.fn(),
    },
    Users: {
      showCurrentUser: jest.fn(),
      allProjects: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetClient.mockReturnValue(mockClient);
  });

  it('should return groups and current user', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    mockClient.Groups.all.mockResolvedValueOnce([
      { full_path: 'group1', id: 1 },
      { full_path: 'group2', id: 2 },
    ]);
    mockClient.Groups.all.mockResolvedValueOnce([]);
    mockClient.Users.showCurrentUser.mockResolvedValue({
      username: 'user1',
      id: 3,
    });

    const result = await handleAutocompleteRequest({
      resource: 'groups',
      token: 'token',
      context: {},
    });

    expect(result).toEqual({
      results: [
        { title: 'group1', id: '1' },
        { title: 'group2', id: '2' },
        { title: 'user1', id: '3' },
      ],
    });
  });

  it('should return repositories for a group', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    mockClient.Users.showCurrentUser.mockResolvedValue({ id: 3 });
    mockClient.Groups.allProjects.mockResolvedValue([
      { name: 'Repo 1', path: 'repo-1' },
      { name: 'Repo 2', path: 'repo-2' },
    ]);

    const result = await handleAutocompleteRequest({
      resource: 'repositories',
      token: 'token',
      context: { id: '1' },
    });

    expect(result).toEqual({
      results: [
        { title: 'Repo 1', id: 'repo-1' },
        { title: 'Repo 2', id: 'repo-2' },
      ],
    });
  });

  it('should return repositories for a user', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    mockClient.Users.showCurrentUser.mockResolvedValue({ id: 1 });
    mockClient.Users.allProjects.mockResolvedValue([
      { name: 'Repo 1', path: 'repo-1' },
      { name: 'Repo 2', path: 'repo-2' },
    ]);

    const result = await handleAutocompleteRequest({
      resource: 'repositories',
      token: 'token',
      context: { id: '1' },
    });

    expect(result).toEqual({
      results: [
        { title: 'Repo 1', id: 'repo-1' },
        { title: 'Repo 2', id: 'repo-2' },
      ],
    });
  });

  it('returns branches for a nested namespace using the supplied credentials', async () => {
    const handle = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });
    mockClient.Branches.all.mockResolvedValue([
      { name: 'main' },
      { name: 'feature/example' },
    ]);
    await expect(
      handle({
        resource: 'branches',
        token: 'user-token',
        context: {
          host: 'gitlab.example.com',
          owner: 'group/subgroup',
          repository: 'repo',
        },
      }),
    ).resolves.toEqual({
      results: [
        { title: 'main', id: 'main' },
        { title: 'feature/example', id: 'feature/example' },
      ],
    });
    expect(mockGetClient).toHaveBeenCalledWith({
      host: 'gitlab.example.com',
      integrations: mockIntegrations,
      token: 'user-token',
    });
    expect(mockClient.Branches.all).toHaveBeenCalledWith('group/subgroup/repo');
    mockClient.Branches.all.mockResolvedValue([]);
    await expect(
      handle({
        resource: 'branches',
        token: 'user-token',
        context: { owner: 'group', repository: 'empty' },
      }),
    ).resolves.toEqual({ results: [] });
    mockClient.Branches.all.mockRejectedValue(new Error('Forbidden'));
    await expect(
      handle({
        resource: 'branches',
        token: 'user-token',
        context: { owner: 'group', repository: 'private' },
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('rejects missing branch context and credentials without listing branches', async () => {
    const handle = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });
    const missingContexts: Record<string, string>[] = [
      {},
      { owner: 'group' },
      { repository: 'repo' },
    ];
    for (const context of missingContexts) {
      await expect(
        handle({ resource: 'branches', token: 'user-token', context }),
      ).rejects.toThrow(InputError);
    }
    await expect(
      handle({
        resource: 'branches',
        token: '',
        context: { owner: 'group', repository: 'repo' },
      }),
    ).rejects.toThrow('Missing user credentials');
    expect(mockClient.Branches.all).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid resource', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    await expect(
      handleAutocompleteRequest({
        resource: 'invalid',
        token: 'token',
        context: {},
      }),
    ).rejects.toThrow(InputError);
  });

  it('should throw an error if context id is missing for repositories', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    await expect(
      handleAutocompleteRequest({
        resource: 'repositories',
        token: 'token',
        context: {},
      }),
    ).rejects.toThrow(InputError);
  });
});
