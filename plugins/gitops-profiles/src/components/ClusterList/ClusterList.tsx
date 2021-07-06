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

import React, { useState } from 'react';

import ClusterTable from '../ClusterTable/ClusterTable';
import { Button } from '@material-ui/core';
import { useAsync } from 'react-use';
import { gitOpsApiRef } from '../../api';
import { Alert } from '@material-ui/lab';

import {
  Content,
  ContentHeader,
  Header,
  SupportButton,
  Page,
  Progress,
  HeaderLabel,
} from '@backstage/core-components';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';

const ClusterList = () => {
  const api = useApi(gitOpsApiRef);
  const githubAuth = useApi(githubAuthApiRef);
  const [githubUsername, setGithubUsername] = useState(String);

  const { loading, error, value } = useAsync(async () => {
    const accessToken = await githubAuth.getAccessToken(['repo', 'user']);
    if (!githubUsername) {
      const userInfo = await api.fetchUserInfo({ accessToken });
      setGithubUsername(userInfo.login);
    }
    return api.listClusters({
      gitHubToken: accessToken,
      gitHubUser: githubUsername,
    });
  });
  let content: JSX.Element;
  if (loading) {
    content = (
      <Content>
        <Progress />
      </Content>
    );
  } else if (error) {
    content = (
      <Content>
        <div>
          <Alert severity="error">
            Error encountered while fetching list of GitOps-managed cluster.{' '}
            {error.toString()}
          </Alert>
          <Alert severity="info">
            Please make sure that you start GitOps-API backend on localhost port
            3008 before using this plugin.
          </Alert>
        </div>
      </Content>
    );
  } else {
    content = (
      <Content>
        <ContentHeader title="Clusters">
          <Button
            variant="contained"
            color="primary"
            href="/gitops-cluster-create"
          >
            Create GitOps-managed Cluster
          </Button>
          <SupportButton>All clusters</SupportButton>
        </ContentHeader>
        <ClusterTable components={value!.result} />
      </Content>
    );
  }

  return (
    <Page themeId="home">
      <Header title="GitOps-managed Clusters">
        <HeaderLabel label="Welcome" value={githubUsername} />
      </Header>
      {content}
    </Page>
  );
};

export default ClusterList;
