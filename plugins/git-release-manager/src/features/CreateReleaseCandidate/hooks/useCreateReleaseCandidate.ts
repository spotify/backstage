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

import { useEffect, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import {
  GetLatestReleaseResult,
  GetRepositoryResult,
} from '../../../api/GitReleaseClient';

import { CardHook, ComponentConfigCreateRc } from '../../../types/types';
import { getReleaseCandidateGitInfo } from '../../../helpers/getReleaseCandidateGitInfo';
import { gitReleaseManagerApiRef } from '../../../api/serviceApiRef';
import { GitReleaseManagerError } from '../../../errors/GitReleaseManagerError';
import { Project } from '../../../contexts/ProjectContext';
import { TAG_OBJECT_MESSAGE } from '../../../constants/constants';
import { useResponseSteps } from '../../../hooks/useResponseSteps';
import { useUserContext } from '../../../contexts/UserContext';
import { useApi } from '@backstage/core-plugin-api';

interface UseCreateReleaseCandidate {
  defaultBranch: GetRepositoryResult['repository']['defaultBranch'];
  latestRelease: GetLatestReleaseResult['latestRelease'];
  releaseCandidateGitInfo: ReturnType<typeof getReleaseCandidateGitInfo>;
  project: Project;
  onSuccess?: ComponentConfigCreateRc['onSuccess'];
}

export function useCreateReleaseCandidate({
  defaultBranch,
  latestRelease,
  releaseCandidateGitInfo,
  project,
  onSuccess,
}: UseCreateReleaseCandidate): CardHook<void> {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { user } = useUserContext();

  if (releaseCandidateGitInfo.error) {
    throw new GitReleaseManagerError(
      `Unexpected error: ${
        releaseCandidateGitInfo.error.title
          ? `${releaseCandidateGitInfo.error.title} (${releaseCandidateGitInfo.error.subtitle})`
          : releaseCandidateGitInfo.error.subtitle
      }`,
    );
  }

  const {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
  } = useResponseSteps();

  /**
   * (1) Get the default branch's most recent commit
   */
  const [latestCommitRes, run] = useAsyncFn(async () => {
    const { commit: latestCommit } = await pluginApiClient
      .getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: defaultBranch,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Fetched latest commit from "${defaultBranch}"`,
      secondaryMessage: `with message "${latestCommit.commit.message}"`,
      link: latestCommit.htmlUrl,
    });

    return {
      latestCommit,
    };
  });

  /**
   * (2) Create release branch based on default branch's most recent sha
   */
  const releaseBranchRes = useAsync(async () => {
    abortIfError(latestCommitRes.error);
    if (!latestCommitRes.value) return undefined;

    const { reference: createdReleaseBranch } = await pluginApiClient
      .createRef({
        owner: project.owner,
        repo: project.repo,
        sha: latestCommitRes.value.latestCommit.sha,
        ref: `refs/heads/${releaseCandidateGitInfo.rcBranch}`,
      })
      .catch(error => {
        if (error?.body?.message === 'Reference already exists') {
          throw new GitReleaseManagerError(
            `Branch "${releaseCandidateGitInfo.rcBranch}" already exists: .../tree/${releaseCandidateGitInfo.rcBranch}`,
          );
        }
        throw error;
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Created Release Branch',
      secondaryMessage: `with ref "${createdReleaseBranch.ref}"`,
    });

    return {
      ...createdReleaseBranch,
    };
  }, [latestCommitRes.value, latestCommitRes.error]);

  /**
   * (3) Create tag object for our soon-to-be-created annotated tag
   */
  const tagObjectRes = useAsync(async () => {
    abortIfError(releaseBranchRes.error);
    if (!releaseBranchRes.value) return undefined;

    const { tagObject } = await pluginApiClient
      .createTagObject({
        owner: project.owner,
        repo: project.repo,
        tag: releaseCandidateGitInfo.rcReleaseTag,
        object: releaseBranchRes.value.objectSha,
        taggerName: user.username,
        taggerEmail: user.email,
        message: TAG_OBJECT_MESSAGE,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Created Tag Object',
      secondaryMessage: `with sha "${tagObject.tagSha}"`,
    });

    return {
      ...tagObject,
    };
  }, [releaseBranchRes.value, releaseBranchRes.error]);

  /**
   * (4) Create reference for tag object
   */
  const createRcRes = useAsync(async () => {
    abortIfError(tagObjectRes.error);
    if (!tagObjectRes.value) return undefined;

    const { reference: createdRef } = await pluginApiClient
      .createRef({
        owner: project.owner,
        repo: project.repo,
        ref: `refs/tags/${releaseCandidateGitInfo.rcReleaseTag}`,
        sha: tagObjectRes.value.tagSha,
      })
      .catch(error => {
        if (error?.body?.message === 'Reference already exists') {
          throw new GitReleaseManagerError(
            `Tag reference "${releaseCandidateGitInfo.rcReleaseTag}" already exists`,
          );
        }
        throw error;
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Cut Tag Reference',
      secondaryMessage: `with ref "${createdRef.ref}"`,
    });

    return {
      ...createdRef,
    };
  }, [tagObjectRes.value, tagObjectRes.error]);

  /**
   * (5) Compose a body for the release
   */
  const getComparisonRes = useAsync(async () => {
    abortIfError(createRcRes.error);
    if (!createRcRes.value) return undefined;

    const previousReleaseBranch = latestRelease
      ? latestRelease.targetCommitish
      : defaultBranch;
    const nextReleaseBranch = releaseCandidateGitInfo.rcBranch;
    const { comparison } = await pluginApiClient
      .getComparison({
        owner: project.owner,
        repo: project.repo,
        base: previousReleaseBranch,
        head: nextReleaseBranch,
      })
      .catch(asyncCatcher);

    const releaseBody = `**Compare** ${comparison.htmlUrl}

**Ahead by** ${comparison.aheadBy} commits

**Release branch** ${createRcRes.value.ref}

---

`;

    addStepToResponseSteps({
      message: 'Fetched commit comparison',
      secondaryMessage: `${previousReleaseBranch}...${nextReleaseBranch}`,
      link: comparison.htmlUrl,
    });

    return {
      ...comparison,
      releaseBody,
    };
  }, [createRcRes.value, createRcRes.error]);

  /**
   * (6) Creates the Git Release itself
   */
  const createReleaseRes = useAsync(async () => {
    abortIfError(getComparisonRes.error);
    if (!getComparisonRes.value) return undefined;

    const { release: createReleaseResult } = await pluginApiClient
      .createRelease({
        owner: project.owner,
        repo: project.repo,
        tagName: releaseCandidateGitInfo.rcReleaseTag,
        name: releaseCandidateGitInfo.releaseName,
        targetCommitish: releaseCandidateGitInfo.rcBranch,
        body: getComparisonRes.value.releaseBody,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Created Release Candidate "${createReleaseResult.name}"`,
      secondaryMessage: `with tag "${releaseCandidateGitInfo.rcReleaseTag}"`,
      link: createReleaseResult.htmlUrl,
    });

    return {
      ...createReleaseResult,
    };
  }, [getComparisonRes.value, getComparisonRes.error]);

  /**
   * (7) Run onSuccess if defined
   */
  useAsync(async () => {
    if (onSuccess && !!createReleaseRes.value && !!getComparisonRes.value) {
      abortIfError(createReleaseRes.error);

      try {
        await onSuccess({
          comparisonUrl: getComparisonRes.value.htmlUrl,
          createdTag: createReleaseRes.value.tagName,
          gitReleaseName: createReleaseRes.value.name,
          gitReleaseUrl: createReleaseRes.value.htmlUrl,
          previousTag: latestRelease?.tagName,
        });
      } catch (error) {
        asyncCatcher(error);
      }

      addStepToResponseSteps({
        message: 'Success callback successfully called 🚀',
        icon: 'success',
      });
    }
  }, [createReleaseRes.value, createReleaseRes.error]);

  const TOTAL_STEPS = 6 + (!!onSuccess ? 1 : 0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress((responseSteps.length / TOTAL_STEPS) * 100);
  }, [TOTAL_STEPS, responseSteps.length]);

  return {
    progress,
    responseSteps,
    run,
    runInvoked: Boolean(
      latestCommitRes.loading || latestCommitRes.value || latestCommitRes.error,
    ),
  };
}
