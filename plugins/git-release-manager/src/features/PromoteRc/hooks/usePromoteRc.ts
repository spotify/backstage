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

import { useState, useEffect } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { CardHook, ComponentConfigPromoteRc } from '../../../types/types';

import { GetLatestReleaseResult } from '../../../api/GitReleaseClient';
import { gitReleaseManagerApiRef } from '../../../api/serviceApiRef';
import { GitReleaseManagerError } from '../../../errors/GitReleaseManagerError';
import { TAG_OBJECT_MESSAGE } from '../../../constants/constants';
import { useProjectContext } from '../../../contexts/ProjectContext';
import { useResponseSteps } from '../../../hooks/useResponseSteps';
import { useUserContext } from '../../../contexts/UserContext';
import { useApi } from '@backstage/core-plugin-api';

interface PromoteRc {
  rcRelease: NonNullable<GetLatestReleaseResult['latestRelease']>;
  releaseVersion: string;
  onSuccess?: ComponentConfigPromoteRc['onSuccess'];
}

export function usePromoteRc({
  rcRelease,
  releaseVersion,
  onSuccess,
}: PromoteRc): CardHook<void> {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { user } = useUserContext();
  const { project } = useProjectContext();
  const {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
  } = useResponseSteps();

  /**
   * (1) Fetch most recent release branch commit
   */
  const [latestReleaseBranchCommitSha, run] = useAsyncFn(async () => {
    const { commit: latestCommit } = await pluginApiClient
      .getCommit({
        owner: project.owner,
        repo: project.repo,
        ref: rcRelease.targetCommitish,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Fetched most recent commit from release branch',
      secondaryMessage: `with sha "${latestCommit.sha}"`,
    });

    return {
      ...latestCommit,
    };
  });

  /**
   * (2) Create tag object for our soon-to-be-created annotated tag
   */
  const tagObjectRes = useAsync(async () => {
    abortIfError(latestReleaseBranchCommitSha.error);
    if (!latestReleaseBranchCommitSha.value) return undefined;

    const { tagObject } = await pluginApiClient
      .createTagObject({
        owner: project.owner,
        repo: project.repo,
        tag: releaseVersion,
        object: latestReleaseBranchCommitSha.value.sha,
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
  }, [latestReleaseBranchCommitSha.value, latestReleaseBranchCommitSha.error]);

  /**
   * (3) Create reference for tag object
   */
  const createRcRes = useAsync(async () => {
    abortIfError(tagObjectRes.error);
    if (!tagObjectRes.value) return undefined;

    const { reference: createdRef } = await pluginApiClient
      .createRef({
        owner: project.owner,
        repo: project.repo,
        ref: `refs/tags/${releaseVersion}`,
        sha: tagObjectRes.value.tagSha,
      })
      .catch(error => {
        if (error?.body?.message === 'Reference already exists') {
          throw new GitReleaseManagerError(
            `Tag reference "${releaseVersion}" already exists`,
          );
        }
        throw error;
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Create Tag Reference',
      secondaryMessage: `with ref "${createdRef.ref}"`,
    });

    return {
      ...createdRef,
    };
  }, [tagObjectRes.value, tagObjectRes.error]);

  /**
   * (4) Promote Release Candidate to Release Version
   */
  const promotedReleaseRes = useAsync(async () => {
    abortIfError(createRcRes.error);
    if (!createRcRes.value) return undefined;

    const { release } = await pluginApiClient
      .updateRelease({
        owner: project.owner,
        repo: project.repo,
        releaseId: rcRelease.id,
        tagName: releaseVersion,
        prerelease: false,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Promoted "${release.name}"`,
      secondaryMessage: `from "${rcRelease.tagName}" to "${release.tagName}"`,
      link: release.htmlUrl,
    });

    return {
      ...release,
    };
  }, [createRcRes.value, createRcRes.error]);

  /**
   * (5) Run onSuccess if defined
   */
  useAsync(async () => {
    if (onSuccess && !!promotedReleaseRes.value) {
      abortIfError(promotedReleaseRes.error);

      try {
        await onSuccess?.({
          gitReleaseUrl: promotedReleaseRes.value.htmlUrl,
          gitReleaseName: promotedReleaseRes.value.name,
          previousTagUrl: rcRelease.htmlUrl,
          previousTag: rcRelease.tagName,
          updatedTagUrl: promotedReleaseRes.value.htmlUrl,
          updatedTag: promotedReleaseRes.value.tagName,
        });
      } catch (error) {
        asyncCatcher(error);
      }

      addStepToResponseSteps({
        message: 'Success callback successfully called 🚀',
        icon: 'success',
      });
    }
  }, [promotedReleaseRes.value, promotedReleaseRes.error]);

  const TOTAL_STEPS = 4 + (!!onSuccess ? 1 : 0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress((responseSteps.length / TOTAL_STEPS) * 100);
  }, [TOTAL_STEPS, responseSteps.length]);

  return {
    progress,
    responseSteps,
    run,
    runInvoked: Boolean(
      promotedReleaseRes.loading ||
        promotedReleaseRes.value ||
        promotedReleaseRes.error,
    ),
  };
}
