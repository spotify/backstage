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

import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import {
  GetBranchResult,
  GetLatestReleaseResult,
} from '../../api/GitReleaseClient';
import { CalverTagParts } from '../../helpers/tagParts/getCalverTagParts';
import { ComponentConfigPatch } from '../../types/types';
import { Differ } from '../../components/Differ';
import { getPatchCommitSuffix } from './helpers/getPatchCommitSuffix';
import { gitReleaseManagerApiRef } from '../../api/serviceApiRef';
import { GitReleaseManagerError } from '../../errors/GitReleaseManagerError';
import { ResponseStepDialog } from '../../components/ResponseStepDialog/ResponseStepDialog';
import { SemverTagParts } from '../../helpers/tagParts/getSemverTagParts';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { usePatch } from './hooks/usePatch';
import { useProjectContext } from '../../contexts/ProjectContext';

import { Link, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

interface PatchBodyProps {
  bumpedTag: string;
  latestRelease: NonNullable<GetLatestReleaseResult['latestRelease']>;
  releaseBranch: GetBranchResult['branch'];
  onSuccess?: ComponentConfigPatch['onSuccess'];
  tagParts: NonNullable<CalverTagParts | SemverTagParts>;
}

export const PatchBody = ({
  bumpedTag,
  latestRelease,
  releaseBranch,
  onSuccess,
  tagParts,
}: PatchBodyProps) => {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const [checkedCommitIndex, setCheckedCommitIndex] = useState(-1);

  const gitDataResponse = useAsync(async () => {
    const [
      { recentCommits: recentCommitsOnDefaultBranch },
      { recentCommits: recentCommitsOnReleaseBranch },
    ] = await Promise.all([
      pluginApiClient.getRecentCommits({
        owner: project.owner,
        repo: project.repo,
      }),
      pluginApiClient.getRecentCommits({
        owner: project.owner,
        repo: project.repo,
        releaseBranchName: releaseBranch.name,
      }),
    ]);

    return {
      recentCommitsOnDefaultBranch,
      recentCommitsOnReleaseBranch,
    };
  });

  const { progress, responseSteps, run, runInvoked } = usePatch({
    bumpedTag,
    latestRelease,
    project,
    tagParts,
    onSuccess,
  });

  if (responseSteps.length > 0) {
    return (
      <ResponseStepDialog
        progress={progress}
        responseSteps={responseSteps}
        title="Patch Release Candidate"
      />
    );
  }

  if (gitDataResponse.error) {
    return (
      <Alert data-testid={TEST_IDS.patch.error} severity="error">
        Unexpected error: {gitDataResponse.error.message}
      </Alert>
    );
  }

  if (gitDataResponse.loading) {
    return (
      <Box data-testid={TEST_IDS.patch.loading}>
        <Progress />
      </Box>
    );
  }

  function Description() {
    return (
      <>
        {!latestRelease.prerelease && (
          <Box marginBottom={2}>
            <Alert data-testid={TEST_IDS.patch.notPrerelease} severity="info">
              <AlertTitle>
                The current Git release is a <b>Release Version</b>
              </AlertTitle>
              It's still possible to patch it, but be extra mindful of changes
            </Alert>
          </Box>
        )}

        <Box marginBottom={2}>
          <Typography>
            <Differ
              icon="tag"
              current={latestRelease.tagName}
              next={bumpedTag}
            />
          </Typography>
        </Box>
      </>
    );
  }

  function CommitList() {
    if (!gitDataResponse.value?.recentCommitsOnDefaultBranch) {
      return null;
    }

    return (
      <List>
        {gitDataResponse.value.recentCommitsOnDefaultBranch.map(
          (commit, index) => {
            // FIXME: Performance improvement opportunity: Convert to object lookup
            const commitExistsOnReleaseBranch = !!gitDataResponse.value?.recentCommitsOnReleaseBranch.find(
              releaseBranchCommit =>
                releaseBranchCommit.sha === commit.sha ||
                // The selected patch commit's sha is included in the commit message,
                // which means it's part of a previous patch
                releaseBranchCommit.commit.message.includes(
                  getPatchCommitSuffix({ commitSha: commit.sha }),
                ),
            );
            const hasNoParent = !commit.firstParentSha;

            return (
              <div style={{ position: 'relative' }} key={`commit-${index}`}>
                {commitExistsOnReleaseBranch && (
                  <Paper
                    elevation={3}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate3d(-50%,-50%,0)',
                      zIndex: 10,
                      color: 'green',
                      padding: 6,
                      background: 'rgba(244,244,244,1)',
                      borderRadius: 8,
                    }}
                  >
                    <FileCopyIcon
                      fontSize="small"
                      style={{ verticalAlign: 'middle' }}
                    />{' '}
                    Already exists on <b>{releaseBranch?.name}</b>
                  </Paper>
                )}

                <ListItem
                  disabled={
                    runInvoked || commitExistsOnReleaseBranch || hasNoParent
                  }
                  role={undefined}
                  dense
                  button
                  onClick={() => {
                    if (index === checkedCommitIndex) {
                      setCheckedCommitIndex(-1);
                    } else {
                      setCheckedCommitIndex(index);
                    }
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedCommitIndex === index}
                      tabIndex={-1}
                    />
                  </ListItemIcon>

                  <ListItemText
                    style={{ marginRight: 15 }}
                    id={commit.sha}
                    primary={commit.commit.message}
                    secondary={
                      <>
                        <Link
                          color="primary"
                          to={commit.htmlUrl}
                          target="_blank"
                        >
                          {commit.sha}
                        </Link>{' '}
                        {commit.author.htmlUrl && (
                          <Link
                            color="primary"
                            to={commit.author.htmlUrl}
                            target="_blank"
                          >
                            @{commit.author.login}
                          </Link>
                        )}
                      </>
                    }
                  />

                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="commit"
                      disabled={
                        runInvoked ||
                        commitExistsOnReleaseBranch ||
                        !releaseBranch
                      }
                      onClick={() => {
                        const repoPath = pluginApiClient.getRepoPath({
                          owner: project.owner,
                          repo: project.repo,
                        });
                        const host = pluginApiClient.getHost();

                        const newTab = window.open(
                          `https://${host}/${repoPath}/compare/${releaseBranch?.name}...${commit.sha}`,
                          '_blank',
                        );
                        newTab?.focus();
                      }}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </div>
            );
          },
        )}
      </List>
    );
  }

  return (
    <Box data-testid={TEST_IDS.patch.body}>
      <Description />

      <Box style={{ maxHeight: 450, overflowY: 'auto' }}>
        <CommitList />
      </Box>

      <Button
        disabled={checkedCommitIndex === -1 || progress > 0}
        variant="contained"
        color="primary"
        onClick={() => {
          const selectedPatchCommit =
            gitDataResponse.value?.recentCommitsOnDefaultBranch[
              checkedCommitIndex
            ];
          if (!selectedPatchCommit) {
            throw new GitReleaseManagerError(
              'Could not find selected patch commit',
            );
          }

          run(selectedPatchCommit);
        }}
      >
        Patch Release Candidate
      </Button>
    </Box>
  );
};
