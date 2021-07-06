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

import {
  createMockCommit,
  createMockTag,
  mockApiClient,
  mockSemverProject,
} from '../../../test-helpers/test-helpers';
import { getTagDates } from './getTagDates';

describe('getTagDates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should get tag dates for startTag when is tag and endTag is undefined', async () => {
    (mockApiClient.getTag as jest.Mock).mockResolvedValueOnce(
      createMockTag({ date: 'TAG-START' }),
    );

    const result = await getTagDates({
      pluginApiClient: mockApiClient,
      project: mockSemverProject,
      startTag: {
        tagSha: 'sha-start',
        tagType: 'tag',
      },
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "endDate": undefined,
        "startDate": "TAG-START",
      }
    `);
  });

  it('should get tag dates for startTag when startTag is commit and endTag is undefined', async () => {
    (mockApiClient.getCommit as jest.Mock).mockResolvedValueOnce(
      createMockCommit({ createdAt: 'COMMIT_START' }),
    );

    const result = await getTagDates({
      pluginApiClient: mockApiClient,
      project: mockSemverProject,
      startTag: {
        tagSha: 'sha-start',
        tagType: 'commit',
      },
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "endDate": undefined,
        "startDate": "COMMIT_START",
      }
    `);
  });

  it('should get tag dates when startTag & endTag both are of type tag', async () => {
    (mockApiClient.getTag as jest.Mock)
      .mockResolvedValueOnce(createMockTag({ date: 'TAG-START' }))
      .mockResolvedValueOnce(createMockTag({ date: 'TAG-END' }));

    const result = await getTagDates({
      pluginApiClient: mockApiClient,
      project: mockSemverProject,
      startTag: {
        tagSha: 'sha-start',
        tagType: 'tag',
      },
      endTag: {
        tagSha: 'sha-end',
        tagType: 'tag',
      },
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "endDate": "TAG-END",
        "startDate": "TAG-START",
      }
    `);
  });

  it('should get commit createdAt when startTag & endTag both are of type commit', async () => {
    (mockApiClient.getCommit as jest.Mock)
      .mockResolvedValueOnce(createMockCommit({ createdAt: 'COMMIT_START' }))
      .mockResolvedValueOnce(createMockCommit({ createdAt: 'COMMIT_END' }));

    const result = await getTagDates({
      pluginApiClient: mockApiClient,
      project: mockSemverProject,
      startTag: {
        tagSha: 'sha-start',
        tagType: 'commit',
      },
      endTag: {
        tagSha: 'sha-end',
        tagType: 'commit',
      },
    });

    expect(result).toMatchInlineSnapshot(`
      Object {
        "endDate": "COMMIT_END",
        "startDate": "COMMIT_START",
      }
    `);
  });

  it('should get commit createdAt when startTag is of type tag but endTag is of type commit', async () => {
    (mockApiClient.getTag as jest.Mock).mockResolvedValueOnce(
      createMockTag({ objectSha: 'OBJECT_SHA_START' }),
    );
    (mockApiClient.getCommit as jest.Mock).mockResolvedValueOnce(
      createMockCommit({ createdAt: 'COMMIT_START' }),
    );

    (mockApiClient.getCommit as jest.Mock).mockResolvedValueOnce(
      createMockCommit({ createdAt: 'COMMIT_END' }),
    );

    const result = await getTagDates({
      pluginApiClient: mockApiClient,
      project: mockSemverProject,
      startTag: {
        tagSha: 'sha-start',
        tagType: 'tag',
      },
      endTag: {
        tagSha: 'sha-end',
        tagType: 'commit',
      },
    });

    const { owner, repo } = mockSemverProject;
    expect(mockApiClient.getTag).toHaveBeenCalledWith({
      owner,
      repo,
      tagSha: 'sha-start',
    });
    expect((mockApiClient.getCommit as jest.Mock).mock.calls).toEqual([
      [{ owner, ref: 'sha-end', repo }],
      [{ owner, ref: 'OBJECT_SHA_START', repo }],
    ]);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "endDate": "COMMIT_START",
        "startDate": "COMMIT_END",
      }
    `);
  });

  it('should get commit createdAt when endTag is of type tag but startTag is of type commit', async () => {
    (mockApiClient.getCommit as jest.Mock).mockResolvedValueOnce(
      createMockCommit({ createdAt: 'COMMIT_START' }),
    );

    (mockApiClient.getTag as jest.Mock).mockResolvedValueOnce(
      createMockTag({ objectSha: 'OBJECT_SHA_END' }),
    );
    (mockApiClient.getCommit as jest.Mock).mockResolvedValueOnce(
      createMockCommit({ createdAt: 'COMMIT_END' }),
    );

    const result = await getTagDates({
      pluginApiClient: mockApiClient,
      project: mockSemverProject,
      startTag: {
        tagSha: 'sha-start',
        tagType: 'commit',
      },
      endTag: {
        tagSha: 'sha-end',
        tagType: 'tag',
      },
    });

    const { owner, repo } = mockSemverProject;
    expect(mockApiClient.getTag).toHaveBeenCalledWith({
      owner,
      repo,
      tagSha: 'sha-end',
    });
    expect((mockApiClient.getCommit as jest.Mock).mock.calls).toEqual([
      [{ owner, ref: 'sha-start', repo }],
      [{ owner, ref: 'OBJECT_SHA_END', repo }],
    ]);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "endDate": "COMMIT_END",
        "startDate": "COMMIT_START",
      }
    `);
  });
});
